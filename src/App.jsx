import { useState, useEffect } from 'react'
import { Routes, Route, useLocation, useMatch } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { trackPageView } from './lib/trackView'
import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'
import Nav from './components/Nav'
import Ticker from './components/Ticker'
import Hero from './components/Hero'
import WebsiteOffer from './components/WebsiteOffer'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Writing from './components/Writing'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import ProjectModal from './components/ProjectModal'
import PrivacyModal from './components/PrivacyModal'
import TrafficLight from './components/TrafficLight'
import BlogPost from './pages/BlogPost'
import NotFound from './pages/NotFound'
import Service from './pages/Service'
import Project from './pages/Project'
import { SERVICES } from './data/services.js'
import { PROJECT_STORIES } from './data/projectStories.js'
import { PublicContentContext } from './lib/PublicContent.jsx'
import { isPublishedPost } from './lib/publication.js'
import { applyMetadata, articleMetadata, homeMetadata, notFoundMetadata, serviceMetadata, projectMetadata } from './lib/seo.js'
import StatusStrip from "./components/StatusStrip";
function Home({ projects, writing, dataLoading, activeProject, openProject, openPrivacy, closeModal }) {
  return (
    <div className="min-h-screen">
      <StatusStrip />
      <Nav />
      <Ticker />
      <Hero />
      <WebsiteOffer />
      <About />
      <Skills />
      <Projects projects={projects} loading={dataLoading} onOpen={openProject} />
      <Writing posts={writing} loading={dataLoading} />
      <Contact />
      <Footer onOpenPrivacy={openPrivacy} />
      <WhatsAppButton />
      <TrafficLight />
      <ProjectModal projectId={activeProject} projects={projects} onClose={closeModal} />
    </div>
  )
}

export default function App({ initialData }) {
  const location = useLocation()
  const articleMatch = useMatch('/writing/:id')
  const serviceMatch = useMatch('/services/:slug')
  const projectMatch = useMatch('/projects/:id')
  const [activeProject, setActiveProject] = useState(null)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [projects, setProjects] = useState(initialData?.projects || [])
  const [writing, setWriting] = useState(() => (initialData?.writing || []).filter(isPublishedPost))
  const [dataLoading, setDataLoading] = useState(!initialData)

  const openProject = (id) => {
    window.history.pushState({ modal: true }, '')
    setActiveProject(id)
  }

  const openPrivacy = () => {
    window.history.pushState({ modal: true }, '')
    setPrivacyOpen(true)
  }

  const closeModal = () => {
    if (window.history.state && window.history.state.modal) {
      window.history.back()
    } else {
      setActiveProject(null)
      setPrivacyOpen(false)
    }
  }

  useEffect(() => {
    const onPopState = () => {
      setActiveProject(null)
      setPrivacyOpen(false)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = activeProject || privacyOpen ? 'hidden' : ''
  }, [activeProject, privacyOpen])

  useEffect(() => {
    if (location.pathname === '/') return applyMetadata(homeMetadata)
    if (projectMatch) {
      const story = PROJECT_STORIES.find((item) => item.id === projectMatch.params.id)
      applyMetadata(story ? projectMetadata(story, projects.find((item) => item.id === story.id)) : notFoundMetadata)
      return
    }
    if (articleMatch) {
      const post = writing.find((item) => item.id === articleMatch.params.id)
      if (post) applyMetadata(articleMetadata(post))
      else if (!dataLoading) applyMetadata(notFoundMetadata)
      return
    }
    const service = serviceMatch && SERVICES.find((item) => item.slug === serviceMatch.params.slug)
    applyMetadata(service ? serviceMetadata(service) : notFoundMetadata)
  }, [location.pathname, articleMatch, serviceMatch, projectMatch, projects, writing, dataLoading])

  useEffect(() => {
    const anchor = location.hash && document.getElementById(location.hash.slice(1))
    if (anchor) anchor.scrollIntoView({ behavior: 'instant' })
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (import.meta.env.PROD) {
      trackPageView(location.pathname)
    }
  }, [location.pathname])

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsSnap, writingSnap] = await Promise.all([
          getDocs(collection(db, 'projects')),
          getDocs(collection(db, 'writing')),
        ])
        setProjects(projectsSnap.docs.map((d) => ({ ...d.data(), id: d.id })))
        setWriting(writingSnap.docs.map((d) => ({ ...d.data(), id: d.id })).filter(isPublishedPost))
      } catch (err) {
        console.error('Failed to load content:', err)
      } finally {
        setDataLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <PublicContentContext.Provider value={initialData?.content || {}}>
      <Analytics />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              projects={projects}
              writing={writing}
              dataLoading={dataLoading}
              activeProject={activeProject}
              openProject={openProject}
              openPrivacy={openPrivacy}
              closeModal={closeModal}
            />
          }
        />
        <Route path="/writing/:id" element={<BlogPost posts={writing} loading={dataLoading} onOpenPrivacy={openPrivacy} />} />
        <Route path="/services/:slug" element={<Service onOpenPrivacy={openPrivacy} />} />
        <Route path="/projects/:id" element={<Project projects={projects} onOpenPrivacy={openPrivacy} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <PrivacyModal open={privacyOpen} onClose={closeModal} />
    </PublicContentContext.Provider>
  )
}
