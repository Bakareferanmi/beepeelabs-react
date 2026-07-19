import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.6, 0.2, 1] } },
}

function SkeletonCard() {
  return (
    <div className="border-2 border-ink bg-paper animate-pulse">
      <div className="aspect-[16/10] w-full border-b-2 border-ink bg-ink/10" />
      <div className="p-6 flex flex-col gap-3">
        <div className="h-3 w-20 bg-ink/10" />
        <div className="h-6 w-2/3 bg-ink/10" />
        <div className="h-4 w-full bg-ink/10" />
        <div className="h-4 w-4/5 bg-ink/10" />
      </div>
    </div>
  )
}

export default function Projects({ projects, loading, onOpen }) {
  return (
    <section id="projects" className="border-b-2 border-ink px-5 md:px-10 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-10 md:mb-14 gap-4 flex-wrap">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-blue mb-3">03 / Projects</div>
            <h2 className="font-display text-4xl md:text-5xl mb-3">Things I have shipped</h2>
            <p className="text-ink-soft max-w-md">A selection of products I have designed and built, end to end.</p>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-5">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="grid md:grid-cols-2 gap-5"
          >
            {projects.map((p, i) => (
              <motion.button
                key={p.id}
                variants={reveal}
                onClick={() => onOpen(p.id)}
                whileHover={{ y: -6, rotate: -0.5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="ticket-edge text-left border-2 border-ink bg-paper hover:bg-yellow group relative overflow-hidden transition-shadow duration-300 hover:shadow-[6px_6px_0_#FFC22E]"
              >
                <div className="aspect-[16/10] w-full border-b-2 border-ink bg-ink-soft relative overflow-hidden flex items-center justify-center">
                  <span className="font-display text-6xl text-paper/25 select-none">{p.initials}</span>
                  <span className="absolute top-2.5 left-2.5 font-mono text-[0.6rem] uppercase tracking-widest text-paper/60">
                    Preview
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs uppercase tracking-widest text-blue">
                      RT-{String(i + 1).padStart(2, '0')} &middot; {p.type}
                    </span>
                    <ArrowUpRight
                      size={18}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                  <div className="font-display text-2xl mb-2">{p.name}</div>
                  <p className="text-sm text-ink-soft leading-relaxed mb-4">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.stack.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[0.65rem] uppercase tracking-wide px-2 py-1 border border-ink text-ink-soft"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
