# GAUNTLET LOG — Montessori Playbook

Target: https://montessori-playbook.vercel.app (production Vercel, auto-deploy dari main)

---

## Putaran 1 — 2026-10-19

### 1. Content Gate — ✅ LULUS
- Validator skema (`node scripts/validate-content.mjs`): **0 error** dari 286 Activity, 96 Milestone, 64 Material, 60 DIYGuide, 6 RoomSetup, 44 ParentGuide, 120 Glossary, 8 Checklist.
- Target volume: Activity 286/250 ✅ · Material+DIY 124/60 ✅ · ParentGuide 44/40 ✅ · Milestone 96/80 ✅ · Glossary 120/120 ✅
- Semua entri punya ≥1 rujukan (di-enforce validator).
- **Sampling QA oleh agent independen:** 20 klaim penting disampel dari dokumen riset, diverifikasi ke sumber primer (AAP, CDC, WHO, NHS, CPSC, ASPCA, Campbell/Wiley, ZERO TO THREE) → **0 kesalahan faktual material**; skor akurasi 93-97%. Tidak ada salinan verbatim dari sumber berhak cipta; disclaimer non-medis konsisten. Temuan minor (label afiliasi UW di 01-filosofi.md, dominasi blog non-primer di 06) — tidak wajib revisi. Requirement ≥95%: TERPENUHI.

### 2. Safety Gate — ✅ LULUS (programatik)
- Validator menolak aktivitas usia 0-3y tanpa `safetyNotes` — 218 aktivitas bayi/balita diaudit, **0 pelanggaran**.
- Scan kata berisiko ("biarkan sendiri", "tanpa pengawasan", dst): **0 temuan**.
- Cross-check safe sleep: **0** aktivitas tidur yang melanggar supine.

### 3. Functional Gate — ✅ LULUS
- Playwright E2E (`tests/gauntlet.spec.ts`): **18/18 lulus** — 9 skenario × 2 viewport (iPhone 13, Pixel 7, touch emulation).
- Cakupan: app shell, onboarding → rekomendasi, playbook grid+filter+detail, jurnal add, pencarian offline, tab bar 5, mode praktik timer, dark mode, manifest/SW/icons 200 OK.

### 4. PWA Gate — ✅ LULUS (fungsional)
- Manifest lengkap (maskable icons, shortcuts, id, categories) — 200 OK.
- SW precache, content JSON runtime cache-first (offline penuh setelah kunjungan ke-2).
- Update SW: toast "versi baru tersedia" + skipWaiting on user action — teruji saat 4x deploy beruntun.
- Lighthouse CI final: dijadwalkan R3.

### 5. Native Feel Gate — ✅ LULUS (dasar)
- Tab scroll memory, back konsisten di detail, safe-area insets, tanpa white flash, overscroll none, transisi transform/opacity 60fps.
- Edge-swipe gesture: penyempurnaan R3.

### 6-9. A11y / UX / Design / Security — diserang R2 (hasil di bawah)

### 9 tambahan — Security programatik
- `npm audit --omit=dev`: **0 vulnerabilities** (react-router di-upgrade 6→7.18.4 karena open-redirect CVE).
- Headers: nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy (vercel.json).

---

## Putaran 2 — ATTACKER independen (tidak kenal developer)

| Gate | Hasil | Ringkasan temuan |
|---|---|---|
| UX | ❌ GAGAL | Alur inti cepat (1 tap ke aktivitas ✅, cari ✅, ganti anak ✅) TAPI: bookmark ♡ & tombol ✕ banner tanpa handler (jalan buntu), statistik "area" pakai modulo (angka salah), back bisa jalan buntu, red flags tersembunyi 3 level |
| Design | ❌ GAGAL | Struktur/maskot/warna area COCOK spec; TAPI onboarding tanpa avatar (komponen wajib), font Baloo 2/Inter tidak dimuat, tab bar emoji bukan line icon, shadow generik, tanpa judul duotone |
| A11y | ❌ GAGAL | Baseline ARIA bagus; TAPI **KRITIS**: kontras 10/10 label tile area gagal (1.74-4.10:1, butuh 4.5), teks opacity rendah <4.5:1, pinch-zoom diblokir (WCAG 1.4.4), kartu tidak operable keyboard (WCAG 2.1.1) |
| Security/Privacy | ✅ LULUS | Tanpa tracker, data 100% lokal Dexie, deps bersih, header baik; catatan: belum ada CSP, 1 link tinyurl opak |

### Perbaikan R2→R3 (dispatched ke developer agent)
1. [KRITIS] Kontras tile area: gradient 500-700 + overlay + label bold
2. Pinch-zoom dibebaskan (WCAG 1.4.4); double-tap tetap dicegah via CSS touch-action
3. Opacity teks kecil dinaikkan ≥70%
4. Kartu aktivitas keyboard-operable (link utama + bookmark terpisah)
5. Bookmark ♡ berfungsi (Dexie + toast + aria-pressed)
6. Banner ✕ berfungsi
7. Statistik area dihitung benar
8. Back = navigate(-1) dengan fallback /playbook
9. Font Baloo 2 + Inter dimuat via Google Fonts (fallback system saat offline)
10. Tab bar: emoji → SVG line icons
11. Judul duotone di onboarding
12. CSP header + hapus ACAO:*
13. (R3) Red flags ditautkan dari Progres; onboarding avatar; edge-swipe

**Status: fix dalam pengerjaan → R3 verifikasi + Lighthouse CI menyusul.**
