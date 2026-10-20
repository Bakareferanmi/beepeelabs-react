import { doc, setDoc, increment } from 'firebase/firestore'
import { db } from '../firebase'
import { leadEvent } from './enquiries.js'

export async function trackPageView(path) {
  const cleanPath = path === '/' ? 'home' : path.replace(/^\/|\/$/g, '').replace(/\//g, '_')
  try {
    await setDoc(
      doc(db, 'analytics', cleanPath),
      {
        path,
        count: increment(1),
        lastVisited: new Date().toISOString(),
      },
      { merge: true }
    )
  } catch (err) {
    console.error('Analytics tracking failed:', err)
  }
}

export async function trackLeadEvent(event, source) {
  if (!import.meta.env.PROD || typeof window === 'undefined') return
  const entry = leadEvent(event, source, window.location.pathname)
  if (!entry) return
  try {
    await setDoc(doc(db, 'analytics', entry.id), {
      ...entry.data,
      count: increment(1),
      lastVisited: new Date().toISOString(),
    }, { merge: true })
  } catch (err) {
    console.error('Contact action tracking failed:', err)
  }
}
