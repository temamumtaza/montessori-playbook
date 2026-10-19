import type { AgeBandMeta, AreaMeta } from './schema'

export const AGE_BANDS: AgeBandMeta[] = [
  { id: '0-3m', label: '0–3 bulan', rangeMonths: [0, 3], color: 'sky', icon: '0-3m' },
  { id: '3-6m', label: '3–6 bulan', rangeMonths: [3, 6], color: 'tosca', icon: '3-6m' },
  { id: '6-9m', label: '6–9 bulan', rangeMonths: [6, 9], color: 'leaf', icon: '6-9m' },
  { id: '9-12m', label: '9–12 bulan', rangeMonths: [9, 12], color: 'sunny', icon: '9-12m' },
  { id: '12-18m', label: '1–1,5 tahun', rangeMonths: [12, 18], color: 'mango', icon: '12-18m' },
  { id: '18-24m', label: '1,5–2 tahun', rangeMonths: [18, 24], color: 'candy', icon: '18-24m' },
  { id: '2-3y', label: '2–3 tahun', rangeMonths: [24, 36], color: 'apple', icon: '2-3y' },
  { id: '3-4y', label: '3–4 tahun', rangeMonths: [36, 48], color: 'grape', icon: '3-4y' },
  { id: '4-5y', label: '4–5 tahun', rangeMonths: [48, 60], color: 'sky', icon: '4-5y' },
]

export const AREAS: AreaMeta[] = [
  {
    id: 'practical-life', label: 'Kehidupan Praktis', labelEn: 'Practical Life', color: 'apple', icon: 'pour',
    description: 'Keterampilan hidup sehari-hari: menuang, menyendok, merapikan, merawat diri dan lingkungan.',
  },
  {
    id: 'sensorial', label: 'Sensorial', labelEn: 'Sensorial', color: 'grape', icon: 'shape',
    description: 'Mengasah indera: bentuk, warna, tekstur, suara, berat — mempertajam cara anak mengamati dunia.',
  },
  {
    id: 'language', label: 'Bahasa', labelEn: 'Language', color: 'sky', icon: 'speech',
    description: 'Dari berceloteh awal ke kosakata, cerita, dan pramenulis — bahasa tumbuh dari percakapan nyata.',
  },
  {
    id: 'math', label: 'Matematika', labelEn: 'Math', color: 'leaf', icon: 'number',
    description: 'Angka, jumlah, dan pola lewat bahan konkret yang bisa digenggam sebelum simbol abstrak.',
  },
  {
    id: 'culture', label: 'Budaya & Alam', labelEn: 'Culture', color: 'tosca', icon: 'globe',
    description: 'Benua, peta, alam, musik, dan seni — membuka jendela dunia untuk anak.',
  },
  {
    id: 'movement', label: 'Gerak', labelEn: 'Movement', color: 'mango', icon: 'movement',
    description: 'Motorik kasar dan halus: merangkak, memanjat, melempar, memindah — gerak bebas setiap hari.',
  },
  {
    id: 'grace-courtesy', label: 'Sopan Santun', labelEn: 'Grace & Courtesy', color: 'candy', icon: 'courtesy',
    description: 'Salam, menunggu giliran, minta tolong — keterampilan sosial yang dilatih lewat teladan.',
  },
  {
    id: 'self-care', label: 'Merawat Diri', labelEn: 'Self Care', color: 'sunny', icon: 'care',
    description: 'Berpakaian, mencuci tangan, grooming, toilet learning — kemandirian dimulai dari diri sendiri.',
  },
  {
    id: 'art-music', label: 'Seni & Musik', labelEn: 'Art & Music', color: 'grape', icon: 'music',
    description: 'Menggambar, melukis, menempel, bernyanyi — proses lebih penting daripada hasil.',
  },
  {
    id: 'outdoor', label: 'Outdoor', labelEn: 'Outdoor', color: 'leaf', icon: 'tree',
    description: 'Alam terbuka: berjalan sendiri, berkebun, mengamati serangga — alam adalah kelas terbesar.',
  },
]

export const ageBandById = (id: string) => AGE_BANDS.find((a) => a.id === id)
export const areaById = (id: string) => AREAS.find((a) => a.id === id)
