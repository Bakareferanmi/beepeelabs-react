const SITE = 'https://www.beepeelabs.cv'
const FIRESTORE = 'https://firestore.googleapis.com/v1/projects/beepeelabs/databases/(default)/documents'

const xmlEscape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]))

const toDate = (iso) => {
  const d = iso ? new Date(iso) : null
  return d && !Number.isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : null
}

export default async function handler(req, res) {
  const urls = [{ loc: `${SITE}/`, changefreq: 'weekly', priority: '1.0' }]

  try {
    let pageToken = ''
    do {
      const qs = `pageSize=300${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`
      const fsRes = await fetch(`${FIRESTORE}/writing?${qs}`)
      if (!fsRes.ok) break
      const data = await fsRes.json()
      for (const doc of data.documents || []) {
        const id = doc.name.split('/').pop()
        const f = doc.fields || {}
        const lastmod = toDate(f.updatedAt?.stringValue) || toDate(f.publishedAt?.stringValue)
        urls.push({
          loc: `${SITE}/writing/${encodeURIComponent(id)}`,
          lastmod,
          changefreq: 'monthly',
          priority: '0.7',
        })
      }
      pageToken = data.nextPageToken || ''
    } while (pageToken)
  } catch {
    // If Firestore is unreachable, still serve a valid sitemap with the home page
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${xmlEscape(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate')
  res.status(200).send(body)
}
