import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App.jsx'

export function render(url, initialData) {
  return renderToString(<StaticRouter location={url}><App initialData={initialData} /></StaticRouter>)
}
