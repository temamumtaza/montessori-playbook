import { useEffect } from 'react'

type BottomSheetProps = {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-label="Tutup" className="absolute inset-0 h-full w-full cursor-default bg-black/40" onClick={onClose} />
      <div className="sheet-enter absolute inset-x-0 bottom-0 rounded-t-3xl bg-white dark:bg-navy-800 p-5 pb-safe shadow-2xl">
        <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-sky-200 dark:bg-navy-600" aria-hidden />
        <h2 className="mt-4 text-lg font-bold font-[family-name:var(--font-display)]">{title}</h2>
        {children}
      </div>
    </div>
  )
}
