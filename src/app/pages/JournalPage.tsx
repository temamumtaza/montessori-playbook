import { useLiveQuery } from 'dexie-react-hooks'
import { db, type JournalEntry } from '../db'
import { useChildStore } from '../stores/children'
import { useState } from 'react'
import { EmptyState } from './TodayPage'

export function JournalPage() {
  const activeId = useChildStore((s) => s.activeId)
  const [note, setNote] = useState('')
  const [mood, setMood] = useState<JournalEntry['mood']>('senang')

  const entries = useLiveQuery(async () => {
    if (!activeId) return [] as JournalEntry[]
    return db.journal.where('childId').equals(activeId).reverse().sortBy('createdAt')
  }, [activeId])

  async function save() {
    if (!activeId || !note.trim()) return
    await db.journal.add({ childId: activeId, createdAt: Date.now(), note: note.trim(), skillTags: [], mood })
    setNote('')
  }

  return (
    <div className="px-5 space-y-4">
      <section className="rounded-blob bg-white dark:bg-navy-800 p-4 shadow-sm">
        <h2 className="font-semibold mb-2">Catat observasi</h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Apa yang kamu amati hari ini? Contoh: Rani fokus menuang sendiri 10 menit…"
          rows={3}
          className="w-full rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/50 dark:bg-navy-700/40 p-3 text-sm min-h-[88px]"
          aria-label="Catatan observasi"
        />
        <div className="flex gap-2 mt-2" role="group" aria-label="Suasana anak">
          {(['senang', 'fokus', 'frustrasi', 'tenang'] as const).map((m) => (
            <button
              key={m}
              aria-pressed={mood === m}
              onClick={() => setMood(m)}
              className={`rounded-full px-3 min-h-[36px] text-sm border transition ${
                mood === m ? 'bg-sky-600 text-white border-sky-600' : 'border-sky-200 dark:border-navy-700'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <button
          onClick={save}
          disabled={!note.trim()}
          className="mt-3 w-full rounded-full bg-sky-600 text-white font-semibold min-h-[48px] disabled:opacity-40 active:scale-[0.98] transition"
        >
          Simpan catatan
        </button>
      </section>

      <h2 className="font-[family-name:var(--font-display)] font-bold text-lg">Timeline</h2>
      {!entries ? (
        <p className="text-sm opacity-60">Memuat…</p>
      ) : entries.length === 0 ? (
        <EmptyState title="Belum ada catatan" text="Observasi pertamamu akan muncul di sini." />
      ) : (
        <ol className="space-y-3">
          {entries.map((e) => (
            <li key={e.id} className="rounded-blob bg-white dark:bg-navy-800 p-4 shadow-sm">
              <p className="text-xs opacity-60">{new Date(e.createdAt).toLocaleString('id-ID')}</p>
              <p className="text-sm mt-1">{e.note}</p>
              {e.mood && <p className="text-xs mt-2 opacity-70">Mood: {e.mood}</p>}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
