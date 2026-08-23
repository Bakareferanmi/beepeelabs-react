export default async function handler(req, res) {
  const { id, debug } = req.query
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
  let debugInfo = { id, fetchOk: null, fetchStatus: null, fields: null, error: null }

  try {
    const fsUrl = `https://firestore.googleapis.com/v1/projects/beepeelabs/databases/(default)/documents/writing/${encodeURIComponent(id)}`
    const fsRes = await fetch(fsUrl)
    debugInfo.fetchOk = fsRes.ok
    debugInfo.fetchStatus = fsRes.status
    if (fsRes.ok) {
      const data = await fsRes.json()
      const f = data.fields || {}
      debugInfo.fields = Object.keys(f)
      if (f.title?.stringValue) title = `${f.title.stringValue} — BeepeeLabs`
      if (f.excerpt?.stringValue) description = f.excerpt.stringValue
    }
  } catch (err) {
    debugInfo.error = err.message
  }

  if (debug) {
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({ ...debugInfo, resolvedTitle: title })
    return
  }

  const escape = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

  const pageUrl = `${siteUrl}/writing/${id}`
  const imageUrl = `${siteUrl}/og-image.png`
  const t = escape(title)
  const d = escape(description)

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
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${d}">
<meta name="twitter:image" content="${imageUrl}">
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
