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
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">ID (unique, no spaces, e.g. "my-project")</span>
          <input
            type="text"
            value={editing.id}
            onChange={(e) => setEditing({ ...editing, id: e.target.value.trim().toLowerCase().replace(/\s+/g, '-') })}
            className="border-2 border-ink bg-paper px-3 py-2.5 text-sm focus:outline-none focus:bg-yellow/20"
          />
        </label>

        {[
          ['type', 'Type (e.g. "Marketplace")'],
          ['name', 'Project name'],
          ['initials', 'Initials (2 letters, e.g. "EV")'],
          ['link', 'Live link (leave blank if none)'],
        ].map(([key, placeholder]) => (
          <label key={key} className="flex flex-col gap-1.5">
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">{placeholder}</span>
            <input
              type="text"
              value={editing[key] || ''}
              onChange={(e) => setEditing({ ...editing, [key]: e.target.value })}
              className="border-2 border-ink bg-paper px-3 py-2.5 text-sm focus:outline-none focus:bg-yellow/20"
            />
          </label>
        ))}

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
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-
