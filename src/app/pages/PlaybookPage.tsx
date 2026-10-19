import { useEffect, useState } from 'react'
import { loadAllActivities } from '../../content/store'
import { AGE_BANDS, AREAS } from '../../content/meta'
import type { Activity, AgeBandId } from '../../content/schema'
import { EmptyState, SkeletonCards } from './TodayPage'

type Filters = { band: AgeBandId | 'semua'; area: string | 'semua'; durasi: 'semua' | 'pendek' | 'sedang'; fromHome: boolean }

export function PlaybookPage() {
  const [acts, setActs] = useState<Activity[] | null>(null)
  const [f, setF] = useState<Filters>({ band: 'semua', area: 'semua', durasi: 'semua', fromHome: false })

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
      {/* Chip filter horizontal */}
      <div className="hide-scrollbar -mx-5 px-5 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter usia">
        <Chip active={f.band === 'semua'} onClick={() => setF({ ...f, band: 'semua' })}>Semua usia</Chip>
        {AGE_BANDS.map((b) => (
          <Chip key={b.id} active={f.band === b.id} onClick={() => setF({ ...f, band: b.id })}>
            {b.mascot} {b.label}
          </Chip>
        ))}
      </div>
      <div className="hide-scrollbar -mx-5 px-5 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter area">
        <Chip active={f.area === 'semua'} onClick={() => setF({ ...f, area: 'semua' })}>Semua area</Chip>
        {AREAS.map((a) => (
          <Chip key={a.id} active={f.area === a.id} onClick={() => setF({ ...f, area: a.id })}>
            {a.icon} {a.label}
          </Chip>
        ))}
      </div>
      <div className="hide-scrollbar -mx-5 px-5 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter lainnya">
        <Chip active={f.durasi === 'pendek'} onClick={() => setF({ ...f, durasi: f.durasi === 'pendek' ? 'semua' : 'pendek' })}>≤ 15 menit</Chip>
        <Chip active={f.durasi === 'sedang'} onClick={() => setF({ ...f, durasi: f.durasi === 'sedang' ? 'semua' : 'sedang' })}>15–40 menit</Chip>
        <Chip active={f.fromHome} onClick={() => setF({ ...f, fromHome: !f.fromHome })}>🏠 Bahan di rumah</Chip>
      </div>

      {!acts ? (
        <SkeletonCards n={5} />
      ) : filtered.length === 0 ? (
        <EmptyState emoji="🔍" title="Belum ada yang cocok" text="Coba longgarkan filternya — konten masih terus bertambah." />
      ) : (
        <ul className="space-y-3 pt-1">
          {filtered.map((a) => (
            <li key={a.id}>
              <article className="rounded-blob bg-white dark:bg-navy-800 p-4 shadow-sm active:scale-[0.98] transition">
                <div className="flex gap-1.5 mb-1.5 flex-wrap">
                  {a.areas.slice(0, 3).map((ar) => {
                    const meta = AREAS.find((x) => x.id === ar)
                    return (
                      <span key={ar} className="text-[11px] rounded-full bg-sky-50 dark:bg-navy-700 px-2 py-0.5">
                        {meta?.icon} {meta?.label}
                      </span>
                    )
                  })}
                </div>
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-sm opacity-70 mt-1 line-clamp-2">{a.summary}</p>
                <p className="text-xs opacity-60 mt-2">⏱ {a.durationMinutes} m · usia {a.ageBands.join(', ')}</p>
              </article>
            </li>
          ))}
        </ul>
      )}
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
