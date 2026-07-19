import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'
import AdminLogin from './AdminLogin'

export default function AdminApp() {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)

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
      <div className="px-5 md:px-10 py-10">
        <p className="text-ink-soft">Dashboard sections coming next.</p>
      </div>
    </div>
  )
}
