import { motion } from 'framer-motion'

export default function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-paper flex flex-col items-center justify-center gap-6"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.6, 0.2, 1] }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-12 h-28 bg-ink border-2 border-ink rounded-sm flex flex-col items-center justify-between py-3 gap-2">
          <motion.span
            className="w-5 h-5 rounded-full bg-[#E23D28]"
            animate={{ opacity: [1, 0.15, 0.15] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.span
            className="w-5 h-5 rounded-full bg-yellow"
            animate={{ opacity: [0.15, 1, 0.15] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.span
            className="w-5 h-5 rounded-full bg-green"
            animate={{ opacity: [0.15, 0.15, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      <span className="font-mono text-xs uppercase tracking-widest text-ink-soft">
        Loading BeepeeLabs
      </span>
    </motion.div>
  )
}
