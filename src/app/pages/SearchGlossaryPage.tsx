import { useEffect, useRef, useState } from 'react'
import { loadGlobal, searchActivities } from '../../content/store'
import type { Activity, GlossaryEntry } from '../../content/schema'
import { areaById } from '../../content/meta'
import { AreaIcon } from '../components/icons'
import { AREA_GRADIENTS, EmptyState, SkeletonCards } from './TodayPage'

export function SearchGlossaryPage() {
  const [query, setQuery] = useState('')
  const [activities, setActivities] = useState<Activity[]>([])
  const [glossary, setGlossary] = useState<GlossaryEntry[]>([])
  const [loadingGlobal, setLoadingGlobal] = useState(true)
  const [searching, setSearching] = useState(false)
  const requestId = useRef(0)

  useEffect(() => {
    loadGlobal().then((global) => {
      setGlossary(global.glossary)
      setLoadingGlobal(false)
    })
  }, [])

  useEffect(() => {
    const q = query.trim()
    const id = ++requestId.current

    if (!q) {
      setActivities([])
      setSearching(false)
      return
    }

    setSearching(true)
    const timer = window.setTimeout(() => {
      searchActivities(q).then((results) => {
        if (id === requestId.current) {
          setActivities(results)
          setSearching(false)
        }
      })
    }, 250)

    return () => window.clearTimeout(timer)
  }, [query])

  const normalizedQuery = query.trim().toLocaleLowerCase()
  const filteredGlossary = glossary.filter((entry) =>
    !normalizedQuery ||
    entry.term.toLocaleLowerCase().includes(normalizedQuery) ||
    entry.definition.toLocaleLowerCase().includes(normalizedQuery),
  )

  return (
    <div className="px-5 space-y-6">
      <div className="sticky top-0 z-30 -mx-5 px-5 py-2 bg-sky-50/90 dark:bg-navy-900/90 backdrop-blur-md">
        <label className="sr-only" htmlFor="activity-search">Cari aktivitas atau glosarium</label>
        <div className="flex items-center gap-3 rounded-full bg-white dark:bg-navy-800 shadow-sm px-5 min-h-[56px]">
          <span aria-hidden className="text-lg">🔍</span>
          <input
            id="activity-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari aktivitas atau istilah…"
            className="min-w-0 flex-1 bg-transparent text-base text-sky-900 dark:text-sky-100 placeholder:text-sky-900/45 dark:placeholder:text-sky-100/45 outline-none"
            type="search"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Hapus pencarian"
              className="w-8 h-8 rounded-full text-sky-900/50 dark:text-sky-100/50"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {query.trim() && (
        <section aria-labelledby="activity-results-title">
          <h2 id="activity-results-title" className="font-[family-name:var(--font-display)] font-bold text-lg mb-2.5">
            Aktivitas <span className="opacity-50 text-base">({activities.length})</span>
          </h2>
          {searching ? (
            <SkeletonCards n={3} />
          ) : activities.length === 0 ? (
            <EmptyState title="Aktivitas belum ditemukan" text="Coba kata kunci lain, seperti menuang, bahasa, atau sensorik." mood="sleepy" />
          ) : (
            <ul className="space-y-3">
              {activities.map((activity) => (
                <ActivityResult key={activity.id} activity={activity} />
              ))}
            </ul>
          )}
        </section>
      )}

      <section aria-labelledby="glossary-title">
        <div className="flex items-center justify-between mb-2.5">
          <h2 id="glossary-title" className="font-[family-name:var(--font-display)] font-bold text-lg">
            Glosarium <span className="opacity-50 text-base">({filteredGlossary.length})</span>
          </h2>
        </div>
        {loadingGlobal ? (
          <GlossarySkeleton />
        ) : filteredGlossary.length === 0 ? (
          <EmptyState title="Istilah belum ditemukan" text="Coba cari istilah Montessori yang lain." mood="sleepy" />
        ) : (
          <dl className="space-y-3">
            {filteredGlossary.map((entry) => (
              <div key={entry.term} className="rounded-3xl bg-white dark:bg-navy-800 shadow-sm p-4">
                <dt className="font-semibold text-sky-900 dark:text-sky-100">{entry.term}</dt>
                <dd className="text-sm opacity-70 mt-1 leading-relaxed">{entry.definition}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>
    </div>
  )
}

function ActivityResult({ activity }: { activity: Activity }) {
  const area = areaById(activity.areas[0])
  const gradient = AREA_GRADIENTS[activity.areas[0]] ?? 'from-sky-500 to-sky-700'

  return (
    <li>
      <article className="rounded-3xl bg-white dark:bg-navy-800 shadow-sm overflow-hidden active:scale-[0.98] transition">
        <a href={`#/aktivitas/${activity.id}`} aria-label={activity.title} className="flex items-stretch">
          <div className={`w-24 shrink-0 bg-gradient-to-br ${gradient} bg-black/15 bg-blend-overlay grid place-items-center relative`}>
            <AreaIcon area={activity.areas[0]} className="w-10 h-10 text-white/95 drop-shadow" />
            <span className="absolute bottom-2 left-1.5 right-1.5 text-center text-[9px] font-semibold bg-white/90 text-sky-800 rounded-full px-1 py-0.5 truncate">{area?.label}</span>
          </div>
          <div className="p-3.5 min-w-0">
            <h3 className="font-semibold leading-snug">{activity.title}</h3>
            <p className="text-xs opacity-75 mt-1 line-clamp-2">{activity.summary}</p>
            <p className="text-[11px] opacity-70 mt-2">⏱ {activity.durationMinutes} mnt</p>
          </div>
        </a>
      </article>
    </li>
  )
}

function GlossarySkeleton() {
  return (
    <div className="space-y-3 animate-pulse" aria-hidden>
      {[1, 2, 3].map((item) => (
        <div key={item} className="rounded-3xl bg-white dark:bg-navy-800 p-4 space-y-2">
          <div className="h-4 w-1/3 rounded bg-sky-100 dark:bg-navy-700" />
          <div className="h-3 w-full rounded bg-sky-50 dark:bg-navy-700/60" />
          <div className="h-3 w-4/5 rounded bg-sky-50 dark:bg-navy-700/60" />
        </div>
      ))}
    </div>
  )
}
