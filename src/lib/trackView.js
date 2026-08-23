import { doc, setDoc, increment } from 'firebase/firestore'
import { db } from '../firebase'

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
