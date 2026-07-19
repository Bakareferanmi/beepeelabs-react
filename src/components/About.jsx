import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

const DEFAULT_ABOUT = {
  eyebrow: '01 / About',
  heading: 'Engineer by training,\nbuilder by choice',
  paragraphs: [
    'I am **Bakare Oluwaferanmi**, a software engineer who graduated with a B.Eng. in Electrical and Electronics Engineering. I bridge the gap between technical rigor and great user experience.',
    'My work spans UI engineering, SEO architecture, and technical writing. I write code the same way I write documentation: clearly, purposefully, and with the reader in mind.',
    'I founded **BeepeeLabs** as a space to build, publish, and collaborate. Every project here is something I have shipped and stand behind.',
  ],
  stats: [
    { label: 'Base', value: 'Lagos, Nigeria — remote available' },
    { label: 'Status', value: 'Open to freelance & contract work', accent: true },
    { label: 'Degree', value: 'B.Eng. Electrical & Electronics Engineering', sub: 'Olabisi Onabanjo University' },
    { label: 'Portfolio', value: 'beepeethebrand.netlify.app', link: 'https://beepeethebrand.netlify.app' },
  ],
}

function renderBold(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="text-ink">{part}</strong> : part
  )
}

export default function About() {
  const [about, setAbout] = useState(DEFAULT_ABOUT)

  useEffect(() => {
    async function fetchAbout() {
      try {
        const snap = await getDoc(doc(db, 'content', 'about'))
        if (snap.exists()) setAbout(snap.data())
      } catch (err) {
        console.error('Failed to load about content:', err)
      }
    }
    fetchAbout()
  }, [])

  return (
    <section id="about" className="border-b-2 border-ink px-5 md:px-10 py-16 md:py-24">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="font-mono text-xs uppercase tracking-widest text-blue mb-3">{about.eyebrow}</div>
          <h2 className="font-display text-4xl md:text-5xl leading-[0.95] whitespace-pre-line">
            {about.heading}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-4"
        >
          {about.paragraphs.map((p, i) => (
            <p key={i} className="text-ink-soft leading-relaxed">
              {renderBold(p)}
            </p>
          ))}

          <div className="mt-4 grid grid-cols-2 gap-px bg-ink border-2 border-ink">
            {about.stats.map((s) => (
              <div key={s.label} className="bg-paper p-4">
                <div className="font-mono text-[0.65rem] uppercase tracking-widest text-muted mb-1.5">
                  {s.label}
                </div>
                {s.link ? (
                  <a
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm font-medium hover:text-blue transition-colors ${s.accent ? 'text-green' : ''}`}
                  >
                    {s.value}
                  </a>
                ) : (
                  <div className={`text-sm font-medium ${s.accent ? 'text-green' : ''}`}>{s.value}</div>
                )}
                {s.sub && <div className="text-xs text-muted mt-0.5">{s.sub}</div>}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
