// Stable sample data from the live site (Oct 2026). If a template is removed, swap in another from sitemap.xml.

export const FREE_TEMPLATE = {
  path: '/free-templates/after-effects/titles/cinematic-free-animated-titles-after-effects-template-for-creative-projects',
  downloadId: 3643,
};

export const PREMIUM_TEMPLATE = {
  path: '/premium-templates/after-effects/titles/elegant-serif-cinematic-movie-title-with-director-credit-after-effects-template',
  downloadId: 9365,
};

/** Distinct free templates, used by quota tests. */
export const FREE_DOWNLOAD_IDS = [434, 3680, 3706, 127, 532, 3773];

export const STATIC_PAGES = [
  '/', '/pricing', '/black-friday', '/black-friday/premiere-pro', '/black-friday/after-effects',
  '/about', '/faq', '/contact', '/license', '/terms', '/privacy', '/refund', '/dmca', '/blog',
  '/blog/the-one-second-rule-why-logo-reveals-got-shorter', '/blog/how-to-use-after-effects-templates',
  '/blog/how-to-use-mogrt-templates-in-premiere-pro', '/blog/typoanim-is-live',
  '/login', '/register', '/forgot-password',
];

export const LISTING_PAGES = [
  '/free-templates', '/premium-templates',
  '/free-templates/after-effects', '/free-templates/premiere-pro',
  '/premium-templates/after-effects', '/premium-templates/premiere-pro',
  ...['logo-animations', 'lower-thirds', 'slideshow', 'titles'].map((c) => `/free-templates/${c}`),
  ...['infographics', 'logo-animations', 'lower-thirds', 'news', 'product-promo', 'saas', 'slideshow', 'titles', 'transitions']
    .flatMap((c) => [`/premium-templates/${c}`, `/templates/${c}`]),
  '/templates/search?q=logo', '/templates/search?res=vertical',
];

/** One template detail page per (licence, software, category) group. */
export const TEMPLATE_SAMPLES = [
  '/free-templates/after-effects/logo-animations/minimal-filled-square-brand-logo-intro-for-brand-intros-free-after-effects',
  '/free-templates/after-effects/titles/minimal-typography-free-after-effects-text-animation-template-for-clean-design',
  '/free-templates/after-effects/titles/overline-underline-title-for-training-videos-in-after-effects-free-download',
  FREE_TEMPLATE.path,
  PREMIUM_TEMPLATE.path,
  '/premium-templates/premiere-pro/titles/handwritten-tagline-typography-with-wide-caps-and-dashes-premiere-pro-mogrt',
  '/premium-templates/after-effects/product-promo/3d-perspective-product-boxes-black-friday-sale-promo-after-effects-template',
  '/premium-templates/premiere-pro/infographics/animated-bar-graph-infographics-for-business-reports-premiere-pro-motion-graphics-template',
  '/premium-templates/after-effects/transitions/rainbow-bar-sweep-colorful-title-transition-after-effects-template',
  '/premium-templates/after-effects/saas/ai-productivity-saas-promo-after-effects-template-with-3d-perspective-dashboard-screens',
  '/premium-templates/premiere-pro/lower-thirds/elegant-shadow-name-lower-thirds-and-information-banners-for-premiere-pro',
  '/premium-templates/after-effects/slideshow/cinematic-slideshow-openers-featuring-photo-filled-mega-letters-after-effects-template',
];

export const ACCOUNT_PAGES = ['/profile', '/downloads', '/collection'];
