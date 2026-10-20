import { createElement as h } from 'react'

const formatDate = (value) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}

// Shared by the browser and the article function. Regular React elements let
// Node render the same content without a separate JSX compilation pipeline.
export default function ArticleContent({ post }) {
  return h('main', { className: 'flex-1 px-5 md:px-10 py-16 md:py-24' },
    h('article', { className: 'max-w-2xl mx-auto' },
      h('a', { href: '/#writing', className: 'inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-blue hover:underline mb-10' }, '← Back to writing'),
      post.image && h('img', { src: post.image, alt: post.title, width: 1200, height: 630, decoding: 'async', className: 'w-full aspect-[1200/630] object-cover border-2 border-ink mb-8' }),
      h('div', { className: 'font-mono text-xs uppercase tracking-widest text-blue mb-2' }, post.meta),
      h('h1', { className: 'font-display text-3xl md:text-4xl leading-tight mb-4' }, post.title),
      h('div', { className: 'font-mono text-xs text-ink-soft mb-8' },
        'By ' + (post.author || 'Bakare Feranmi'),
        post.publishedAt && h('span', null, ' · ', h('time', { dateTime: post.publishedAt }, formatDate(post.publishedAt))),
        post.updatedAt && post.updatedAt !== post.publishedAt && h('span', null, ' · Updated ', h('time', { dateTime: post.updatedAt }, formatDate(post.updatedAt))),
      ),
      h('div', { className: 'space-y-4' }, post.body.map((paragraph, index) => h('p', { key: index, className: 'text-sm md:text-base text-ink leading-relaxed' }, paragraph))),
    ),
  )
}
