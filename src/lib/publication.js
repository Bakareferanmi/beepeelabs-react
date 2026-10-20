// Keep the existing test documents editable without deleting anything in Firestore.
// Saving one as Published in the editor explicitly opts it back into the public site.
const LEGACY_DRAFT_IDS = new Set(['nnn', 'my-new-beginning', "what's-good"])
const hasText = (value) => typeof value === 'string' && /[\p{L}\p{N}]/u.test(value)

export function publicationError(post) {
  if (!hasText(post?.title)) return 'Add a descriptive title before publishing.'
  if (!Array.isArray(post?.body) || !post.body.some(hasText)) {
    return 'Add article content before publishing.'
  }
  return null
}

export function publicationStatus(post) {
  if (!post || publicationError(post)) return 'draft'
  if (post.status !== undefined) return post.status === 'published' ? 'published' : 'draft'
  return LEGACY_DRAFT_IDS.has(post.id) ? 'draft' : 'published'
}

export const isPublishedPost = (post) => publicationStatus(post) === 'published'
