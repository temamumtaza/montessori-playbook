# Design Spec — Montessori Playbook (barometer: docs/design/reference-ui.jpg)

Referensi visual resmi. GAYA saja (bukan layout konten persis). Semua komponen baru harus cocok dengan spec ini.

## Karakter keseluruhan
- "Sky world": latar sky tint sangat muda dengan motif awan putih lembut, bintang kuning kecil, pelangi mini.
- Kartu-kartu putih bersih, sudut SANGAT membulat (radius 20-28px), shadow lembut kebiruan (bukan abu-abu).
- Penuh warna cerah ala anak: tiap Area punya warna identitas solid pastel-cerah (apple/mango/sunny/leaf/grape/candy/tosca/sky), dipakai penuh pada tile grid (bukan cuma aksen tipis).
- Ilustrasi: anak kartun lucu (mata besar, pipi merona), gaya vektor hangat. Maskot & empty state memakai karakter yang sama.
- Tipografi: heading font bulat ramah (Baloo 2), body terbaca (Inter). Judul app bisa duotone (kata 1 biru, kata 2 merah muda seperti referensi).

## Komponen wajib (sesuai referensi)
1. **Onboarding "Buat Profil Anak"**: kartu tengah, avatar bulat besar + kamera badge, pilihan ikon anak (avatar bulat berwarna-warni, termasuk opsi hewan lucu), input pill, toggle "bisa memilih beberapa anak", CTA pill biru penuh.
2. **Home "Halo, {nama} 👋"**: kartu profil anak yang bisa dipilih (avatar + usia) di atas, search bar pill besar, section "Rekomendasi Hari Ini" → kartu aktivitas horizontal dengan FOTO/ilustrasi + badge area berwarna di pojok kiri atas kartu, durasi & usia di bawah judul, ikon hati di pojok kanan atas.
3. **Progres Minggu Ini**: 4 kartu stat kecil (angka besar + label), banner pengingat kuning lembut dengan ikon matahari.
4. **Playbook**: segmented filter di atas (Usia/Area/Durasi/Bahan di Rumah), grid tile AREA penuh warna (icon putih + label di tile berwarna) 3 kolom, chips usia bulat dengan border warna, daftar aktivitas dengan foto besar + badge area.
5. **Tab bar 5**: Hari Ini (rumah), Playbook (buku), Jurnal, Progres (grafik), Lainnya (garis) — ikon garis sederhana, aktif = biru + label.
6. Badge/chip: pill kecil pastel dengan teks berwarna gelap (misal "10 mnt", "Bahan di Rumah", "2-3 th").

## Aturan teknis
- Shadow: `0 8px 24px rgba(2,132,199,0.08)` (sky-tinted), bukan hitam.
- Latar halaman: `sky-50` → `#f0f9ff` dengan awan SVG samar; kartu putih `#FFFFFF`.
- Tombol primer: pill biru `sky-600` (#0284c7) teks putih, tinggi 48px, teks semibold.
- Ikon area: SVG buatan sendiri gaya flat-cute, di tile warna solid.
- Motif dekoratif (awan/bintang/pelangi) hanya di: header area, empty state, splash, milestone confetti — JANGAN di balik teks panjang.
- Dark mode: navy `#071724` latar, kartu `#0B2233`, warna area tetap cerah (bagian gelapnya turun 1 tingkat).

## Aset yang harus dibuat
- [ ] Maskot awan+bintang (SVG) untuk empty/loading/error
- [ ] 10 ikon area SVG flat-cute (putih, dipakai di tile warna)
- [ ] Ilustrasi avatar anak (6 varian + 2 hewan) untuk pilihan profil
- [ ] Awan dekoratif SVG (header, splash)
- [ ] Confetti milestone (bintang + pelangi kecil)
