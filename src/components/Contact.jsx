import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, MessageCircle } from 'lucide-react'
import EnquiryLink from './EnquiryLink'
import { trackLeadEvent } from '../lib/trackView.js'
import { CONTACT_FORM_ENDPOINT, submitEnquiry } from '../lib/submitEnquiry.js'

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
  heading: 'Tell me what\nyour business needs.',
  body: 'Need a new website, an online store or improvements to an existing product? Share what you need and we can agree the right scope. You can also ask about mobile apps, technical writing and SEO.',
  links: [
    { Icon: XIcon, label: 'X', value: 'x.com/bakarepheranmi', href: 'https://x.com/bakarepheranmi' },
    { Icon: GithubIcon, label: 'GitHub', value: 'github.com/Bakareferanmi', href: 'https://github.com/Bakareferanmi' },
    { Icon: LinkedinIcon, label: 'LinkedIn', value: 'linkedin.com/in/bakare-feranmi-313357139', href: 'https://www.linkedin.com/in/bakare-feranmi-313357139' },
  ],
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', project: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const handleSend = async (event) => {
    event.preventDefault()
    if (status === 'sending') return
    setError('')
    setStatus('sending')
    try {
      await submitEnquiry(form)
      void trackLeadEvent('form_accepted', 'contact')
      setStatus('sent')
      setForm({ name: '', email: '', project: '' })
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Please try again, or reach me on WhatsApp or email.')
    }
  }

  const buttonLabel = {
    idle: 'Send message',
    sending: 'Sending...',
    sent: 'Message submitted',
    error: 'Try again',
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

          <div className="flex flex-col items-start gap-4 mb-8">
            <EnquiryLink source="contact" context="a project for my business" className="inline-flex items-center gap-2 px-5 py-3 bg-yellow border-2 border-ink font-mono text-xs uppercase hover:bg-blue hover:text-paper transition-colors"><MessageCircle size={18} /> Chat on WhatsApp</EnquiryLink>
            <EnquiryLink channel="email" source="contact" context="a project for my business" className="inline-flex items-center gap-2 text-sm text-blue underline"><Mail size={16} /> bakareferanmi96@gmail.com</EnquiryLink>
          </div>

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

        <motion.form
          action={CONTACT_FORM_ENDPOINT}
          method="POST"
          onSubmit={handleSend}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="border-2 border-ink p-6 md:p-7 self-start"
        >
          <h3 className="font-display text-2xl mb-3">Request a project quote</h3>
          <p className="text-sm text-ink-soft leading-relaxed mb-6">Tell me about your business, what you need and your preferred timeline. A current website or example link helps too.</p>
          <div className="flex flex-col gap-5">
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">Name</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                required
                maxLength={120}
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
                name="email"
                autoComplete="email"
                required
                maxLength={254}
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
                name="project"
                required
                maxLength={5000}
                placeholder="What does your business do, and what would you like to build or improve?"
                value={form.project}
                onChange={(e) => setForm({ ...form, project: e.target.value })}
                className="border-2 border-ink bg-paper px-3 py-2.5 font-body text-sm resize-none focus:outline-none focus:bg-yellow/20"
              />
            </label>
            <motion.button
              type="submit"
              disabled={status === 'sending'}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-ink text-paper font-mono text-sm uppercase tracking-wider hover:bg-blue transition-colors disabled:opacity-60"
            >
              {buttonLabel}
              <Send size={15} />
            </motion.button>
            {status === 'sent' && <p role="status" className="text-sm text-green">Your message has been submitted. You can also reach me using the WhatsApp or email links.</p>}
            {status === 'error' && <p role="alert" className="text-sm text-red-700">{error}</p>}
            <p className="text-xs text-muted leading-relaxed">Your details are used to reply to your enquiry. The form is processed by Formspree.</p>
          </div>
        </motion.form>
      </div>
    </section>
  )
}
