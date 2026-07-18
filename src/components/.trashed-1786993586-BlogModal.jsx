import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { BLOG_POSTS } from '../data/blogPosts'

export default function BlogModal({ postId, onClose }) {
  const post = BLOG_POSTS.find((p) => p.id === postId)

  return (
    <AnimatePresence>
      {post && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] bg-ink/60 flex items-end md:items-center justify-center p-0 md:p-6"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: '100%', opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.6 }}
            transition={{ duration: 0.35, ease: [0.2, 0.6, 0.2, 1] }}
            className="w-full md:max-w-xl max-h-[88vh] overflow-y-auto bg-paper border-2 border-ink relative"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center border-2 border-ink bg-paper hover:bg-yellow"
            >
              <X size={16} />
            </button>

            <div className="p-6 md:p-8">
              <div className="font-mono text-xs uppercase tracking-widest text-blue mb-2">{post.meta}</div>
              <h3 className="font-display text-2xl md:text-3xl leading-tight mb-6 pr-10">{post.title}</h3>
              <div className="space-y-4">
                {post.body.map((p, i) => (
                  <p key={i} className="text-sm text-ink-soft leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
