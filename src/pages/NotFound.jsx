import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="max-w-2xl mx-auto px-5 py-24">
      <p className="font-mono text-blue mb-4">404</p>
      <h1 className="font-display text-4xl mb-6">Page not found</h1>
      <p className="mb-8">This page is unavailable or has not been published.</p>
      <Link className="underline text-blue" to="/">Back to BeepeeLabs</Link>
    </main>
  )
}
