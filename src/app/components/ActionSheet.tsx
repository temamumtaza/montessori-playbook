import type { ReactNode } from 'react'
import { BottomSheet } from './BottomSheet'

export type ActionSheetAction = {
  label: string
  icon: ReactNode
  onSelect: () => void
}

type ActionSheetProps = {
  open: boolean
  onClose: () => void
  actions: ActionSheetAction[]
}

export function ActionSheet({ open, onClose, actions }: ActionSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose} title="Pilih Aksi">
      <div className="mt-4 space-y-2">
        {actions.map((action) => (
          <button
            key={action.label}
            aria-label={action.label}
            onClick={() => { action.onSelect(); onClose() }}
            className="flex min-h-[48px] w-full items-center gap-3 rounded-2xl bg-sky-50 px-4 text-left font-semibold text-sky-800 dark:bg-navy-700 dark:text-sky-100"
          >
            <span className="w-5 h-5" aria-hidden>{action.icon}</span>
            {action.label}
          </button>
        ))}
        <button aria-label="Batal" onClick={onClose} className="mt-2 min-h-[48px] w-full rounded-full border border-sky-200 text-sm font-semibold text-sky-700 dark:border-navy-600 dark:text-sky-200">
          Batal
        </button>
      </div>
    </BottomSheet>
  )
}
