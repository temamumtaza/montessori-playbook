import type { AgeBandMeta, AreaMeta } from './schema'

export const AGE_BANDS: AgeBandMeta[] = [
  { id: '0-3m', label: '0–3 bulan', rangeMonths: [0, 3], color: 'sky', mascot: '🐥' },
  { id: '3-6m', label: '3–6 bulan', rangeMonths: [3, 6], color: 'tosca', mascot: '🐣' },
  { id: '6-9m', label: '6–9 bulan', rangeMonths: [6, 9], color: 'leaf', mascot: '🌿' },
  { id: '9-12m', label: '9–12 bulan', rangeMonths: [9, 12], color: 'sunny', mascot: '☀️' },
  { id: '12-18m', label: '1–1,5 tahun', rangeMonths: [12, 18], color: 'mango', mascot: '🎈' },
  { id: '18-24m', label: '1,5–2 tahun', rangeMonths: [18, 24], color: 'candy', mascot: '🧸' },
  { id: '2-3y', label: '2–3 tahun', rangeMonths: [24, 36], color: 'apple', mascot: '🚂' },
  { id: '3-4y', label: '3–4 tahun', rangeMonths: [36, 48], color: 'grape', mascot: '🎨' },
  { id: '4-5y', label: '4–5 tahun', rangeMonths: [48, 60], color: 'sky', mascot: '🚀' },
]

export const AREAS: AreaMeta[] = [
  {
    id: 'practical-life', label: 'Kehidupan Praktis', labelEn: 'Practical Life', color: 'apple', icon: '🫗',
    description: 'Keterampilan hidup sehari-hari: menuang, menyendok, merapikan, merawat diri dan lingkungan.',
  },
  {
    id: 'sensorial', label: 'Sensorial', labelEn: 'Sensorial', color: 'grape', icon: '🔺',
    description: 'Mengasah indera: bentuk, warna, tekstur, suara, berat — mempertajam cara anak mengamati dunia.',
  },
  {
    id: 'language', label: 'Bahasa', labelEn: 'Language', color: 'sky', icon: '💬',
    description: 'Dari berceloteh awal ke kosakata, cerita, dan pramenulis — bahasa tumbuh dari percakapan nyata.',
  },
  {
    id: 'math', label: 'Matematika', labelEn: 'Math', color: 'leaf', icon: '🔢',
    description: 'Angka, jumlah, dan pola lewat bahan konkret yang bisa digenggam sebelum simbol abstrak.',
  },
  {
    id: 'culture', label: 'Budaya & Alam', labelEn: 'Culture', color: 'tosca', icon: '🌍',
    description: 'Benua, peta, alam, musik, dan seni — membuka jendela dunia untuk anak.',
  },
  {
    id: 'movement', label: 'Gerak', labelEn: 'Movement', color: 'mango', icon: '🤸',
    description: 'Motorik kasar dan halus: merangkak, memanjat, melempar, memindah — gerak bebas setiap hari.',
  },
  {
    id: 'grace-courtesy', label: 'Sopan Santun', labelEn: 'Grace & Courtesy', color: 'candy', icon: '🤝',
    description: 'Salam, menunggu giliran, minta tolong — keterampilan sosial yang dilatih lewat teladan.',
  },
  {
    id: 'self-care', label: 'Merawat Diri', labelEn: 'Self Care', color: 'sunny', icon: '🪥',
    description: 'Berpakaian, mencuci tangan, grooming, toilet learning — kemandirian dimulai dari diri sendiri.',
  },
  {
    id: 'art-music', label: 'Seni & Musik', labelEn: 'Art & Music', color: 'grape', icon: '🎵',
    description: 'Menggambar, melukis, menempel, bernyanyi — proses lebih penting daripada hasil.',
  },
  {
    id: 'outdoor', label: 'Outdoor', labelEn: 'Outdoor', color: 'leaf', icon: '🌳',
    description: 'Alam terbuka: berjalan sendiri, berkebun, mengamati serangga — alam adalah kelas terbesar.',
  },
]

export const ageBandById = (id: string) => AGE_BANDS.find((a) => a.id === id)
export const areaById = (id: string) => AREAS.find((a) => a.id === id)
