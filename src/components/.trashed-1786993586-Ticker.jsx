import { motion } from 'framer-motion'

const ITEMS = [
  'SOFTWARE ENGINEER',
  'TECHNICAL WRITER',
  'SEO STRATEGIST',
  'LAGOS, NIGERIA',
]

export default function Ticker() {
  const strip = [...ITEMS, ...ITEMS, ...ITEMS]

  return (
    <div className="relative overflow-hidden bg-ink border-b-2 border-ink py-2.5">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ['0%', '-33.3333%'] }}
        transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
      >
        {strip.map((item, i) => (
          <span
            key={i}
            className="font-mono text-xs md:text-sm tracking-widest text-yellow px-4 flex items-center gap-4"
          >
            {item}
            <span className="text-blue">&bull;</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
