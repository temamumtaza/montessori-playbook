import { useEffect, useState } from 'react'
import { IconSparkle } from './ui-icons'

export function UpdateToast({ swUpdate }: { swUpdate: { onNeedRefresh: (cb: () => void) => () => void; applyUpdate: () => void } }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => swUpdate.onNeedRefresh(() => setVisible(true)), [swUpdate])

  if (!visible) return null

  return (
    <div
      className="fixed bottom-24 inset-x-4 z-[60] mx-auto max-w-sm rounded-2xl bg-navy-800 px-4 py-3 text-white shadow-xl flex items-center gap-3 page-enter"
      role="status"
    >
      <IconSparkle className="w-5 h-5" />
      <p className="flex-1 text-sm">Versi baru tersedia</p>
      <button
        onClick={() => { swUpdate.applyUpdate(); setVisible(false) }}
        className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold min-h-[40px] active:scale-95 transition"
      >
        Perbarui
      </button>
    </div>
  )
}
