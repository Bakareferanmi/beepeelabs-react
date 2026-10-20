import { SERVICES } from '../data/services.js'
import { PROJECT_STORIES } from '../data/projectStories.js'

export const CONTACT_EMAIL = 'bakareferanmi96@gmail.com'
export const WHATSAPP_NUMBER = '2348167462524'
export const LEAD_EVENT_LABELS = {
  whatsapp_click: 'WhatsApp clicks',
  email_click: 'Email clicks',
  form_accepted: 'Forms accepted',
}
const SOURCES = new Set(['hero', 'offer', 'contact', 'service', 'project', 'project-modal', 'floating'])
const PAGES = new Set(['/', ...SERVICES.map((item) => '/services/' + item.slug), ...PROJECT_STORIES.map((item) => '/projects/' + item.id)])

export function enquiryHref(channel, context = 'a project') {
  const message = 'Hi Bakare, I found BeepeeLabs and would like to discuss ' + context + '.'
  return channel === 'email'
    ? 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent('Project enquiry: ' + context) + '&body=' + encodeURIComponent(message)
    : 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message)
}

// Only fixed action/source names and known page paths enter aggregate analytics.
// Never include a query string, form values, contact details or referrer URLs.
export function leadEvent(event, source, pathname = '/') {
  if (!Object.hasOwn(LEAD_EVENT_LABELS, event) || !SOURCES.has(source)) return null
  const cleanPath = pathname.split(/[?#]/)[0]
  const path = PAGES.has(cleanPath) ? cleanPath : cleanPath.startsWith('/writing/') ? '/writing' : '/other'
  const id = 'lead_' + event + '_' + source + '_' + (path === '/' ? 'home' : path.slice(1).replaceAll('/', '_'))
  return { id, data: { kind: 'lead', event, source, path } }
}

export function summariseAnalytics(entries) {
  const pages = entries.filter((entry) => entry.kind !== 'lead')
  const actions = entries.filter((entry) => entry.kind === 'lead' && Object.hasOwn(LEAD_EVENT_LABELS, entry.event))
  return {
    pages,
    actions,
    totalViews: pages.reduce((sum, entry) => sum + (entry.count || 0), 0),
    totals: Object.fromEntries(Object.keys(LEAD_EVENT_LABELS).map((event) => [event, actions.filter((entry) => entry.event === event).reduce((sum, entry) => sum + (entry.count || 0), 0)])),
  }
}
