#!/usr/bin/env node
// Validator konten: jalankan `node scripts/validate-content.mjs`
// Memvalidasi SEMUA file content/*.json & content/bundles/*.json terhadap skema.
// Skema sumber: src/content/schema.ts (Zod) — di-mirror sebagai pemeriksaan struktural di sini
// agar validator bisa jalan tanpa build step (CI-friendly).

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const contentDir = join(root, 'content')
const bundlesDir = join(contentDir, 'bundles')

const AGE_BANDS = new Set(['0-3m', '3-6m', '6-9m', '9-12m', '12-18m', '18-24m', '2-3y', '3-4y', '4-5y'])
const AREAS = new Set(['practical-life', 'sensorial', 'language', 'math', 'culture', 'movement', 'grace-courtesy', 'self-care', 'art-music', 'outdoor'])
const kebab = (s) => /^[a-z0-9-]+$/.test(s)
const isUrl = (s) => {
  try { new URL(s); return true } catch { return false }
}

const errors = []
const stats = { activities: 0, materials: 0, diy: 0, milestones: 0, parentGuides: 0, glossary: 0, roomSetups: 0, checklists: 0 }

function err(file, msg) { errors.push(`${file}: ${msg}`) }

function checkSource(refs, file, ctx) {
  if (!Array.isArray(refs) || refs.length === 0) { err(file, `${ctx}: WAJIB minimal 1 rujukan`); return }
  refs.forEach((r, i) => {
    if (!r.title || String(r.title).length < 3) err(file, `${ctx}.references[${i}].title tidak valid`)
    if (!r.url || !isUrl(r.url)) err(file, `${ctx}.references[${i}].url bukan URL valid`)
  })
}

function checkActivity(a, file, i) {
  const ctx = `activities[${i}] "${a.id ?? a.title ?? '?'}"`
  if (!a.id || !kebab(a.id)) err(file, `${ctx}.id harus kebab-case`)
  if (!a.title || a.title.length < 5) err(file, `${ctx}.title terlalu pendek`)
  if (!a.summary || a.summary.length < 20) err(file, `${ctx}.summary minimal 20 karakter`)
  if (!Array.isArray(a.ageBands) || a.ageBands.length === 0 || a.ageBands.some((b) => !AGE_BANDS.has(b))) err(file, `${ctx}.ageBands tidak valid`)
  if (!Array.isArray(a.areas) || a.areas.length === 0 || a.areas.some((x) => !AREAS.has(x))) err(file, `${ctx}.areas tidak valid`)
  if (!Array.isArray(a.objectives) || a.objectives.length < 1) err(file, `${ctx}.objectives minimal 1`)
  if (!Array.isArray(a.materials) || a.materials.length < 1) err(file, `${ctx}.materials minimal 1`)
  if (!Array.isArray(a.presentation) || a.presentation.length < 2) err(file, `${ctx}.presentation minimal 2 langkah`)
  if (!Array.isArray(a.readySigns) || a.readySigns.length < 1) err(file, `${ctx}.readySigns minimal 1`)
  if (!Number.isInteger(a.prepMinutes) || a.prepMinutes < 0) err(file, `${ctx}.prepMinutes tidak valid`)
  if (!Number.isInteger(a.durationMinutes) || a.durationMinutes < 1) err(file, `${ctx}.durationMinutes tidak valid`)
  if (!['rendah', 'sedang', 'tinggi'].includes(a.prepLevel)) err(file, `${ctx}.prepLevel harus rendah/sedang/tinggi`)
  // Safety Gate: aktivitas bayi/balita WAJIB catatan keselamatan
  const babyish = a.ageBands.some((b) => ['0-3m', '3-6m', '6-9m', '9-12m', '12-18m', '18-24m', '2-3y'].includes(b))
  if (babyish && (!Array.isArray(a.safetyNotes) || a.safetyNotes.length === 0)) {
    err(file, `${ctx}: aktivitas usia bayi/balita WAJIB punya safetyNotes`)
  }
  checkSource(a.references, file, ctx)
  stats.activities++
}

// ===== global.json =====
const gp = join(contentDir, 'global.json')
if (existsSync(gp)) {
  const g = JSON.parse(readFileSync(gp, 'utf8'))
  if (g.ageBands && (!Array.isArray(g.ageBands) || g.ageBands.length !== 9)) err("global.json", "ageBands harus 9 entri")
  if (g.areas && (!Array.isArray(g.areas) || g.areas.length < 10)) err("global.json", "areas minimal 10 entri")
  for (const arr of ['materials', 'diyGuides', 'roomSetups', 'parentGuides', 'glossary', 'checklists', 'skills']) {
    if (!Array.isArray(g[arr])) err('global.json', `${arr} harus array`)
  }
  ;(g.materials ?? []).forEach((m, i) => { checkSource(m.references, 'global.json', `materials[${i}]`); stats.materials++ })
  ;(g.diyGuides ?? []).forEach((d, i) => { checkSource(d.references, 'global.json', `diyGuides[${i}]`); stats.diy++ })
  ;(g.roomSetups ?? []).forEach((r, i) => { checkSource(r.references, 'global.json', `roomSetups[${i}]`); stats.roomSetups++ })
  ;(g.parentGuides ?? []).forEach((p, i) => {
    if (!p.body || p.body.length < 200) err('global.json', `parentGuides[${i}].body minimal 200 karakter`)
    checkSource(p.references, 'global.json', `parentGuides[${i}]`)
    stats.parentGuides++
  })
  ;(g.glossary ?? []).forEach((e, i) => {
    if (!e.term || !e.definition || e.definition.length < 30) err('global.json', `glossary[${i}] tidak lengkap`)
    stats.glossary++
  })
  ;(g.checklists ?? []).forEach((c, i) => {
    if (!Array.isArray(c.items) || c.items.length < 3) err('global.json', `checklists[${i}].items minimal 3`)
    checkSource(c.references, 'global.json', `checklists[${i}]`)
    stats.checklists++
  })
} else {
  console.log('ℹ️  content/global.json belum ada — dilewati (akan divalidasi saat produksi konten)')
}

// ===== bundles/*.json =====
if (existsSync(bundlesDir)) {
  for (const f of readdirSync(bundlesDir).filter((x) => x.endsWith('.json'))) {
    const b = JSON.parse(readFileSync(join(bundlesDir, f), 'utf8'))
    if (!AGE_BANDS.has(b.ageBand)) err(f, `ageBand "${b.ageBand}" tidak valid`)
    if (!Array.isArray(b.activities)) err(f, 'activities harus array')
    ;(b.activities ?? []).forEach((a, i) => checkActivity(a, f, i))
    ;(b.milestones ?? []).forEach((m, i) => {
      const ctx = `milestones[${i}]`
      if (!m.id || !kebab(m.id)) err(f, `${ctx}.id kebab-case`)
      if (!m.title || m.title.length < 5) err(f, `${ctx}.title pendek`)
      if (!m.description || m.description.length < 20) err(f, `${ctx}.description pendek`)
      if (!AGE_BANDS.has(m.ageBand)) err(f, `${ctx}.ageBand tidak valid`)
      checkSource(m.references, f, ctx)
      stats.milestones++
    })
  }
} else {
  console.log('ℹ️  content/bundles/ belum ada — dilewati')
}

// ===== Laporan =====
console.log('=== Validasi Konten Montessori Playbook ===')
console.log(`Activity:     ${stats.activities} (target ≥ 250)`)
console.log(`Material:     ${stats.materials}`)
console.log(`DIYGuide:     ${stats.diy} (Material+DIY target ≥ 60)`)
console.log(`Milestone:    ${stats.milestones} (target ≥ 80)`)
console.log(`ParentGuide:  ${stats.parentGuides} (target ≥ 40)`)
console.log(`Glossary:     ${stats.glossary} (target ≥ 120)`)
console.log(`RoomSetup:    ${stats.roomSetups}`)
console.log(`Checklist:    ${stats.checklists}`)

const targets = [
  ['Activity', stats.activities, 250],
  ['Material+DIY', stats.materials + stats.diy, 60],
  ['ParentGuide', stats.parentGuides, 40],
  ['Milestone', stats.milestones, 80],
  ['Glossary', stats.glossary, 120],
]
const unmet = targets.filter(([, v, t]) => v < t).map(([n, v, t]) => `${n}: ${v}/${t}`)
if (unmet.length && process.env.STRICT_TARGETS === '1') {
  console.error('\n❌ Target volume belum tercapai (STRICT_TARGETS=1):', unmet.join(', '))
  process.exit(1)
}
if (unmet.length) console.log(`\n⚠️  Target belum tercapai: ${unmet.join(', ')}`)

if (errors.length) {
  console.error(`\n❌ ${errors.length} error skema:`)
  for (const e of errors.slice(0, 50)) console.error('  -', e)
  if (errors.length > 50) console.error(`  ... dan ${errors.length - 50} lainnya`)
  process.exit(1)
}
console.log('\n✅ Semua file konten lolos validasi skema.')
