import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ArticleContent from '../src/components/ArticleContent.js'
import { isPublishedPost } from '../src/lib/publication.js'
import { articleMetadata, notFoundMetadata } from '../src/lib/seo.js'
import { getDocument } from '../lib/firestore.js'
import { readTemplate } from '../lib/template.js'
import { renderPage, notFoundBody } from '../lib/render-page.js'

export function createWritingHandler({ getPost = (id) => getDocument('writing', id), getTemplate = readTemplate } = {}) {
  return async function handler(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    const id = req.query.id
    try {
      const validId = typeof id === 'string' && id.length > 0 && id.length <= 500 && !id.includes('/')
      const [template, post] = await Promise.all([getTemplate(), validId ? getPost(id) : null])
      if (!isPublishedPost(post)) {
        res.setHeader('X-Robots-Tag', 'noindex, follow')
        res.setHeader('Cache-Control', 'no-store')
        return res.status(404).send(renderPage(template, {
          metadata: notFoundMetadata, body: notFoundBody,
          initialData: { projects: [], writing: [], content: {} },
        }))
      }
      const body = '<div class="min-h-screen flex flex-col"><nav class="border-b-2 border-ink px-5 md:px-10 h-16 flex items-center"><a class="font-display text-lg" href="/">BeepeeLabs</a></nav>'
        + renderToStaticMarkup(createElement(ArticleContent, { post }))
        + '<footer class="bg-ink text-paper px-5 md:px-10 py-10"><a href="mailto:bakareferanmi96@gmail.com">Discuss a project with BeepeeLabs</a></footer></div>'
      res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=30')
      return res.status(200).send(renderPage(template, {
        metadata: articleMetadata(post), body,
        initialData: { projects: [], writing: [post], content: {} },
      }))
    } catch {
      // An upstream outage is temporary, not a missing article or an indexable
      // empty page. Do not cache it or expose backend exception details.
      res.setHeader('Cache-Control', 'no-store')
      res.setHeader('Retry-After', '60')
      return res.status(503).send('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Content temporarily unavailable | BeepeeLabs</title></head><body><main><h1>Content temporarily unavailable</h1><p>Please try again shortly.</p><a href="/">BeepeeLabs home</a></main></body></html>')
    }
  }
}

export default createWritingHandler()
