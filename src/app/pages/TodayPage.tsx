import { useEffect, useState } from 'react'
import { pickToday } from '../../content/store'
import { activeAgeBand, useChildStore } from '../stores/children'
import { ageBandById } from '../../content/meta'
import type { Activity } from '../../content/schema'

export function TodayPage() {
  const [acts, setActs] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const band = activeAgeBand()
  const child = useChildStore((s) => s.children.find((c) => c.id === s.activeId))

  useEffect(() => {
    if (!band) return
    pickToday(band).then((a) => { setActs(a); setLoading(false) })
  }, [band])

  if (!child) return <OnboardPrompt />

  const meta = band ? ageBandById(band) : null

  return (
    <div className="px-5 space-y-4">
      <section className="rounded-blob bg-gradient-to-br from-sky-100 to-cream-100 dark:from-navy-800 dark:to-navy-700 p-5 shadow-sm">
        <p className="text-sm text-sky-700 dark:text-sky-300">Aktivitas untuk {child.nickname} 😊</p>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold mt-1">
          {meta ? meta.label : '—'} {meta?.mascot}
        </h2>
        <p className="text-sm opacity-70 mt-1">3 aktivitas pilihan hari ini, sesuai tahap si kecil.</p>
      </section>

      {loading ? (
        <SkeletonCards n={3} />
      ) : acts.length === 0 ? (
        <EmptyState
          emoji="☁️"
          title="Konten sedang di siapkan"
          text="Aktivitas untuk usia ini belum tersedia di build awal. Cek playbook usia lain dulu ya."
        />
      ) : (
        <ul className="space-y-3">
          {acts.map((a) => (
            <li key={a.id}>
              <article className="rounded-blob bg-white dark:bg-navy-800 p-4 shadow-sm active:scale-[0.98] transition">
                <h3 className="font-semibold text-base">{a.title}</h3>
                <p className="text-sm opacity-70 mt-1 line-clamp-2">{a.summary}</p>
                <p className="text-xs mt-2 opacity-60">⏱ {a.durationMinutes} menit · persiapan {a.prepLevel}</p>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function OnboardPrompt() {
  return (
    <div className="px-5">
      <div className="rounded-blob bg-gradient-to-br from-sky-100 to-cream-100 dark:from-navy-800 dark:to-navy-700 p-6 text-center shadow-sm">
        <div className="text-6xl" aria-hidden>☁️</div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold mt-3">Selamat datang!</h2>
        <p className="text-sm opacity-75 mt-2">
          Buat profil si kecil dulu supaya aktivitas yang muncul sesuai usianya.
        </p>
        <a
          href="#/lainnya"
          className="inline-block mt-4 rounded-full bg-sky-600 px-6 py-3 text-white font-semibold min-h-[48px] leading-[24px] active:scale-95 transition"
        >
          Buat profil anak
        </a>
      </div>
    </div>
  )
}

export function EmptyState({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <div className="py-12 text-center px-6">
      <div className="text-5xl" aria-hidden>{emoji}</div>
      <h3 className="font-[family-name:var(--font-display)] font-bold text-lg mt-3">{title}</h3>
      <p className="text-sm opacity-70 mt-1 max-w-xs mx-auto">{text}</p>
    </div>
  )
}

export function SkeletonCards({ n }: { n: number }) {
  return (
    <div className="space-y-3" aria-hidden>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="rounded-blob bg-white dark:bg-navy-800 p-4 shadow-sm animate-pulse">
          <div className="h-4 w-2/3 rounded bg-sky-100 dark:bg-navy-700" />
          <div className="h-3 w-full rounded bg-sky-50 dark:bg-navy-700/60 mt-2" />
          <div className="h-3 w-1/3 rounded bg-sky-50 dark:bg-navy-700/60 mt-2" />
        </div>
      ))}
    </div>
  )
}
