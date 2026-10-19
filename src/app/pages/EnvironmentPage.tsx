import { useEffect, useMemo, useState } from 'react'
import { loadGlobal } from '../../content/store'
import type { RoomSetup } from '../../content/schema'
import { db } from '../db'
import { useChildStore } from '../stores/children'
import { Mascot, RainbowDeco } from '../components/icons'

const ROOM_META: Record<RoomSetup['room'], { label: string; icon: string }> = {
  'kamar-anak': { label: 'Kamar anak', icon: '🛏️' },
  'kamar-mandi': { label: 'Kamar mandi', icon: '🛁' },
  dapur: { label: 'Dapur', icon: '🍳' },
  'ruang-keluarga': { label: 'Ruang keluarga', icon: '🛋️' },
  'area-makan': { label: 'Area makan', icon: '🍽️' },
  outdoor: { label: 'Outdoor', icon: '🌿' },
}

const ROOM_ORDER: RoomSetup['room'][] = ['kamar-anak', 'kamar-mandi', 'dapur', 'ruang-keluarga', 'area-makan', 'outdoor']

export function EnvironmentPage() {
  const activeId = useChildStore((s) => s.activeId)
  const [rooms, setRooms] = useState<RoomSetup[]>([])
  const [selectedRoom, setSelectedRoom] = useState<RoomSetup['room']>('kamar-anak')
  const [done, setDone] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGlobal().then((global) => {
      setRooms(global.roomSetups)
      if (global.roomSetups.length > 0) setSelectedRoom(global.roomSetups[0].room)
      setLoading(false)
    })
  }, [])

  const room = useMemo(() => rooms.find((r) => r.room === selectedRoom), [rooms, selectedRoom])

  useEffect(() => {
    let cancelled = false
    if (!activeId || !room) {
      setDone(new Set())
      return
    }
    db.checklists.where('childId').equals(activeId).toArray().then((records) => {
      if (!cancelled) setDone(new Set(records.filter((r) => r.checklistId === room.id && r.done).map((r) => r.itemId)))
    })
    return () => { cancelled = true }
  }, [activeId, room])

  async function toggleItem(itemId: number) {
    if (!activeId || !room) return
    const nextDone = !done.has(itemId)
    setDone((current) => {
      const next = new Set(current)
      if (nextDone) next.add(itemId)
      else next.delete(itemId)
      return next
    })
    await db.checklists.put({ childId: activeId, checklistId: room.id, itemId, done: nextDone })
  }

  if (loading) return <div className="px-5 py-12 text-center text-sm opacity-65">Menyiapkan panduan ruangan…</div>

  return (
    <div className="px-5 space-y-5">
      <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-navy-800 p-5 shadow-sm">
        <RainbowDeco className="absolute -right-1 -top-1 w-20 opacity-70" />
        <h2 className="relative font-[family-name:var(--font-display)] text-2xl font-bold">Persiapan rumah</h2>
        <p className="relative mt-1 max-w-sm text-sm opacity-70">Buat lingkungan yang mengundang anak untuk bergerak, memilih, dan mandiri.</p>
      </section>

      <section aria-label="Pilih ruangan">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-1 px-1 pb-1">
          {ROOM_ORDER.map((roomId) => {
            const meta = ROOM_META[roomId]
            const available = rooms.some((r) => r.room === roomId)
            return (
              <button
                key={roomId}
                onClick={() => setSelectedRoom(roomId)}
                disabled={!available}
                aria-pressed={selectedRoom === roomId}
                className={`shrink-0 rounded-2xl px-3 min-h-[64px] border-2 transition active:scale-[0.97] ${
                  selectedRoom === roomId ? 'bg-sky-600 border-sky-600 text-white shadow-md' : 'bg-white dark:bg-navy-800 border-sky-100 dark:border-navy-700'
                } ${!available ? 'opacity-40' : ''}`}
              >
                <span className="block text-xl" aria-hidden>{meta.icon}</span>
                <span className="block text-[11px] font-semibold mt-0.5">{meta.label}</span>
              </button>
            )
          })}
        </div>
      </section>

      {!room ? (
        <div className="rounded-3xl bg-white dark:bg-navy-800 p-6 text-center shadow-sm">
          <Mascot className="w-28 mx-auto" mood="sleepy" />
          <p className="mt-2 text-sm opacity-70">Panduan ruangan belum tersedia.</p>
        </div>
      ) : (
        <>
          <section className="rounded-3xl bg-white dark:bg-navy-800 p-5 shadow-sm">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold">{room.title}</h2>
            <div className="mt-4 flex items-center justify-between text-sm font-medium">
              <span>Progres persiapan</span>
              <span className="text-sky-600 dark:text-sky-400">{done.size}/{room.items.length}</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-sky-100 dark:bg-navy-700" aria-label={`${done.size} dari ${room.items.length} item selesai`} role="progressbar" aria-valuemin={0} aria-valuemax={room.items.length} aria-valuenow={done.size}>
              <div className="h-full rounded-full bg-sky-600 transition-all" style={{ width: `${room.items.length ? (done.size / room.items.length) * 100 : 0}%` }} />
            </div>
            {!activeId && <p className="mt-3 text-xs text-apple-600">Pilih atau buat profil anak di menu Lainnya agar progres tersimpan.</p>}
          </section>

          <section className="rounded-3xl bg-white dark:bg-navy-800 p-5 shadow-sm">
            <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">Prinsip penataan</h3>
            <ul className="mt-3 space-y-3 text-sm">
              {room.principles.map((principle) => <li key={principle} className="flex gap-2"><span className="text-sky-500" aria-hidden>✦</span><span>{principle}</span></li>)}
            </ul>
          </section>

          <section>
            <h3 className="mb-2.5 font-[family-name:var(--font-display)] text-lg font-bold">Checklist perlengkapan</h3>
            <div className="space-y-3">
              {room.items.map((item, index) => (
                <label key={item.name} className={`block rounded-3xl bg-white dark:bg-navy-800 p-4 shadow-sm transition ${done.has(index) ? 'ring-2 ring-leaf-300' : ''}`}>
                  <span className="flex items-start gap-3">
                    <input type="checkbox" checked={done.has(index)} onChange={() => toggleItem(index)} disabled={!activeId} className="mt-1 h-5 w-5 accent-sky-600" />
                    <span className="min-w-0 flex-1">
                      <span className={`block font-semibold ${done.has(index) ? 'line-through opacity-55' : ''}`}>{item.name}</span>
                      <span className="mt-2 grid gap-1 text-xs opacity-75"><span><b className="text-leaf-700 dark:text-leaf-300">Rendah:</b> {item.budgetRendah}</span>{item.budgetSedang && <span><b className="text-mango-700 dark:text-mango-300">Sedang:</b> {item.budgetSedang}</span>}</span>
                      <span className="mt-2 flex flex-wrap gap-1.5">{item.essential && <span className="rounded-full bg-sky-100 dark:bg-navy-700 px-2 py-0.5 text-[10px] font-semibold text-sky-700 dark:text-sky-300">Esensial</span>}{item.diy && <span className="rounded-full bg-sunny-100 px-2 py-0.5 text-[10px] font-semibold text-sunny-700">DIY</span>}</span>
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-tosca-50 dark:bg-navy-800 p-5 shadow-sm">
            <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">Tips tata letak</h3>
            <ul className="mt-3 space-y-2 text-sm">{room.layoutTips.map((tip) => <li key={tip} className="flex gap-2"><span aria-hidden>💡</span><span>{tip}</span></li>)}</ul>
          </section>
        </>
      )}
    </div>
  )
}
