import { useState, useEffect } from 'react'
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase'

const EMPTY = { id: '', meta: '', title: '', excerpt: '', body: [] }

export default function WritingEditor() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    const snap = await getDocs(collection(db, 'writing'))
    setPosts(snap.docs.map((d) => d.data()))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!editing.id) return alert('ID is required (e.g. "my-post-title", no spaces)')
    setSaving(true)
    await setDoc(doc(db, 'writing', editing.id), editing)
    setSaving(false)
    setEditing(null)
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm(`Delete post "${id}"? This cannot be undone.`)) return
    await deleteDoc(doc(db, 'writing', id))
    load()
  }

  if (loading) return <p className="text-ink-soft">Loading...</p>

  if (editing) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="font-display text-2xl">{posts.find((p) => p.id === editing.id) ? 'Edit' : 'New'} Post</h2>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">ID (unique, no spaces)</span>
          <input
            type="text"
            value={editing.id}
            onChange={(e) => setEditing({ ...editing, id: e.target.value.trim().toLowerCase().replace(/\s+/g, '-') })}
            className="border-2 border-ink bg-paper px-3 py-2.5 text-sm focus:outline-none focus:bg-yellow/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">Meta (e.g. "SEO — 2026")</span>
          <input
            type="text"
            value={editing.meta || ''}
            onChange={(e) => setEditing({ ...editing, meta: e.target.value })}
            className="border-2 border-ink bg-paper px-3 py-2.5 text-sm focus:outline-none focus:bg-yellow/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">Title</span>
          <input
            type="text"
            value={editing.title || ''}
            onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            className="border-2 border-ink bg-paper px-3 py-2.5 text-sm focus:outline-none focus:bg-yellow/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">Excerpt (list preview)</span>
          <textarea
            rows={2}
            value={editing.excerpt || ''}
            onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
            className="border-2 border-ink bg-paper px-3 py-2.5 text-sm resize-none focus:outline-none focus:bg-yellow/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">
            Body — one paragraph per line
          </span>
          <textarea
            rows={10}
            value={(editing.body || []).join('\n')}
            onChange={(e) => setEditing({ ...editing, body: e.target.value.split('\n').filter(Boolean) })}
            className="border-2 border-ink bg-paper px-3 py-2.5 text-sm resize-none focus:outline-none focus:bg-yellow/20"
          />
        </label>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-3 bg-ink text-paper font-mono text-sm uppercase tracking-wider hover:bg-blue transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save post'}
          </button>
          <button
            onClick={() => setEditing(null)}
            className="px-5 py-3 border-2 border-ink font-mono text-sm uppercase tracking-wider hover:bg-yellow"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">Writing</h2>
        <button
          onClick={() => setEditing({ ...EMPTY })}
          className="px-4 py-2.5 border-2 border-ink font-mono text-xs uppercase tracking-widest hover:bg-yellow"
        >
          + New post
        </button>
      </div>

      {posts.map((p) => (
        <div key={p.id} className="border-2 border-ink p-4 flex items-center justify-between gap-4">
          <div>
            <div className="font-display text-lg">{p.title}</div>
            <div className="font-mono text-xs text-muted">{p.meta}</div>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => setEditing({ ...EMPTY, ...p })}
              className="font-mono text-xs uppercase tracking-widest text-blue hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(p.id)}
              className="font-mono text-xs uppercase tracking-widest text-[#E23D28] hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
