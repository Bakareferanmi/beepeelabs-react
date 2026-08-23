import { useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function BlogPost({ posts, loading }) {
  const { id } = useParams()
  const post = posts.find((p) => p.id === id)

  useEffect(() => {
    if (post) document.title = `${post.title} — BeepeeLabs`
    return () => { document.title = 'BeepeeLabs' }
  }, [post])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-xs uppercase tracking-widest text-muted">Loading...</div>
      </div>
    )
  }

  if (!post) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0.6, 0.2, 1] }}
        className="flex-1 px-5 md:px-10 py-16 md:py-24"
      >
        <div className="max-w-2xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-blue hover:underline mb-10"
          >
            <ArrowLeft size={14} /> Back to writing
          </Link>

          <div className="font-mono text-xs uppercase tracking-widest text-blue mb-2">{post.meta}</div>
          <h1 className="font-display text-3xl md:text-4xl leading-tight mb-8">{post.title}</h1>

          <div className="space-y-4">
            {post.body.map((p, i) => (
              <p key={i} className="text-sm md:text-base text-ink-soft leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </div>
      </motion.main>
      <Footer />
    </div>
  )
}
