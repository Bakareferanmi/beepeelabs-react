import { motion } from 'framer-motion'

const stats = [
  { label: 'Base', value: 'Lagos, Nigeria — remote available' },
  { label: 'Status', value: 'Open to freelance & contract work', accent: true },
  { label: 'Degree', value: 'B.Eng. Electrical & Electronics Engineering', sub: 'Olabisi Onabanjo University' },
  { label: 'Portfolio', value: 'beepeethebrand.netlify.app', link: 'https://beepeethebrand.netlify.app' },
]

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.6, 0.2, 1] } },
}

export default function About() {
  return (
    <section id="about" className="border-b-2 border-ink px-5 md:px-10 py-16 md:py-24">
      <div className="max-w-5xl mx-auto grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={reveal}
        >
          <div className="font-mono text-xs uppercase tracking-widest text-blue mb-3">01 / About</div>
          <h2 className="font-display text-4xl md:text-5xl leading-[0.95] mb-6">
            Engineer by training,<br />builder by choice
          </h2>
          <div className="space-y-4 text-ink-soft text-[1.05rem] leading-relaxed max-w-md">
            <p>
              I am <strong className="text-ink">Bakare Oluwaferanmi</strong>, a software
              engineer who graduated with a B.Eng. in Electrical and Electronics
              Engineering. I bridge the gap between technical rigor and great user
              experience.
            </p>
            <p>
              My work spans UI engineering, SEO architecture, and technical writing. I
              write code the same way I write documentation: clearly, purposefully, and
              with the reader in mind.
            </p>
            <p>
              I founded <strong className="text-ink">BeepeeLabs</strong> as a space to
              build, publish, and collaborate. Every project here is something I have
              shipped and stand behind.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="flex flex-col border-2 border-ink self-start"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              variants={reveal}
              className={`px-5 py-4 ${i !== stats.length - 1 ? 'border-b-2 border-ink' : ''} ${
                s.accent ? 'bg-yellow' : ''
              }`}
            >
              <div className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-soft mb-1">
                {s.label}
              </div>
              {s.link ? (
                <a
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-blue hover:underline"
                >
                  {s.value}
                </a>
              ) : (
                <div className="font-mono text-sm text-ink">{s.value}</div>
              )}
              {s.sub && <div className="font-mono text-xs text-muted mt-0.5">{s.sub}</div>}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
