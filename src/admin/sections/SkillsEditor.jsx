import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'

const uid = () => Math.random().toString(36).slice(2, 10)

export default function SkillsEditor() {
  const [items, setItems] = useState([])
  const [tagsText, setTagsText] = useState({}) // keyed by item._key, raw comma-separated text
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, 'content', 'skills'))
      const rawItems = snap.exists() ? snap.data().items || [] : []
      const withKeys = rawItems.map((it) => ({ ...it, _key: uid() }))
      setItems(withKeys)
      setTagsText(Object.fromEntries(withKeys.map((it) => [it._key, (it.tags || []).join(', ')])))
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    const cleanItems = items.map(({ _key, ...rest }) => ({
      ...rest,
      tags: (tagsText[_key] || '').split(',').map((t) => t.trim()).filter(Boolean),
    }))
    setSaving(true)
    await setDoc(doc(db, 'content', 'skills'), { items: cleanItems })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const update = (key, field, value) => {
    setItems((prev) => prev.map((it) => (it._key === key ? { ...it, [field]: value } : it)))
  }

  const addSkill = () => {
    const key = uid()
    setItems((prev) => [...prev, { icon: 'Code2', name: '', desc: '', tags: [], _key: key }])
    setTagsText((prev) => ({ ...prev, [key]: '' }))
  }

  const removeSkill = (key) => {
    setItems((prev) => prev.filter((it) => it._key !== key))
    setTagsText((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  if (loading) return <p className="text-ink-soft">Loading...</p>

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-2xl">Skills Section</h2>

      {items.map((s) => (
        <div key={s._key} className="border-2 border-ink p-4 flex flex-col gap-2.5">
          <input
            type="text"
            placeholder="Lucide icon name (e.g. Code2, Database)"
            value={s.icon || ''}
            onChange={(e) => update(s._key, 'icon', e.target.value)}
            className="border-2 border-ink bg-paper px-3 py-2 text-sm focus:outline-none focus:bg-yellow/20"
          />
          <input
            type="text"
            placeholder="Skill name"
            value={s.name || ''}
            onChange={(e) => update(s._key, 'name', e.target.value)}
            className="border-2 border-ink bg-paper px-3 py-2 text-sm focus:outline-none focus:bg-yellow/20"
          />
          <textarea
            rows={2}
            placeholder="Description"
            value={s.desc || ''}
            onChange={(e) => update(s._key, 'desc', e.target.value)}
            className="border-2 border-ink bg-paper px-3 py-2 text-sm resize-none focus:outline-none focus:bg-yellow/20"
          />
          <input
            type="text"
            placeholder="Tags, comma separated"
            value={tagsText[s._key] || ''}
            onChange={(e) => setTagsText((prev) => ({ ...prev, [s._key]: e.target.value }))}
            className="border-2 border-ink bg-paper px-3 py-2 text-sm focus:outline-none focus:bg-yellow/20"
          />
          <button
            onClick={() => removeSkill(s._key)}
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
