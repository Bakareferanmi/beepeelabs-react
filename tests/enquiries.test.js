import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveHero, HERO_DEFAULTS } from '../src/data/offer.js'
import { PROJECT_STORIES, projectPath } from '../src/data/projectStories.js'
import { enquiryHref, leadEvent, summariseAnalytics } from '../src/lib/enquiries.js'
import { submitEnquiry, CONTACT_FORM_ENDPOINT } from '../src/lib/submitEnquiry.js'
import { projectMetadata, SITE } from '../src/lib/seo.js'

test('starter hero copy changes while custom CMS copy and availability survive', () => {
  assert.deepEqual(resolveHero(null), HERO_DEFAULTS)
  const old = { headline: 'I build interfaces that actually work', subtext: 'Software engineer, technical writer, and SEO strategist. I turn complex problems into clean, performant web products. Based in Lagos — available remotely.', availableForWork: false }
  assert.equal(resolveHero(old).headline, HERO_DEFAULTS.headline)
  assert.equal(resolveHero(old).subtext, HERO_DEFAULTS.subtext)
  assert.equal(resolveHero(old).availableForWork, false)
  const custom = { headline: 'Custom heading', subtext: 'My own service description.', availableForWork: false }
  assert.deepEqual(resolveHero(custom), custom)
})

test('WhatsApp and email enquiry links preserve the project context', () => {
  const context = 'a hair & beauty store'
  const whatsapp = new URL(enquiryHref('whatsapp', context))
  assert.equal(whatsapp.origin + whatsapp.pathname, 'https://wa.me/2348167462524')
  assert.equal(whatsapp.searchParams.get('text'), 'Hi Bakare, I found BeepeeLabs and would like to discuss ' + context + '.')
  const email = new URL(enquiryHref('email', context))
  assert.equal(email.protocol, 'mailto:')
  assert.equal(email.searchParams.get('subject'), 'Project enquiry: ' + context)
})

test('contact analytics accept fixed actions and exclude query strings and arbitrary paths', () => {
  const entry = leadEvent('whatsapp_click', 'project', '/projects/hairehaven?email=someone@example.com#private')
  assert.equal(entry.data.path, '/projects/hairehaven')
  assert.doesNotMatch(JSON.stringify(entry), /someone|private|\?email/)
  assert.equal(leadEvent('whatsapp_click', 'contact', '/someone@example.com').data.path, '/other')
  assert.equal(leadEvent('email_click', 'floating', '/writing/a-post?name=private').data.path, '/writing')
  assert.equal(leadEvent('submitted message text', 'contact', '/'), null)
  assert.equal(leadEvent('form_accepted', 'a private source', '/'), null)
})

test('contact actions do not inflate legacy page-view totals', () => {
  const summary = summariseAnalytics([
    { path: '/', count: 25 },
    { path: '/services/web-development', count: 8 },
    { ...leadEvent('whatsapp_click', 'hero').data, count: 3 },
    { ...leadEvent('whatsapp_click', 'contact').data, count: 2 },
    { ...leadEvent('form_accepted', 'contact').data, count: 1 },
  ])
  assert.equal(summary.totalViews, 33)
  assert.equal(summary.pages.length, 2)
  assert.deepEqual(summary.totals, { whatsapp_click: 5, email_click: 0, form_accepted: 1 })
})

test('valid enquiries go only to the existing form endpoint with trimmed form fields', async () => {
  let sent
  await submitEnquiry({ name: ' A Visitor ', email: ' visitor@example.com ', project: ' A storefront. ', analytics: 'must not be sent' }, async (url, options) => {
    sent = { url, options }
    return new Response(null, { status: 200 })
  })
  assert.equal(sent.url, CONTACT_FORM_ENDPOINT)
  assert.equal(sent.options.method, 'POST')
  assert.deepEqual(JSON.parse(sent.options.body), { name: 'A Visitor', email: 'visitor@example.com', project: 'A storefront.' })
})

test('empty or invalid enquiries do not contact the form service', async () => {
  let sends = 0
  const send = async () => { sends++; return new Response(null, { status: 200 }) }
  for (const form of [
    { name: ' ', email: 'valid@example.com', project: 'A site' },
    { name: 'A Visitor', email: 'invalid@', project: 'A site' },
    { name: 'A Visitor', email: 'valid@example.com', project: '  ' },
  ]) await assert.rejects(submitEnquiry(form, send), /Please enter/)
  assert.equal(sends, 0)
})

test('rejected or failed form requests never resolve as accepted submissions', async () => {
  const form = { name: 'A Visitor', email: 'visitor@example.com', project: 'A website' }
  await assert.rejects(submitEnquiry(form, async () => new Response(null, { status: 422 })), /could not be submitted/)
  await assert.rejects(submitEnquiry(form, async () => { throw new Error('offline') }), /offline/)
})

test('each project has its own canonical URL, description and sharing image', () => {
  for (const story of PROJECT_STORIES) {
    const metadata = projectMetadata(story, { image: 'https://example.com/project.png' })
    assert.equal(metadata.url, SITE + projectPath(story.id))
    assert.equal(metadata.image, 'https://example.com/project.png')
    assert.equal(metadata.schema.url, metadata.url)
    assert.equal(metadata.schema.creator['@id'], SITE + '/#person')
    assert.ok(metadata.description.length > 60)
  }
})
