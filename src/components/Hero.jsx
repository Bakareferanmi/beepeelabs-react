import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import avatarFront from '../assets/avatar-front.jpg'
import avatarBack from '../assets/avatar-back.jpg'

const headlineWords = ['I', 'build', 'interfaces', 'that', 'actually', 'work']

export default function Hero() {
  const [flipped, setFlipped] = useState(false)

  return (
    <section id="home" className="border-b-2 border-ink px-5 md:px-10 pt-14 pb-16 md:pt-20 md:pb-24">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            onClick={() => setFlipped((f) => !f)}
            className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 border-2 border-ink [perspective:800px]"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            aria-label="Flip avatar"
          >
            <motion.div
              className="w-full h-full [transform-style:preserve-3d]"
              animate={{
                rotateY: flipped ? 180 : 0,
                filter: flipped
                  ? 'drop-shadow(-6px 6px 0 rgba(20,18,14,0.25))'
                  : 'drop-shadow(6px 6px 0 rgba(20,18,14,0.25))',
              }}
              transition={{ duration: 0.6, ease: [0.2, 0.6, 0.2, 1] }}
            >
              <img
                src={avatarFront}
                alt="Bakare Oluwaferanmi"
                className="absolute inset-0 w-full h-full object-cover [backface-visibility:hidden]"
              />
              <img
                src={avatarBack}
                alt="Alter ego"
                className="absolute inset-0 w-full h-full object-cover [backface-visibility:hidden]"
                style={{ transform: 'rotateY(180deg)' }}
              />
            </motion.div>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest border-2 border-ink px-3 py-1.5 bg-yellow"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            Available for work
          </motion.div>
        </div>

        <h1 className="font-display text-[13vw] leading-[0.92] md:text-[6.2rem] md:leading-[0.9] mb-8 max-w-4xl">
          {headlineWords.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.22em]"
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.55, ease: [0.2, 0.6, 0.2, 1] }}
              style={{ display: 'inline-block' }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-lg md:text-xl text-ink-soft max-w-xl mb-9 leading-relaxed"
        >
          Software engineer, technical writer, and SEO strategist. I turn complex
          problems into clean, performant web products. Based in Lagos — available
          remotely.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.5 }}
          className="flex flex-wrap items-center gap-3"
        >
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="group inline-flex items-center gap-2 px-6 py-3.5 bg-ink text-paper font-mono text-sm uppercase tracking-wider border-2 border-ink hover:bg-blue hover:border-blue transition-colors"
          >
            View my work
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="group inline-flex items-center gap-2 px-6 py-3.5 font-mono text-sm uppercase tracking-wider border-2 border-ink hover:text-blue hover:border-blue transition-colors"
          >
            Get in touch
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
