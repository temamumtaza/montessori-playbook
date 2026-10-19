#!/bin/bash
# Codex UI worker: 3 halaman tambahan, sekuensial (satu cwd, aman)
cd /home/temamumtaza/Documents/dev/montessori-playbook

COMMON="Kamu senior React+TS developer. Proyek: PWA Montessori Playbook (Vite+React18+TS+Tailwind v4 CSS-first, react-router-dom HashRouter). JANGAN mengubah file lain selain yang diminta. Gunakan komponen & pattern yang sudah ada: src/content/store.ts (loadGlobal, searchActivities), src/content/meta.ts (AGE_BANDS, AREAS, areaById), src/app/components/icons.tsx (Mascot, AreaIcon, CloudDeco, StarDeco, RainbowDeco), src/app/pages/TodayPage.tsx (EmptyState, SkeletonCards, AREA_GRADIENTS), src/app/db.ts (db Dexie). Desain: latar sky-50, kartu putih rounded-3xl shadow-sm, teks sky-900, dark mode navy (dark:bg-navy-800), tombol pill sky-600 min-h 48px, font display var(--font-display). Tailwind v4: warna custom (sky/leaf/apple/mango/sunny/grape/candy/tosca/navy/cream) sudah terdaftar via @theme. TypeScript strict. Setelah selesai: jalankan npm run build dan pastikan sukses (abaikan warning). Jawab terakhir: DONE UI."

echo "[1/3] Glossary + Search page"
codex exec -m gpt-5.6-luna --sandbox workspace-write --skip-git-repo-check "$COMMON

TUGAS: Buat src/app/pages/SearchGlossaryPage.tsx — halaman pencarian offline + glosarium.
Fitur: (1) search bar pill besar di atas (sticky), live search pakai searchActivities(q) dari store (debounce 250ms); (2) hasil aktivitas: kartu ringkas (judul, area badge warna graden AREA_GRADIENTS, durasi, onClick → navigasi /aktivitas/:id pakai useNavigate); (3) di bawahnya section Glosarium: filter lokal dari loadGlobal().glossary (filter includes pada term/definition, tanpa Fuse), tampil sebagai daftar term bold + definition; (4) empty state pakai EmptyState; (5) skeleton saat loading.
Lalu daftarkan route '/cari' di src/app/App.tsx (import + Route) DAN ganti href search bar di TodayPage dari '#/playbook' menjadi '#/cari'.
npm run build harus lulus. DONE UI." > .workers/logs/ui-1.log 2>&1
echo "ui-1 exit: $?"

echo "[2/3] Environment planner page"
codex exec -m gpt-5.6-luna --sandbox workspace-write --skip-git-repo-check "$COMMON

TUGAS: Buat src/app/pages/EnvironmentPage.tsx — planner prepared environment per ruangan.
Data: loadGlobal().roomSetups (id, room enum, title, principles[], items[{name,essential,budgetRendah,budgetSedang,diy}], layoutTips[], ageBands[]).
Fitur: (1) chips pilih ruangan (ikon + label, semua 6 room); (2) tampil principles sebagai list, items sebagai checklist interaktif — state tersimpan via db.checklists (key [childId+checklistId+itemId], checklistId = room id, import db dari ../db dan useChildStore untuk childId); (3) tiap item tampil budget rendah/sedang + badge DIY; (4) layoutTips section; (5) progress bar sederhana (berapa item dicentang / total).
Route '/lingkungan' di App.tsx + tambah link di MorePage (section baru 'Persiapan rumah' dengan <a href=\"#/lingkungan\">).
npm run build harus lulus. DONE UI." > .workers/logs/ui-2.log 2>&1
echo "ui-2 exit: $?"

echo "[3/3] Red flags + parent guides page"
codex exec -m gpt-5.6-luna --sandbox workspace-write --skip-git-repo-check "$COMMON

TUGAS: Buat src/app/pages/LearnPage.tsx — pusat 'Panduan & Pemantauan'.
Fitur: (1) Tab segmented 'Panduan' | 'Red Flags': (2) Panduan = daftar parentGuides dari loadGlobal() (kategori badge berwarna, judul, keyTakeaways preview, expand on tap menampilkan body markdown-lite — render paragraf split \\n\\n, bold **teks** sederhana); (3) Red Flags = dari loadBundle band anak aktif (ageBandFromBirth dari ../stores/children): daftar milestone yang punya redFlags tidak kosong, tampil redFlags dengan warna apple; (4) disclaimer banner kuning di atas (bg-sunny-100): 'Bukan pengganti nasihat dokter...' (5) gunakan EmptyState saat kosong.
Route '/belajar' di App.tsx + link di MorePage section baru 'Panduan orang tua' <a href=\"#/belajar\">.
npm run build harus lulus. DONE UI." > .workers/logs/ui-3.log 2>&1
echo "ui-3 exit: $?"
echo "=== UI WORKERS SELESAI ==="
