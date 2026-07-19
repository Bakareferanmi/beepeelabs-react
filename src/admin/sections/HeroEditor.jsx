import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'

export default function HeroEditor() {
  const [form, setForm] = useState({ headline: '', subtext: '', availableForWork: true })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, 'content', 'hero'))
      if (snap.exists()) setForm(snap.data())
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await setDoc(doc(db, 'content', 'hero'), form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <p className="text-ink-soft">Loading...</p>

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-2xl">Hero Section</h2>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">Headline</span>
        <input
          type="text"
          value={form.headline}
          onChange={(e) => setForm({ ...form, headline: e.target.value })}
          className="border-2 border-ink bg-paper px-3 py-2.5 text-sm focus:outline-none focus:bg-yellow/20"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">Subtext</span>
        <textarea
          rows={4}
          value={form.subtext}
          onChange={(e) => setForm({ ...form, subtext: e.target.value })}
          className="border-2 border-ink bg-paper px-3 py-2.5 text-sm resize-none focus:outline-none focus:bg-yellow/20"
        />
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.availableForWork}
          onChange={(e) => setForm({ ...form, availableForWork: e.target.checked })}
          className="w-4 h-4"
        />
        <span className="text-sm">Show "Available for work" pill</span>
      </label>

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
