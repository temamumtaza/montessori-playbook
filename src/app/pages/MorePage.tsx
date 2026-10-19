import { useRef, useState } from 'react'
import { useChildStore } from '../stores/children'
import { exportAllData, importAllData } from '../db'

export function MorePage({ isDark, onToggleDark }: { isDark: boolean; onToggleDark: () => void }) {
  const { children, activeId, setActive, addChild, removeChild } = useChildStore()
  const fileRef = useRef<HTMLInputElement>(null)

  async function onExport() {
    const json = await exportAllData()
    const blob = new Blob([json], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `montessori-playbook-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  async function onImportFile(f: File) {
    const text = await f.text()
    try {
      await importAllData(text)
      alert('Data berhasil diimpor.')
    } catch {
      alert('File tidak dikenali. Gunakan file hasil ekspor app ini.')
    }
  }

  return (
    <div className="px-5 space-y-4">
      {/* Profil anak */}
      <section className="rounded-blob bg-white dark:bg-navy-800 p-4 shadow-sm">
        <h2 className="font-[family-name:var(--font-display)] font-bold text-lg">Profil anak</h2>
        {children.length === 0 ? (
          <p className="text-sm opacity-70 mt-1">Belum ada profil.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {children.map((c) => (
              <li key={c.id} className="flex items-center gap-2">
                <button
                  onClick={() => setActive(c.id)}
                  aria-pressed={activeId === c.id}
                  className={`flex-1 text-left rounded-2xl px-4 min-h-[48px] border transition ${
                    activeId === c.id ? 'bg-sky-600 text-white border-sky-600' : 'border-sky-200 dark:border-navy-700'
                  }`}
                >
                  <span className="font-semibold">{c.nickname}</span>
                  <span className="block text-xs opacity-70">Lahir {c.birthDate}</span>
                </button>
                <button
                  onClick={() => { if (confirm(`Hapus profil ${c.nickname}? Data jurnalnya tetap tersimpan.`)) removeChild(c.id) }}
                  aria-label={`Hapus profil ${c.nickname}`}
                  className="rounded-full border border-apple-400 text-apple-600 min-w-[48px] min-h-[48px]"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
        <AddChildForm onAdd={addChild} />
      </section>

      {/* Tampilan */}
      <section className="rounded-blob bg-white dark:bg-navy-800 p-4 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Mode gelap</h2>
          <p className="text-xs opacity-65">Sky navy, nyaman untuk sesi malam.</p>
        </div>
        <button
          role="switch"
          aria-checked={isDark}
          onClick={onToggleDark}
          className={`w-14 h-8 rounded-full transition relative ${isDark ? 'bg-sky-600' : 'bg-sky-200'}`}
        >
          <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${isDark ? 'left-7' : 'left-1'}`} />
        </button>
      </section>

      {/* Data */}
      <section className="rounded-blob bg-white dark:bg-navy-800 p-4 shadow-sm space-y-2">
        <h2 className="font-semibold">Data kamu</h2>
        <p className="text-xs opacity-65">Semua data tersimpan di perangkat ini saja. Tidak ada server, tidak ada tracking.</p>
        <div className="flex gap-2 pt-1">
          <button onClick={onExport} className="flex-1 rounded-full border border-sky-300 dark:border-navy-600 min-h-[44px] font-medium active:scale-[0.98] transition">
            Ekspor JSON
          </button>
          <button onClick={() => fileRef.current?.click()} className="flex-1 rounded-full border border-sky-300 dark:border-navy-600 min-h-[44px] font-medium active:scale-[0.98] transition">
            Impor JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onImportFile(e.target.files[0])}
          />
        </div>
      </section>

      {/* Disclaimer */}
      <section className="rounded-blob bg-sunny-100 dark:bg-navy-800 p-4 text-sm">
        <h2 className="font-bold">⚠️ Disclaimer</h2>
        <p className="mt-1 opacity-80">
          Montessori Playbook adalah panduan edukatif untuk orang tua, bukan pengganti nasihat dokter, terapis,
          atau tenaga kesehatan. Setiap anak berkembang dengan temponya sendiri. Jika ada kekhawatiran tentang
          tumbuh kembang anak, konsultasikan ke dokter atau ahli terapi. Dalam keadaan darurat, hubungi layanan
          gawat darurat setempat.
        </p>
      </section>

      <p className="text-center text-xs opacity-50 pb-2">Montessori Playbook v0.1 · dibuat dengan ☁️ untuk orang tua Indonesia</p>
    </div>
  )
}

function AddChildForm({ onAdd }: { onAdd: (nickname: string, birthDate: string) => void }) {
  const [open, setOpen] = useState(false)
  const [nickname, setNickname] = useState('')
  const [birth, setBirth] = useState('')

  if (!open)
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 w-full rounded-full border-2 border-dashed border-sky-300 dark:border-navy-600 text-sky-700 dark:text-sky-300 min-h-[48px] font-medium active:scale-[0.98] transition"
      >
        + Tambah anak
      </button>
    )

  return (
    <form
      className="mt-3 space-y-2"
      onSubmit={(e) => {
        e.preventDefault()
        if (!nickname.trim() || !birth) return
        onAdd(nickname.trim(), birth)
        setNickname(''); setBirth(''); setOpen(false)
      }}
    >
      <input
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Nama panggilan"
        aria-label="Nama panggilan anak"
        className="w-full rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/50 dark:bg-navy-700/40 px-4 min-h-[48px]"
        required
      />
      <input
        type="date"
        value={birth}
        onChange={(e) => setBirth(e.target.value)}
        aria-label="Tanggal lahir anak"
        className="w-full rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/50 dark:bg-navy-700/40 px-4 min-h-[48px]"
        required
      />
      <div className="flex gap-2">
        <button type="button" onClick={() => setOpen(false)} className="flex-1 rounded-full border border-sky-200 dark:border-navy-700 min-h-[44px]">
          Batal
        </button>
        <button type="submit" className="flex-1 rounded-full bg-sky-600 text-white font-semibold min-h-[44px]">
          Simpan
        </button>
      </div>
    </form>
  )
}
