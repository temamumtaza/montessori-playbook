// Ikon area flat-cute (putih, dipakai di tile warna) + dekorasi langit
type P = { className?: string }

export function TabIcon({ name, className }: { name: 'home' | 'book-open' | 'journal' | 'chart' | 'ellipsis'; className?: string }) {
  const common = { className, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  switch (name) {
    case 'home': return <svg {...common}><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></svg>
    case 'book-open': return <svg {...common}><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H12v17H5.5A2.5 2.5 0 0 1 3 17.5z" /><path d="M21 5.5A2.5 2.5 0 0 0 18.5 3H12v17h6.5a2.5 2.5 0 0 0 2.5-2.5z" /></svg>
    case 'journal': return <svg {...common}><path d="M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z" /><path d="M7 4v16M9 9h6M9 13h6" /><path d="m16 3 3 3" /></svg>
    case 'chart': return <svg {...common}><path d="M4 19V5M4 19h16" /><path d="m7 15 3-4 3 2 5-7" /><path d="M18 6h-3" /></svg>
    case 'ellipsis': return <svg {...common}><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></svg>
  }
}

export function AreaIcon({ area, className }: { area: string; className?: string }) {
  const cls = className ?? 'w-8 h-8'
  switch (area) {
    case 'practical-life':
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" aria-hidden>
          <path d="M14 20c0-2 2-4 4-4h12c2 0 4 2 4 4v2c0 2-2 4-4 4H18c-2 0-4-2-4-4v-2z" fill="#fff" opacity=".95"/>
          <path d="M17 26h14v3c0 6-3 10-7 10s-7-4-7-10v-3z" fill="#fff" opacity=".8"/>
          <path d="M31 12c3 1 6 4 6 8" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"/>
          <circle cx="31" cy="11" r="2.4" fill="#fff"/>
        </svg>
      )
    case 'sensorial':
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" aria-hidden>
          <rect x="8" y="26" width="32" height="7" rx="3.5" fill="#fff" opacity=".85"/>
          <rect x="13" y="17" width="22" height="7" rx="3.5" fill="#fff" opacity=".92"/>
          <rect x="18" y="8" width="12" height="7" rx="3.5" fill="#fff"/>
        </svg>
      )
    case 'language':
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" aria-hidden>
          <path d="M8 12c0-2 2-4 4-4h20c2 0 4 2 4 4v14c0 2-2 4-4 4H20l-8 8v-8h-.5C9 30 8 28 8 26V12z" fill="#fff" opacity=".95"/>
          <circle cx="18" cy="19" r="2.2" fill="currentColor" opacity=".55"/>
          <circle cx="25" cy="19" r="2.2" fill="currentColor" opacity=".55"/>
          <circle cx="32" cy="19" r="2.2" fill="currentColor" opacity=".55"/>
        </svg>
      )
    case 'math':
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" aria-hidden>
          <rect x="7" y="18" width="14" height="22" rx="3" fill="#fff" opacity=".9"/>
          <rect x="17" y="10" width="14" height="30" rx="3" fill="#fff" opacity=".95"/>
          <rect x="27" y="14" width="14" height="26" rx="3" fill="#fff" opacity=".85"/>
          <circle cx="24" cy="6" r="3" fill="#fff"/>
        </svg>
      )
    case 'culture':
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" aria-hidden>
          <circle cx="24" cy="24" r="17" fill="#fff" opacity=".95"/>
          <path d="M14 18c4-2 7 1 6 5s3 6 7 4 8 1 6 5c-2 5-9 8-14 6-6-2-10-9-8-15 .7-2 1.6-4 3-5z" fill="currentColor" opacity=".45"/>
          <path d="M30 12c3 2 5 5 5 8 0 2-3 2-5 1s-4-3-3-6c.6-1.7 2-2.7 3-3z" fill="currentColor" opacity=".3"/>
        </svg>
      )
    case 'movement':
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" aria-hidden>
          <circle cx="20" cy="9" r="5" fill="#fff"/>
          <path d="M20 15c-4 1-7 4-8 8l-2 7c-.5 2 1 3.5 3 3.5 1.5 0 2.7-1 3.2-2.5l1.3-4" stroke="#fff" strokeWidth="3.4" strokeLinecap="round"/>
          <path d="M20 20c4 0 7 2 9 5l4 6M17 33l-4 8M28 31l5 9" stroke="#fff" strokeWidth="3.4" strokeLinecap="round"/>
        </svg>
      )
    case 'grace-courtesy':
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" aria-hidden>
          <circle cx="15" cy="12" r="5" fill="#fff"/>
          <path d="M15 18c-4 2-7 6-7 11v6h13v-6M25 20l8-8M25 12l8 8" stroke="#fff" strokeWidth="3.2" strokeLinecap="round"/>
          <path d="M36 26c2 3 2 7-1 10-2 2-5 3-8 2" stroke="#fff" strokeWidth="3.2" strokeLinecap="round"/>
        </svg>
      )
    case 'self-care':
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" aria-hidden>
          <rect x="10" y="20" width="20" height="18" rx="4" fill="#fff" opacity=".95"/>
          <path d="M14 20v-4c0-3 3-6 7-6 2 0 4 1 5 2.5M34 14c3 0 5 2 5 5s-2 5-5 5h-4" stroke="#fff" strokeWidth="3.2" strokeLinecap="round"/>
          <path d="M16 28h8" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" opacity=".5"/>
        </svg>
      )
    case 'art-music':
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" aria-hidden>
          <path d="M18 36V14l16-4v20" stroke="#fff" strokeWidth="3.2" strokeLinecap="round"/>
          <ellipse cx="14" cy="36" rx="5" ry="4" fill="#fff"/>
          <ellipse cx="30" cy="30" rx="5" ry="4" fill="#fff"/>
          <path d="M14 12c2 4 2 8-1 12" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity=".7"/>
        </svg>
      )
    case 'outdoor':
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" aria-hidden>
          <circle cx="33" cy="13" r="6" fill="#fff" opacity=".9"/>
          <path d="M24 12c3 0 6 3 6 6M16 40V26M16 26c-5 0-9-4-9-9 5 0 9 4 9 9zM16 30c0-6 5-11 11-11 0 6-5 11-11 11z" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 40h30" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" aria-hidden>
          <circle cx="24" cy="24" r="14" fill="#fff"/>
        </svg>
      )
  }
}

export function CloudDeco({ className }: P) {
  return (
    <svg viewBox="0 0 120 60" className={className} fill="currentColor" aria-hidden>
      <ellipse cx="35" cy="42" rx="26" ry="14" />
      <ellipse cx="62" cy="30" rx="24" ry="18" />
      <ellipse cx="88" cy="42" rx="24" ry="13" />
    </svg>
  )
}

export function StarDeco({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2l2.4 6.2L21 9.3l-5 4.4 1.5 6.5L12 16.8 6.5 20.2 8 13.7 3 9.3l6.6-1.1L12 2z" />
    </svg>
  )
}

export function RainbowDeco({ className }: P) {
  return (
    <svg viewBox="0 0 64 32" className={className} fill="none" aria-hidden>
      <path d="M4 32a28 28 0 0 1 56 0" stroke="#f87171" strokeWidth="5" strokeLinecap="round"/>
      <path d="M12 32a20 20 0 0 1 40 0" stroke="#facc15" strokeWidth="5" strokeLinecap="round"/>
      <path d="M20 32a12 12 0 0 1 24 0" stroke="#4ade80" strokeWidth="5" strokeLinecap="round"/>
      <path d="M28 32a4 4 0 0 1 8 0" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  )
}

// Maskot: awan ceria dengan pipi + bintang (empty/loading/error states)
export function Mascot({ className, mood = 'happy' }: { className?: string; mood?: 'happy' | 'sleepy' | 'oops' }) {
  return (
    <svg viewBox="0 0 120 90" className={className} fill="none" aria-hidden>
      <ellipse cx="46" cy="62" rx="30" ry="16" fill="#e0f2fe"/>
      <ellipse cx="60" cy="46" rx="28" ry="21" fill="#ffffff"/>
      <ellipse cx="38" cy="56" rx="20" ry="14" fill="#ffffff"/>
      <ellipse cx="84" cy="56" rx="20" ry="14" fill="#ffffff"/>
      {mood === 'sleepy' ? (
        <>
          <path d="M48 46c2 2 5 2 7 0M68 46c2 2 5 2 7 0" stroke="#0369a1" strokeWidth="2.6" strokeLinecap="round"/>
          <path d="M78 22c3-4 9-4 12 0" stroke="#facc15" strokeWidth="3" strokeLinecap="round"/>
        </>
      ) : mood === 'oops' ? (
        <>
          <circle cx="51" cy="45" r="3" fill="#0369a1"/>
          <circle cx="73" cy="45" r="3" fill="#0369a1"/>
          <ellipse cx="62" cy="56" rx="4" ry="5" fill="#0369a1"/>
        </>
      ) : (
        <>
          <path d="M47 44c1.5-2.5 5.5-2.5 7 0M69 44c1.5-2.5 5.5-2.5 7 0" stroke="#0369a1" strokeWidth="3" strokeLinecap="round"/>
          <path d="M56 52c2 3 8 3 10 0" stroke="#0369a1" strokeWidth="2.6" strokeLinecap="round"/>
        </>
      )}
      <circle cx="42" cy="52" r="4.5" fill="#fda4af" opacity=".8"/>
      <circle cx="82" cy="52" r="4.5" fill="#fda4af" opacity=".8"/>
      <path d="M97 18l1.8 4.6 4.6 1.8-4.6 1.8L97 30.8l-1.8-4.6-4.6-1.8 4.6-1.8L97 18z" fill="#facc15"/>
      <path d="M20 28l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2 1.2-3z" fill="#facc15"/>
    </svg>
  )
}

export function ConfettiBurst({ className }: P) {
  return (
    <svg viewBox="0 0 80 40" className={className} fill="none" aria-hidden>
      <path d="M8 30L12 18 16 30 20 18 24 30" stroke="#f87171" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M40 28l2.4 5 5 2.4-5 2.4-2.4 5-2.4-5-5-2.4 5-2.4 2.4-5z" fill="#facc15"/>
      <path d="M58 30a12 12 0 0 1 20 0" stroke="#4ade80" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="34" cy="12" r="3" fill="#38bdf8"/>
      <circle cx="70" cy="10" r="2.5" fill="#c084fc"/>
    </svg>
  )
}
