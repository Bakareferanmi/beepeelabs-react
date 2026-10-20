import { Link, useParams } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { SERVICES } from '../data/services.js'
import NotFound from './NotFound'

export default function Service() {
  const { slug } = useParams()
  const service = SERVICES.find((item) => item.slug === slug)
  if (!service) return <NotFound />
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 px-5 md:px-10 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="font-mono text-xs uppercase text-blue underline">BeepeeLabs home</Link>
          <p className="font-mono text-xs uppercase tracking-widest text-blue mt-10 mb-4">Lagos, Nigeria · Available remotely</p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight mb-8">{service.heading}</h1>
          <div className="space-y-5 text-ink-soft leading-relaxed">
            {service.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <h2 className="font-display text-2xl mt-12 mb-5">What we can work on</h2>
          <ul className="list-disc pl-5 space-y-3 text-ink-soft">
            {service.deliverables.map((item) => <li key={item}>{item}</li>)}
          </ul>
          {service.article && <p className="mt-6"><Link className="text-blue underline" to={service.article}>Read about my React Native food ordering app</Link></p>}
          <h2 className="font-display text-2xl mt-12 mb-6">Project questions</h2>
          {service.questions.map(([question, answer]) => (
            <section key={question} className="mb-6">
              <h3 className="font-semibold mb-2">{question}</h3><p className="text-ink-soft leading-relaxed">{answer}</p>
            </section>
          ))}
          <div className="border-2 border-ink bg-yellow p-6 mt-12">
            <h2 className="font-display text-2xl mb-3">Tell me about your project</h2>
            <p className="mb-5">Share what you want to build or improve, your timeline and any existing website or product.</p>
            <a className="inline-block bg-ink text-paper px-5 py-3 font-mono text-sm" href="mailto:bakareferanmi96@gmail.com">Discuss your project</a>
          </div>
          <nav aria-label="Other services" className="flex flex-wrap gap-x-6 gap-y-3 mt-10">
            {SERVICES.filter((item) => item.slug !== slug).map((item) => <Link key={item.slug} className="text-blue underline text-sm" to={'/services/' + item.slug}>{item.label}</Link>)}
          </nav>
        </div>
      </main>
      <Footer />
    </div>
  )
}
