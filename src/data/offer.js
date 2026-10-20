export const HERO_DEFAULTS = {
  headline: 'Websites built for your business',
  subtext: 'I build business websites, online stores and web apps that make it easy for customers to see what you offer and contact you. Based in Lagos, working with clients worldwide.',
  availableForWork: true,
}

const LEGACY_HEADLINE = 'I build interfaces that actually work'
const LEGACY_SUBTEXT = 'Software engineer, technical writer, and SEO strategist. I turn complex problems into clean, performant web products. Based in Lagos — available remotely.'

// Update the original starter copy while preserving custom CMS edits. The editor
// uses the same resolver so it shows the copy visitors actually see.
export function resolveHero(content = {}) {
  content = content || {}
  return {
    ...HERO_DEFAULTS,
    ...content,
    headline: !content.headline?.trim() || content.headline === LEGACY_HEADLINE ? HERO_DEFAULTS.headline : content.headline,
    subtext: !content.subtext?.trim() || content.subtext === LEGACY_SUBTEXT ? HERO_DEFAULTS.subtext : content.subtext,
  }
}
