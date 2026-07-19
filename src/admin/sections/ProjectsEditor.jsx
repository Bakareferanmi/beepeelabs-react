import { useState, useEffect } from 'react'
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase'

const EMPTY = {
  id: '', type: '', name: '', initials: '', desc: '', summary: '',
  features: [], stack: [], link: '',
}

export default function ProjectsEditor() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    const snap = await getDocs(collection(db, 'projects'))
    setProjects(snap.docs.map((d) => d.data()))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!editing.id) return alert('ID is required (e.g. "my-project", no spaces)')
    setSaving(true)
    await setDoc(doc(db, 'projects', editing.id), editing)
    setSaving(false)
    setEditing(null)
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm(`Delete project "${id}"? This cannot be undone.`)) return
    await deleteDoc(doc(db, 'projects', id))
    load()
  }

  if (loading) return <p className="text-ink-soft">Loading...</p>

  if (editing) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="font-display text-2xl">{projects.find((p) => p.id === editing.id) ? 'Edit' : 'New'} Project</h2>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">ID (unique, no spaces, e.g. my-project)</span>
          <input
            type="text"
            value={editing.id}
            onChange={(e) => setEditing({ ...editing, id: e.target.value.trim().toLowerCase().replace(/\s+/g, '-') })}
            className="border-2 border-ink bg-paper px-3 py-2.5 text-sm focus:outline-none focus:bg-yellow/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">Type (e.g. Marketplace)</span>
          <input
            type="text"
            value={editing.type || ''}
            onChange={(e) => setEditing({ ...editing, type: e.target.value })}
            className="border-2 border-ink bg-paper px-3 py-2.5 text-sm focus:outline-none focus:bg-yellow/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">Project name</span>
          <input
            type="text"
            value={editing.name || ''}
            onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            className="border-2 border-ink bg-paper px-3 py-2.5 text-sm focus:outline-none focus:bg-yellow/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">Initials (2 letters, e.g. EV)</span>
          <input
            type="text"
            value={editing.initials || ''}
            onChange={(e) => setEditing({ ...editing, initials: e.target.value })}
            className="border-2 border-ink bg-paper px-3 py-2.5 text-sm focus:outline-none focus:bg-yellow/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">Live link (leave blank if none)</span>
          <input
            type="text"
            value={editing.link || ''}
            onChange={(e) => setEditing({ ...editing, link: e.target.value })}
            className="border-2 border-ink bg-paper px-3 py-2.5 text-sm focus:outline-none focus:bg-yellow/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">Short description (card preview)</span>
          <textarea
            rows={2}
            value={editing.desc || ''}
            onChange={(e) => setEditing({ ...editing, desc: e.target.value })}
            className="border-2 border-ink bg-paper px-3 py-2.5 text-sm resize-none focus:outline-none focus:bg-yellow/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">Full summary (modal detail)</span>
          <textarea
            rows={3}
            value={editing.summary || ''}
            onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
            className="border-2 border-ink bg-paper px-3 py-2.5 text-sm resize-none focus:outline-none focus:bg-yellow/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">Features (one per line)</span>
          <textarea
            rows={5}
            value={(editing.features || []).join('\n')}
            onChange={(e) => setEditing({ ...editing, features: e.target.value.split('\n').filter(Boolean) })}
            className="border-2 border-ink bg-paper px-3 py-2.5 text-sm resize-none focus:outline-none focus:bg-yellow/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">Stack (comma separated)</span>
          <input
            type="text"
            value={(editing.stack || []).join(', ')}
            onChange={(e) => setEditing({ ...editing, stack: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
            className="border-2 border-ink bg-paper px-3 py-2.5 text-sm focus:outline-none focus:bg-yellow/20"
          />
        </label>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-3 bg-ink text-paper font-mono text-sm uppercase tracking-wider hover:bg-blue transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save project'}
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
        <h2 className="font-display text-2xl">Projects</h2>
        <button
          onClick={() => setEditing({ ...EMPTY })}
          className="px-4 py-2.5 border-2 border-ink font-mono text-xs uppercase tracking-widest hover:bg-yellow"
        >
          + New project
        </button>
      </div>

      {projects.map((p) => (
        <div key={p.id} className="border-2 border-ink p-4 flex items-center justify-between gap-4">
          <div>
            <div className="font-display text-lg">{p.name}</div>
            <div className="font-mono text-xs text-muted">{p.type}</div>
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
