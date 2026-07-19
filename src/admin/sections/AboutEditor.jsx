import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'

export default function AboutEditor() {
  const [form, setForm] = useState({ eyebrow: '', heading: '', paragraphs: [], stats: [] })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, 'content', 'about'))
      if (snap.exists()) setForm(snap.data())
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await setDoc(doc(db, 'content', 'about'), form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateStat = (i, key, value) => {
    const stats = [...form.stats]
    stats[i] = { ...stats[i], [key]: value }
    setForm({ ...form, stats })
  }

  if (loading) return <p className="text-ink-soft">Loading...</p>

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-2xl">About Section</h2>

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
        <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">Heading (use a line break for a 2-line heading)</span>
        <textarea
          rows={2}
          value={form.heading}
          onChange={(e) => setForm({ ...form, heading: e.target.value })}
          className="border-2 border-ink bg-paper px-3 py-2.5 text-sm resize-none focus:outline-none focus:bg-yellow/20"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">
          Paragraphs (one per line, use **text** for bold)
        </span>
        <textarea
          rows={6}
          value={form.paragraphs.join('\n')}
          onChange={(e) => setForm({ ...form, paragraphs: e.target.value.split('\n').filter(Boolean) })}
          className="border-2 border-ink bg-paper px-3 py-2.5 text-sm resize-none focus:outline-none focus:bg-yellow/20"
        />
      </label>

      <div className="font-mono text-[0.65rem] uppercase tracking-widest text-muted mt-2">Stats</div>
      {form.stats.map((s, i) => (
        <div key={i} className="border-2 border-ink p-3 flex flex-col gap-2">
          <input
            type="text"
            placeholder="Label"
            value={s.label || ''}
            onChange={(e) => updateStat(i, 'label', e.target.value)}
            className="border-2 border-ink bg-paper px-3 py-2 text-sm focus:outline-none focus:bg-yellow/20"
          />
          <input
            type="text"
            placeholder="Value"
            value={s.value || ''}
            onChange={(e) => updateStat(i, 'value', e.target.value)}
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
