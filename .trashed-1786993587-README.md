# BeepeeLabs — React

A full rebuild of the BeepeeLabs portfolio in React, using Vite, Tailwind CSS v4, and Framer Motion. Same content and copy as the original single-file version — new visual identity and interaction design.

## Design concept — "Danfo Signal"

Inspired by Lagos danfo bus livery: bold yellow-and-black signage, route plates, and hand-painted destination boards, filtered through an engineer's precision (hairline grid, mono data labels, sharp edges instead of soft shadows). The signature moment is the scrolling destination ticker under the nav, and project cards styled as numbered route tickets (RT-01, RT-02...).

- **Colors:** paper `#F7F4EC`, ink `#14120E`, signal yellow `#FFC22E`, route blue `#2547FF`, status green `#1FA463`
- **Type:** Anton (display/headlines), Inter (body), Space Mono (labels/data)
- **Motion:** Framer Motion for scroll reveals, staggered lists, the hero word-by-word entrance, the infinite ticker, and the hero avatar 3D flip

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # production build to dist/
npm run preview   # preview the production build locally
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

To edit project or writing content, edit `src/data/projects.js` or
`src/data/blogPosts.js` — no need to touch component code.

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

## Notes

- The WhatsApp button link uses a placeholder number — update it in
  `src/components/WhatsAppButton.jsx`.
- The contact form is currently front-end only (shows a "Message sent"
  confirmation but doesn't send anywhere). Wire it up to Formspree, a
  serverless function, or your email provider of choice when ready.
- Two extras from the old single-file site — the hidden triple-tap admin
  panel and the animated dog puppet — were left out of this rebuild to keep
  scope focused on the redesign. Say the word if you want either back in.
