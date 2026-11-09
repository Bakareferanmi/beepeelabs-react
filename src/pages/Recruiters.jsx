import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Download, Mail, MapPin, Smartphone, Layers3, Code2, BriefcaseBusiness } from 'lucide-react'
import { GithubIcon as Github } from '../components/SocialIcons'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const work = [
  { name: 'Damiland CBT', type: 'Web applications', tag: 'Production system', stack: 'React · TypeScript · Hono · Cloudflare Workers · D1', description: 'A computer-based examination platform built for a secondary school. Timed exams, randomised questions, automated scoring, live monitoring, printable records and result management.', contribution: 'Built and supported a real examination workflow, including production debugging and database optimisation.', github: 'https://github.com/Bakareferanmi/damilandcbt', site: 'https://damilandcbt.com' },
  { name: 'Pentreeform', type: 'Backend & infrastructure', tag: 'SaaS product', stack: 'Cloudflare Workers · Webhooks · Resend · Authentication', description: 'A hosted form backend with user accounts, email verification, submission inboxes, webhook delivery and an administration workspace.', contribution: 'Worked across product architecture, form submission APIs, authentication, email delivery and deployment.', github: 'https://github.com/Bakareferanmi/pentreeform' },
  { name: 'RideWithMe', type: 'Mobile applications', tag: 'Cross-platform', stack: 'React Native · Expo Router · TypeScript · Next.js', description: 'A vehicle marketplace prototype for buying, renting, leasing and auctions, with mobile, customer web and admin applications in a shared monorepo.', contribution: 'Organised cross-platform interfaces, shared tokens, data models and API client structure. Uses sample data until backend integration.', github: 'https://github.com/Bakareferanmi/ridewithme' },
  { name: 'PerTrack', type: 'Mobile applications', tag: 'Offline-first', stack: 'React Native · Expo · TypeScript · AsyncStorage', description: 'A teacher timetable and period-reminder app, paired with a PWA. Scheduled local notifications and device-based data storage work without an account.', contribution: 'Developed mobile reminder scheduling, local persistence and a companion web experience.', github: 'https://github.com/Bakareferanmi/pertrack' },
  { name: 'Brokoto', type: 'Mobile applications', tag: 'Mobile UI', stack: 'React Native · Expo · React Navigation · JavaScript', description: 'A food-ordering mobile app featuring dish discovery, cart state, order screens, custom tabs and lazy-loaded screens.', contribution: 'Built mobile navigation and screen flows with reusable UI, context-based state and loading states.', github: 'https://github.com/Bakareferanmi/brokoto' },
  { name: 'VeriDoc', type: 'Web applications', tag: 'Trust workflows', stack: 'React · Cloudflare Workers · D1', description: 'A verification platform exploring identity, institution and credential trust workflows, role-based workspaces and verifiable public records.', contribution: 'Developed product flows and cloud-backed platform foundations. Still evolving.', github: 'https://github.com/Bakareferanmi/Veridoc' },
  { name: 'Deegeetal Thesis', type: 'Web applications', tag: 'Education tools', stack: 'React · File uploads · Admin workflows', description: 'A thesis submission system for students, with structured entries, document uploads, admin review and export.', contribution: 'Designed and built the submission workflow and administration interface.', github: 'https://github.com/Bakareferanmi/deegeetalthesis' },
]
const filters = ['All work', 'Web applications', 'Mobile applications', 'Backend & infrastructure']
const skills = [
  ['Frontend', 'React, Next.js, JavaScript, TypeScript, HTML, CSS, Tailwind CSS'],
  ['Mobile', 'React Native, Expo, Expo Router, React Navigation, device storage and notifications'],
  ['Backend & cloud', 'Hono, REST APIs, Express.js, Node.js, PostgreSQL, Hono, REST APIs, Cloudflare Workers, D1, authentication, webhooks, Vercel'],
  ['Tools & other', 'Git, GitHub, Excel, technical writing, troubleshooting, Python fundamentals'],
]
const roleGroups = [
  { title: 'Software engineering', note: 'Primary focus', roles: ['Frontend Developer', 'React / Next.js Developer', 'React Native Developer', 'Mobile App Developer', 'Junior Full-Stack Developer', 'Junior Backend / API Developer'] },
  { title: 'IT & technical operations', note: 'Related opportunities', roles: ['IT Support Specialist', 'Application Support Analyst', 'Technical Support Engineer', 'Junior QA / Software Tester', 'Technical Operations Associate'] },
  { title: 'Content & digital products', note: 'Additional strengths', roles: ['Technical Writer', 'Developer Documentation Writer', 'Digital Marketing Specialist', 'Web Content / SEO Specialist'] },
  { title: 'Data & analytics', note: 'Entry-level, developing skills', roles: ['Data Analyst Intern', 'Junior Reporting / Excel Analyst'] },
]
const email = 'bakareferanmi96@gmail.com'

function External({ href, children, className = '' }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}<ArrowUpRight size={15} aria-hidden="true" /></a>
}

export default function Recruiters({ onOpenPrivacy }) {
  const [filter, setFilter] = useState('All work')
  const reduced = useReducedMotion()
  const reveal = (delay = 0) => reduced ? {} : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.12 }, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } }
  const shown = filter === 'All work' ? work : work.filter((item) => item.type === filter)
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav />
      <main id="main">
        <section className="border-b-2 border-ink px-5 md:px-10 pt-14 pb-16 md:pt-20 md:pb-24">
          <div className="max-w-7xl mx-auto">
            <motion.div {...reveal()} className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wider mb-10">
              <span className="inline-flex gap-2 items-center border border-ink px-3 py-2"><span className="h-2 w-2 rounded-full bg-green" /> Open to opportunities</span>
              <span className="inline-flex gap-1 items-center text-muted"><MapPin size={14} /> Lagos, Nigeria · Remote / Hybrid / On-site</span>
            </motion.div>
            <motion.p {...reveal(0.07)} className="font-mono text-xs uppercase tracking-[.25em] text-blue mb-4">Bakare Oluwaferanmi Pelumi · Engineering portfolio</motion.p>
            <motion.h1 {...reveal(0.14)} className="font-display text-[clamp(3.2rem,9vw,8.5rem)] leading-[.94] max-w-6xl">Building for web, mobile &amp; real people.</motion.h1>
            <motion.div {...reveal(0.21)} className="grid lg:grid-cols-2 gap-8 lg:gap-20 mt-9 items-end">
              <p className="text-lg md:text-xl leading-relaxed text-ink-soft max-w-2xl">I'm a software developer with hands-on experience building web applications, React Native mobile apps and cloud-backed tools. I work across interfaces, APIs, databases, deployment and product improvement.</p>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <a href="/Bakare_Oluwaferanmi_Software_Developer_CV.pdf" download="Bakare_Oluwaferanmi_Software_Developer_CV.pdf" className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-3 font-mono text-xs uppercase hover:bg-blue transition-colors"><Download size={16} /> Download CV</a>
                <External href="https://github.com/Bakareferanmi" className="inline-flex items-center gap-2 border-2 border-ink px-5 py-3 font-mono text-xs uppercase hover:bg-yellow transition-colors"><Github size={16} /> GitHub</External>
                <a href={'mailto:' + email + '?subject=Job%20Opportunity'} className="inline-flex items-center gap-2 border-2 border-ink px-5 py-3 font-mono text-xs uppercase hover:bg-yellow transition-colors"><Mail size={16} /> Email me</a>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-5 md:px-10 py-12 md:py-16 border-b-2 border-ink bg-yellow">
          <div className="max-w-7xl mx-auto">
            <motion.div {...reveal()} className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-3"><BriefcaseBusiness size={20} aria-hidden="true" /><p className="font-mono text-xs uppercase tracking-widest">Career interests</p></div>
                <h2 className="font-display text-4xl md:text-5xl">Roles I'm exploring</h2>
              </div>
              <p className="text-sm md:text-base text-ink-soft max-w-md">My strongest focus is web and mobile software development. I'm also open to adjacent technical and communication roles.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-3">
              {roleGroups.map((group, index) => (
                <motion.div key={group.title} {...reveal(Math.min(index, 3) * 0.07)} className="bg-paper border-2 border-ink p-5 md:p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
                    <h3 className="font-display text-xl md:text-2xl">{group.title}</h3>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-blue">{group.note}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.roles.map((role) => <span key={role} className="border border-ink/40 px-3 py-2 font-mono text-[11px] md:text-xs leading-snug">{role}</span>)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="selected-work" className="px-5 md:px-10 py-16 md:py-24 border-b-2 border-ink">
          <div className="max-w-7xl mx-auto">
            <motion.div {...reveal()} className="flex flex-wrap gap-6 items-end justify-between mb-8">
              <div><p className="font-mono text-blue text-xs uppercase tracking-widest mb-3">01 / Proof of work</p><h2 className="font-display text-5xl md:text-7xl">Selected projects</h2></div>
              <p className="max-w-sm text-ink-soft">A mix of real deployments, independent tools and developing products. Each repository shows the implementation.</p>
            </motion.div>
            <motion.div {...reveal(0.05)} className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter projects">
              {filters.map((f) => <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)} className={'px-4 py-2 border-2 border-ink font-mono text-xs transition-colors ' + (filter === f ? 'bg-ink text-paper' : 'hover:bg-yellow')}>{f}</button>)}
            </motion.div>
            <motion.div layout={!reduced} className="grid md:grid-cols-2 gap-4">
              <AnimatePresence initial={false} mode="popLayout">
              {shown.map((item, index) => (
                <motion.article key={item.name} layout={!reduced} {...(reduced ? {} : { initial: { opacity: 0, y: 18, scale: 0.99 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -9, scale: 0.99 }, whileHover: { y: -4 }, transition: { duration: 0.4, delay: Math.min(index, 5) * 0.055 } })} className="border-2 border-ink p-6 md:p-8 bg-paper hover:bg-paper-dim transition-colors flex flex-col min-h-[320px]">
                  <div className="flex justify-between gap-4 items-start mb-7"><span className="font-mono text-xs text-blue uppercase tracking-wider">{item.type}</span><span className="font-mono text-xs border border-ink px-2 py-1">{item.tag}</span></div>
                  <h3 className="font-display text-3xl md:text-4xl mb-3">{item.name}</h3>
                  <p className="leading-relaxed text-ink-soft mb-4">{item.description}</p>
                  <p className="text-sm mb-5"><strong className="text-ink">My contribution:</strong> {item.contribution}</p>
                  <div className="mt-auto pt-4 border-t border-ink/25">
                    <p className="font-mono text-[11px] text-muted mb-4">{item.stack}</p>
                    <div className="flex gap-4 flex-wrap">
                      <External href={item.github} className="inline-flex items-center gap-1 font-mono text-xs font-bold underline underline-offset-4 hover:text-blue">Source code</External>
                      {item.site && <External href={item.site} className="inline-flex items-center gap-1 font-mono text-xs font-bold underline underline-offset-4 hover:text-blue">Live project</External>}
                    </div>
                  </div>
                </motion.article>
              ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        <section className="grid lg:grid-cols-2 border-b-2 border-ink">
          <div className="px-5 md:px-10 py-16 md:py-20 lg:border-r-2 border-ink">
            <motion.div {...reveal()} className="max-w-xl ml-auto"><p className="font-mono text-blue text-xs uppercase tracking-widest mb-3">02 / Capabilities</p><h2 className="font-display text-5xl md:text-6xl mb-8">Skills &amp; tools</h2>
              {skills.map(([heading, detail], i) => <motion.div key={heading} {...reveal(i * 0.06)} className="border-t border-ink/30 py-5"><h3 className="font-mono text-xs uppercase tracking-wider text-blue mb-2">{heading}</h3><p className="leading-relaxed">{detail}</p></motion.div>)}
            </motion.div>
          </div>
          <div className="px-5 md:px-10 py-16 md:py-20 bg-paper-dim">
            <motion.div {...reveal(0.1)} className="max-w-xl"><p className="font-mono text-blue text-xs uppercase tracking-widest mb-3">03 / Background</p><h2 className="font-display text-5xl md:text-6xl mb-8">Where I come from</h2>
              <p className="text-lg leading-relaxed mb-8">I hold a B.Eng. in Electrical &amp; Electronics Engineering from Olabisi Onabanjo University (2023). My work combines software projects with technical communication, digital operations and hands-on troubleshooting.</p>
              <div className="space-y-6">
                <div className="flex gap-4"><Code2 className="shrink-0 text-blue" /><div><h3 className="font-semibold">Independent software projects · BeepeeLabs</h3><p className="text-sm text-ink-soft mt-1">Developed products for education, form handling, mobile workflows and web experiences.</p></div></div>
                <div className="flex gap-4"><Layers3 className="shrink-0 text-blue" /><div><h3 className="font-semibold">Public Health Office · NYSC placement</h3><p className="text-sm text-ink-soft mt-1">Supported administrative and operational work at Ukwa East LGI Public Health Office.</p></div></div>
                <div className="flex gap-4"><Smartphone className="shrink-0 text-blue" /><div><h3 className="font-semibold">Digital content &amp; communication</h3><p className="text-sm text-ink-soft mt-1">Experience in content writing, copywriting, social media and digital design.</p></div></div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="contact-recruiter" className="bg-ink text-paper px-5 md:px-10 py-16 md:py-24">
          <motion.div {...reveal()} className="max-w-7xl mx-auto">
            <p className="font-mono text-yellow text-xs uppercase tracking-widest mb-4">04 / Let's talk</p>
            <h2 className="font-display text-5xl md:text-8xl max-w-4xl leading-[1.02] mb-8">Have a role in mind? Let's talk.</h2>
            <p className="max-w-2xl text-lg text-paper/80 mb-8">I'm interested in teams where I can contribute, learn and build reliable software. Send me the role details, or ask for the CV that best fits your opening.</p>
            <div className="flex flex-wrap gap-3">
              <a className="inline-flex gap-2 items-center bg-yellow text-ink px-5 py-3 font-mono text-sm hover:bg-paper transition-colors" href={'mailto:' + email + '?subject=Job%20Opportunity'}><Mail size={16} /> Email me</a>
              <a className="inline-flex gap-2 items-center border border-paper px-5 py-3 font-mono text-sm hover:bg-paper hover:text-ink transition-colors" href="/Bakare_Oluwaferanmi_Software_Developer_CV.pdf" download="Bakare_Oluwaferanmi_Software_Developer_CV.pdf"><Download size={16} /> Download CV</a>
              <External className="inline-flex gap-2 items-center border border-paper px-5 py-3 font-mono text-sm hover:bg-paper hover:text-ink transition-colors" href="https://github.com/Bakareferanmi"><Github size={16} /> GitHub</External>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer onOpenPrivacy={onOpenPrivacy} />
    </div>
  )
}
