import { z } from 'zod'

// ===== Enum inti =====
export const AgeBandId = z.enum([
  '0-3m', '3-6m', '6-9m', '9-12m',
  '12-18m', '18-24m', '2-3y', '3-4y', '4-5y',
])
export type AgeBandId = z.infer<typeof AgeBandId>

export const AreaId = z.enum([
  'practical-life', 'sensorial', 'language', 'math', 'culture',
  'movement', 'grace-courtesy', 'self-care', 'art-music', 'outdoor',
])
export type AreaId = z.infer<typeof AreaId>

export const MasteryLevel = z.enum(['belum', 'mulai', 'mahir'])
export type MasteryLevel = z.infer<typeof MasteryLevel>

// ===== Referensi sumber (WAJIB di tiap entri konten) =====
export const Source = z.object({
  title: z.string().min(3),
  url: z.string().url(),
  note: z.string().optional(),
})
export type Source = z.infer<typeof Source>

// ===== Activity (entitas inti) =====
export const Activity = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'id: kebab-case'),
  title: z.string().min(5),
  summary: z.string().min(20, 'ringkasan minimal 20 karakter'),
  ageBands: z.array(AgeBandId).min(1),
  areas: z.array(AreaId).min(1),
  skills: z.array(z.string()).default([]),
  objectives: z.array(z.string()).min(1, 'minimal 1 tujuan'),
  materials: z.array(z.object({
    name: z.string().min(2),
    fromHome: z.boolean().default(true),
    optional: z.boolean().default(false),
  })).min(1),
  prepMinutes: z.number().int().min(0).max(120),
  durationMinutes: z.number().int().min(1).max(180),
  prepLevel: z.enum(['rendah', 'sedang', 'tinggi']),
  presentation: z.array(z.object({
    step: z.number().int().min(1),
    text: z.string().min(10),
  })).min(2, 'minimal 2 langkah presentasi'),
  controlOfError: z.string().min(10).optional(),
  variations: z.array(z.string()).default([]),
  readySigns: z.array(z.string()).min(1, 'minimal 1 tanda siap'),
  struggleSigns: z.array(z.string()).default([]),
  safetyNotes: z.array(z.string()).default([]),
  references: z.array(Source).min(1, 'WAJIB minimal 1 rujukan'),
  diyGuideId: z.string().optional(),
  materialIds: z.array(z.string()).default([]),
})
export type Activity = z.infer<typeof Activity>

// ===== Material =====
export const Material = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(3),
  purpose: z.string().min(20),
  ageBands: z.array(AgeBandId).min(1),
  budget: z.enum(['rendah', 'sedang', 'tinggi']),
  buyHint: z.string().optional(),
  diy: z.boolean().default(false),
  safetyNotes: z.array(z.string()).default([]),
  references: z.array(Source).min(1),
})
export type Material = z.infer<typeof Material>

// ===== DIYGuide =====
export const DIYGuide = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(5),
  makes: z.string().min(3),
  timeMinutes: z.number().int().min(5).max(600),
  cost: z.enum(['gratis', 'rendah', 'sedang']),
  materialsNeeded: z.array(z.string()).min(1),
  steps: z.array(z.string()).min(2),
  ageBands: z.array(AgeBandId).min(1),
  safetyNotes: z.array(z.string()).default([]),
  references: z.array(Source).min(1),
})
export type DIYGuide = z.infer<typeof DIYGuide>

// ===== RoomSetup =====
export const RoomSetup = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  room: z.enum(['kamar-anak', 'kamar-mandi', 'dapur', 'ruang-keluarga', 'area-makan', 'outdoor']),
  title: z.string().min(5),
  principles: z.array(z.string()).min(2),
  items: z.array(z.object({
    name: z.string().min(2),
    essential: z.boolean().default(true),
    budgetRendah: z.string(),
    budgetSedang: z.string().optional(),
    diy: z.boolean().default(false),
  })).min(3),
  layoutTips: z.array(z.string()).min(1),
  ageBands: z.array(AgeBandId).min(1),
  references: z.array(Source).min(1),
})
export type RoomSetup = z.infer<typeof RoomSetup>

// ===== Milestone =====
export const Milestone = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(5),
  ageBand: AgeBandId,
  domain: z.enum(['motorik-kasar', 'motorik-halus', 'bahasa', 'kognitif', 'sosial-emosional', 'self-help']),
  description: z.string().min(20),
  typicalFromMonths: z.number().min(0).max(72),
  typicalToMonths: z.number().min(0).max(72),
  redFlags: z.array(z.string()).default([]),
  references: z.array(Source).min(1),
})
export type Milestone = z.infer<typeof Milestone>

// ===== ParentGuide =====
export const ParentGuide = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(5),
  category: z.enum(['filosofi', 'komunikasi', 'disiplin', 'rutinitas', 'screen-time', 'sibling', 'toilet', 'tantrum', 'observasi', 'self-care']),
  ageBands: z.array(AgeBandId).default([]),
  body: z.string().min(200, 'panduan minimal 200 karakter'),
  keyTakeaways: z.array(z.string()).min(2),
  references: z.array(Source).min(1),
})
export type ParentGuide = z.infer<typeof ParentGuide>

// ===== Glossary =====
export const GlossaryEntry = z.object({
  term: z.string().min(2),
  termEn: z.string().optional(),
  definition: z.string().min(30),
  relatedTerms: z.array(z.string()).default([]),
})
export type GlossaryEntry = z.infer<typeof GlossaryEntry>

// ===== Checklist =====
export const Checklist = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(5),
  kind: z.enum(['environment', 'rutinitas', 'persiapan-aktivitas', 'keselamatan']),
  scope: z.string(),
  items: z.array(z.object({
    text: z.string().min(5),
    hint: z.string().optional(),
  })).min(3),
  references: z.array(Source).min(1),
})
export type Checklist = z.infer<typeof Checklist>

// ===== Skill =====
export const Skill = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(3),
  area: AreaId,
  description: z.string().min(20),
  ageBands: z.array(AgeBandId).min(1),
})
export type Skill = z.infer<typeof Skill>

// ===== AgeBand metadata (warna & label) =====
export const AgeBandMeta = z.object({
  id: AgeBandId,
  label: z.string().min(3),
  rangeMonths: z.tuple([z.number(), z.number()]),
  color: z.enum(['sky', 'apple', 'mango', 'sunny', 'leaf', 'grape', 'candy', 'tosca']),
  icon: AgeBandId,
})
export type AgeBandMeta = z.infer<typeof AgeBandMeta>

// ===== Area metadata =====
export const AreaMeta = z.object({
  id: AreaId,
  label: z.string().min(3),
  labelEn: z.string(),
  color: z.enum(['sky', 'apple', 'mango', 'sunny', 'leaf', 'grape', 'candy', 'tosca']),
  icon: z.string().min(1),
  description: z.string().min(30),
})
export type AreaMeta = z.infer<typeof AreaMeta>

// ===== Bundle per AgeBand (lazy-load unit) =====
export const AgeBandBundle = z.object({
  ageBand: AgeBandId,
  activities: z.array(Activity),
  milestones: z.array(Milestone).default([]),
})
export type AgeBandBundle = z.infer<typeof AgeBandBundle>

// ===== File bundle global =====
export const GlobalBundle = z.object({
  ageBands: z.array(AgeBandMeta),
  areas: z.array(AreaMeta),
  skills: z.array(Skill).default([]),
  materials: z.array(Material),
  diyGuides: z.array(DIYGuide),
  roomSetups: z.array(RoomSetup),
  parentGuides: z.array(ParentGuide),
  glossary: z.array(GlossaryEntry),
  checklists: z.array(Checklist),
})
export type GlobalBundle = z.infer<typeof GlobalBundle>
