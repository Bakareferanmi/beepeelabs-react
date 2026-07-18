import { motion } from 'framer-motion'

export default function TrafficLight() {
  return (
    <motion.div
      className="fixed bottom-6 left-5 z-40"
      animate={{ y: [0, -6, 0], rotate: [0, -2, 0, 2, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="w-9 h-20 md:w-10 md:h-24 bg-ink border-2 border-ink rounded-sm flex flex-col items-center justify-between py-2.5 gap-1.5 shadow-[4px_4px_0_rgba(20,18,14,0.2)]">
        <motion.span
          className="w-4 h-4 md:w-4.5 md:h-4.5 rounded-full bg-[#E23D28]"
          animate={{ opacity: [1, 0.15, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="w-4 h-4 md:w-4.5 md:h-4.5 rounded-full bg-yellow"
          animate={{ opacity: [0.15, 1, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="w-4 h-4 md:w-4.5 md:h-4.5 rounded-full bg-green"
          animate={{ opacity: [0.15, 0.15, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  )
}


