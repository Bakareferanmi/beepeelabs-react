import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import EnquiryLink from './EnquiryLink'

export default function WebsiteOffer() {
  return (
    <section id="services" aria-labelledby="website-offer" className="border-b-2 border-ink bg-yellow px-5 md:px-10 py-12 md:py-16 scroll-mt-20">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest mb-4">For business owners</p>
          <h2 id="website-offer" className="font-display text-3xl md:text-4xl mb-5">Need a website or a better one?</h2>
          <p className="leading-relaxed max-w-lg">Give customers a clear place to see your services, explore your products and ask about working with you. I can build a new site or improve the one you already have.</p>
        </div>
        <div>
          <ul className="space-y-3 mb-6 text-sm leading-relaxed">
            <li>Business and service pages that work on phones and desktops</li>
            <li>A clear route to WhatsApp, email or a project enquiry</li>
            <li>Page titles, descriptions and public content search engines can read</li>
            <li>Deployment and a handover so you know how to use your site</li>
          </ul>
          <p className="text-sm mb-6">Share your business, your current site if you have one, and what you need. We agree the scope, price and timeline before work starts.</p>
          <div className="flex flex-wrap items-center gap-5">
            <EnquiryLink source="offer" context="a business website or redesign" className="inline-flex items-center gap-2 border-2 border-ink bg-ink text-paper px-5 py-3 font-mono text-xs uppercase hover:bg-blue hover:border-blue transition-colors">Get a website quote <ArrowRight size={16} /></EnquiryLink>
            <Link to="/services/web-development" className="text-sm underline underline-offset-4">See website services</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
