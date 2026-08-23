import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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
import PrivacyModal from './components/PrivacyModal'
import TrafficLight from './components/TrafficLight'
import LoadingScreen from './components/LoadingScreen'
import BlogPost from './pages/BlogPost'

function Home({ projects, writing, dataLoading, activeProject, openProject, privacyOpen, openPrivacy, closeModal }) {
  return (
    <div className="min-h-screen">
      <Nav />
      <Ticker />
      <Hero />
      <About />
      <Skills />
      <Projects projects={projects} loading={dataLoading} onOpen={openProject} />
      <Writing posts={writing} loading={dataLoading} />
      <Contact />
      <Footer onOpenPrivacy={openPrivacy} />
      <WhatsAppButton />
      <TrafficLight />
      <ProjectModal projectId={activeProject} projects={projects} onClose={closeModal} />
      <PrivacyModal open={privacyOpen} onClose={closeModal} />
    </div>
  )
}

export default function App() {
  const [activeProject, setActiveProject] = useState(null)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [projects, setProjects] = useState([])
  const [writing, setWriting] = useState([])
  const [dataLoading, setDataLoading] = useState(true)

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
    <>
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>
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
              privacyOpen={privacyOpen}
              openPrivacy={openPrivacy}
              closeModal={closeModal}
            />
          }
        />
        <Route path="/writing/:id" element={<BlogPost posts={writing} loading={dataLoading} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
