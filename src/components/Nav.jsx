import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#writing', label: 'Writing' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLink = (e, href) => {
    e.preventDefault()
    setOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className={`sticky top-0 z-50 flex items-center justify-between px-5 md:px-10 h-16 border-b-2 border-ink transition-colors duration-200 ${
        scrolled ? 'bg-ink' : 'bg-paper'
      }`}
    >
      <a
        href="#home"
        onClick={(e) => handleLink(e, '#home')}
        className="flex items-center gap-2.5"
      >
        <span
          className={`font-display text-lg tracking-wide ${
            scrolled ? 'text-paper' : 'text-ink'
          }`}
        >
          BeepeeLabs
        </span>
      </a>

      <ul className="hidden md:flex items-center gap-8">
        {LINKS.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              onClick={(e) => handleLink(e, l.href)}
              className={`font-mono text-xs uppercase tracking-wider hover:text-blue transition-colors ${
                scrolled ? 'text-paper' : 'text-ink-soft'
              }`}
            >
              {l.label}
            </a>
          </li>
        ))}
        <li>
          <a
            href="#contact"
            onClick={(e) => handleLink(e, '#contact')}
            className="font-mono text-xs uppercase tracking-wider px-4 py-2 border-2 border-ink bg-yellow text-ink hover:bg-blue hover:text-paper hover:border-blue transition-colors"
          >
            Hire me
          </a>
        </li>
      </ul>

      <button
        className={`md:hidden ${scrolled ? 'text-paper' : 'text-ink'}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="absolute top-16 left-0 right-0 bg-ink border-b-2 border-ink flex flex-col md:hidden"
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleLink(e, l.href)}
              className="font-mono text-sm uppercase tracking-wider text-paper px-6 py-4 border-b border-ink-soft"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleLink(e, '#contact')}
            className="font-mono text-sm uppercase tracking-wider text-ink bg-yellow px-6 py-4"
          >
            Hire me
          </a>
        </motion.div>
      )}
    </nav>
  )
}
