import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'
import Nav from './components/Nav'
import Ticker from './components/Ticker'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Writing from './components/Writing'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import ProjectModal from './components/ProjectModal'
import BlogModal from './components/BlogModal'
import PrivacyModal from './components/PrivacyModal'
import TrafficLight from './components/TrafficLight'
import LoadingScreen from './components/LoadingScreen'

export default function App() {
  const [activeProject, setActiveProject] = useState(null)
  const [activePost, setActivePost] = useState(null)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [projects, setProjects] = useState([])
  const [writing, setWriting] = useState([])
  const [dataLoading, setDataLoading] = useState(true)

  const openProject = (id) => {
    window.history.pushState({ modal: true }, '')
    setActiveProject(id)
  }

  const openPost = (id) => {
    window.history.pushState({ modal: true }, '')
    setActivePost(id)
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
      setActivePost(null)
      setPrivacyOpen(false)
    }
  }

  useEffect(() => {
    const onPopState = () => {
      setActiveProject(null)
      setActivePost(null)
      setPrivacyOpen(false)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = activeProject || activePost || privacyOpen ? 'hidden' : ''
  }, [activeProject, activePost, privacyOpen])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsSnap, writingSnap] = await Promise.all([
          getDocs(collection(db, 'projects')),
          getDocs(collection(db, 'writing')),
        ])
        setProjects(projectsSnap.docs.map((d) => d.data()))
        setWriting(writingSnap.docs.map((d) => d.data()))
      } catch (err) {
        console.error('Failed to load content:', err)
      } finally {
        setDataLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen">
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>
      <Nav />
      <Ticker />
      <Hero />
      <About />
      <Skills />
      <Projects projects={projects} loading={dataLoading} onOpen={openProject} />
      <Writing posts={writing} loading={dataLoading} onOpen={openPost} />
      <Contact />
      <Footer onOpenPrivacy={openPrivacy} />
      <WhatsAppButton />
      <TrafficLight />
      <ProjectModal projectId={activeProject} projects={projects} onClose={closeModal} />
      <BlogModal postId={activePost} posts={writing} onClose={closeModal} />
      <PrivacyModal open={privacyOpen} onClose={closeModal} />
    </div>
  )
}
