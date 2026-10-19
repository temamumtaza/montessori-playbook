# Montessori Playbook

PWA mobile-first berisi panduan Montessori lengkap, akurat, dan praktis untuk orang tua dengan anak usia 0–5 tahun. Bahasa Indonesia (default), offline-first, tanpa akun, tanpa tracking.

## Visi

Setiap orang tua bisa mempraktikkan Montessori di rumah — tanpa harga sekolah Montessori. App ini merangkum filosofi, aktivitas per usia, panduan bahan & DIY, setup ruangan, tracker milestone, dan jurnal observasi dalam satu app yang terasa native di HP.

## Arsitektur

- **Stack**: Vite + React 18 + TypeScript + Tailwind CSS v4 + Framer Motion + React Router (hash) + Zustand + Dexie (IndexedDB) + Fuse.js + vite-plugin-pwa (Workbox).
- **Local-first**: semua data anak (profil, jurnal, foto, progres) hanya di perangkat. Tidak ada backend, tidak ada request jaringan yang membawa data.
- **Konten**: JSON terstruktur (skema Zod di `src/content/schema.ts`), di-bundle per AgeBand (`content/bundles/<band>.json`) dan lazy-load on-demand; `content/global.json` untuk materi, DIY, room setup, parent guide, glossary, checklist.
- **PWA**: manifest lengkap (maskable icons, shortcuts), service worker dengan update prompt ("versi baru tersedia"), offline penuh, app shell tanpa white flash.
- **Native feel**: bottom tab bar 5 tab dengan state per tab, transisi push/pop, collapsing large title, safe-area insets, dark mode sky navy.

## Menjalankan

```bash
npm install
npm run dev        # development
npm run build      # production build + SW
npm run preview    # preview build
node scripts/validate-content.mjs   # validasi skema konten
```

## Install sebagai app

### iOS (Safari)
1. Buka URL app di Safari.
2. Tap tombol **Share** → **Add to Home Screen**.
3. Buka dari ikon di home screen — app jalan fullscreen dengan splash screen.

### Android (Chrome)
1. Buka URL app di Chrome.
2. Tap **Install app** di banner, atau menu ⋮ → **Install app**.
3. App muncul di launcher dengan adaptive icon.

## Kontribusi konten

1. Semua konten hidup di `content/` sebagai JSON mengikuti skema di `src/content/schema.ts`.
2. Setiap entri **wajib** punya minimal 1 rujukan (`references`) ke sumber publik. Dilarang menyalin teks berhak cipta — tulis ulang (parafrase).
3. Aktivitas untuk usia bayi/balita (< 3 th) **wajib** mengisi `safetyNotes`.
4. Validasi lokal sebelum PR: `node scripts/validate-content.mjs` (CI juga menjalankan ini).

## Lisensi

- Kode: MIT
- Konten (`content/`): CC BY-NC-SA 4.0

## Disclaimer

App ini bersifat edukatif dan bukan pengganti nasihat dokter/terapis. Untuk kekhawatiran tumbuh kembang, konsultasikan ke tenaga kesehatan. Dalam keadaan darurat, hubungi layanan gawat darurat.
