import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import LazyAdmin from './admin/LazyAdmin.jsx'

const isAdmin = /^\/admin(?:\/|$)/.test(window.location.pathname)
let initialData
try {
  const node = document.getElementById('public-content')
  if (node) initialData = JSON.parse(node.textContent)
} catch {
  // A missing snapshot falls back to the existing live CMS reads.
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdmin ? (
      <LazyAdmin />
    ) : (
      <BrowserRouter>
        <App initialData={initialData} />
      </BrowserRouter>
    )}
  </StrictMode>,
)
