import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'

export default function ContactEditor() {
  const [form, setForm] = useState({ eyebrow: '', heading: '', body: '', links: [] })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, 'content', 'contact'))
      if (snap.exists()) setForm(snap.data())
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await setDoc(doc(db, 'content', 'contact'), form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateLink = (i, key, value) => {
    const links = [...form.links]
    links[i] = { ...links[i], [key]: value }
    setForm({ ...form, links })
  }

  if (loading) return <p className="text-ink-soft">Loading...</p>

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-2xl">Contact Section</h2>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">Eyebrow label</span>
        <input
          type="text"
          value={form.eyebrow}
          onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
          className="border-2 border-ink bg-paper px-3 py-2.5 text-sm focus:outline-none focus:bg-yellow/20"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">Heading</span>
        <textarea
          rows={2}
          value={form.heading}
          onChange={(e) => setForm({ ...form, heading: e.target.value })}
          className="border-2 border-ink bg-paper px-3 py-2.5 text-sm resize-none focus:outline-none focus:bg-yellow/20"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">Body text</span>
        <textarea
          rows={4}
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          className="border-2 border-ink bg-paper px-3 py-2.5 text-sm resize-none focus:outline-none focus:bg-yellow/20"
        />
      </label>

      <div className="font-mono text-[0.65rem] uppercase tracking-widest text-muted mt-2">Links</div>
      {form.links.map((l, i) => (
        <div key={i} className="border-2 border-ink p-3 flex flex-col gap-2">
          <input
            type="text"
            placeholder="Lucide icon (Mail, Globe, Github, Linkedin)"
            value={l.icon || ''}
            onChange={(e) => updateLink(i, 'icon', e.target.value)}
            className="border-2 border-ink bg-paper px-3 py-2 text-sm focus:outline-none focus:bg-yellow/20"
          />
          <input
            type="text"
            placeholder="Label"
            value={l.label || ''}
            onChange={(e) => updateLink(i, 'label', e.target.value)}
            className="border-2 border-ink bg-paper px-3 py-2 text-sm focus:outline-none focus:bg-yellow/20"
          />
          <input
            type="text"
            placeholder="Display value"
            value={l.value || ''}
            onChange={(e) => updateLink(i, 'value', e.target.value)}
            className="border-2 border-ink bg-paper px-3 py-2 text-sm focus:outline-none focus:bg-yellow/20"
          />
          <input
            type="text"
            placeholder="Href / URL"
            value={l.href || ''}
            onChange={(e) => updateLink(i, 'href', e.target.value)}
            className="border-2 border-ink bg-paper px-3 py-2 text-sm focus:outline-none focus:bg-yellow/20"
          />
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        className="self-start px-5 py-3 bg-ink text-paper font-mono text-sm uppercase tracking-wider hover:bg-blue transition-colors disabled:opacity-60"
      >
        {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save changes'}
      </button>
    </div>
  )
}
