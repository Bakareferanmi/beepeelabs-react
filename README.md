# BeepeeLabs — React

A BeepeeLabs portfolio built with React, Vite, Tailwind CSS v3, Framer Motion and a Firebase content editor. Public pages include software development, technical writing and SEO services.

## Design concept — "Danfo Signal"

Inspired by Lagos danfo bus livery: bold yellow-and-black signage, route plates, and hand-painted destination boards, filtered through an engineer's precision (hairline grid, mono data labels, sharp edges instead of soft shadows). The signature moment is the scrolling destination ticker under the nav, and project cards styled as numbered route tickets (RT-01, RT-02...).

- **Colors:** paper `#F7F4EC`, ink `#14120E`, signal yellow `#FFC22E`, route blue `#2547FF`, status green `#1FA463`
- **Type:** Anton (display/headlines), Inter (body), Space Mono (labels/data)
- **Motion:** Framer Motion for scroll reveals, staggered lists, the hero word-by-word entrance, the infinite ticker, and the hero avatar 3D flip

## Getting started

```bash
npm ci
npm run dev       # local dev server
npm run build     # production build to dist/
npm run preview   # preview the production build locally
npm run lint
npm test          # publication, article response and sitemap regression checks
```

## Project structure

```
src/
  assets/           avatar photos, logo (pulled from the original site)
  data/             projects.js, blogPosts.js — edit content here
  components/       Nav, Ticker, Hero, About, Skills, Projects, Writing,
                     Contact, Footer, WhatsAppButton, ProjectModal, BlogModal
  App.jsx           page composition + modal state
  index.css         design tokens (Tailwind v4 @theme block)
```

Project and article content on the live site is managed in the Firebase-backed
editor at `/admin`. The older files in `src/data/projects.js` and
`src/data/blogPosts.js` are seed data, not the live CMS. Service page copy lives
in `src/data/services.js`.

## Public rendering and SEO

`npm run build` first builds the client, then runs `scripts/prerender.mjs`.
The script reads the public Firebase content and renders the existing React
homepage plus four service pages to HTML. It also emits an admin shell and a
custom `404.html`. The build requires access to the existing public Firestore
REST API; a content outage fails the build instead of publishing an empty site.

The browser starts with that public snapshot and refreshes its content from
Firebase. To refresh the homepage's initial HTML after changing CMS content,
trigger a new Vercel build. Service copy changes also need a build.

Articles are rendered at request time by `api/writing-og.js`, including their
visible body, metadata and BlogPosting structured data. Article edits and
publication changes need no rebuild. Public article responses and the dynamic
sitemap cache for 60 seconds, with up to 30 seconds of stale revalidation.

New articles default to **Draft**. Choose **Published** and save to include one
on the website and in the sitemap. A title and article body containing text are
required. The existing test documents `nnn`, `my-new-beginning` and `what's-good`
are treated as drafts unless explicitly published with substantive content.
They are retained in Firebase and remain editable. Other existing articles keep
their previous public status. Draft filtering is a publication control; this
change does not modify Firestore access rules.

Vercel rewrites only known article, service and admin routes. Missing paths use
the generated 404 page and HTTP 404 status. Article lookup failures return a
retryable, uncached 503 rather than an empty successful page. Functions include
`dist/index.html` explicitly so they can load the template without an HTTP
request back into the deployment.

`npm run preview` previews static output only. The dynamic article and sitemap
functions require Vercel's development environment or a preview deployment.
After deploying, inspect the homepage, a service page and an article in Search
Console, then submit `/sitemap.xml`. Search Console access and ranking outcomes
are outside the code changes.

## Deploying (GitHub → Vercel)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/beepeelabs-react.git
git push -u origin main
```

Then import the repo on vercel.com — Vercel auto-detects Vite and uses
`npm run build` / `dist` with no extra config needed.

## Performance

The admin app and Firebase Authentication load in a separate chunk. Public
skill icons use named imports instead of shipping the complete Lucide icon
catalogue. Supported editor icon names are Code2, Database, Search, FileText,
PenTool, Megaphone, Smartphone, Globe, Server, Palette, Wrench and BarChart3;
unknown names fall back to Code2. Project images load lazily with reserved space,
and public pages no longer wait for a fixed-duration loading overlay.
