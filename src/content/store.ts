import type { Activity, GlobalBundle, AgeBandBundle, AgeBandId } from './schema'
import { AGE_BANDS, AREAS } from './meta'

// Lazy-load semua bundle per AgeBand (ditandatangani Vite sebagai chunk terpisah)
const bundleModules = import.meta.glob('../../content/bundles/*.json')
const globalModules = import.meta.glob('../../content/*.json')

let globalCache: GlobalBundle | null = null
const bundleCache = new Map<AgeBandId, AgeBandBundle>()

export async function loadGlobal(): Promise<GlobalBundle> {
  if (globalCache) return globalCache
  const key = Object.keys(globalModules).find((k) => k.endsWith('/global.json'))
  if (!key) return emptyGlobal()
  const mod = (await globalModules[key]()) as { default: GlobalBundle }
  globalCache = mod.default ?? (mod as unknown as GlobalBundle)
  return globalCache
}

export async function loadBundle(band: AgeBandId): Promise<AgeBandBundle> {
  const cached = bundleCache.get(band)
  if (cached) return cached
  const key = Object.keys(bundleModules).find((k) => k.endsWith(`/${band}.json`))
  const empty: AgeBandBundle = { ageBand: band, activities: [], milestones: [] }
  if (!key) return empty
  const mod = (await bundleModules[key]()) as { default: AgeBandBundle }
  const bundle = mod.default ?? (mod as unknown as AgeBandBundle)
  bundleCache.set(band, bundle)
  return bundle
}

export async function loadActivitiesFor(bands: AgeBandId[]): Promise<Activity[]> {
  const bundles = await Promise.all(bands.map(loadBundle))
  return bundles.flatMap((b) => b.activities)
}

export async function loadAllActivities(): Promise<Activity[]> {
  const all = await Promise.all(AGE_BANDS.map((a) => loadBundle(a.id)))
  return all.flatMap((b) => b.activities)
}

// Rekomendasi "Hari Ini": 3 aktivitas sesuai usia + rotasi harian deterministik
export async function pickToday(band: AgeBandId, interests: string[] = [], seedDay = new Date().getDate()): Promise<Activity[]> {
  const pool = await loadActivitiesFor([band])
  if (pool.length === 0) return []
  const scored = pool.map((a, i) => {
    const interestBoost = interests.some((it) => a.areas.includes(it as never)) ? 100 : 0
    const rot = (i * 7 + seedDay * 3) % 50
    return { a, score: interestBoost + rot }
  })
  scored.sort((x, y) => y.score - x.score)
  return scored.slice(0, 3).map((s) => s.a)
}

function emptyGlobal(): GlobalBundle {
  return {
    ageBands: AGE_BANDS,
    areas: AREAS,
    skills: [],
    materials: [],
    diyGuides: [],
    roomSetups: [],
    parentGuides: [],
    glossary: [],
    checklists: [],
  }
}

// Pencarian offline penuh (Fuse.js lazy-load) — indeks dibangun sekali, di-cache
type FuseType = import('fuse.js').default<Activity>
let fusePromise: Promise<FuseType> | null = null
export async function searchActivities(q: string): Promise<Activity[]> {
  if (!q.trim()) return []
  if (!fusePromise) {
    fusePromise = Promise.all([loadAllActivities(), import('fuse.js')]).then(
      ([acts, { default: Fuse }]) =>
        new Fuse(acts, {
          keys: ['title', 'summary', 'skills', 'materials.name'],
          threshold: 0.35,
          ignoreLocation: true,
        }) as FuseType,
    )
  }
  const fuse = await fusePromise
  return fuse.search(q).map((r) => r.item)
}
