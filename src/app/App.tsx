import { useEffect, useState, createContext, useContext } from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { TodayPage } from './pages/TodayPage'
import { PlaybookPage } from './pages/PlaybookPage'
import { JournalPage } from './pages/JournalPage'
import { ProgressPage } from './pages/ProgressPage'
import { MorePage } from './pages/MorePage'
import { UpdateToast } from './components/UpdateToast'
import { swUpdate } from './pwa'
import { useChildStore } from './stores/children'

type TabScroll = Record<string, number>
const ScrollCtx = createContext<{ save: (tab: string, y: number) => void; get: (tab: string) => number }>({
  save: () => {},
  get: () => 0,
})
export const useTabScroll = () => useContext(ScrollCtx)

const TABS = [
  { to: '/', label: 'Hari Ini', icon: '☀️' },
  { to: '/playbook', label: 'Playbook', icon: '📖' },
  { to: '/jurnal', label: 'Jurnal', icon: '📝' },
  { to: '/progres', label: 'Progres', icon: '🌱' },
  { to: '/lainnya', label: 'Lainnya', icon: '⋯' },
]

export default function App() {
  const location = useLocation()
  const [scrollMem, setScrollMem] = useState<TabScroll>({})
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem('mp-theme') === 'dark' ||
      (localStorage.getItem('mp-theme') === null && window.matchMedia('(prefers-color-scheme: dark)').matches),
  )
  const activeChild = useChildStore((s) => s.children[0])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('mp-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  // Simpan scroll per tab & restore saat kembali
  useEffect(() => {
    const tab = TABS.find((t) => t.to === location.pathname)?.to ?? location.pathname
    const saved = scrollMem[tab]
    if (saved !== undefined) requestAnimationFrame(() => window.scrollTo(0, saved))
    const onScroll = () => {
      setScrollMem((m) => (m[tab] === window.scrollY ? m : { ...m, [tab]: window.scrollY }))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])

  return (
    <ScrollCtx.Provider value={{ save: () => {}, get: (t) => scrollMem[t] ?? 0 }}>
      <div className="min-h-dvh bg-sky-50 dark:bg-navy-900 text-sky-900 dark:text-sky-100 transition-colors">
        {/* Header collapsing large title */}
        <Header title={titleFor(location.pathname)} />

        <main className="px-safe pb-28 pt-2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            >
              <Routes location={location}>
                <Route path="/" element={<TodayPage />} />
                <Route path="/playbook" element={<PlaybookPage />} />
                <Route path="/jurnal" element={<JournalPage />} />
                <Route path="/progres" element={<ProgressPage />} />
                <Route path="/lainnya" element={<MorePage isDark={isDark} onToggleDark={() => setIsDark((d) => !d)} />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>

        <TabBar tabs={TABS} />
        <UpdateToast swUpdate={swUpdate} />
        {/* a11y: nama anak di judul dinamis */}
        <span className="sr-only" aria-live="polite">{activeChild ? `Profil aktif: ${activeChild.nickname}` : ''}</span>
      </div>
    </ScrollCtx.Provider>
  )
}

function titleFor(path: string): string {
  if (path === '/') return 'Hari Ini'
  if (path.startsWith('/playbook')) return 'Playbook'
  if (path.startsWith('/jurnal')) return 'Jurnal'
  if (path.startsWith('/progres')) return 'Progres'
  return 'Lainnya'
}

function Header({ title }: { title: string }) {
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 36)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <header className="sticky top-0 z-40 bg-sky-50/85 dark:bg-navy-900/85 backdrop-blur-md pt-safe">
      <div className="px-5 pb-2 transition-all" style={{ height: compact ? 48 : 84 }}>
        <h1
          className={`font-[family-name:var(--font-display)] font-bold text-sky-700 dark:text-sky-300 transition-all ${compact ? 'text-xl leading-[48px]' : 'text-3xl leading-[84px]'}`}
        >
          {title}
        </h1>
      </div>
    </header>
  )
}

function TabBar({ tabs }: { tabs: typeof TABS }) {
  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed bottom-0 inset-x-0 z-50 bg-white/90 dark:bg-navy-800/90 backdrop-blur-md border-t border-sky-100 dark:border-navy-700 pb-safe"
    >
      <div className="grid grid-cols-5 px-safe">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2 min-h-[48px] justify-center text-[11px] font-medium transition-colors ${
                isActive ? 'text-sky-600 dark:text-sky-400' : 'text-sky-900/45 dark:text-sky-100/45'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span aria-hidden className="text-xl leading-none">{t.icon}</span>
                <span>{t.label}</span>
                {isActive && (
                  <motion.span layoutId="tabdot" className="absolute top-0 h-0.5 w-8 rounded-full bg-sky-500" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
