import { lazy, Suspense } from 'react'
import LoadingScreen from '../components/LoadingScreen.jsx'

const AdminApp = lazy(() => import('./AdminApp.jsx'))

export default function LazyAdmin() {
  return <Suspense fallback={<LoadingScreen />}><AdminApp /></Suspense>
}
