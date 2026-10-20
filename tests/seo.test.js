import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createWritingHandler } from '../api/writing-og.js'
import { createSitemapHandler } from '../api/sitemap.js'
import { isPublishedPost, publicationError } from '../src/lib/publication.js'
import { getDocument, listDocuments } from '../lib/firestore.js'
import { SERVICES } from '../src/data/services.js'

const template = await readFile(new URL('../index.html', import.meta.url), 'utf8')
const article = {
  id: 'working-with-apis', title: 'Working with APIs', excerpt: 'A practical API guide.',
  body: ['Start by checking the documented response format.'], author: 'Bakare Feranmi',
  publishedAt: '2026-10-10T08:00:00.000Z', updatedAt: '2026-10-11T08:00:00.000Z',
}
function response() {
  return { headers: {}, statusCode: 200, body: '',
    setHeader(key, value) { this.headers[key.toLowerCase()] = value },
    status(code) { this.statusCode = code; return this },
    send(body) { this.body = body; return this },
  }
}
async function requestArticle(post, id = post?.id || 'missing') {
  const res = response()
  await createWritingHandler({ getPost: async () => post, getTemplate: async () => template })({ query: { id } }, res)
  return res
}

test('existing substantive articles stay public; drafts and unpublished statuses do not', () => {
  assert.equal(isPublishedPost(article), true)
  assert.equal(isPublishedPost({ ...article, status: 'published' }), true)
  assert.equal(isPublishedPost({ ...article, status: 'draft' }), false)
  assert.equal(isPublishedPost({ ...article, status: 'archived' }), false)
})

test('the three existing test posts remain drafts until explicitly republished', () => {
  for (const id of ['nnn', 'my-new-beginning', "what's-good"]) {
    assert.equal(isPublishedPost({ ...article, id }), false)
    assert.equal(isPublishedPost({ ...article, id, status: 'published' }), true)
  }
})

test('punctuation-only or empty articles cannot be published', () => {
  assert.equal(isPublishedPost({ ...article, title: '.', body: ['.'], status: 'published' }), false)
  assert.ok(publicationError({ ...article, body: [] }))
  assert.ok(publicationError({ ...article, title: ' ' }))
  assert.equal(publicationError({ ...article, title: 'Àwọn ìmọ̀ tuntun' }), null)
})

test('a direct article request returns readable content and article-specific metadata', async () => {
  const res = await requestArticle(article)
  assert.equal(res.statusCode, 200)
  assert.match(res.body, /<article\b/)
  assert.match(res.body, /<h1[^>]*>Working with APIs<\/h1>/)
  assert.match(res.body, /Start by checking the documented response format\./)
  assert.match(res.body, /rel="canonical" href="https:\/\/www\.beepeelabs\.cv\/writing\/working-with-apis"/)
  assert.equal((res.body.match(/<h1\b/g) || []).length, 1)
  assert.doesNotMatch(res.body, /<noscript>/)
  assert.match(res.body, /"@type":"BlogPosting"/)
  assert.match(res.body, /"dateModified":"2026-10-11T08:00:00.000Z"/)
})

test('article text cannot break out of JSON scripts or HTML attributes', async () => {
  const unsafe = { ...article, id: 'quotes & spaces', title: 'A "quoted" <title> $&', body: ['</script><script>window.injected=true</script>'] }
  const res = await requestArticle(unsafe)
  assert.equal(res.statusCode, 200)
  assert.doesNotMatch(res.body, /<script>window\.injected=true<\/script>/)
  const snapshot = res.body.match(/<script id="public-content"[^>]*>(.*?)<\/script>/s)[1]
  assert.equal(JSON.parse(snapshot).writing[0].body[0], unsafe.body[0])
  assert.equal(JSON.parse(snapshot).writing[0].title, unsafe.title)
  assert.match(res.body, /quotes%20%26%20spaces/)
  assert.match(res.body, /A &quot;quoted&quot; &lt;title&gt;/)
})

test('missing and draft articles return uncached noindex 404 pages', async () => {
  for (const post of [null, { ...article, status: 'draft' }, { ...article, id: 'nnn' }]) {
    const res = await requestArticle(post)
    assert.equal(res.statusCode, 404)
    assert.equal(res.headers['x-robots-tag'], 'noindex, follow')
    assert.equal(res.headers['cache-control'], 'no-store')
    assert.doesNotMatch(res.body, /"@type":"BlogPosting"/)
    assert.doesNotMatch(res.body, /Working with APIs/)
    assert.doesNotMatch(res.body, /rel="canonical"/)
    assert.match(res.body, /Page not found/)
  }
})

test('invalid article IDs are rejected before contacting the content store', async () => {
  let reads = 0
  const handler = createWritingHandler({ getPost: async () => { reads++; return article }, getTemplate: async () => template })
  for (const id of [undefined, ['first', 'second'], '../nested/id', '']) {
    const res = response()
    await handler({ query: { id } }, res)
    assert.equal(res.statusCode, 404)
  }
  assert.equal(reads, 0)
})

test('a content service outage returns retryable 503 rather than a fake article or 404', async () => {
  const res = response()
  await createWritingHandler({ getPost: async () => { throw new Error('private backend detail') }, getTemplate: async () => template })({ query: { id: article.id } }, res)
  assert.equal(res.statusCode, 503)
  assert.equal(res.headers['cache-control'], 'no-store')
  assert.equal(res.headers['retry-after'], '60')
  assert.doesNotMatch(res.body, /private backend detail/)
})

test('sitemap includes every service and only published articles', async () => {
  const res = response()
  await createSitemapHandler({ getPosts: async () => [article, { ...article, id: 'draft', status: 'draft' }, { ...article, id: 'nnn' }] })({}, res)
  assert.equal(res.statusCode, 200)
  assert.equal(res.headers['content-type'], 'application/xml; charset=utf-8')
  for (const service of SERVICES) assert.ok(res.body.includes('/services/' + service.slug))
  assert.ok(res.body.includes('/writing/' + article.id))
  assert.doesNotMatch(res.body, /\/writing\/(?:draft|nnn)</)
  assert.match(res.body, /<lastmod>2026-10-11<\/lastmod>/)
})

test('a failed content listing does not publish a partial sitemap', async () => {
  const res = response()
  await createSitemapHandler({ getPosts: async () => { throw new Error('unavailable') } })({}, res)
  assert.equal(res.statusCode, 503)
  assert.equal(res.headers['cache-control'], 'no-store')
  assert.doesNotMatch(res.body, /<urlset/)
})

test('Firestore pagination and typed publication fields survive decoding', async (t) => {
  const calls = []
  t.mock.method(globalThis, 'fetch', async (url) => {
    calls.push(url)
    const id = calls.length === 1 ? 'first' : 'second'
    return Response.json({ documents: [{ name: 'projects/example/documents/writing/' + id, fields: {
      title: { stringValue: article.title }, status: { stringValue: 'draft' },
      publishedAt: { timestampValue: article.publishedAt },
      body: { arrayValue: { values: [{ stringValue: article.body[0] }] } },
    } }], ...(calls.length === 1 ? { nextPageToken: 'next page' } : {}) })
  })
  const docs = await listDocuments('writing')
  assert.equal(docs.length, 2)
  assert.equal(docs[1].id, 'second')
  assert.equal(docs[0].publishedAt, article.publishedAt)
  assert.deepEqual(docs[0].body, article.body)
  assert.equal(isPublishedPost(docs[0]), false)
  assert.ok(calls[1].includes('pageToken=next%20page'))
})

test('Firestore distinguishes missing documents from upstream failures', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 404 }))
  assert.equal(await getDocument('writing', 'missing'), null)
  t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 503 }))
  await assert.rejects(getDocument('writing', 'existing'), /HTTP 503/)
})
