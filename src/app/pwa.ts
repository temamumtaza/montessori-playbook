// Registrasi service worker dengan UX update yang benar:
// - SW baru menunggu (waiting) sampai user setuju via toast "Versi baru tersedia"
// - Setelah skipWaiting + reload, app langsung pakai versi baru
type SWUpdate = { onNeedRefresh: (cb: () => void) => () => void; applyUpdate: () => void }

let notifyNeedRefresh: (() => void) | null = null
let waitingWorker: ServiceWorker | null = null

export const swUpdate: SWUpdate = {
  onNeedRefresh(cb) {
    notifyNeedRefresh = cb
    if (waitingWorker) cb()
    return () => { notifyNeedRefresh = null }
  },
  applyUpdate() {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' })
    waitingWorker?.addEventListener('statechange', (e) => {
      const sw = e.target as ServiceWorker
      if (sw.state === 'activated') window.location.reload()
    })
  },
}

export function registerSW() {
  if (!('serviceWorker' in navigator)) return
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      reg.addEventListener('updatefound', () => {
        const installing = reg.installing
        installing?.addEventListener('statechange', () => {
          if (installing.state === 'installed' && navigator.serviceWorker.controller) {
            waitingWorker = installing
            notifyNeedRefresh?.()
          }
        })
      })
    }).catch(() => {/* offline-first: biarkan */})
  })
}
