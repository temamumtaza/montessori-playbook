import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { loadBundle, loadGlobal } from '../../content/store'
import type { Milestone, ParentGuide } from '../../content/schema'
import { AGE_BANDS } from '../../content/meta'
import { EmptyState } from './TodayPage'
import { ageBandFromBirth, useChildStore } from '../stores/children'
import { IconCheck, IconShield, IconChevronDown, IconChevronRight } from '../components/ui-icons'

type Tab = 'guides' | 'red-flags'

const CATEGORY_LABELS: Record<ParentGuide['category'], string> = {
  filosofi: 'Filosofi',
  komunikasi: 'Komunikasi',
  disiplin: 'Disiplin',
  rutinitas: 'Rutinitas',
  'screen-time': 'Screen time',
  sibling: 'Saudara',
  toilet: 'Toilet learning',
  tantrum: 'Tantrum',
  observasi: 'Observasi',
  'self-care': 'Merawat diri',
}

const CATEGORY_CLASSES: Record<ParentGuide['category'], string> = {
  filosofi: 'bg-grape-100 text-grape-700',
  komunikasi: 'bg-sky-100 text-sky-700',
  disiplin: 'bg-apple-100 text-apple-700',
  rutinitas: 'bg-leaf-100 text-leaf-700',
  'screen-time': 'bg-mango-100 text-mango-700',
  sibling: 'bg-tosca-100 text-tosca-700',
  toilet: 'bg-sunny-100 text-sunny-800',
  tantrum: 'bg-candy-100 text-candy-700',
  observasi: 'bg-sky-100 text-sky-700',
  'self-care': 'bg-leaf-100 text-leaf-700',
}

export function LearnPage() {
  const [searchParams] = useSearchParams()
  const activeId = useChildStore((s) => s.activeId)
  const child = useChildStore((s) => s.children.find((c) => c.id === s.activeId))
  const [tab, setTab] = useState<Tab>('guides')
  const [guides, setGuides] = useState<ParentGuide[] | null>(null)
  const [redFlags, setRedFlags] = useState<Milestone[] | null>(null)

  useEffect(() => {
    setTab(searchParams.get('tab') === 'red-flags' ? 'red-flags' : 'guides')
  }, [searchParams])

  useEffect(() => {
    let cancelled = false
    loadGlobal().then((global) => {
      if (!cancelled) setGuides(global.parentGuides)
    })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    setRedFlags(null)
    if (!child || !activeId) {
      setRedFlags([])
      return () => { cancelled = true }
    }
    loadBundle(ageBandFromBirth(child.birthDate)).then((bundle) => {
      if (!cancelled) setRedFlags(bundle.milestones.filter((milestone) => milestone.redFlags.length > 0))
    })
    return () => { cancelled = true }
  }, [activeId, child])

  return (
    <div className="px-5 space-y-4">
      <section className="rounded-3xl bg-sunny-100 dark:bg-navy-800 p-4 flex items-start gap-3">
        <IconShield className="w-5 h-5 shrink-0 text-sunny-700" />
        <p className="text-sm text-sky-900 dark:text-sky-100">
          Bukan pengganti nasihat dokter. Jika ada kekhawatiran tentang tumbuh kembang anak, konsultasikan dengan dokter atau tenaga kesehatan.
        </p>
      </section>

      <div className="grid grid-cols-2 gap-1 rounded-full bg-sky-100 dark:bg-navy-800 p-1" role="tablist" aria-label="Pilih isi panduan">
        <TabButton active={tab === 'guides'} onClick={() => setTab('guides')} id="guides-tab">Panduan</TabButton>
        <TabButton active={tab === 'red-flags'} onClick={() => setTab('red-flags')} id="red-flags-tab">Red Flags</TabButton>
      </div>

      {tab === 'guides' ? (
        guides === null ? <Loading /> : guides.length === 0 ? (
          <EmptyState title="Panduan belum tersedia" text="Panduan orang tua sedang disiapkan." mood="sleepy" />
        ) : (
          <div className="space-y-3" role="tabpanel" aria-labelledby="guides-tab">
            {guides.map((guide) => <GuideCard key={guide.id} guide={guide} />)}
          </div>
        )
      ) : redFlags === null ? (
        <Loading />
      ) : redFlags.length === 0 ? (
        <EmptyState title="Belum ada red flags" text="Belum ada catatan red flags untuk rentang usia ini." mood="happy" />
      ) : (
        <div className="space-y-3" role="tabpanel" aria-labelledby="red-flags-tab">
          {redFlags.map((milestone) => (
            <article key={milestone.id} className="rounded-3xl bg-white dark:bg-navy-800 shadow-sm p-4">
              <h2 className="font-[family-name:var(--font-display)] font-bold">{milestone.title}</h2>
              <ul className="mt-2 space-y-2 text-sm text-apple-700 dark:text-apple-300">
                {milestone.redFlags.map((flag) => <li key={flag} className="flex gap-2"><IconFlagDot /><span>{flag}</span></li>)}
              </ul>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

function TabButton({ active, onClick, id, children }: { active: boolean; onClick: () => void; id: string; children: string }) {
  return (
    <button
      id={id}
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded-full min-h-[48px] px-4 text-sm font-semibold transition ${active ? 'bg-white dark:bg-navy-700 text-sky-700 dark:text-sky-200 shadow-sm' : 'opacity-70'}`}
    >
      {children}
    </button>
  )
}

function GuideCard({ guide }: { guide: ParentGuide }) {
  const [open, setOpen] = useState(false)
  const bandLabels = guide.ageBands.map((id) => AGE_BANDS.find((band) => band.id === id)?.label).filter(Boolean)

  return (
    <article className="rounded-3xl bg-white dark:bg-navy-800 shadow-sm overflow-hidden">
      <button onClick={() => setOpen((value) => !value)} aria-expanded={open} className="w-full text-left p-4 min-h-[48px]">
        <div className="flex items-start justify-between gap-3">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${CATEGORY_CLASSES[guide.category]}`}>
            {CATEGORY_LABELS[guide.category]}
          </span>
          {open ? <IconChevronDown className="w-5 h-5 text-sky-600 dark:text-sky-300" /> : <IconChevronRight className="w-5 h-5 text-sky-600 dark:text-sky-300" />}
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold mt-2">{guide.title}</h2>
        {bandLabels.length > 0 && <p className="text-xs opacity-70 mt-1">{bandLabels.join(' · ')}</p>}
        <ul className="mt-3 space-y-1 text-sm opacity-80">
          {guide.keyTakeaways.slice(0, 2).map((takeaway) => <li key={takeaway} className="flex gap-2"><IconCheck className="w-4 h-4 shrink-0 text-leaf-600" /><span>{takeaway}</span></li>)}
        </ul>
      </button>
      {open && <div className="border-t border-sky-100 dark:border-navy-700 px-4 pb-4 pt-3 text-sm leading-relaxed space-y-3">{renderBody(guide.body)}</div>}
    </article>
  )
}

function IconFlagDot() { return <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-apple-600" aria-hidden /> }

function renderBody(body: string) {
  return body.split(/\n\n+/).map((paragraph, index) => (
    <p key={`${paragraph}-${index}`}>{renderBold(paragraph)}</p>
  ))
}

function renderBold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={index}>{part.slice(2, -2)}</strong>
      : <span key={index}>{part}</span>,
  )
}

function Loading() {
  return <div className="rounded-3xl bg-white dark:bg-navy-800 p-6 text-center text-sm opacity-70">Memuat panduan…</div>
}
