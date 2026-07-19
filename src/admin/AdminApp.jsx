import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'
import AdminLogin from './AdminLogin'
import HeroEditor from './sections/HeroEditor'
import AboutEditor from './sections/AboutEditor'
import SkillsEditor from './sections/SkillsEditor'
import ProjectsEditor from './sections/ProjectsEditor'
import WritingEditor from './sections/WritingEditor'
import ContactEditor from './sections/ContactEditor'

const TABS = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'writing', label: 'Writing' },
  { id: 'contact', label: 'Contact' },
]

export default function AdminApp() {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [activeTab, setActiveTab] = useState('hero')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setChecking(false)
    })
    return () => unsub()
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">Loading...</span>
      </div>
    )
  }

  if (!user) {
    return <AdminLogin onSuccess={() => {}} />
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="border-b-2 border-ink px-5 md:px-10 py-4 flex items-center justify-between">
        <div className="font-display text-xl">BeepeeLabs Admin</div>
        <button
          onClick={() => signOut(auth)}
          className="font-mono text-xs uppercase tracking-widest border-2 border-ink px-3 py-1.5 hover:bg-yellow"
        >
          Sign out
        </button>
      </div>

      <div className="flex overflow-x-auto border-b-2 border-ink">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-mono text-xs uppercase tracking-widest whitespace-nowrap border-r-2 border-ink ${
              activeTab === tab.id ? 'bg-yellow' : 'hover:bg-yellow/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-5 md:px-10 py-8 max-w-2xl">
        {activeTab === 'hero' && <HeroEditor />}
        {activeTab === 'about' && <AboutEditor />}
        {activeTab === 'skills' && <SkillsEditor />}
        {activeTab === 'projects' && <ProjectsEditor />}
        {activeTab === 'writing' && <WritingEditor />}
        {activeTab === 'contact' && <ContactEditor />}
      </div>
    </div>
  )
}
