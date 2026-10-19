import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { useChildStore } from '../stores/children'
import { loadBundle } from '../../content/store'
import { useEffect, useState } from 'react'
import type { Milestone } from '../../content/schema'
import { EmptyState } from './TodayPage'
import { ConfettiBurst } from '../components/icons'

export function ProgressPage() {
  const activeId = useChildStore((s) => s.activeId)
  const [milestones, setMilestones] = useState<Milestone[] | null>(null)
  const [confettiSeed, setConfettiSeed] = useState<number | null>(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 1800)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (confettiSeed === null) return
    const timer = window.setTimeout(() => setConfettiSeed(null), 1800)
    return () => window.clearTimeout(timer)
  }, [confettiSeed])

  useEffect(() => {
    const st = useChildStore.getState()
    const c = st.children.find((x) => x.id === st.activeId)
    if (!c) return
    import('../stores/children').then(({ ageBandFromBirth }) => {
      loadBundle(ageBandFromBirth(c.birthDate)).then((b) => setMilestones(b.milestones))
    })
  }, [activeId])

  const mastery = useLiveQuery(
    async () => {
      if (!activeId) return []
      return db.mastery.where('childId').equals(activeId).toArray()
    },
    [activeId],
  )

  const doneCount = mastery?.filter((m) => m.level !== 'belum').length ?? 0

  if (!milestones) return <p className="px-5 text-sm opacity-70">Memuat…</p>

  return (
    <div className="px-5 space-y-4">
      <section className="rounded-blob bg-gradient-to-br from-leaf-100 to-cream-100 dark:from-navy-800 dark:to-navy-700 p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold">Perkembangan 🌱</h2>
        <p className="text-sm opacity-75 mt-1">
          {doneCount} tanda dicatat. Setiap anak punya tempo sendiri — ini peta, bukan lomba.
        </p>
        {milestones.length > 0 && (
          <a href="#/belajar" className="mt-3 inline-flex items-center rounded-full border border-sky-600 bg-white/80 px-4 min-h-[48px] font-semibold text-sky-700 dark:border-sky-300 dark:bg-navy-800/80 dark:text-sky-200">
            🚩 Lihat red flags usia ini
          </a>
        )}
      </section>

      {milestones.length === 0 ? (
        <EmptyState title="Milestone usia ini belum tersedia" text="Konten progres sedang dibangun bertahap." />
      ) : (
        <ul className="space-y-3">
          {milestones.map((m) => {
            const rec = mastery?.find((x) => x.targetId === m.id)
            return (
              <li key={m.id} className="rounded-blob bg-white dark:bg-navy-800 p-4 shadow-sm">
                <div className="flex justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-sm">{m.title}</h3>
                    <p className="text-xs opacity-75 mt-1">{m.description}</p>
                  </div>
                  <Segmented
                    value={rec?.level ?? 'belum'}
                    onChange={async (lv) => {
                      if (!activeId) return
                      if (lv === 'mahir' && rec?.level !== 'mahir') {
                        setConfettiSeed(Date.now())
                        setToast('🎉 Milestone mahir!')
                      }
                      await db.mastery.put({ childId: activeId, targetId: m.id, kind: 'milestone', level: lv, updatedAt: Date.now() })
                    }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      )}
      {confettiSeed !== null && (
        <div className="pointer-events-none fixed inset-x-0 top-20 z-50 h-48 overflow-hidden" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <ConfettiBurst
              key={`${confettiSeed}-${i}`}
              className="confetti-fall absolute h-10 w-20"
              style={{ left: `${12 + ((confettiSeed + i * 23) % 76)}%`, top: `${i * 4}px`, animationDelay: `${i * 0.06}s` }}
            />
          ))}
        </div>
      )}
      {toast && <div className="fixed bottom-24 inset-x-0 z-50 mx-auto w-fit rounded-full bg-navy-800 px-4 py-2 text-sm text-white shadow-lg" role="status" aria-live="polite">{toast}</div>}
    </div>
  )
}

function Segmented({ value, onChange }: { value: 'belum' | 'mulai' | 'mahir'; onChange: (v: 'belum' | 'mulai' | 'mahir') => void }) {
  const opts = ['belum', 'mulai', 'mahir'] as const
  return (
    <div role="radiogroup" aria-label="Status" className="flex flex-col gap-1 shrink-0">
      {opts.map((o) => (
        <button
          key={o}
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={`text-[11px] rounded-full px-2.5 min-h-[28px] border transition ${
            value === o ? 'bg-leaf-600 text-white border-leaf-600' : 'border-sky-200 dark:border-navy-700 opacity-70'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  )
}
