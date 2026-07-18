export const BLOG_POSTS = [
  {
    id: 'maintainability',
    meta: 'Technical Writing — 2025',
    title: 'How I structure web apps for long-term maintainability',
    excerpt: 'A practical breakdown of the patterns I use to ship clean, scalable projects that are easy to hand off and build on.',
    body: [
      "Most of the projects I build start as single-file HTML — one file, embedded CSS and JS, no build step. It sounds like a shortcut, but it's actually the opposite: it forces every decision about structure to be deliberate, because there's nowhere to hide complexity behind a folder structure.",
      "The rule I follow is simple — group by feature, not by file type. A modal's markup, styles, and behavior live near each other conceptually even in a single file, with clear comment headers marking sections. When a project outgrows one file, I split along those same feature boundaries rather than the generic 'components/utils/styles' pattern, so the multi-file version reads the same way the single-file version did.",
      "Naming is the other half of it. I lean on consistent prefixes — project-card, writing-item, detail-modal — so that six months later, searching the codebase for a feature is a five-second grep, not a hunt. Consistency beats cleverness almost every time.",
      "The last piece is treating every fix as a chance to simplify, not just patch. If a bug points at tangled logic, I take the extra ten minutes to untangle it before moving on. That habit is the difference between a codebase that's still easy to hand off a year later, and one that's quietly become unmaintainable.",
    ],
  },
  {
    id: 'cwv-nigeria',
    meta: 'SEO — 2025',
    title: 'Core Web Vitals for Nigerian websites: what actually matters',
    excerpt: 'A targeted guide to passing CWV on low-bandwidth networks common in West Africa.',
    body: [
      "Most Core Web Vitals advice assumes fast, stable connections. That assumption falls apart fast on Nigerian networks, where 3G and inconsistent 4G are still the norm for a huge share of visitors. Optimizing for a lab score on fast wifi doesn't tell you much about the real experience.",
      "Largest Contentful Paint is the metric I obsess over most here, because hero images and web fonts are the two biggest offenders. I compress images aggressively, serve modern formats, and load fonts with font-display: swap so text isn't invisible while a font file crawls in over a weak connection.",
      "Cumulative Layout Shift matters more than people think on mobile-heavy traffic, because Nigerian users are overwhelmingly on phones, often mid-scroll on a moving bus or generator-powered wifi. Reserving space for images and ads before they load prevents the frustrating jump that makes people tap the wrong thing.",
      "The last thing I check is total JavaScript weight. A lot of client sites arrive with heavy tracking scripts and unused libraries bolted on over the years. Trimming that — even just deferring non-critical scripts — often does more for real-world performance than any single Vitals-focused tweak.",
    ],
  },
  {
    id: 'supabase-integration',
    meta: 'Engineering — 2025',
    title: 'Integrating Supabase into a lightweight frontend project',
    excerpt: 'Step-by-step: auth, CRUD, and real-time subscriptions with a minimal, dependency-light setup.',
    body: [
      "Supabase is my default when a client project needs a real backend but doesn't justify spinning up a full custom API. Auth, a Postgres database, and real-time subscriptions are available almost immediately, which matters when you're working in single-file HTML and want to keep the setup lightweight.",
      "Auth is usually the first thing I wire up — email/password to start, since most client projects don't need social login on day one. I keep the session check minimal: a single onAuthStateChange listener that toggles the UI between logged-in and guest states.",
      "For CRUD, I avoid over-abstracting. Direct Supabase client calls inside the relevant functions are more readable in a small codebase than a generic data-access layer that adds indirection without adding value. Row-level security policies do the real work of keeping data safe, not application-side checks.",
      "Real-time subscriptions are where Supabase earns its keep for client work — an admin updates a product or a listing, and it reflects on the live site without a refresh. It's a small detail, but it's the kind of thing that makes a client site feel genuinely modern rather than just functional.",
    ],
  },
  {
    id: 'usd-clients',
    meta: 'Career — 2025',
    title: 'Landing USD-paying clients as a Lagos-based developer',
    excerpt: 'My honest account of the platforms, outreach strategies, and positioning that worked.',
    body: [
      "The biggest shift for me wasn't finding clients — it was positioning. Early on I was pitching as 'a developer in Nigeria,' which framed price as the pitch. Once I started leading with the work itself — finished products, clear before/after outcomes — the conversation moved away from rate negotiation entirely.",
      "A portfolio of real, working products did more than any cold pitch. Clients want to see that you've shipped something that looks and functions like a real business tool, not a tutorial project. That's part of why I build in single-file HTML for a lot of personal and client work — it's fast to iterate and easy to demo live.",
      "Invoicing in USD from day one, even for early clients, set the tone for every conversation after. It's a small thing, but it signals you're running this as a business, not picking up freelance gigs on the side.",
      "The last piece was just being direct about time zones and communication. Being upfront about working async, responding fast during overlap hours, and setting clear expectations removed the hesitation a lot of overseas clients have about hiring remotely into a new market.",
    ],
  },
]
