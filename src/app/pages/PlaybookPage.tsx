import { useEffect, useState } from 'react'
import { loadAllActivities } from '../../content/store'
import { AGE_BANDS, AREAS, areaById } from '../../content/meta'
import type { Activity, AgeBandId } from '../../content/schema'
import { EmptyState, SkeletonCards, AREA_GRADIENTS, BookmarkButton } from './TodayPage'
import { AreaIcon } from '../components/icons'

type Filters = { band: AgeBandId | 'semua'; area: string | 'semua'; durasi: 'semua' | 'pendek' | 'sedang'; fromHome: boolean }

const CHIP_ACTIVE: Record<string, string> = {
  '0-3m': 'bg-sky-500', '3-6m': 'bg-tosca-500', '6-9m': 'bg-leaf-500',
  '9-12m': 'bg-sunny-500', '12-18m': 'bg-mango-500', '18-24m': 'bg-candy-500',
  '2-3y': 'bg-apple-500', '3-4y': 'bg-grape-500', '4-5y': 'bg-sky-600',
}

export function PlaybookPage() {
  const [acts, setActs] = useState<Activity[] | null>(null)
  const [f, setF] = useState<Filters>({ band: 'semua', area: 'semua', durasi: 'semua', fromHome: false })
  const [toast, setToast] = useState('')
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 1500)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    loadAllActivities().then(setActs)
  }, [])

  const filtered = (acts ?? []).filter((a) => {
    if (f.band !== 'semua' && !a.ageBands.includes(f.band)) return false
    if (f.area !== 'semua' && !a.areas.includes(f.area as never)) return false
    if (f.durasi === 'pendek' && a.durationMinutes > 15) return false
    if (f.durasi === 'sedang' && (a.durationMinutes < 15 || a.durationMinutes > 40)) return false
    if (f.fromHome && !a.materials.every((m) => m.fromHome)) return false
    return true
  })

  return (
    <div className="px-5 space-y-3">
      {/* Chips usia */}
      <div className="hide-scrollbar -mx-5 px-5 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter usia">
        <Chip active={f.band === 'semua'} onClick={() => setF({ ...f, band: 'semua' })}>Semua</Chip>
        {AGE_BANDS.map((b) => (
          <button
            key={b.id}
            aria-pressed={f.band === b.id}
            onClick={() => setF({ ...f, band: f.band === b.id ? 'semua' : b.id })}
            className={`shrink-0 w-[68px] rounded-2xl border-2 py-2 text-center transition active:scale-95 ${
              f.band === b.id
                ? `${CHIP_ACTIVE[b.id]} border-transparent text-white shadow-md`
                : 'bg-white dark:bg-navy-800 border-sky-100 dark:border-navy-700 text-sky-900 dark:text-sky-100'
            }`}
          >
            <span className="block text-base leading-none" aria-hidden>{b.mascot}</span>
            <span className="block text-[10px] font-semibold mt-1">{b.id}</span>
          </button>
        ))}
      </div>

      {/* Grid area warna */}
      <section aria-label="Area Montessori">
        <h3 className="font-[family-name:var(--font-display)] font-bold text-lg mb-2">Area Montessori</h3>
        <div className="grid grid-cols-3 gap-2.5">
          {AREAS.map((a) => {
            const active = f.area === a.id
            const grad = AREA_GRADIENTS[a.id] ?? 'from-sky-500 to-sky-700'
            return (
              <button
                key={a.id}
                onClick={() => setF({ ...f, area: active ? 'semua' : a.id })}
                aria-pressed={active}
                className={`rounded-3xl p-3.5 text-left aspect-[5/4] bg-gradient-to-br ${grad} bg-black/15 bg-blend-overlay text-white shadow-sm transition active:scale-[0.96] relative overflow-hidden ${
                  active ? 'ring-4 ring-sky-300 scale-[1.02]' : ''
                }`}
              >
                <AreaIcon area={a.id} className="w-9 h-9 drop-shadow" />
                <span className="absolute bottom-2.5 left-3 right-2 text-xs font-bold leading-tight drop-shadow-sm">
                  {a.label}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Filter durasi & bahan */}
      <div className="hide-scrollbar -mx-5 px-5 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter lainnya">
        <Chip active={f.durasi === 'pendek'} onClick={() => setF({ ...f, durasi: f.durasi === 'pendek' ? 'semua' : 'pendek' })}>≤ 15 menit</Chip>
        <Chip active={f.durasi === 'sedang'} onClick={() => setF({ ...f, durasi: f.durasi === 'sedang' ? 'semua' : 'sedang' })}>15–40 menit</Chip>
        <Chip active={f.fromHome} onClick={() => setF({ ...f, fromHome: !f.fromHome })}>🏠 Bahan di Rumah</Chip>
      </div>

      {/* Hasil */}
      <section>
        <h3 className="font-[family-name:var(--font-display)] font-bold text-lg mb-2">
          Semua Aktivitas <span className="opacity-50 text-base">({filtered.length})</span>
        </h3>
        {!acts ? (
          <SkeletonCards n={4} />
        ) : filtered.length === 0 ? (
          <EmptyState title="Belum ada yang cocok" text="Coba longgarkan filternya — konten masih terus bertambah." />
        ) : (
          <ul className="space-y-3">
            {filtered.map((a) => {
              const area = areaById(a.areas[0])
              const grad = AREA_GRADIENTS[a.areas[0]] ?? 'from-sky-500 to-sky-700'
              return (
                <li key={a.id}>
                  <article className="relative rounded-3xl bg-white dark:bg-navy-800 shadow-sky-sm overflow-hidden active:scale-[0.98] transition">
                    <a href={`#/aktivitas/${a.id}`} aria-label={a.title} className="block">
                      <div className={`relative h-24 bg-gradient-to-br ${grad} grid place-items-center bg-black/15 bg-blend-overlay`}>
                        <AreaIcon area={a.areas[0]} className="w-11 h-11 text-white/95 drop-shadow" />
                        <span className="absolute top-2 left-2 text-[10px] font-semibold bg-white/90 text-sky-800 rounded-full px-2 py-0.5">{area?.label}</span>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold">{a.title}</h4>
                        <p className="text-sm opacity-70 mt-1 line-clamp-2">{a.summary}</p>
                        <div className="flex gap-1.5 mt-2.5 flex-wrap"><Badge>⏱ {a.durationMinutes} mnt</Badge><Badge>{a.ageBands.join(' · ')}</Badge></div>
                      </div>
                    </a>
                    <BookmarkButton activityId={a.id} onToast={setToast} />
                  </article>
                </li>
              )
            })}
          </ul>
        )}
      </section>
      {toast && <div className="fixed bottom-24 inset-x-0 z-50 mx-auto w-fit rounded-full bg-navy-800 px-4 py-2 text-sm text-white shadow-lg" role="status" aria-live="polite">{toast}</div>}
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full px-4 min-h-[36px] text-sm font-medium border transition active:scale-95 ${
        active
          ? 'bg-sky-600 text-white border-sky-600'
          : 'bg-white dark:bg-navy-800 border-sky-200 dark:border-navy-700 text-sky-800 dark:text-sky-200'
      }`}
    >
      {children}
    </button>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="text-[11px] rounded-full bg-sky-50 dark:bg-navy-700 px-2 py-0.5 text-sky-800 dark:text-sky-200">{children}</span>
}
