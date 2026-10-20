import { lazy, Suspense, useEffect, useState, useRef, createContext, useContext } from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { TodayPage } from './pages/TodayPage'
const PlaybookPage = lazy(() => import('./pages/PlaybookPage').then((m) => ({ default: m.PlaybookPage })))
const JournalPage = lazy(() => import('./pages/JournalPage').then((m) => ({ default: m.JournalPage })))
const ProgressPage = lazy(() => import('./pages/ProgressPage').then((m) => ({ default: m.ProgressPage })))
const MorePage = lazy(() => import('./pages/MorePage').then((m) => ({ default: m.MorePage })))
const ActivityDetailPage = lazy(() => import('./pages/ActivityDetailPage').then((m) => ({ default: m.ActivityDetailPage })))
const SearchGlossaryPage = lazy(() => import('./pages/SearchGlossaryPage').then((m) => ({ default: m.SearchGlossaryPage })))
const EnvironmentPage = lazy(() => import('./pages/EnvironmentPage').then((m) => ({ default: m.EnvironmentPage })))
const LearnPage = lazy(() => import('./pages/LearnPage').then((m) => ({ default: m.LearnPage })))
const OnboardingPage = lazy(() => import('./pages/OnboardingPage').then((m) => ({ default: m.OnboardingPage })))
import { UpdateToast } from './components/UpdateToast'
import { swUpdate } from './pwa'
import { useChildStore } from './stores/children'
import { TabIcon } from './components/icons'

type TabScroll = Record<string, number>
const ScrollCtx = createContext<{ save: (tab: string, y: number) => void; get: (tab: string) => number }>({
  save: () => {},
  get: () => 0,
})
export const useTabScroll = () => useContext(ScrollCtx)

const TABS = [
  { to: '/', label: 'Hari Ini', icon: 'home' as const },
  { to: '/playbook', label: 'Playbook', icon: 'book-open' as const },
  { to: '/jurnal', label: 'Jurnal', icon: 'journal' as const },
  { to: '/progres', label: 'Progres', icon: 'chart' as const },
  { to: '/lainnya', label: 'Lainnya', icon: 'ellipsis' as const },
]

export default function App() {
  const location = useLocation()
  const [scrollMem, setScrollMem] = useState<TabScroll>({})
  const scrollMemRef = useRef(scrollMem)
  useEffect(() => { scrollMemRef.current = scrollMem }, [scrollMem])
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem('mp-theme') === 'dark' ||
      (localStorage.getItem('mp-theme') === null && window.matchMedia('(prefers-color-scheme: dark)').matches),
  )
  const activeChild = useChildStore((s) => s.children[0])
  const isOnboarding = location.pathname === '/onboarding'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('mp-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  // Simpan scroll per tab & restore saat kembali
  useEffect(() => {
    const tab = TABS.find((t) => t.to === location.pathname)?.to ?? location.pathname
    const saved = scrollMemRef.current[tab]
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
        {!isOnboarding && <Header title={titleFor(location.pathname)} />}

        <main className={`${isOnboarding ? 'px-safe' : 'px-safe pb-28 pt-2'} page-enter`} key={location.pathname}>
          <Suspense fallback={<div className="min-h-48 animate-pulse rounded-3xl bg-white/70" role="status" aria-label="Memuat halaman" />}>
            <Routes location={location}>
              <Route path="/" element={<TodayPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/playbook" element={<PlaybookPage />} />
              <Route path="/aktivitas/:id" element={<ActivityDetailPage />} />
              <Route path="/cari" element={<SearchGlossaryPage />} />
              <Route path="/jurnal" element={<JournalPage />} />
              <Route path="/progres" element={<ProgressPage />} />
              <Route path="/lainnya" element={<MorePage isDark={isDark} onToggleDark={() => setIsDark((d) => !d)} />} />
              <Route path="/lingkungan" element={<EnvironmentPage />} />
              <Route path="/belajar" element={<LearnPage />} />
            </Routes>
          </Suspense>
        </main>

        {!isOnboarding && <TabBar tabs={TABS} />}
        <UpdateToast swUpdate={swUpdate} />
        {/* a11y: nama anak di judul dinamis */}
        <span className="sr-only" aria-live="polite">{activeChild ? `Profil aktif: ${activeChild.nickname}` : ''}</span>
      </div>
    </ScrollCtx.Provider>
  )
}

function titleFor(path: string): string {
  if (path === '/') return 'Hari Ini'
  if (path.startsWith('/cari')) return 'Cari'
  if (path.startsWith('/playbook')) return 'Playbook'
  if (path.startsWith('/jurnal')) return 'Jurnal'
  if (path.startsWith('/progres')) return 'Progres'
  if (path.startsWith('/lingkungan')) return 'Persiapan rumah'
  if (path.startsWith('/belajar')) return 'Panduan & Pemantauan'
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
                isActive ? 'text-sky-700 dark:text-sky-400' : 'text-sky-900/75 dark:text-sky-100/75'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <TabIcon name={t.icon} className="w-5 h-5" />
                <span>{t.label}</span>
                {isActive && (
                  <span className="absolute top-0 h-0.5 w-8 rounded-full bg-sky-500 transition-all" aria-hidden />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
