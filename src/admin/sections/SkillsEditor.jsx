import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'

export default function SkillsEditor() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, 'content', 'skills'))
      if (snap.exists()) setItems(snap.data().items || [])
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await setDoc(doc(db, 'content', 'skills'), { items })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const update = (i, key, value) => {
    const next = [...items]
    next[i] = { ...next[i], [key]: value }
    setItems(next)
  }

  const addSkill = () => {
    setItems([...items, { icon: 'Code2', name: '', desc: '', tags: [] }])
  }

  const removeSkill = (i) => {
    setItems(items.filter((_, idx) => idx !== i))
  }

  if (loading) return <p className="text-ink-soft">Loading...</p>

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-2xl">Skills Section</h2>

      {items.map((s, i) => (
        <div key={i} className="border-2 border-ink p-4 flex flex-col gap-2.5">
          <input
            type="text"
            placeholder="Lucide icon name (e.g. Code2, Database)"
            value={s.icon || ''}
            onChange={(e) => update(i, 'icon', e.target.value)}
            className="border-2 border-ink bg-paper px-3 py-2 text-sm focus:outline-none focus:bg-yellow/20"
          />
          <input
            type="text"
            placeholder="Skill name"
            value={s.name || ''}
            onChange={(e) => update(i, 'name', e.target.value)}
            className="border-2 border-ink bg-paper px-3 py-2 text-sm focus:outline-none focus:bg-yellow/20"
          />
          <textarea
            rows={2}
            placeholder="Description"
            value={s.desc || ''}
            onChange={(e) => update(i, 'desc', e.target.value)}
            className="border-2 border-ink bg-paper px-3 py-2 text-sm resize-none focus:outline-none focus:bg-yellow/20"
          />
          <input
            type="text"
            placeholder="Tags, comma separated"
            value={(s.tags || []).join(', ')}
            onChange={(e) => update(i, 'tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
            className="border-2 border-ink bg-paper px-3 py-2 text-sm focus:outline-none focus:bg-yellow/20"
          />
          <button
            onClick={() => removeSkill(i)}
            className="self-start font-mono text-xs uppercase tracking-widest text-[#E23D28] hover:underline"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        onClick={addSkill}
        className="self-start px-4 py-2.5 border-2 border-ink font-mono text-xs uppercase tracking-widest hover:bg-yellow"
      >
        + Add skill
      </button>

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
