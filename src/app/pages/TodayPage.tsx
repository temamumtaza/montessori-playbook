import { useEffect, useState } from 'react'
import { loadAllActivities, pickToday } from '../../content/store'
import { activeAgeBand, useChildStore, ageBandFromBirth } from '../stores/children'
import { ageBandById, areaById } from '../../content/meta'
import type { Activity } from '../../content/schema'
import { AreaIcon, Mascot, StarDeco, CloudDeco } from '../components/icons'
import { db } from '../db'

export const AREA_GRADIENTS: Record<string, string> = {
  'practical-life': 'from-apple-500 to-apple-700',
  sensorial: 'from-grape-500 to-grape-700',
  language: 'from-sky-500 to-sky-700',
  math: 'from-leaf-500 to-leaf-700',
  culture: 'from-tosca-500 to-tosca-700',
  movement: 'from-mango-500 to-mango-700',
  'grace-courtesy': 'from-candy-500 to-candy-700',
  'self-care': 'from-sunny-500 to-sunny-700',
  'art-music': 'from-grape-500 to-candy-700',
  outdoor: 'from-leaf-500 to-tosca-700',
}

export function TodayPage() {
  const [acts, setActs] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const band = activeAgeBand()
  const { children, activeId, setActive } = useChildStore()
  const child = children.find((c) => c.id === activeId)

  const [stats, setStats] = useState({ aktivitas: 0, area: 0, momen: 0, kebiasaan: 0 })
  const [toast, setToast] = useState('')
  const [dismissed, setDismissed] = useState(false)
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 1500)
    return () => window.clearTimeout(timer)
  }, [toast])
  useEffect(() => {
    if (!activeId) return
    Promise.all([
      db.mastery.where('childId').equals(activeId).toArray(),
      db.journal.where('childId').equals(activeId).count(),
      loadAllActivities(),
    ]).then(([mastery, journalCount, allActivities]) => {
      const touched = mastery.filter((m) => m.level !== 'belum')
      const areasByActivity = new Map(allActivities.map((a) => [a.id, a.areas]))
      const areaSet = new Set(touched.filter((m) => m.kind === 'activity').flatMap((m) => areasByActivity.get(m.targetId) ?? []))
      setStats({
        aktivitas: touched.filter((m) => m.kind === 'activity').length,
        area: areaSet.size,
        momen: journalCount,
        kebiasaan: touched.filter((m) => m.kind === 'milestone').length,
      })
    })
  }, [activeId, acts])

  useEffect(() => {
    if (!band) return
    pickToday(band).then((a) => { setActs(a); setLoading(false) })
  }, [band])

  if (!child) return <OnboardPrompt />

  return (
    <div className="px-5 space-y-5">
      {/* Halo header */}
      <section>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-sky-900 dark:text-sky-100">
              Halo, {child.nickname} <span aria-hidden>👋</span>
            </h2>
            <p className="text-sm opacity-75 mt-0.5">Siap main dan belajar hari ini?</p>
          </div>
          <button aria-label="Pengingat" className="w-11 h-11 rounded-full bg-white dark:bg-navy-800 shadow-sm grid place-items-center text-lg active:scale-95 transition">
            🔔
          </button>
        </div>

        {/* Child switcher */}
        <div className="mt-3 flex gap-2 overflow-x-auto hide-scrollbar -mx-1 px-1" role="group" aria-label="Pilih anak">
          {children.map((c) => {
            const cBand = ageBandById(ageBandFromBirth(c.birthDate))
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                aria-pressed={activeId === c.id}
                className={`shrink-0 flex items-center gap-2 rounded-full pl-1.5 pr-4 min-h-[48px] border-2 transition active:scale-[0.97] ${
                  activeId === c.id
                    ? 'bg-sky-600 border-sky-600 text-white shadow-md'
                    : 'bg-white dark:bg-navy-800 border-sky-100 dark:border-navy-700'
                }`}
              >
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-200 to-sky-400 dark:from-navy-600 dark:to-navy-500 grid place-items-center text-lg" aria-hidden>
                  {cBand?.mascot ?? '🙂'}
                </span>
                <span className="text-left leading-tight">
                  <span className="block text-sm font-semibold">{c.nickname}</span>
                  <span className={`block text-[11px] ${activeId === c.id ? 'text-white/80' : 'opacity-70'}`}>{cBand?.label ?? '—'}</span>
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Search bar */}
      <a
        href="#/cari"
        className="flex items-center gap-3 rounded-full bg-white dark:bg-navy-800 shadow-sm px-5 min-h-[48px] text-sm text-sky-900/50 dark:text-sky-100/50 active:scale-[0.98] transition"
      >
        <span aria-hidden>🔍</span>
        Cari aktivitas, misal "menuang", "sensorik"…
      </a>

      {/* Rekomendasi Hari Ini */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-[family-name:var(--font-display)] font-bold text-lg">Rekomendasi Hari Ini</h3>
          <a href="#/playbook" className="text-sm font-medium text-sky-600 dark:text-sky-400">Lihat Semua ›</a>
        </div>
        {loading ? (
          <SkeletonCards n={3} />
        ) : acts.length === 0 ? (
          <EmptyState
            title="Konten sedang disiapkan"
            text="Aktivitas untuk usia ini belum tersedia. Cek playbook usia lain dulu ya."
          />
        ) : (
          <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-1 snap-x snap-mandatory">
            {acts.map((a) => {
              const area = areaById(a.areas[0])
              const grad = AREA_GRADIENTS[a.areas[0]] ?? 'from-sky-500 to-sky-700'
              return (
                <article key={a.id} className="relative snap-start shrink-0 w-44 rounded-3xl bg-white dark:bg-navy-800 shadow-sm overflow-hidden active:scale-[0.97] transition">
                  <a href={`#/aktivitas/${a.id}`} aria-label={a.title} className="block">
                    <div className={`relative h-28 bg-gradient-to-br ${grad} grid place-items-center bg-black/15 bg-blend-overlay`}>
                      <AreaIcon area={a.areas[0]} className="w-14 h-14 text-white/95 drop-shadow" />
                      <span className="absolute top-2 left-2 text-[10px] font-semibold bg-white/90 text-sky-800 rounded-full px-2 py-0.5">{area?.label}</span>
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold text-sm leading-snug line-clamp-2 min-h-[2.5rem]">{a.title}</h4>
                      <p className="text-[11px] opacity-70 mt-1.5">⏱ {a.durationMinutes} mnt · {a.ageBands[0]}</p>
                    </div>
                  </a>
                  <BookmarkButton activityId={a.id} onToast={setToast} />
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* Progres Minggu Ini */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-[family-name:var(--font-display)] font-bold text-lg">Progres Minggu Ini</h3>
          <a href="#/progres" className="text-sm font-medium text-sky-600 dark:text-sky-400">Lihat Detail ›</a>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { n: stats.aktivitas, l: 'aktivitas', c: 'text-leaf-600' },
            { n: stats.area, l: 'area berbeda', c: 'text-sunny-700' },
            { n: stats.momen, l: 'momen berharga', c: 'text-apple-600' },
            { n: stats.kebiasaan, l: 'kebiasaan baru', c: 'text-sky-600' },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl bg-white dark:bg-navy-800 shadow-sm p-2.5 text-center">
              <p className={`font-[family-name:var(--font-display)] font-bold text-xl ${s.c}`}>{s.n}</p>
              <p className="text-[10px] opacity-70 leading-tight mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reminder banner */}
      {!dismissed && <section className="rounded-3xl bg-sunny-100 dark:bg-navy-800 p-4 flex items-start gap-3">
        <span className="text-2xl" aria-hidden>🌞</span>
        <div className="flex-1">
          <p className="text-sm font-semibold">Jangan lupa istirahat, ya!</p>
          <p className="text-xs opacity-70 mt-0.5">Anak juga belajar dari momen santai bersama Mama & Papa.</p>
        </div>
        <button aria-label="Tutup pengingat" onClick={() => setDismissed(true)} className="opacity-70 text-sm px-1">✕</button>
      </section>}
      {toast && <div className="fixed bottom-24 inset-x-0 z-50 mx-auto w-fit rounded-full bg-navy-800 px-4 py-2 text-sm text-white shadow-lg" role="status" aria-live="polite">{toast}</div>}
    </div>
  )
}

export function BookmarkButton({ activityId, onToast }: { activityId: string; onToast: (message: string) => void }) {
  const activeId = useChildStore((s) => s.activeId)
  const [bookmarked, setBookmarked] = useState(false)
  useEffect(() => {
    if (!activeId) return
    db.bookmarks.where('[childId+targetId]').equals([activeId, activityId]).first().then((b) => setBookmarked(!!b))
  }, [activeId, activityId])
  async function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    if (!activeId) return
    if (bookmarked) await db.bookmarks.where('[childId+targetId]').equals([activeId, activityId]).delete()
    else await db.bookmarks.add({ childId: activeId, targetId: activityId, createdAt: Date.now() })
    setBookmarked(!bookmarked)
    onToast(!bookmarked ? 'Disimpan' : 'Dihapus')
  }
  return <button onClick={toggle} aria-label={bookmarked ? 'Hapus bookmark' : 'Simpan ke bookmark'} aria-pressed={bookmarked} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 grid place-items-center text-xs text-sky-800">{bookmarked ? '♥' : '♡'}</button>
}

function childBand(birth: string) {
  return ageBandById(ageBandFromBirth(birth))
}
void childBand

export function OnboardPrompt() {
  return (
    <div className="px-5 relative">
      <CloudDeco className="absolute -top-2 -right-2 w-24 text-white/70 dark:text-navy-700" />
      <StarDeco className="absolute top-8 left-4 w-5 text-sunny-400" />
      <div className="rounded-blob bg-white dark:bg-navy-800 p-6 text-center shadow-sm relative overflow-hidden">
        <Mascot className="w-36 mx-auto" />
        <h1 className="font-[family-name:var(--font-display)] text-lg font-bold"><span className="text-sky-600">Montessori</span> <span className="text-candy-500">Playbook</span></h1>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold mt-2">Selamat datang!</h2>
        <p className="text-sm opacity-70 mt-2 max-w-[280px] mx-auto">
          Ceritakan tentang si kecil, agar kami bisa menyiapkan rekomendasi yang tepat.
        </p>
        <a
          href="#/lainnya"
          className="inline-block mt-4 rounded-full bg-sky-600 px-8 py-3 text-white font-semibold min-h-[48px] leading-[24px] active:scale-95 transition shadow-md shadow-sky-600/20"
        >
          Buat profil anak →
        </a>
      </div>
    </div>
  )
}

export function EmptyState({ title, text, mood = 'happy' }: { title: string; text: string; mood?: 'happy' | 'sleepy' | 'oops' }) {
  return (
    <div className="py-10 text-center px-6">
      <Mascot className="w-28 mx-auto" mood={mood} />
      <h3 className="font-[family-name:var(--font-display)] font-bold text-lg mt-2">{title}</h3>
      <p className="text-sm opacity-70 mt-1 max-w-xs mx-auto">{text}</p>
    </div>
  )
}

export function SkeletonCards({ n }: { n: number }) {
  return (
    <div className="flex gap-3 overflow-hidden -mx-5 px-5" aria-hidden>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="shrink-0 w-44 rounded-3xl bg-white dark:bg-navy-800 overflow-hidden animate-pulse">
          <div className="h-28 bg-sky-100 dark:bg-navy-700" />
          <div className="p-3 space-y-2">
            <div className="h-3.5 w-4/5 rounded bg-sky-100 dark:bg-navy-700" />
            <div className="h-2.5 w-2/5 rounded bg-sky-50 dark:bg-navy-700/60" />
          </div>
        </div>
      ))}
    </div>
  )
}
