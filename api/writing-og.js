const SITE = 'https://www.beepeelabs.cv'

export default async function handler(req, res) {
  const { id } = req.query
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const proto = req.headers['x-forwarded-proto'] || 'https'
  // Fetch the template from whichever host served this request (works on preview deploys)
  const originUrl = `${proto}://${host}`

  let html = ''
  try {
    const htmlRes = await fetch(`${originUrl}/index.html`)
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
  let postImage = null
  let bodyParagraphs = []
  let notFound = false

  try {
    const fsUrl = `https://firestore.googleapis.com/v1/projects/beepeelabs/databases/(default)/documents/writing/${encodeURIComponent(id)}`
    const fsRes = await fetch(fsUrl)
    if (fsRes.status === 404) {
      notFound = true
    } else if (fsRes.ok) {
      const data = await fsRes.json()
      const f = data.fields || {}
      if (f.title?.stringValue) title = `${f.title.stringValue} — BeepeeLabs`
      if (f.excerpt?.stringValue) description = f.excerpt.stringValue
      if (f.author?.stringValue) author = f.author.stringValue
      if (f.publishedAt?.stringValue) publishedAt = f.publishedAt.stringValue
      if (f.updatedAt?.stringValue) updatedAt = f.updatedAt.stringValue
      if (f.image?.stringValue) postImage = f.image.stringValue
      bodyParagraphs = (f.body?.arrayValue?.values || [])
        .map((v) => v.stringValue)
        .filter(Boolean)
    }
  } catch {
    // fall back to site defaults if Firestore read fails
  }

  // Unknown article id: return a real 404 (the React app still redirects humans to /)
  if (notFound) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60')
    res.status(404).send(html)
    return
  }

  const escape = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

  const pageUrl = `${SITE}/writing/${id}`
  const imageUrl = postImage || `${SITE}/og-image.png`
  const headline = title.replace(' — BeepeeLabs', '')
  const t = escape(title)
  const d = escape(description)
  const a = escape(author)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${pageUrl}#article`,
    mainEntityOfPage: pageUrl,
    headline,
    description,
    url: pageUrl,
    image: imageUrl,
    inLanguage: 'en',
    author: { '@type': 'Person', name: author, url: `${SITE}/` },
    publisher: { '@id': `${SITE}/#business` },
    ...(bodyParagraphs.length && { articleBody: bodyParagraphs.join('\n\n') }),
    ...(publishedAt && { datePublished: publishedAt }),
    ...(updatedAt && { dateModified: updatedAt }),
  }
  // Keep "</script>" sequences in article text from closing the tag early
  const jsonLdSafe = JSON.stringify(jsonLd).replace(/</g, '\\u003c')

  const tags = `
<title>${t}</title>
<meta name="description" content="${d}">
<link rel="canonical" href="${pageUrl}">
<meta property="og:type" content="article">
<meta property="og:locale" content="en_NG">
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
<script type="application/ld+json">${jsonLdSafe}</script>
`

  // Full article text for crawlers that do not run JavaScript (most AI crawlers)
  const articleNoscript = bodyParagraphs.length
    ? `<noscript>
  <article style="max-width:42rem;margin:2rem auto;padding:0 1rem;font-family:system-ui,sans-serif;line-height:1.6">
    <h1>${escape(headline)}</h1>
    <p>By ${a}${publishedAt ? ` · <time datetime="${escape(publishedAt)}">${escape(publishedAt)}</time>` : ''}</p>
    ${bodyParagraphs.map((p) => `<p>${escape(p)}</p>`).join('\n    ')}
    <p><a href="/">BeepeeLabs home</a> · <a href="mailto:bakareferanmi96@gmail.com">Contact Bakare Oluwaferanmi</a></p>
  </article>
</noscript>`
    : ''

  html = html
    .replace(/<title>.*?<\/title>/i, '')
    .replace(/<meta name="description"[^>]*>/i, '')
    .replace(/<link rel="canonical"[^>]*>/i, '')
    .replace(/<meta property="og:[^"]*"[^>]*>\s*/gi, '')
    .replace(/<meta name="twitter:[^"]*"[^>]*>\s*/gi, '')
    .replace(/<noscript>[\s\S]*?<\/noscript>/i, articleNoscript)
    .replace('</head>', `${tags}</head>`)

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=600, stale-while-revalidate')
  res.status(200).send(html)
}
