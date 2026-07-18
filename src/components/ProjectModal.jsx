import { AnimatePresence, motion } from 'framer-motion'
import { X, ArrowUpRight } from 'lucide-react'
import { PROJECTS } from '../data/projects'

export default function ProjectModal({ projectId, onClose }) {
  const project = PROJECTS.find((p) => p.id === projectId)

  return (
    <AnimatePresence>
      {project && (
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
            className="w-full md:max-w-lg max-h-[88vh] overflow-y-auto bg-paper border-2 border-ink relative"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center border-2 border-ink bg-paper hover:bg-yellow"
            >
              <X size={16} />
            </button>

            <div className="p-6 md:p-8">
              <div className="font-mono text-xs uppercase tracking-widest text-blue mb-2">{project.type}</div>
              <h3 className="font-display text-3xl md:text-4xl mb-4">{project.name}</h3>
              <p className="text-ink-soft leading-relaxed mb-6">{project.summary}</p>

              <div className="font-mono text-[0.65rem] uppercase tracking-widest text-muted mb-2">
                Key features
              </div>
              <ul className="space-y-2 mb-6">
                {project.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm text-ink-soft leading-relaxed">
                    <span className="text-yellow-deep shrink-0 mt-0.5">&#9632;</span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1.5 mb-7">
                {project.stack.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[0.65rem] uppercase tracking-wide px-2 py-1 border border-ink text-ink-soft"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-ink text-paper font-mono text-sm uppercase tracking-wider hover:bg-blue transition-colors"
                >
                  Visit project <ArrowUpRight size={15} />
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 px-5 py-3 border-2 border-ink font-mono text-sm uppercase tracking-wider text-muted">
                  Coming soon
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
