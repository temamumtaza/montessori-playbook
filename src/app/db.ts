import Dexie, { type Table } from 'dexie'

export type JournalEntry = {
  id?: number
  childId: string
  createdAt: number
  note: string
  photoBlob?: Blob
  activityId?: string
  skillTags: string[]
  mood?: 'senang' | 'fokus' | 'frustrasi' | 'tenang'
}

export type MasteryRecord = {
  childId: string
  targetId: string // activity/skill/milestone id
  kind: 'activity' | 'skill' | 'milestone'
  level: 'belum' | 'mulai' | 'mahir'
  updatedAt: number
}

export type Bookmark = {
  childId: string
  targetId: string
  createdAt: number
}

export type ChecklistState = {
  childId: string
  checklistId: string
  itemId: number
  done: boolean
}

export type Profile = {
  key: string // 'onboarding-v1'
  reminders: boolean
  reminderHour: number
  exportedAt?: string
}

class PlaybookDB extends Dexie {
  journal!: Table<JournalEntry, number>
  mastery!: Table<MasteryRecord, [string, string]>
  bookmarks!: Table<Bookmark, [string, string]>
  checklists!: Table<ChecklistState, [string, string, number]>
  profiles!: Table<Profile, string>

  constructor() {
    super('montessori-playbook')
    this.version(1).stores({
      journal: '++id, childId, createdAt, activityId',
      mastery: '[childId+targetId], childId, level',
      bookmarks: '[childId+targetId], childId',
      checklists: '[childId+checklistId+itemId], childId',
      profiles: 'key',
    })
  }
}

export const db = new PlaybookDB()

export async function exportAllData(): Promise<string> {
  const [journal, mastery, bookmarks, checklists] = await Promise.all([
    db.journal.toArray(),
    db.mastery.toArray(),
    db.bookmarks.toArray(),
    db.checklists.toArray(),
  ])
  // foto blob -> base64
  const journalSer = await Promise.all(
    journal.map(async (j) => ({
      ...j,
      photoBlob: j.photoBlob ? await blobToBase64(j.photoBlob) : undefined,
    })),
  )
  return JSON.stringify({ v: 1, exportedAt: new Date().toISOString(), journal: journalSer, mastery, bookmarks, checklists }, null, 2)
}

export async function importAllData(json: string): Promise<void> {
  const data = JSON.parse(json)
  if (data.v !== 1) throw new Error('Format file tidak dikenal')
  await db.transaction('rw', db.journal, db.mastery, db.bookmarks, db.checklists, async () => {
    for (const j of data.journal ?? []) {
      const { photoBlob, ...rest } = j
      await db.journal.add({ ...rest, photoBlob: photoBlob ? await base64ToBlob(photoBlob) : undefined })
    }
    if (data.mastery) await db.mastery.bulkPut(data.mastery)
    if (data.bookmarks) await db.bookmarks.bulkPut(data.bookmarks)
    if (data.checklists) await db.checklists.bulkPut(data.checklists)
  })
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((res) => {
    const r = new FileReader()
    r.onload = () => res(String(r.result))
    r.readAsDataURL(blob)
  })
}

function base64ToBlob(dataUrl: string): Promise<Blob> {
  return fetch(dataUrl).then((r) => r.blob())
}
