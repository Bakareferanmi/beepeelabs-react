import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send } from 'lucide-react'

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.446-2.136 2.94v5.666H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.554V9h3.565v11.452z" />
    </svg>
  )
}

function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

const CONTACT = {
  eyebrow: '05 / Contact',
  heading: "Let's build\nsomething.",
  body: 'Open to software engineering contracts, technical writing gigs, SEO projects, and long-term collaborations. I work with clients globally — remotely or in Lagos — and invoice in USD.',
  links: [
    { Icon: Mail, label: 'Email', value: 'hello@beepeelabs.com', href: 'mailto:hello@beepeelabs.com' },
    { Icon: XIcon, label: 'X', value: 'x.com/bakarepheranmi', href: 'https://x.com/bakarepheranmi' },
    { Icon: GithubIcon, label: 'GitHub', value: 'github.com/Bakareferanmi', href: 'https://github.com/Bakareferanmi' },
    { Icon: LinkedinIcon, label: 'LinkedIn', value: 'linkedin.com/in/bakare-feranmi-313357139', href: 'https://www.linkedin.com/in/bakare-feranmi-313357139' },
  ],
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', project: '' })
  const [status, setStatus] = useState('idle')

  const handleSend = async () => {
    if (!form.name || !form.email || !form.project) return
    setStatus('sending')
    try {
      const res = await fetch('https://formspree.io/f/mdaqgwno', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('sent')
        setForm({ name: '', email: '', project: '' })
        setTimeout(() => setStatus('idle'), 3500)
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3500)
      }
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3500)
    }
  }

  const buttonLabel = {
    idle: 'Send message',
    sending: 'Sending...',
    sent: 'Message sent',
    error: 'Something went wrong',
  }[status]

  return (
    <section id="contact" className="border-b-2 border-ink px-5 md:px-10 py-16 md:py-24">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="font-mono text-xs uppercase tracking-widest text-blue mb-3">{CONTACT.eyebrow}</div>
          <h2 className="font-display text-4xl md:text-5xl leading-[0.95] mb-6 whitespace-pre-line">
            {CONTACT.heading}
          </h2>
          <p className="text-ink-soft leading-relaxed mb-8 max-w-sm">{CONTACT.body}</p>

          <div className="flex flex-col border-2 border-ink">
            {CONTACT.links.map((l, i) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className={`flex items-center gap-3 px-4 py-3.5 hover:bg-yellow transition-colors ${
                  i !== CONTACT.links.length - 1 ? 'border-b border-ink' : ''
                }`}
              >
                <l.Icon width={16} height={16} className="text-blue shrink-0" />
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted w-16 shrink-0">
                  {l.label}
                </span>
                <span className="font-mono text-sm truncate min-w-0 flex-1">{l.value}</span>
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="border-2 border-ink p-6 md:p-7 self-start"
        >
          <div className="flex flex-col gap-5">
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">Name</span>
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border-2 border-ink bg-paper px-3 py-2.5 font-body text-sm focus:outline-none focus:bg-yellow/20"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">Email</span>
              <input
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border-2 border-ink bg-paper px-3 py-2.5 font-body text-sm focus:outline-none focus:bg-yellow/20"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">
                What are you building?
              </span>
              <textarea
                rows={4}
                placeholder="Tell me about your project..."
                value={form.project}
                onChange={(e) => setForm({ ...form, project: e.target.value })}
                className="border-2 border-ink bg-paper px-3 py-2.5 font-body text-sm resize-none focus:outline-none focus:bg-yellow/20"
              />
            </label>
            <motion.button
              onClick={handleSend}
              disabled={status === 'sending'}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-ink text-paper font-mono text-sm uppercase tracking-wider hover:bg-blue transition-colors disabled:opacity-60"
            >
              {buttonLabel}
              <Send size={15} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
