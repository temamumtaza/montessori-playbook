import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AgeBandId } from '../../content/schema'

export type Child = {
  id: string
  nickname: string
  birthDate: string // ISO date
}

export function ageBandFromBirth(birthDate: string, now = new Date()): AgeBandId {
  const b = new Date(birthDate)
  const months = (now.getFullYear() - b.getFullYear()) * 12 + (now.getMonth() - b.getMonth())
  if (months < 3) return '0-3m'
  if (months < 6) return '3-6m'
  if (months < 9) return '6-9m'
  if (months < 12) return '9-12m'
  if (months < 18) return '12-18m'
  if (months < 24) return '18-24m'
  if (months < 36) return '2-3y'
  if (months < 48) return '3-4y'
  return '4-5y'
}

type ChildStore = {
  children: Child[]
  activeId: string | null
  onboarded: boolean
  addChild: (nickname: string, birthDate: string) => void
  setActive: (id: string) => void
  removeChild: (id: string) => void
}

export const useChildStore = create<ChildStore>()(
  persist(
    (set) => ({
      children: [],
      activeId: null,
      onboarded: false,
      addChild: (nickname, birthDate) => {
        const id = crypto.randomUUID()
        set((s) => ({
          children: [...s.children, { id, nickname, birthDate }],
          activeId: s.activeId ?? id,
          onboarded: true,
        }))
      },
      setActive: (id) => set({ activeId: id }),
      removeChild: (id) =>
        set((s) => {
          const children = s.children.filter((c) => c.id !== id)
          return { children, activeId: children[0]?.id ?? null, onboarded: children.length > 0 }
        }),
    }),
    { name: 'mp-children' },
  ),
)

export function getActiveChild(): Child | null {
  const st = useChildStore.getState()
  return st.children.find((c) => c.id === st.activeId) ?? null
}

export function activeAgeBand(): AgeBandId | null {
  const c = getActiveChild()
  return c ? ageBandFromBirth(c.birthDate) : null
}
