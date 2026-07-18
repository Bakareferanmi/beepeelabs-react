import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { BLOG_POSTS } from '../data/blogPosts'

const reveal = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.2, 0.6, 0.2, 1] } },
}

export default function Writing({ onOpen }) {
  return (
    <section id="writing" className="border-b-2 border-ink px-5 md:px-10 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <div className="font-mono text-xs uppercase tracking-widest text-blue mb-3">04 / Writing</div>
        <h2 className="font-display text-4xl md:text-5xl mb-3">Articles and documentation</h2>
        <p className="text-ink-soft max-w-md mb-10 md:mb-14">
          Technical writing, SEO content, and developer guides.
        </p>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="flex flex-col border-2 border-ink"
        >
          {BLOG_POSTS.map((post, i) => (
            <motion.button
              key={post.id}
              variants={reveal}
              onClick={() => onOpen(post.id)}
              className={`text-left flex items-center justify-between gap-6 px-5 md:px-6 py-6 hover:bg-yellow transition-colors ${
                i !== BLOG_POSTS.length - 1 ? 'border-b-2 border-ink' : ''
              }`}
            >
              <div>
                <div className="font-mono text-[0.65rem] uppercase tracking-widest text-blue mb-2">
                  {post.meta}
                </div>
                <div className="font-display text-xl md:text-2xl mb-1.5 leading-tight">{post.title}</div>
                <p className="text-sm text-ink-soft leading-relaxed max-w-xl">{post.excerpt}</p>
              </div>
              <ArrowRight size={20} className="shrink-0" />
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
