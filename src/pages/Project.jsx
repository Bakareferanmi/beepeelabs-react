import { Link, useParams } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import EnquiryLink from '../components/EnquiryLink'
import WhatsAppButton from '../components/WhatsAppButton'
import { PROJECT_STORIES, projectPath } from '../data/projectStories.js'
import NotFound from './NotFound'

export default function Project({ projects, onOpenPrivacy }) {
  const { id } = useParams()
  const story = PROJECT_STORIES.find((item) => item.id === id)
  if (!story) return <NotFound />
  const project = projects.find((item) => item.id === id)
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 px-5 md:px-10 py-12 md:py-20">
        <article className="max-w-3xl mx-auto">
          <Link to="/#projects" className="font-mono text-xs uppercase text-blue underline">All projects</Link>
          <p className="font-mono text-xs uppercase tracking-widest text-blue mt-10 mb-4">{story.category} · {project?.name || id}</p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight mb-6">{story.heading}</h1>
          <p className="text-lg text-ink-soft leading-relaxed mb-8">{story.intro}</p>
          {project?.image && <img src={project.image} alt={(project.name || id) + ' website preview'} width={1200} height={750} className="w-full h-auto border-2 border-ink mb-10" />}
          <h2 className="font-display text-2xl mb-4">What the website is for</h2>
          <p className="text-ink-soft leading-relaxed mb-8">{story.brief}</p>
          <h2 className="font-display text-2xl mb-4">How it was built</h2>
          <p className="text-ink-soft leading-relaxed mb-6">{story.approach}</p>
          <ul className="list-disc pl-5 space-y-3 text-ink-soft mb-8">{story.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
          {project?.link && <a href={project.link.startsWith('http') ? project.link : 'https://' + project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-mono text-sm text-blue underline mb-10">Visit the project <ArrowUpRight size={16} /></a>}
          <section className="border-2 border-ink bg-yellow p-6 md:p-8">
            <h2 className="font-display text-2xl mb-4">Could this work for your business?</h2>
            <p className="leading-relaxed mb-6">{story.relevance}</p>
            <div className="flex flex-wrap items-center gap-5">
              <EnquiryLink source="project" context={story.quote} className="inline-flex bg-ink text-paper px-5 py-3 font-mono text-sm hover:bg-blue transition-colors">Discuss a similar project</EnquiryLink>
              <EnquiryLink channel="email" source="project" context={story.quote} className="text-sm underline underline-offset-4">Email your brief</EnquiryLink>
            </div>
          </section>
          <Link to="/services/web-development" className="inline-block mt-8 text-blue underline">Explore website and web app development</Link>
          <nav aria-label="More projects" className="flex flex-wrap gap-5 mt-8">
            {PROJECT_STORIES.filter((item) => item.id !== id).map((item) => <Link key={item.id} to={projectPath(item.id)} className="text-sm text-blue underline">{item.title.split(':')[0]}</Link>)}
          </nav>
        </article>
      </main>
      <Footer onOpenPrivacy={onOpenPrivacy} />
      <WhatsAppButton />
    </div>
  )
}
