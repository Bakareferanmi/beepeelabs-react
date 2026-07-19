import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyChBo4SbtNLMkuk_hrAKFZkaQwRkfC8Q2E",
  authDomain: "beepeelabs.firebaseapp.com",
  projectId: "beepeelabs",
  storageBucket: "beepeelabs.firebasestorage.app",
  messagingSenderId: "892162385908",
  appId: "1:892162385908:web:107db4e9d002b9357c3ba1",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

const EMAIL = process.env.FIREBASE_ADMIN_EMAIL
const PASSWORD = process.env.FIREBASE_ADMIN_PASSWORD

if (!EMAIL || !PASSWORD) {
  console.error('Set FIREBASE_ADMIN_EMAIL and FIREBASE_ADMIN_PASSWORD env vars first.')
  process.exit(1)
}

const ABOUT = {
  eyebrow: '01 / About',
  heading: 'Engineer by training,\nbuilder by choice',
  paragraphs: [
    'I am **Bakare Oluwaferanmi**, a software engineer who graduated with a B.Eng. in Electrical and Electronics Engineering. I bridge the gap between technical rigor and great user experience.',
    'My work spans UI engineering, SEO architecture, and technical writing. I write code the same way I write documentation: clearly, purposefully, and with the reader in mind.',
    'I founded **BeepeeLabs** as a space to build, publish, and collaborate. Every project here is something I have shipped and stand behind.',
  ],
  stats: [
    { label: 'Base', value: 'Lagos, Nigeria — remote available' },
    { label: 'Status', value: 'Open to freelance & contract work', accent: true },
    { label: 'Degree', value: 'B.Eng. Electrical & Electronics Engineering', sub: 'Olabisi Onabanjo University' },
    { label: 'Portfolio', value: 'beepeethebrand.netlify.app', link: 'https://beepeethebrand.netlify.app' },
  ],
}

const CONTACT = {
  eyebrow: '05 / Contact',
  heading: "Let's build\nsomething.",
  body: 'Open to software engineering contracts, technical writing gigs, SEO projects, and long-term collaborations. I work with clients globally — remotely or in Lagos — and invoice in USD.',
  links: [
    { icon: 'Mail', label: 'Email', value: 'hello@beepeelabs.com', href: 'mailto:hello@beepeelabs.com' },
    { icon: 'Globe', label: 'Portfolio', value: 'beepeethebrand.netlify.app', href: 'https://beepeethebrand.netlify.app' },
    { icon: 'Github', label: 'GitHub', value: 'github.com/Bakareferanmi', href: 'https://github.com/Bakareferanmi' },
    { icon: 'Linkedin', label: 'LinkedIn', value: 'linkedin.com/in/bakare-feranmi-313357139', href: 'https://www.linkedin.com/in/bakare-feranmi-313357139' },
  ],
}

const SKILLS = [
  { icon: 'Code2', name: 'Frontend Engineering', desc: 'Component-driven UIs, responsive layouts, and accessible, performant interfaces built from the ground up.', tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'Tailwind'] },
  { icon: 'Database', name: 'Backend Integration', desc: 'Connecting frontends to real data. I work with Node.js, Python, Firebase, Supabase, REST APIs, and serverless functions.', tags: ['Node.js', 'Python', 'Firebase', 'Supabase', 'REST API', 'Cloudinary'] },
  { icon: 'Search', name: 'SEO Strategy', desc: 'Technical SEO audits, content architecture, on-page optimization, and structured data implementation.', tags: ['Technical SEO', 'Schema', 'Core Web Vitals', 'Analytics'] },
  { icon: 'FileText', name: 'Technical Writing', desc: 'Developer docs, how-to guides, product content, and blog posts that rank and actually help people.', tags: ['Dev Docs', 'API Guides', 'Content Strategy', 'Markdown'] },
  { icon: 'PenTool', name: 'UI / Product Design', desc: 'Wireframes, design systems, and high-fidelity interfaces. I can design it and build it.', tags: ['Figma', 'Design Systems', 'Prototyping'] },
  { icon: 'Megaphone', name: 'Digital Marketing', desc: 'Growth strategy, content marketing, and conversion-focused copy for web products and brands.', tags: ['Content Marketing', 'Conversion', 'Brand Strategy'] },
]

const HERO = {
  headline: 'I build interfaces that actually work',
  subtext: 'Software engineer, technical writer, and SEO strategist. I turn complex problems into clean, performant web products. Based in Lagos — available remotely.',
  availableForWork: true,
}

const PROJECTS = [
  { id: 'evvee', type: 'Marketplace', name: 'Evvee', initials: 'EV', desc: 'Nigerian event vendor marketplace. WhatsApp-first contact model with vendor profiles, reviews, a blog, and a fully functional listing dashboard.', summary: 'A Nigerian event vendor marketplace built around how people actually book vendors here — over WhatsApp. Evvee gives vendors a real storefront and gives clients a fast way to compare, browse, and reach out.', features: ['Vendor profiles with cover photos, packages, portfolio galleries, and reviews', 'WhatsApp-first contact flow instead of forms nobody replies to', 'Search and filtering across 12+ vendor categories', 'A self-service listing dashboard vendors can edit themselves', 'Location browsing covering all 36 Nigerian states'], stack: ['HTML', 'CSS', 'JavaScript', 'LocalStorage'], link: null },
  { id: 'tootorlee', type: 'SaaS Tool', name: 'Tootorlee', initials: 'TL', desc: 'Open-source AI study tool for students and teachers. Features chat history persistence, markdown rendering, and a smooth typing animation. Built with the Anthropic API.', summary: 'An AI-powered study assistant built for students and teachers who need a faster way to turn source material into something they can actually study from.', features: ['Chat history that persists across sessions', 'Markdown rendering for clean, readable AI responses', 'Speech-to-text transcription with an editable text box', 'A fullscreen slide viewer for study material with keyboard navigation', 'Built directly on the Anthropic API'], stack: ['HTML', 'JavaScript', 'AI API', 'PWA'], link: null },
  { id: 'isebe', type: 'E-commerce', name: 'Isebe', initials: 'IS', desc: 'Lagos food brand storefront with a Supabase backend, admin panel, blog system, and image carousel. Production-grade architecture with clean, maintainable code.', summary: 'A storefront and content platform for a Lagos food brand, rebuilt on a production-grade backend so the client could manage everything themselves without calling a developer every time.', features: ['Full backend on Firebase (Firestore + Auth), migrated from an earlier Supabase setup', 'Cloudinary-hosted image pipeline for menu and gallery photos', 'Built-in blog system for the brand to publish updates', 'SEO, Open Graph, and JSON-LD restaurant structured data', 'Admin dashboard for day-to-day content management'], stack: ['HTML', 'Firebase', 'Cloudinary', 'JS'], link: 'https://do-d6d535.netlify.app' },
  { id: 'beelvoice', type: 'Finance Tool', name: 'Beelvoice', initials: 'BV', desc: 'Professional invoicing app for Nigerian freelancers. Auto-incrementing invoice numbers, light/dark mode, PDF export, and full SEO optimization.', summary: 'A professional invoicing app built for Nigerian freelancers who needed something quicker and cleaner than juggling spreadsheets and Word templates.', features: ['Auto-incrementing invoice numbers, so nothing gets duplicated or lost', 'Light and dark mode', 'One-click PDF export for sending straight to clients', 'Full on-page SEO so freelancers searching for invoice tools can find it'], stack: ['HTML', 'JavaScript', 'CSS', 'PDF'], link: null },
  { id: 'jhay-atelier', type: 'Fashion Brand', name: 'Jhay Atelier', initials: 'JA', desc: 'Bespoke couture brand website with a Firebase Realtime Database backend, Cloudinary image uploads, admin dashboard, and SEO meta tags.', summary: 'A bespoke couture brand site for a Lagos-based designer, built to feel as considered as the clothes — with a lightweight admin system the designer can run without touching code.', features: ['Firebase Realtime Database backend for live content updates', 'Cloudinary-powered image uploads for lookbook and gallery content', 'Hidden admin dashboard accessible via a triple-tap gesture', 'Full SEO meta tag setup for discoverability'], stack: ['Firebase', 'Cloudinary', 'JavaScript', 'SEO'], link: null },
  { id: 'hairehaven', type: 'E-commerce', name: 'Hairehaven', initials: 'HH', desc: 'A storefront for hair stylists to showcase and sell their products and services online. Built for a smooth browsing and checkout experience.', summary: 'An online store built for hair stylists to showcase their work and sell products and services directly to clients.', features: ['Storefront for stylist products and services', 'Clean, mobile-first browsing and checkout flow', 'Built on a modern React/Next.js stack for speed and SEO'], stack: ['React', 'Next.js', 'Node.js'], link: null },
]

const WRITING = [
  { id: 'maintainability', meta: 'Technical Writing — 2025', title: 'How I structure web apps for long-term maintainability', excerpt: 'A practical breakdown of the patterns I use to ship clean, scalable projects that are easy to hand off and build on.', body: ["Most of the projects I build start as single-file HTML — one file, embedded CSS and JS, no build step. It sounds like a shortcut, but it's actually the opposite: it forces every decision about structure to be deliberate, because there's nowhere to hide complexity behind a folder structure.", "The rule I follow is simple — group by feature, not by file type. A modal's markup, styles, and behavior live near each other conceptually even in a single file, with clear comment headers marking sections. When a project outgrows one file, I split along those same feature boundaries rather than the generic 'components/utils/styles' pattern, so the multi-file version reads the same way the single-file version did.", "Naming is the other half of it. I lean on consistent prefixes — project-card, writing-item, detail-modal — so that six months later, searching the codebase for a feature is a five-second grep, not a hunt. Consistency beats cleverness almost every time.", "The last piece is treating every fix as a chance to simplify, not just patch. If a bug points at tangled logic, I take the extra ten minutes to untangle it before moving on. That habit is the difference between a codebase that's still easy to hand off a year later, and one that's quietly become unmaintainable."] },
  { id: 'cwv-nigeria', meta: 'SEO — 2025', title: 'Core Web Vitals for Nigerian websites: what actually matters', excerpt: 'A targeted guide to passing CWV on low-bandwidth networks common in West Africa.', body: ["Most Core Web Vitals advice assumes fast, stable connections. That assumption falls apart fast on Nigerian networks, where 3G and inconsistent 4G are still the norm for a huge share of visitors. Optimizing for a lab score on fast wifi doesn't tell you much about the real experience.", "Largest Contentful Paint is the metric I obsess over most here, because hero images and web fonts are the two biggest offenders. I compress images aggressively, serve modern formats, and load fonts with font-display: swap so text isn't invisible while a font file crawls in over a weak connection.", "Cumulative Layout Shift matters more than people think on mobile-heavy traffic, because Nigerian users are overwhelmingly on phones, often mid-scroll on a moving bus or generator-powered wifi. Reserving space for images and ads before they load prevents the frustrating jump that makes people tap the wrong thing.", "The last thing I check is total JavaScript weight. A lot of client sites arrive with heavy tracking scripts and unused libraries bolted on over the years. Trimming that — even just deferring non-critical scripts — often does more for real-world performance than any single Vitals-focused tweak."] },
  { id: 'supabase-integration', meta: 'Engineering — 2025', title: 'Integrating Supabase into a lightweight frontend project', excerpt: 'Step-by-step: auth, CRUD, and real-time subscriptions with a minimal, dependency-light setup.', body: ["Supabase is my default when a client project needs a real backend but doesn't justify spinning up a full custom API. Auth, a Postgres database, and real-time subscriptions are available almost immediately, which matters when you're working in single-file HTML and want to keep the setup lightweight.", "Auth is usually the first thing I wire up — email/password to start, since most client projects don't need social login on day one. I keep the session check minimal: a single onAuthStateChange listener that toggles the UI between logged-in and guest states.", "For CRUD, I avoid over-abstracting. Direct Supabase client calls inside the relevant functions are more readable in a small codebase than a generic data-access layer that adds indirection without adding value. Row-level security policies do the real work of keeping data safe, not application-side checks.", "Real-time subscriptions are where Supabase earns its keep for client work — an admin updates a product or a listing, and it reflects on the live site without a refresh. It's a small detail, but it's the kind of thing that makes a client site feel genuinely modern rather than just functional."] },
  { id: 'usd-clients', meta: 'Career — 2025', title: 'Landing USD-paying clients as a Lagos-based developer', excerpt: 'My honest account of the platforms, outreach strategies, and positioning that worked.', body: ["The biggest shift for me wasn't finding clients — it was positioning. Early on I was pitching as 'a developer in Nigeria,' which framed price as the pitch. Once I started leading with the work itself — finished products, clear before/after outcomes — the conversation moved away from rate negotiation entirely.", "A portfolio of real, working products did more than any cold pitch. Clients want to see that you've shipped something that looks and functions like a real business tool, not a tutorial project. That's part of why I build in single-file HTML for a lot of personal and client work — it's fast to iterate and easy to demo live.", "Invoicing in USD from day one, even for early clients, set the tone for every conversation after. It's a small thing, but it signals you're running this as a business, not picking up freelance gigs on the side.", "The last piece was just being direct about time zones and communication. Being upfront about working async, responding fast during overlap hours, and setting clear expectations removed the hesitation a lot of overseas clients have about hiring remotely into a new market."] },
]

async function seed() {
  await signInWithEmailAndPassword(auth, EMAIL, PASSWORD)
  console.log('Signed in. Seeding...')

  await setDoc(doc(db, 'content', 'hero'), HERO)
  console.log('✓ hero')

  await setDoc(doc(db, 'content', 'about'), ABOUT)
  console.log('✓ about')

  await setDoc(doc(db, 'content', 'skills'), { items: SKILLS })
  console.log('✓ skills')

  await setDoc(doc(db, 'content', 'contact'), CONTACT)
  console.log('✓ contact')

  for (const p of PROJECTS) {
    await setDoc(doc(db, 'projects', p.id), p)
    console.log(`✓ project: ${p.id}`)
  }

  for (const w of WRITING) {
    await setDoc(doc(db, 'writing', w.id), w)
    console.log(`✓ writing: ${w.id}`)
  }

  console.log('Done seeding.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
