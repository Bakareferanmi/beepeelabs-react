import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { createServer } from 'vite'
import { getDocument, listDocuments } from '../lib/firestore.js'
import { renderPage, notFoundBody } from '../lib/render-page.js'
import { SERVICES } from '../src/data/services.js'
import { PROJECT_STORIES, projectPath } from '../src/data/projectStories.js'
import { isPublishedPost } from '../src/lib/publication.js'
import { homeMetadata, notFoundMetadata, serviceMetadata, projectMetadata } from '../src/lib/seo.js'

const root = fileURLToPath(new URL('../', import.meta.url))
const output = join(root, 'dist')
const template = await readFile(join(output, 'index.html'), 'utf8')
const manifest = JSON.parse(await readFile(join(output, '.vite/manifest.json'), 'utf8'))
const assetUrls = Object.fromEntries(Object.values(manifest)
  .filter((asset) => asset.src && !asset.isEntry && !asset.isDynamicEntry)
  .map((asset) => ['/' + asset.src, '/' + asset.file]))
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
  // The SSR loader uses source image paths. Serve the hashed client-build assets
  // in the first response too, including React's automatic image preload links.
  const visibleMarkup = (markup) => markup
    .replace(/\b(?:src|href)="([^"]+)"/g, (attribute, url) => assetUrls[url] ? attribute.replace(url, assetUrls[url]) : attribute)
    .replace(/style="([^"]*)"/g, (_, styles) => {
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
      metadata: serviceMetadata(service), body: visibleMarkup(render(path, emptyData)), initialData: emptyData,
    }))
  }
  await mkdir(join(output, 'projects'), { recursive: true })
  for (const story of PROJECT_STORIES) {
    const path = projectPath(story.id)
    const project = projects.find((item) => item.id === story.id)
    const data = { ...emptyData, projects: project ? [project] : [] }
    await writeFile(join(output, path + '.html'), renderPage(template, {
      metadata: projectMetadata(story, project), body: visibleMarkup(render(path, data)), initialData: data,
    }))
  }
  await writeFile(join(output, '404.html'), renderPage(template, { metadata: notFoundMetadata, body: notFoundBody, initialData: emptyData }))
  await writeFile(join(output, 'admin.html'), renderPage(template, {
    metadata: { title: 'Admin | BeepeeLabs', description: 'BeepeeLabs content management.', robots: 'noindex, nofollow' }, body: '',
  }))
  console.log('Pre-rendered homepage, ' + SERVICES.length + ' service pages and ' + PROJECT_STORIES.length + ' project pages; ' + initialData.writing.length + ' published articles linked. Draft content excluded.')
} finally {
  await server.close()
}
