export default async function handler(req, res) {
  const { id } = req.query
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const proto = req.headers['x-forwarded-proto'] || 'https'
  const siteUrl = `${proto}://${host}`

  let html = ''
  try {
    const htmlRes = await fetch(`${siteUrl}/index.html`)
    html = await htmlRes.text()
  } catch {
    res.status(502).send('Failed to load base template')
    return
  }

  let title = 'BeepeeLabs | Bakare Oluwaferanmi'
  let description = 'Technical writing and developer notes from BeepeeLabs.'
  let author = 'Bakare Feranmi'
  let publishedAt = null
  let updatedAt = null

  try {
    const fsUrl = `https://firestore.googleapis.com/v1/projects/beepeelabs/databases/(default)/documents/writing/${encodeURIComponent(id)}`
    const fsRes = await fetch(fsUrl)
    if (fsRes.ok) {
      const data = await fsRes.json()
      const f = data.fields || {}
      if (f.title?.stringValue) title = `${f.title.stringValue} — BeepeeLabs`
      if (f.excerpt?.stringValue) description = f.excerpt.stringValue
      if (f.author?.stringValue) author = f.author.stringValue
      if (f.publishedAt?.stringValue) publishedAt = f.publishedAt.stringValue
      if (f.updatedAt?.stringValue) updatedAt = f.updatedAt.stringValue
    }
  } catch {
    // fall back to site defaults if Firestore read fails
  }

  const escape = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

  const pageUrl = `${siteUrl}/writing/${id}`
  const imageUrl = `${siteUrl}/og-image.png`
  const t = escape(title)
  const d = escape(description)
  const a = escape(author)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title.replace(' — BeepeeLabs', ''),
    description,
    url: pageUrl,
    image: imageUrl,
    author: { '@type': 'Person', name: author },
    ...(publishedAt && { datePublished: publishedAt }),
    ...(updatedAt && { dateModified: updatedAt }),
  }

  const tags = `
<title>${t}</title>
<meta name="description" content="${d}">
<link rel="canonical" href="${pageUrl}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="BeepeeLabs">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:url" content="${pageUrl}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="article:author" content="${a}">
${publishedAt ? `<meta property="article:published_time" content="${publishedAt}">` : ''}
${updatedAt ? `<meta property="article:modified_time" content="${updatedAt}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${d}">
<meta name="twitter:image" content="${imageUrl}">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
`

  html = html
    .replace(/<title>.*?<\/title>/i, '')
    .replace(/<meta name="description"[^>]*>/i, '')
    .replace(/<link rel="canonical"[^>]*>/i, '')
    .replace(/<meta property="og:[^"]*"[^>]*>\s*/gi, '')
    .replace(/<meta name="twitter:[^"]*"[^>]*>\s*/gi, '')
    .replace('</head>', `${tags}</head>`)

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=600, stale-while-revalidate')
  res.status(200).send(html)
}
