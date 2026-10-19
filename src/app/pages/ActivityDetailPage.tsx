import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { loadAllActivities } from '../../content/store'
import { areaById, ageBandById } from '../../content/meta'
import type { Activity } from '../../content/schema'
import { AreaIcon } from '../components/icons'
import { AREA_GRADIENTS } from './TodayPage'
import { db } from '../db'
import { useChildStore } from '../stores/children'
import { BottomSheet } from '../components/BottomSheet'

type Mode = 'baca' | 'praktik'

export function ActivityDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [act, setAct] = useState<Activity | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [mode, setMode] = useState<Mode>('baca')
  const [duration, setDuration] = useState<number | null>(null)
  const [remaining, setRemaining] = useState(0)
  const [durationChoice, setDurationChoice] = useState(10)
  const [toast, setToast] = useState('')
  const [wakeLocked, setWakeLocked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const wakeRef = useRef<WakeLockSentinel | null>(null)
  const activeId = useChildStore((s) => s.activeId)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 1800)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    loadAllActivities().then((all) => {
      const found = all.find((a) => a.id === id) ?? null
      setAct(found)
      setNotFound(!found)
    })
  }, [id])

  useEffect(() => {
    if (!act || !activeId) return
    db.bookmarks.where('[childId+targetId]').equals([activeId, act.id]).first().then((b) => setBookmarked(!!b))
  }, [act, activeId])

  // Mode praktik: timer jalan + Wake Lock
  useEffect(() => {
    if (mode !== 'praktik') {
      setDuration(null)
      setRemaining(0)
      wakeRef.current?.release().then(() => setWakeLocked(false)).catch(() => {})
      wakeRef.current = null
      return
    }
    if (duration === null) return
    const t = window.setInterval(() => {
      setRemaining((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(t)
          setToast('Waktu selesai! 🎉')
          return 0
        }
        return seconds - 1
      })
    }, 1000)
    type NavWithLock = Navigator & { wakeLock?: { request: (t: 'screen') => Promise<WakeLockSentinel> } }
    const nav = navigator as NavWithLock
    if (nav.wakeLock) {
      nav.wakeLock.request('screen').then((s) => { wakeRef.current = s; setWakeLocked(true) }).catch(() => {})
    }
    return () => clearInterval(t)
  }, [mode, duration])

  async function toggleBookmark() {
    if (!act || !activeId) return
    if (bookmarked) {
      await db.bookmarks.where('[childId+targetId]').equals([activeId, act.id]).delete()
      setBookmarked(false)
    } else {
      await db.bookmarks.add({ childId: activeId, targetId: act.id, createdAt: Date.now() })
      setBookmarked(true)
    }
  }

  async function markDone(level: 'mulai' | 'mahir') {
    if (!act || !activeId) return
    await db.mastery.put({ childId: activeId, targetId: act.id, kind: 'activity', level, updatedAt: Date.now() })
    if (window.history.length > 1) navigate(-1)
    else navigate('/playbook')
  }

  if (notFound) {
    return <div className="px-5 py-10 text-center"><p className="font-semibold">Aktivitas tidak ditemukan</p><a href="#/playbook" className="text-sky-600 text-sm">← Kembali ke Playbook</a></div>
  }
  if (!act) return <div className="px-5 text-sm opacity-70">Memuat…</div>

  const area = areaById(act.areas[0])
  const grad = AREA_GRADIENTS[act.areas[0]] ?? 'from-sky-500 to-sky-700'
  const countdownMm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const countdownSs = String(remaining % 60).padStart(2, '0')

  return (
    <div className="pb-8">
      {/* Hero */}
      <div className={`relative bg-gradient-to-br ${grad} px-5 pt-safe pb-6`}>
        <div className="flex items-center justify-between pt-2">
          <button onClick={() => { if (window.history.length > 1) navigate(-1); else navigate('/playbook') }} aria-label="Kembali" className="w-11 h-11 rounded-full bg-white/25 backdrop-blur grid place-items-center text-white text-lg active:scale-95 transition">←</button>
          <div className="flex gap-2">
            <button onClick={toggleBookmark} aria-label={bookmarked ? 'Hapus bookmark' : 'Bookmark'} aria-pressed={bookmarked} className="w-11 h-11 rounded-full bg-white/25 backdrop-blur grid place-items-center text-white active:scale-95 transition">
              {bookmarked ? '♥' : '♡'}
            </button>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/25 backdrop-blur grid place-items-center">
            <AreaIcon area={act.areas[0]} className="w-8 h-8 text-white" />
          </div>
          <div className="text-white">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-85">{area?.label}</p>
            <p className="text-sm opacity-90">{act.ageBands.map((b) => ageBandById(b)?.label).join(' · ')}</p>
          </div>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white mt-3 leading-tight">{act.title}</h1>
        <p className="text-white/90 text-sm mt-1.5">{act.summary}</p>
      </div>

      {/* Mode switcher: Baca | Praktik */}
      <div className="sticky z-30 -mt-4 px-5">
        <div role="tablist" aria-label="Mode" className="grid grid-cols-2 rounded-full bg-white dark:bg-navy-800 shadow-md overflow-hidden p-1">
          {(['baca', 'praktik'] as const).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-full min-h-[44px] text-sm font-semibold transition ${mode === m ? 'bg-sky-600 text-white' : 'text-sky-700 dark:text-sky-300'}`}
            >
              {m === 'baca' ? '📖 Baca' : `⏱ Praktik${mode === 'praktik' && duration !== null ? ` ${countdownMm}:${countdownSs}` : ''}`}
            </button>
          ))}
        </div>
        {mode === 'praktik' && (
          <p className="text-center text-xs mt-1.5 opacity-70">
            {wakeLocked ? '🔒 Layar tidak akan mati' : 'Layar mungkin mati otomatis'} · ⏱ {duration !== null ? `${countdownMm}:${countdownSs}` : 'belum mulai'}
          </p>
        )}
      </div>

      <BottomSheet open={mode === 'praktik' && duration === null} onClose={() => setMode('baca')} title="Pilih Durasi Aktivitas">
        <div className="mt-4 grid grid-cols-2 gap-2">
          {[5, 10, 15, 30, act.durationMinutes].map((minutes, index) => (
            <button
              key={`${minutes}-${index}`}
              aria-label={`Pilih durasi ${minutes} menit`}
              aria-pressed={durationChoice === minutes}
              onClick={() => setDurationChoice(minutes)}
              className={`min-h-[44px] rounded-full border-2 text-sm font-semibold transition ${durationChoice === minutes ? 'border-sky-600 bg-sky-600 text-white' : 'border-sky-200 text-sky-700 dark:border-navy-600 dark:text-sky-200'}`}
            >
              {index === 4 ? `⏱ ${minutes} mnt · rekomendasi` : `${minutes} mnt`}
            </button>
          ))}
        </div>
        <button
          aria-label="Mulai Aktivitas"
          onClick={() => { setDuration(durationChoice); setRemaining(durationChoice * 60) }}
          className="mt-4 min-h-[48px] w-full rounded-full bg-sky-600 font-semibold text-white shadow-md shadow-sky-600/20"
        >
          Mulai Aktivitas
        </button>
      </BottomSheet>

      <div className="px-5 space-y-4 mt-4">
        {/* Meta chips */}
        <div className="flex gap-1.5 flex-wrap">
          <span className="text-[11px] rounded-full bg-white dark:bg-navy-800 shadow-sm px-3 py-1.5">⏱ {act.durationMinutes} menit</span>
          <span className="text-[11px] rounded-full bg-white dark:bg-navy-800 shadow-sm px-3 py-1.5">🧺 persiapan {act.prepLevel} ({act.prepMinutes} mnt)</span>
        </div>

        {/* Tujuan */}
        <section className="rounded-3xl bg-white dark:bg-navy-800 p-4 shadow-sm">
          <h2 className="font-[family-name:var(--font-display)] font-bold">Tujuan</h2>
          <ul className="mt-2 space-y-1.5">
            {act.objectives.map((o, i) => (
              <li key={i} className="text-sm flex gap-2"><span className="text-sky-500">✦</span>{o}</li>
            ))}
          </ul>
        </section>

        {/* Bahan */}
        <section className="rounded-3xl bg-white dark:bg-navy-800 p-4 shadow-sm">
          <h2 className="font-[family-name:var(--font-display)] font-bold">Bahan</h2>
          <ul className="mt-2 space-y-1.5">
            {act.materials.map((m, i) => (
              <li key={i} className="text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-md border-2 border-sky-200 inline-block" aria-hidden />
                {m.name}
                {m.fromHome && <span className="text-[10px] bg-leaf-100 text-leaf-700 rounded-full px-2 py-0.5">di rumah</span>}
                {m.optional && <span className="text-[10px] opacity-50">opsional</span>}
              </li>
            ))}
          </ul>
        </section>

        {/* Langkah */}
        <section className="rounded-3xl bg-white dark:bg-navy-800 p-4 shadow-sm">
          <h2 className="font-[family-name:var(--font-display)] font-bold">Langkah presentasi</h2>
          <ol className="mt-3 space-y-3">
            {act.presentation.map((p) => (
              <li key={p.step} className="flex gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full bg-sky-600 text-white text-xs font-bold grid place-items-center">{p.step}</span>
                <p className="text-sm pt-1">{p.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Kontrol kesalahan & variasi */}
        {act.controlOfError && (
          <section className="rounded-3xl bg-tosca-50 dark:bg-navy-800 p-4 shadow-sm border border-tosca-100">
            <h2 className="font-semibold text-sm text-tosca-700">✅ Kontrol kesalahan</h2>
            <p className="text-sm mt-1">{act.controlOfError}</p>
          </section>
        )}
        {act.variations.length > 0 && (
          <section className="rounded-3xl bg-white dark:bg-navy-800 p-4 shadow-sm">
            <h2 className="font-[family-name:var(--font-display)] font-bold">Variasi</h2>
            <ul className="mt-2 space-y-1">{act.variations.map((v, i) => <li key={i} className="text-sm">• {v}</li>)}</ul>
          </section>
        )}

        {/* Keselamatan */}
        {act.safetyNotes.length > 0 && (
          <section className="rounded-3xl bg-apple-50 dark:bg-navy-800 p-4 shadow-sm border border-apple-100">
            <h2 className="font-semibold text-sm text-apple-700">🛡️ Keselamatan</h2>
            <ul className="mt-1.5 space-y-1">{act.safetyNotes.map((s, i) => <li key={i} className="text-sm">{s}</li>)}</ul>
          </section>
        )}

        {/* Tanda siap / kesulitan */}
        <div className="grid grid-cols-2 gap-3">
          <section className="rounded-3xl bg-leaf-50 dark:bg-navy-800 p-4 border border-leaf-100">
            <h2 className="font-semibold text-sm text-leaf-700">Tanda siap</h2>
            <ul className="mt-1.5 space-y-1">{act.readySigns.map((s, i) => <li key={i} className="text-xs">{s}</li>)}</ul>
          </section>
          {act.struggleSigns.length > 0 && (
            <section className="rounded-3xl bg-sunny-50 dark:bg-navy-800 p-4 border border-sunny-100">
              <h2 className="font-semibold text-sm text-sunny-700">Tanda kesulitan</h2>
              <ul className="mt-1.5 space-y-1">{act.struggleSigns.map((s, i) => <li key={i} className="text-xs">{s}</li>)}</ul>
            </section>
          )}
        </div>

        {/* Rujukan */}
        <section className="rounded-3xl bg-white dark:bg-navy-800 p-4 shadow-sm">
          <h2 className="font-semibold text-sm opacity-70">Rujukan</h2>
          <ul className="mt-1.5 space-y-1">
            {act.references.map((r, i) => (
              <li key={i} className="text-xs">
                <a href={r.url} target="_blank" rel="noreferrer" className="text-sky-600 underline">{r.title}</a>
              </li>
            ))}
          </ul>
        </section>

        {/* Aksi utama di zona jempol */}
        {mode === 'praktik' && duration !== null && (
          <div className="text-center">
            <button aria-label="Atur ulang durasi" onClick={() => setDuration(null)} className="text-xs font-semibold text-sky-600 underline dark:text-sky-300">
              atur ulang durasi
            </button>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button onClick={() => markDone('mulai')} className="rounded-full border-2 border-sky-500 text-sky-700 dark:text-sky-300 font-semibold min-h-[48px] active:scale-[0.98] transition">
            Mulai dicoba
          </button>
          <button onClick={() => markDone('mahir')} className="rounded-full bg-sky-600 text-white font-semibold min-h-[48px] active:scale-[0.98] transition shadow-md shadow-sky-600/20">
            Sudah mahir ✓
          </button>
        </div>
      </div>
      {toast && <div className="fixed bottom-24 inset-x-0 z-50 mx-auto w-fit rounded-full bg-navy-800 px-4 py-2 text-sm text-white shadow-lg" role="status" aria-live="polite">{toast}</div>}
    </div>
  )
}
