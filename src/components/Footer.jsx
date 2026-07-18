import { Mail } from 'lucide-react'
import { XIcon, InstagramIcon, FacebookIcon, GithubIcon } from './SocialIcons'

const SOCIALS = [
  { icon: XIcon, href: 'https://x.com/bakarepheranmi', label: 'X' },
  { icon: InstagramIcon, href: 'https://instagram.com/bakarepheranmi', label: 'Instagram' },
  { icon: FacebookIcon, href: 'https://facebook.com/Bakare.feranmi', label: 'Facebook' },
  { icon: GithubIcon, href: 'https://github.com/beepeelabs', label: 'GitHub' },
  { icon: Mail, href: 'mailto:hello@beepeelabs.com', label: 'Email' },
]

export default function Footer({ onOpenPrivacy }) {
  return (
    <footer className="bg-ink text-paper px-5 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
        <div className="font-mono text-xs text-muted-inverse">&copy; 2026 Bakare Oluwaferanmi. All rights reserved.</div>
        <button
          onClick={onOpenPrivacy}
          className="font-mono text-xs text-muted-inverse hover:text-yellow underline underline-offset-2 transition-colors"
        >
          Privacy Policy
        </button>
      </div>
      <div className="flex items-center gap-4">
        {SOCIALS.map((s) => {
          const Icon = s.icon
          return (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              title={s.label}
              className="text-paper hover:text-yellow transition-colors"
            >
              <Icon size={16} />
            </a>
          )
        })}
      </div>
    </footer>
  )
}
