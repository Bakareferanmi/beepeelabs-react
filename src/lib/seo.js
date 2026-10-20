import { projectPath } from '../data/projectStories.js'

export const SITE = 'https://www.beepeelabs.cv'
export const HOME_TITLE = 'Web & Mobile App Developer in Lagos | BeepeeLabs'
export const HOME_DESCRIPTION = 'Websites, web apps and React Native mobile apps by Bakare Oluwaferanmi in Lagos, Nigeria. Technical writing and SEO services for businesses worldwide.'
export const INDEX_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

export const articlePath = (id) => '/writing/' + encodeURIComponent(id)

export function articleMetadata(post) {
  const url = SITE + articlePath(post.id)
  const description = post.excerpt?.trim() || post.body.join(' ').slice(0, 160)
  return {
    title: post.title + ' — BeepeeLabs',
    description,
    url,
    image: post.image || SITE + '/og-image.png',
    type: 'article',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': url + '#article',
      mainEntityOfPage: url,
      headline: post.title,
      description,
      url,
      image: post.image || SITE + '/og-image.png',
      inLanguage: 'en',
      author: { '@type': 'Person', name: post.author || 'Bakare Feranmi', url: SITE + '/' },
      publisher: { '@id': SITE + '/#business' },
      articleBody: post.body.join('\n\n'),
      ...(post.publishedAt && { datePublished: post.publishedAt }),
      ...(post.updatedAt && { dateModified: post.updatedAt }),
    },
  }
}

export const homeMetadata = { title: HOME_TITLE, description: HOME_DESCRIPTION, url: SITE + '/' }
export const notFoundMetadata = {
  title: 'Page not found | BeepeeLabs',
  description: 'This page is unavailable. Browse BeepeeLabs services, projects and writing.',
  robots: 'noindex, follow',
}

export function serviceMetadata(service) {
  const url = SITE + '/services/' + service.slug
  return {
    title: service.title + ' | BeepeeLabs',
    description: service.description,
    url,
    schema: {
      '@context': 'https://schema.org', '@type': 'Service',
      '@id': url + '#service', url, name: service.heading,
      description: service.description,
      provider: { '@id': SITE + '/#business' },
      areaServed: 'Worldwide',
    },
  }
}

export function projectMetadata(story, project) {
  const url = SITE + projectPath(story.id)
  const image = project?.image || SITE + '/og-image.png'
  return {
    title: story.title + ' | BeepeeLabs', description: story.description, url, image,
    schema: {
      '@context': 'https://schema.org', '@type': 'CreativeWork',
      '@id': url + '#project', url, name: story.title,
      description: story.description, image,
      creator: { '@id': SITE + '/#person' },
    },
  }
}

// The same metadata is applied on direct requests and client-side navigation.
export function applyMetadata(metadata) {
  document.title = metadata.title
  const setMeta = (attribute, name, content) => {
    let node = document.head.querySelector('meta[' + attribute + '="' + name + '"]')
    if (!content) { node?.remove(); return }
    if (!node) { node = document.createElement('meta'); node.setAttribute(attribute, name); document.head.append(node) }
    node.content = content
  }
  setMeta('name', 'description', metadata.description)
  setMeta('name', 'robots', metadata.robots || INDEX_ROBOTS)
  for (const [key, value] of Object.entries({ type: metadata.type || 'website', title: metadata.title, description: metadata.description, url: metadata.url, image: metadata.image || SITE + '/og-image.png' })) {
    setMeta('property', 'og:' + key, value)
  }
  setMeta('name', 'twitter:title', metadata.title)
  setMeta('name', 'twitter:description', metadata.description)
  setMeta('name', 'twitter:image', metadata.image || SITE + '/og-image.png')
  setMeta('property', 'article:published_time', metadata.schema?.datePublished)
  setMeta('property', 'article:modified_time', metadata.schema?.dateModified)
  setMeta('property', 'article:author', metadata.schema?.author?.name)
  let canonical = document.head.querySelector('link[rel="canonical"]')
  if (metadata.url) {
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical) }
    canonical.href = metadata.url
  } else canonical?.remove()
  document.getElementById('page-schema')?.remove()
  if (metadata.schema) {
    const script = document.createElement('script')
    script.id = 'page-schema'
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(metadata.schema)
    document.head.append(script)
  }
}
