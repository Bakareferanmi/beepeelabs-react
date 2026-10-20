import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
import { LEAD_EVENT_LABELS, summariseAnalytics } from '../../lib/enquiries.js'

export default function AnalyticsEditor() {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(collection(db, 'analytics'))
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        data.sort((a, b) => (b.count || 0) - (a.count || 0))
        setPages(data)
      } catch {
        setError('Could not load analytics. Please reload this page to try again.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <p className="text-ink-soft">Loading...</p>
  if (error) return <p role="alert" className="text-ink-soft">{error}</p>

  const summary = summariseAnalytics(pages)
  const totalViews = summary.totalViews
  const blogPages = summary.pages.filter((p) => p.path?.startsWith('/writing/'))
  const otherPages = summary.pages.filter((p) => !p.path?.startsWith('/writing/'))

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—'

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-2xl mb-1">Analytics</h2>
        <p className="font-mono text-xs text-muted">Total tracked page views: {totalViews}</p>
      </div>

      <section>
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Contact actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {Object.entries(LEAD_EVENT_LABELS).map(([event, label]) => <div key={event} className="border-2 border-ink p-4"><div className="font-mono text-xs mb-2">{label}</div><div className="font-display text-3xl">{summary.totals[event]}</div></div>)}
        </div>
        <p className="text-sm text-ink-soft mb-5">These are clicks and accepted form submissions, not confirmed conversations or paying clients. Repeated actions may be counted. Tracking starts with this update.</p>
        {summary.actions.length === 0 ? <p className="text-sm text-muted">No contact actions recorded yet.</p> : (
          <div className="border-2 border-ink divide-y-2 divide-ink">
            {summary.actions.map((action) => <div key={action.id} className="flex items-start justify-between gap-4 px-4 py-3"><div className="min-w-0"><div className="text-sm">{LEAD_EVENT_LABELS[action.event]} · {action.source}</div><div className="font-mono text-xs text-muted break-all">{action.path}</div><div className="font-mono text-[0.65rem] text-muted">Last action: {formatDate(action.lastVisited)}</div></div><div className="font-display text-xl">{action.count || 0}</div></div>)}
          </div>
        )}
      </section>

      <div>
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Site pages</h3>
        {otherPages.length === 0 ? (
          <p className="text-sm text-ink-soft">No data yet.</p>
        ) : (
          <div className="border-2 border-ink divide-y-2 divide-ink">
            {otherPages.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <div className="font-mono text-sm">{p.path}</div>
                  <div className="font-mono text-[0.65rem] text-muted">Last visit: {formatDate(p.lastVisited)}</div>
                </div>
                <div className="font-display text-xl">{p.count || 0}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Blog post views</h3>
        {blogPages.length === 0 ? (
          <p className="text-sm text-ink-soft">No data yet.</p>
        ) : (
          <div className="border-2 border-ink divide-y-2 divide-ink">
            {blogPages.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <div className="font-mono text-sm">{p.path}</div>
                  <div className="font-mono text-[0.65rem] text-muted">Last visit: {formatDate(p.lastVisited)}</div>
                </div>
                <div className="font-display text-xl">{p.count || 0}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
