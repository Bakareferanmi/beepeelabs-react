import { motion } from 'framer-motion'
import { Code2, Database, Search, FileText, PenTool, Megaphone } from 'lucide-react'

const SKILLS = [
  {
    icon: Code2,
    name: 'Frontend Engineering',
    desc: 'Component-driven UIs, responsive layouts, and accessible, performant interfaces built from the ground up.',
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'Tailwind'],
  },
  {
    icon: Database,
    name: 'Backend Integration',
    desc: 'Connecting frontends to real data. I work with Node.js, Python, Firebase, Supabase, REST APIs, and serverless functions.',
    tags: ['Node.js', 'Python', 'Firebase', 'Supabase', 'REST API', 'Cloudinary'],
  },
  {
    icon: Search,
    name: 'SEO Strategy',
    desc: 'Technical SEO audits, content architecture, on-page optimization, and structured data implementation.',
    tags: ['Technical SEO', 'Schema', 'Core Web Vitals', 'Analytics'],
  },
  {
    icon: FileText,
    name: 'Technical Writing',
    desc: 'Developer docs, how-to guides, product content, and blog posts that rank and actually help people.',
    tags: ['Dev Docs', 'API Guides', 'Content Strategy', 'Markdown'],
  },
  {
    icon: PenTool,
    name: 'UI / Product Design',
    desc: 'Wireframes, design systems, and high-fidelity interfaces. I can design it and build it.',
    tags: ['Figma', 'Design Systems', 'Prototyping'],
  },
  {
    icon: Megaphone,
    name: 'Digital Marketing',
    desc: 'Growth strategy, content marketing, and conversion-focused copy for web products and brands.',
    tags: ['Content Marketing', 'Conversion', 'Brand Strategy'],
  },
]

const reveal = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.2, 0.6, 0.2, 1] } },
}

export default function Skills() {
  return (
    <section id="skills" className="border-b-2 border-ink px-5 md:px-10 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <div className="font-mono text-xs uppercase tracking-widest text-blue mb-3">02 / Skills</div>
        <h2 className="font-display text-4xl md:text-5xl mb-10 md:mb-14">What I work with</h2>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink border-2 border-ink"
        >
          {SKILLS.map((s) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.name}
                variants={reveal}
                whileHover={{ backgroundColor: '#FFC22E' }}
                transition={{ duration: 0.2 }}
                className="bg-paper p-6 flex flex-col gap-3"
              >
                <Icon size={22} strokeWidth={1.5} className="text-blue" />
                <div className="font-display text-lg leading-tight">{s.name}</div>
                <p className="text-sm text-ink-soft leading-relaxed">{s.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[0.65rem] uppercase tracking-wide px-2 py-1 border border-ink text-ink-soft"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
