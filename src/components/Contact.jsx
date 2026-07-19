import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, Send } from 'lucide-react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

const ICON_MAP = { Mail, Github, Linkedin }

const DEFAULT_CONTACT = {
  eyebrow: '05 / Contact',
  heading: "Let's build\nsomething.",
  body: 'Open to software engineering contracts, technical writing gigs, SEO projects, and long-term collaborations. I work with clients globally — remotely or in Lagos — and invoice in USD.',
  links: [
    { icon: 'Mail', label: 'Email', value: 'hello@beepeelabs.com', href: 'mailto:hello@beepeelabs.com' },
    { icon: 'Github', label: 'GitHub', value: 'github.com/Bakareferanmi', href: 'https://github.com/Bakareferanmi' },
    { icon: 'Linkedin', label: 'LinkedIn', value: 'linkedin.com/in/bakare-feranmi-313357139', href: 'https://www.linkedin.com/in/bakare-feranmi-313357139' },
  ],
}

export default function Contact() {
  const [contact, setContact] = useState(DEFAULT_CONTACT)
  const [form, setForm] = useState({ name: '', email: '', project: '' })
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    async function fetchContact() {
      try {
        const snap = await getDoc(doc(db, 'content', 'contact'))
        if (snap.exists()) setContact(snap.data())
      } catch (err) {
        console.error('Failed to load contact content:', err)
      }
    }
    fetchContact()
  }, [])

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
          <div className="font-mono text-xs uppercase tracking-widest text-blue mb-3">{contact.eyebrow}</div>
          <h2 className="font-display text-4xl md:text-5xl leading-[0.95] mb-6 whitespace-pre-line">
            {contact.heading}
          </h2>
          <p className="text-ink-soft leading-relaxed mb-8 max-w-sm">{contact.body}</p>

          <div className="flex flex-col border-2 border-ink">
            {contact.links.map((l, i) => {
              const Icon = ICON_MAP[l.icon] || Mail
              return (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-4 py-3.5 hover:bg-yellow transition-colors ${
                    i !== contact.links.length - 1 ? 'border-b border-ink' : ''
                  }`}
                >
                  <Icon size={16} className="text-blue shrink-0" />
                  <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted w-16 shrink-0">
                    {l.label}
                  </span>
                  <span className="font-mono text-sm truncate min-w-0 flex-1">{l.value}</span>
                </a>
              )
            })}
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
