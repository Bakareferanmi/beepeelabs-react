import { listDocuments } from '../lib/firestore.js'
import { SERVICES } from '../src/data/services.js'
import { isPublishedPost } from '../src/lib/publication.js'
import { SITE, articlePath } from '../src/lib/seo.js'

const xmlEscape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[character]))
const toDate = (value) => value && !Number.isNaN(new Date(value).getTime()) ? new Date(value).toISOString().slice(0, 10) : null

export function createSitemapHandler({ getPosts = () => listDocuments('writing') } = {}) {
  return async function handler(req, res) {
    try {
      const posts = await getPosts()
      const urls = [
        { loc: SITE + '/' },
        ...SERVICES.map((service) => ({ loc: SITE + '/services/' + service.slug })),
        ...posts.filter(isPublishedPost).map((post) => ({
          loc: SITE + articlePath(post.id),
          lastmod: toDate(post.updatedAt) || toDate(post.publishedAt),
        })),
      ]
      const body = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + urls.map((url) => '  <url><loc>' + xmlEscape(url.loc) + '</loc>' + (url.lastmod ? '<lastmod>' + url.lastmod + '</lastmod>' : '') + '</url>').join('\n')
        + '\n</urlset>\n'
      res.setHeader('Content-Type', 'application/xml; charset=utf-8')
      res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=30')
      return res.status(200).send(body)
    } catch {
      res.setHeader('Cache-Control', 'no-store')
      res.setHeader('Retry-After', '60')
      return res.status(503).send('Sitemap temporarily unavailable. Please try again shortly.')
    }
  }
}

export default createSitemapHandler()
