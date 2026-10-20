import { INDEX_ROBOTS, SITE } from '../src/lib/seo.js'

export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]))
export const serializeData = (data) => JSON.stringify(data).replace(/</g, '\\u003c')

export function renderPage(template, { metadata, body, initialData }) {
  const meta = (attribute, key, value) => value ? '<meta ' + attribute + '="' + key + '" content="' + escapeHtml(value) + '">' : ''
  const tags = [
    '<title>' + escapeHtml(metadata.title) + '</title>',
    meta('name', 'description', metadata.description),
    meta('name', 'robots', metadata.robots || INDEX_ROBOTS),
    metadata.url ? '<link rel="canonical" href="' + escapeHtml(metadata.url) + '">' : '',
    ...Object.entries({ type: metadata.type || 'website', locale: 'en_NG', site_name: 'BeepeeLabs', title: metadata.title, description: metadata.description, url: metadata.url, image: metadata.image || SITE + '/og-image.png' }).map(([key, value]) => meta('property', 'og:' + key, value)),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', metadata.title),
    meta('name', 'twitter:description', metadata.description),
    meta('name', 'twitter:image', metadata.image || SITE + '/og-image.png'),
    meta('property', 'article:author', metadata.schema?.author?.name),
    meta('property', 'article:published_time', metadata.schema?.datePublished),
    meta('property', 'article:modified_time', metadata.schema?.dateModified),
    metadata.schema ? '<script id="page-schema" type="application/ld+json">' + serializeData(metadata.schema) + '</script>' : '',
  ].join('\n')
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta name="(?:description|robots)"[^>]*>\s*/gi, '')
    .replace(/<link rel="canonical"[^>]*>\s*/gi, '')
    .replace(/<meta property="(?:og:|article:)[^"]*"[^>]*>\s*/gi, '')
    .replace(/<meta name="twitter:[^"]*"[^>]*>\s*/gi, '')
    .replace(/<script id="page-schema"[^>]*>[\s\S]*?<\/script>\s*/gi, '')
    .replace(/<script id="public-content"[^>]*>[\s\S]*?<\/script>\s*/gi, '')
    .replace(/<noscript>[\s\S]*?<\/noscript>\s*/gi, '')
    .replace('</head>', () => tags + '\n</head>')
  if (!html.includes('<!--app-html-->')) throw new Error('Missing public page template marker')
  html = html.replace(/<!--app-html-->[\s\S]*?<!--\/app-html-->/, () => '<!--app-html-->' + body + '<!--/app-html-->')
  if (initialData) {
    html = html.replace('</body>', () => '<script id="public-content" type="application/json">' + serializeData(initialData) + '</script>\n</body>')
  }
  return html
}

export const notFoundBody = '<main class="max-w-2xl mx-auto px-5 py-24"><p class="font-mono text-blue mb-4">404</p><h1 class="font-display text-4xl mb-6">Page not found</h1><p class="mb-8">This page is unavailable or has not been published.</p><a class="underline text-blue" href="/">Back to BeepeeLabs</a></main>'
