# Kontribusi ke Montessori Playbook

Terima kasih mau berkontribusi! 🎉

## Cara kerja konten

- Semua konten ada di `content/global.json` (materi, DIY, ruangan, parent guide, glossary, checklist) dan `content/bundles/<ageband>.json` (aktivitas + milestone per usia).
- Ikuti skema di `src/content/schema.ts`. Validasi: `node scripts/validate-content.mjs`.
- **Wajib rujukan**: setiap entri punya minimal 1 `references` berisi title + URL sumber publik yang nyata.
- **Dilarang menyalin**: tidak boleh ada teks dari buku berhak cipta, manual AMI/AMS, atau situs komersial. Parafrase dengan kata sendiri, cantumkan sumbernya.
- **Keselamatan dulu**: aktivitas untuk usia 0–3 tahun wajib punya `safetyNotes`. Klaim medis tidak diperbolehkan — gunakan bahasa "umumnya", "cenderung", dan rujuk ke sumber kesehatan resmi (AAP/CDC/WHO/NHS/IDAI).
- **Nada**: hangat, memaafkan, tidak menghakimi. Tulis untuk orang tua yang lelah, bukan untuk pakar.

## Alur kerja

1. Fork / branch baru dari `main` (`feat/konten-6-9m` misalnya).
2. Tulis/edit konten JSON.
3. Jalankan `node scripts/validate-content.mjs` + `npm run build`.
4. PR ke `main` — CI akan memvalidasi skema dan build.
5. PR direview oleh maintainer (fokus: akurasi, keselamatan, nada, rujukan).

## Konvensi commit

Conventional commits: `feat:`, `fix:`, `content:`, `docs:`, `chore:`.

Contoh: `content: tambah 12 aktivitas usia 6-9m`, `fix: perbaiki kontras chip filter dark mode`.

## Ideas pipeline

Lihat issue berlabel `roadmap` untuk fitur yang sedang dicari kontributor.
