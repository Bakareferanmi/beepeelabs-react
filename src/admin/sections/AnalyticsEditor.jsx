import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'

export default function AnalyticsEditor() {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, 'analytics'))
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      data.sort((a, b) => (b.count || 0) - (a.count || 0))
      setPages(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <p className="text-ink-soft">Loading...</p>

  const totalViews = pages.reduce((sum, p) => sum + (p.count || 0), 0)
  const blogPages = pages.filter((p) => p.path?.startsWith('/writing/'))
  const otherPages = pages.filter((p) => !p.path?.startsWith('/writing/'))

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—'

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-2xl mb-1">Analytics</h2>
        <p className="font-mono text-xs text-muted">Total tracked page views: {totalViews}</p>
      </div>

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
