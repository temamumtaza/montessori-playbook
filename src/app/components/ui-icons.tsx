import type { ReactNode } from 'react'
import type { AgeBandId, RoomSetup } from '../../content/schema'

type IconProps = { className?: string; filled?: boolean }
type RoomId = RoomSetup['room']

const base = (className?: string) => ({ className, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true })
function Line({ className, children, filled = false }: IconProps & { children: ReactNode }) { return <svg {...base(className)} fill={filled ? 'currentColor' : 'none'}>{children}</svg> }

export const IconBell = (p: IconProps) => <Line {...p}><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></Line>
export const IconClock = (p: IconProps) => <Line {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Line>
export const IconHeart = ({ filled = false, ...p }: IconProps) => <Line {...p} filled={filled}><path d="M20.8 8.8c0 5.5-8.8 10.2-8.8 10.2S3.2 14.3 3.2 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 8.8 2.8Z"/></Line>
export const IconShare = (p: IconProps) => <Line {...p}><circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5M8 13l8 5"/></Line>
export const IconStar = (p: IconProps) => <Line {...p}><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"/></Line>
export const IconSun = (p: IconProps) => <Line {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></Line>
export const IconMoon = (p: IconProps) => <Line {...p}><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/></Line>
export const IconCamera = (p: IconProps) => <Line {...p}><path d="M4 7h3l1.5-2h7L17 7h3v12H4z"/><circle cx="12" cy="13" r="3"/></Line>
export const IconCalendar = (p: IconProps) => <Line {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></Line>
export const IconChevronRight = (p: IconProps) => <Line {...p}><path d="m9 5 7 7-7 7"/></Line>
export const IconChevronLeft = (p: IconProps) => <Line {...p}><path d="m15 5-7 7 7 7"/></Line>
export const IconChevronDown = (p: IconProps) => <Line {...p}><path d="m5 9 7 7 7-7"/></Line>
export const IconCheck = (p: IconProps) => <Line {...p}><path d="m5 12 4 4L19 6"/></Line>
export const IconClose = (p: IconProps) => <Line {...p}><path d="m6 6 12 12M18 6 6 18"/></Line>
export const IconSearch = (p: IconProps) => <Line {...p}><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></Line>
export const IconFilter = (p: IconProps) => <Line {...p}><path d="M4 7h16M4 12h16M4 17h16"/><circle cx="9" cy="7" r="1.5" fill="currentColor"/><circle cx="15" cy="12" r="1.5" fill="currentColor"/><circle cx="7" cy="17" r="1.5" fill="currentColor"/></Line>
export const IconHome = (p: IconProps) => <Line {...p}><path d="m3 10 9-7 9 7M5 9v11h14V9M9 20v-6h6v6"/></Line>
export const IconBook = (p: IconProps) => <Line {...p}><path d="M4 5a3 3 0 0 1 3-2h5v18H7a3 3 0 0 1-3-3zM20 5a3 3 0 0 0-3-2h-5v18h5a3 3 0 0 0 3-3z"/></Line>
export const IconJournal = (p: IconProps) => <Line {...p}><path d="M4 4h11a4 4 0 0 1 4 4v12H7a3 3 0 0 1-3-3zM7 4v16M10 9h5M10 13h5"/><path d="m17 3 3 3"/></Line>
export const IconChart = (p: IconProps) => <Line {...p}><path d="M4 19V5M4 19h16M7 15l3-4 3 2 5-7"/></Line>
export const IconDots = (p: IconProps) => <Line {...p}><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/></Line>
export const IconWifiOff = (p: IconProps) => <Line {...p}><path d="M3 8a15 15 0 0 1 18 0M6 12a10 10 0 0 1 7-2M9 16a5 5 0 0 1 4-1M4 4l16 16M12 20h.01"/></Line>
export const IconSparkle = (p: IconProps) => <Line {...p}><path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2ZM19 17l.7 2.3L22 20l-2.3.7L19 23l-.7-2.3L16 20l2.3-.7L19 17Z"/></Line>
export const IconTarget = (p: IconProps) => <Line {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></Line>
export const IconBasket = (p: IconProps) => <Line {...p}><path d="M4 10h16l-1.5 10h-13zM8 10a4 4 0 0 1 8 0M8 14v3M12 14v3M16 14v3"/></Line>
export const IconShield = (p: IconProps) => <Line {...p}><path d="M12 3 20 6v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/><path d="m8 12 3 3 5-6"/></Line>
export const IconRecycle = (p: IconProps) => <Line {...p}><path d="m8 6 2-3 3 1M10 3l3 5H8M16 9l4 1-1 3M20 10l-6 1 3 5M8 15l-3 2 1 3M5 17l6-1-1-5"/></Line>
export const IconFlag = (p: IconProps) => <Line {...p}><path d="M5 21V4M5 5c5-3 8 3 14 0v9c-6 3-9-3-14 0"/></Line>
export const IconGlobe = (p: IconProps) => <Line {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></Line>
export const IconDownload = (p: IconProps) => <Line {...p}><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></Line>
export const IconUpload = (p: IconProps) => <Line {...p}><path d="M12 15V3M7 8l5-5 5 5M5 21h14"/></Line>
export const IconTrash = (p: IconProps) => <Line {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3"/></Line>
export const IconPencil = (p: IconProps) => <Line {...p}><path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10zM14 7l3 3"/></Line>
export const IconPlus = (p: IconProps) => <Line {...p}><path d="M12 5v14M5 12h14"/></Line>
export const IconRefresh = (p: IconProps) => <Line {...p}><path d="M20 11a8 8 0 1 0 1 5M20 5v6h-6"/></Line>
export const IconLock = (p: IconProps) => <Line {...p}><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></Line>

const ageColors: Record<AgeBandId, [string, string]> = {
  '0-3m': ['#bae6fd', '#0284c7'], '3-6m': ['#99f6e4', '#0f766e'], '6-9m': ['#bbf7d0', '#16a34a'],
  '9-12m': ['#fef08a', '#ca8a04'], '12-18m': ['#fed7aa', '#ea580c'], '18-24m': ['#fbcfe8', '#db2777'],
  '2-3y': ['#d9f99d', '#65a30d'], '3-4y': ['#e9d5ff', '#9333ea'], '4-5y': ['#bae6fd', '#2563eb'],
}
export function AgeBandIcon({ band, className }: { band: AgeBandId; className?: string }) {
  const [soft, strong] = ageColors[band]
  const common = { className, viewBox: '0 0 48 48', 'aria-hidden': true }
  const face = <><circle cx="24" cy="25" r="13" fill={soft}/><circle cx="19" cy="24" r="1.5" fill={strong}/><circle cx="29" cy="24" r="1.5" fill={strong}/><path d="M21 29c2 2 4 2 6 0" fill="none" stroke={strong} strokeWidth="1.8" strokeLinecap="round"/></>
  switch (band) {
    case '0-3m': return <svg {...common}>{face}<path d="M13 16c2-6 7-8 11-8s9 2 11 8" fill={strong} opacity=".8"/><path d="M9 39c5-3 25-3 30 0" fill="none" stroke={strong} strokeWidth="3" strokeLinecap="round"/></svg>
    case '3-6m': return <svg {...common}><ellipse cx="24" cy="29" rx="15" ry="10" fill={soft}/><circle cx="14" cy="27" r="6" fill={strong}/>{face}</svg>
    case '6-9m': return <svg {...common}><circle cx="14" cy="17" r="6" fill={soft}/><path d="M12 23c5-4 17-3 22 3l-3 8H12z" fill={strong}/><circle cx="16" cy="37" r="3" fill={soft}/><circle cx="32" cy="37" r="3" fill={soft}/></svg>
    case '9-12m': return <svg {...common}><rect x="14" y="15" width="15" height="21" rx="7" fill={soft}/><circle cx="21" cy="11" r="6" fill={strong}/><path d="M8 9v30M8 19h7" fill="none" stroke={strong} strokeWidth="3" strokeLinecap="round"/></svg>
    case '12-18m': return <svg {...common}><circle cx="25" cy="10" r="5" fill={strong}/><path d="M25 16v15m0-10-8 7m8-7 8 5m-8 0-6 10m6-10 8 10" fill="none" stroke={strong} strokeWidth="3" strokeLinecap="round"/></svg>
    case '18-24m': return <svg {...common}><rect x="9" y="25" width="13" height="13" rx="2" fill={soft}/><rect x="23" y="18" width="14" height="20" rx="2" fill={strong}/><rect x="18" y="10" width="12" height="9" rx="2" fill={soft}/></svg>
    case '2-3y': return <svg {...common}><rect x="8" y="19" width="28" height="15" rx="4" fill={strong}/><path d="m15 19 4-7h7l4 7" fill={soft}/><circle cx="15" cy="36" r="4" fill={strong}/><circle cx="33" cy="36" r="4" fill={strong}/></svg>
    case '3-4y': return <svg {...common}><path d="M9 35 28 10" stroke={strong} strokeWidth="4" strokeLinecap="round"/><path d="M12 31c7-2 13 2 20 0" fill={soft} stroke={strong} strokeWidth="2"/><circle cx="33" cy="13" r="5" fill={soft}/></svg>
    default: return <svg {...common}><circle cx="31" cy="18" r="8" fill={soft}/><path d="M9 35c7-9 19-9 25 0" fill={strong}/><path d="M18 19 9 8" stroke={strong} strokeWidth="3" strokeLinecap="round"/><circle cx="31" cy="18" r="3" fill={strong}/></svg>
  }
}

export function IconRoom({ room, className }: { room: RoomId; className?: string }) {
  const common = { className, viewBox: '0 0 48 48', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  switch (room) {
    case 'kamar-anak': return <svg {...common}><path d="M7 31V18h34v13M7 24h34M12 31v7M36 31v7"/><rect x="11" y="14" width="14" height="10" rx="2" fill="currentColor" opacity=".18"/></svg>
    case 'kamar-mandi': return <svg {...common}><path d="M8 27h32M11 27v6a7 7 0 0 0 14 0v-6M18 13v8M18 13a5 5 0 0 1 9-2"/><path d="M34 8c0 3-3 4-3 7a3 3 0 0 0 6 0c0-3-3-4-3-7Z" fill="currentColor" opacity=".25"/></svg>
    case 'dapur': return <svg {...common}><path d="M8 25h32l-3 12H11zM12 25c0-9 24-9 24 0M18 20V12M30 20V12"/><path d="M18 12c-2-3 2-4 0-7M30 12c-2-3 2-4 0-7"/></svg>
    case 'ruang-keluarga': return <svg {...common}><path d="M8 25v-5a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v5M8 25h32v10H8zM13 35v4M35 35v4"/></svg>
    case 'area-makan': return <svg {...common}><path d="M9 8v13M13 8v13M9 14h4M11 21v18M29 8v31M29 8c7 5 7 11 0 13"/></svg>
    default: return <svg {...common}><path d="M24 39V20M24 25c-7 0-12-5-12-12 7 0 12 5 12 12ZM24 29c0-8 6-14 14-14 0 8-6 14-14 14Z"/><path d="M8 39h32"/></svg>
  }
}

