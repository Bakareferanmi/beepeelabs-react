// Project explanations, based on the work described in the public CMS.
// These describe the product and its use, without claiming sales or client results.
export const PROJECT_STORIES = [
  {
    id: 'hairehaven',
    title: 'Hairehaven: Hair Store Website Project',
    heading: 'An online storefront for a hair business',
    description: 'Explore Hairehaven, a hair storefront project with product browsing and a mobile checkout flow. Discuss an online store for your own business.',
    category: 'Online store',
    intro: 'Hairehaven is a storefront for a hair business to present its products and services online. It gives a potential customer a place to browse the range before deciding what to buy.',
    brief: 'For a hair or beauty business, a social profile can start the conversation. A dedicated website gives people a more organised way to explore products, understand the offer and move towards an order. The storefront brings that journey into one place.',
    approach: 'The project centres on product presentation, browsing on a phone and a clear checkout flow. The interface uses React and Next.js, with the browsing experience kept consistent across small and large screens.',
    features: ['A storefront for hair products and services', 'Product browsing designed for phone screens', 'A clear path from browsing to the checkout flow'],
    relevance: 'If you sell hair, fashion or other products, we can plan a store around your catalogue and how customers order. Payments, delivery options, product management and any existing systems are agreed in the project scope.',
    quote: 'an online store like Hairehaven',
  },
  {
    id: 'isebe',
    title: 'Isebe: Lagos Food Brand Website Project',
    heading: 'A website a food business can keep up to date',
    description: 'Explore Isebe, a Lagos food brand website with content management, image uploads and a blog. Discuss a website for your restaurant or food business.',
    category: 'Food business website',
    intro: 'Isebe is a storefront and content platform for a Lagos food brand. It combines a public website with admin tools for keeping the brand’s information and images up to date.',
    brief: 'A food business needs to show people what it offers and keep that information current. New images, menu content and announcements should have a clear home. The project includes an admin dashboard so routine content changes can happen without editing the website code.',
    approach: 'The current project uses Firebase for its backend and authentication, alongside Cloudinary for images. A built-in blog gives the brand a place to publish updates. Page metadata and restaurant structured data help describe the public content.',
    features: ['An admin dashboard for day-to-day content updates', 'Cloudinary image uploads for food and gallery photos', 'A blog for brand news and updates', 'Page metadata and restaurant structured data'],
    relevance: 'For a restaurant, caterer or food brand, we can plan a site around your menu, location, enquiries and content updates. If you need online ordering or payments, we will define those requirements separately before the build.',
    quote: 'a food business website like Isebe',
  },
  {
    id: 'evvee',
    title: 'Evvee: Nigerian Event Vendor Marketplace Project',
    heading: 'A marketplace that helps people find event vendors',
    description: 'Explore Evvee, an event vendor marketplace with profiles, category browsing and WhatsApp contact. Discuss a directory or marketplace for your business.',
    category: 'Marketplace web app',
    intro: 'Evvee is a Nigerian event vendor marketplace. It brings vendor information, packages and portfolios into a browsing experience, with WhatsApp as the route to starting a conversation.',
    brief: 'When someone is planning an event, they need to compare what vendors offer and see enough information to decide who to contact. Evvee organises that information into profiles and categories so visitors can explore their options before reaching out.',
    approach: 'The project combines category and location browsing with vendor profiles and a listing dashboard. Contact links connect visitors to WhatsApp, allowing the conversation to continue in a channel they already use.',
    features: ['Vendor profiles with packages and portfolio galleries', 'Category and location browsing', 'A dashboard for editing vendor listings', 'WhatsApp contact links beside vendor information'],
    relevance: 'If you are planning a directory, booking platform or marketplace, we can start with the core journey: who creates a listing, how people find it and what happens when they want to enquire. Accounts, moderation and payments are scoped around that journey.',
    quote: 'a marketplace or directory like Evvee',
  },
]

export const projectPath = (id) => '/projects/' + encodeURIComponent(id)
