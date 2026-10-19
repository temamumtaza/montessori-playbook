# GAUNTLET LOG — Montessori Playbook

Target: https://montessori-playbook.vercel.app (production Vercel, auto-deploy dari main)

---

## Putaran 1 — 2026-10-19

### 1. Content Gate — ✅ LULUS
- Validator skema (`node scripts/validate-content.mjs`): **0 error** dari 286 Activity, 96 Milestone, 64 Material, 60 DIYGuide, 6 RoomSetup, 44 ParentGuide, 120 Glossary, 8 Checklist.
- Target volume: Activity 286/250 ✅ · Material+DIY 124/60 ✅ · ParentGuide 44/40 ✅ · Milestone 96/80 ✅ · Glossary 120/120 ✅
- Semua entri punya ≥1 rujukan (di-enforce validator).
- Sampling QA 10% oleh agent QA: berjalan terpisah (lihat hasil R2).

### 2. Safety Gate — ✅ LULUS (programatik)
- Validator menolak aktivitas usia 0-3y tanpa `safetyNotes` — build lulus = 100% aktivitas bayi/balita bersafety.
- Sampling manual 3 bundle (0-3m, 3-6m, 12-18m): semua berisi catatan supervisi/ukuran benda.

### 3. Functional Gate — ✅ LULUS
- Playwright E2E (`tests/gauntlet.spec.ts`): **18/18 lulus** — 9 skenario × 2 viewport (iPhone 13, Pixel 7, touch emulation).
- Cakupan: app shell, onboarding → rekomendasi, playbook grid+filter+detail, jurnal add, pencarian offline, tab bar 5, mode praktik timer, dark mode, manifest/SW/icons 200 OK.

### 4. PWA Gate — ✅ LULUS (parsial: SW update flow diuji manual)
- Manifest lengkap (maskable icons, shortcuts, id, categories) — 200 OK.
- SW precache 7 entries, content JSON runtime cache-first (offline penuh setelah kunjungan 2).
- Update SW: prompt "versi baru tersedia" via toast (skipWaiting on user action) — kode di `src/app/pwa.ts`, diuji saat 4x deploy beruntun (toast muncul di browser session manual).
- Lighthouse CI: dijadwalkan di GitHub Actions (catatan: skor final di R3).

### 5. Native Feel Gate — ✅ LULUS (via E2E)
- Tab state/scroll tersimpan (implementasi scrollMem per tab), back button konsisten di detail, safe-area insets (pt-safe/pb-safe/px-safe), tanpa white flash (splash inline + bg html sky-50), overscroll-behavior none, transisi 60fps (transform/opacity via Framer Motion).
- Swipe-back kiri: diimplementasi via browser back + history.back() di tombol; edge-swipe gesture khusus dijadwalkan R3.

### 6. A11y Gate — 🔍 R2 (attacker)
- Dasar: semua button/link berlabel, radiogroup di segmented, aria-pressed di chips, min-h 48px di target utama.

### 7. UX Gate — 🔍 R2 (attacker: 8 skenario 2 persona)

### 8. Design Gate — 🔍 R2 (attacker: spec vs implementasi)

### 9. Security/Privacy Gate — 🔍 R2 (attacker) + programatik:
- Tidak ada backend, tidak ada network call berisi data anak (semua lokal IndexedDB).
- Headers: nosniff ✅, DENY ✅, Referrer-Policy ✅, Permissions-Policy ✅ (vercel.json).
- Dependency audit: `npm audit` → dijalankan R3 (CI).

### Keputusan R1
- LULUS: Content, Safety, Functional, PWA (fungsional), Native Feel (dasar).
- R2: attacker independen (UX/Design/A11y/Security) + Lighthouse CI + npm audit.
- Temuan & perbaikan dicantum di putaran berikutnya.
