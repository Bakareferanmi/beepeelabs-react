import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { createServer } from 'vite'
import { getDocument, listDocuments } from '../lib/firestore.js'
import { renderPage, notFoundBody } from '../lib/render-page.js'
import { SERVICES } from '../src/data/services.js'
import { isPublishedPost } from '../src/lib/publication.js'
import { homeMetadata, notFoundMetadata, serviceMetadata } from '../src/lib/seo.js'

const root = fileURLToPath(new URL('../', import.meta.url))
const output = join(root, 'dist')
const template = await readFile(join(output, 'index.html'), 'utf8')
const [projects, posts, contentEntries] = await Promise.all([
  listDocuments('projects'),
  listDocuments('writing'),
  Promise.all(['hero', 'about', 'skills'].map(async (key) => [key, await getDocument('content', key)])),
])
const initialData = { projects, writing: posts.filter(isPublishedPost), content: Object.fromEntries(contentEntries) }
const emptyData = { projects: [], writing: [], content: {} }

// Render the existing React UI, not a separate crawler-only version. The browser
// mounts the same components with this public snapshot, then refreshes from the
// CMS. Articles continue to render at request time so publishing needs no build.
const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom' })
try {
  const { render } = await server.ssrLoadModule('/src/entry-server.jsx')
  const visibleMarkup = (markup) => markup.replace(/style="([^"]*)"/g, (_, styles) => {
    // Framer Motion's entrance states must not hide the static page if scripts
    // are unavailable. Browser entrance and hover animations remain intact.
    const visible = styles.replace(/(^|;)opacity:0(?=;|$)/g, '$1opacity:1').replace(/(^|;)transform:translate[^;]*/g, '$1transform:none')
    return 'style="' + visible + '"'
  })
  await writeFile(join(output, 'index.html'), renderPage(template, {
    metadata: homeMetadata, body: visibleMarkup(render('/', initialData)), initialData,
  }))
  await mkdir(join(output, 'services'), { recursive: true })
  for (const service of SERVICES) {
    const path = '/services/' + service.slug
    await writeFile(join(output, path + '.html'), renderPage(template, {
      metadata: serviceMetadata(service), body: render(path, emptyData), initialData: emptyData,
    }))
  }
  await writeFile(join(output, '404.html'), renderPage(template, { metadata: notFoundMetadata, body: notFoundBody, initialData: emptyData }))
  await writeFile(join(output, 'admin.html'), renderPage(template, {
    metadata: { title: 'Admin | BeepeeLabs', description: 'BeepeeLabs content management.', robots: 'noindex, nofollow' }, body: '',
  }))
  console.log('Pre-rendered homepage and ' + SERVICES.length + ' service pages; ' + initialData.writing.length + ' published articles linked. Draft content excluded.')
} finally {
  await server.close()
}
