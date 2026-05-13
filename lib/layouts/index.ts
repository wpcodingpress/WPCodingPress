import type { NormalizedSiteData } from '@/types/content-schema'

export interface IndustryLayout {
  id: string
  name: string
  description: string
  sections: SectionConfig[]
  homepageLayout: HomepageLayout
  visualSettings: VisualSettings
}

export interface SectionConfig {
  id: string
  name: string
  component: string
  required: boolean
  priority: number
  maxItems?: number
  layoutVariant: string
}

export interface HomepageLayout {
  heroStyle: 'centered' | 'split' | 'fullscreen' | 'overlay'
  gridLayout: 'sidebar' | 'full' | 'magazine'
  contentWidth: 'narrow' | 'default' | 'wide' | 'full'
  showBreadcrumbs: boolean
}

export interface VisualSettings {
  containerClass: string
  sectionSpacing: string
  cardStyle: 'default' | 'glass' | 'bordered' | 'minimal' | 'elevated'
  buttonStyle: 'primary' | 'outline' | 'ghost' | 'gradient' | 'glow'
  borderRadius: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'none'
  shadowSize: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export function generateIndustryLayout(data: NormalizedSiteData, industry: string): IndustryLayout {
  const generator = LAYOUTS[industry]
  if (generator) return generator(data)
  return LAYOUTS.business(data)
}

const LAYOUTS: Record<string, (data: NormalizedSiteData) => IndustryLayout> = {
  business: (data) => ({
    id: 'business',
    name: 'Business Corporate',
    description: 'Professional business layout with clean typography and structured sections',
    sections: buildBusinessSections(data),
    homepageLayout: {
      heroStyle: data.hero?.backgroundImage ? 'overlay' : 'centered',
      gridLayout: 'full',
      contentWidth: 'default',
      showBreadcrumbs: true,
    },
    visualSettings: {
      containerClass: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
      sectionSpacing: 'py-16 md:py-24',
      cardStyle: 'elevated',
      buttonStyle: 'primary',
      borderRadius: 'lg',
      shadowSize: 'md',
    },
  }),
  agency: (data) => ({
    id: 'agency',
    name: 'Creative Agency',
    description: 'Bold, visually-driven layout for creative agencies and studios',
    sections: buildAgencySections(data),
    homepageLayout: {
      heroStyle: 'split',
      gridLayout: 'full',
      contentWidth: 'wide',
      showBreadcrumbs: false,
    },
    visualSettings: {
      containerClass: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
      sectionSpacing: 'py-20 md:py-32',
      cardStyle: 'glass',
      buttonStyle: 'gradient',
      borderRadius: 'xl',
      shadowSize: 'lg',
    },
  }),
  saas: (data) => ({
    id: 'saas',
    name: 'SaaS Startup',
    description: 'Conversion-optimized layout for software products and platforms',
    sections: buildSaaSSections(data),
    homepageLayout: {
      heroStyle: 'centered',
      gridLayout: 'full',
      contentWidth: 'default',
      showBreadcrumbs: false,
    },
    visualSettings: {
      containerClass: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
      sectionSpacing: 'py-16 md:py-24',
      cardStyle: 'bordered',
      buttonStyle: 'primary',
      borderRadius: 'md',
      shadowSize: 'sm',
    },
  }),
  medical: (data) => ({
    id: 'medical',
    name: 'Medical & Healthcare',
    description: 'Clean, trustworthy layout for medical and healthcare practices',
    sections: buildMedicalSections(data),
    homepageLayout: {
      heroStyle: 'centered',
      gridLayout: 'sidebar',
      contentWidth: 'default',
      showBreadcrumbs: true,
    },
    visualSettings: {
      containerClass: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
      sectionSpacing: 'py-12 md:py-16',
      cardStyle: 'minimal',
      buttonStyle: 'primary',
      borderRadius: 'sm',
      shadowSize: 'none',
    },
  }),
  portfolio: (data) => ({
    id: 'portfolio',
    name: 'Portfolio Showcase',
    description: 'Visual-first layout for showcasing creative work',
    sections: buildPortfolioSections(data),
    homepageLayout: {
      heroStyle: 'fullscreen',
      gridLayout: 'full',
      contentWidth: 'full',
      showBreadcrumbs: false,
    },
    visualSettings: {
      containerClass: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
      sectionSpacing: 'py-20 md:py-32',
      cardStyle: 'glass',
      buttonStyle: 'ghost',
      borderRadius: 'xl',
      shadowSize: 'lg',
    },
  }),
  blog: (data) => ({
    id: 'blog',
    name: 'Blog & Editorial',
    description: 'Content-first layout optimized for reading and engagement',
    sections: buildBlogSections(data),
    homepageLayout: {
      heroStyle: 'centered',
      gridLayout: 'sidebar',
      contentWidth: 'narrow',
      showBreadcrumbs: true,
    },
    visualSettings: {
      containerClass: 'max-w-5xl mx-auto px-4 sm:px-6',
      sectionSpacing: 'py-12 md:py-20',
      cardStyle: 'minimal',
      buttonStyle: 'ghost',
      borderRadius: 'md',
      shadowSize: 'none',
    },
  }),
  news: (data) => ({
    id: 'news',
    name: 'News Magazine',
    description: 'Dynamic layout for news portals with category-based organization',
    sections: buildNewsSections(data),
    homepageLayout: {
      heroStyle: 'overlay',
      gridLayout: 'magazine',
      contentWidth: 'wide',
      showBreadcrumbs: false,
    },
    visualSettings: {
      containerClass: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
      sectionSpacing: 'py-8 md:py-12',
      cardStyle: 'bordered',
      buttonStyle: 'outline',
      borderRadius: 'sm',
      shadowSize: 'sm',
    },
  }),
}

function buildBusinessSections(data: NormalizedSiteData): SectionConfig[] {
  const sections: SectionConfig[] = [
    { id: 'navbar', name: 'Navigation', component: 'Navbar', required: true, priority: 100, layoutVariant: 'default' },
    { id: 'hero', name: 'Hero Section', component: 'Hero', required: true, priority: 90, layoutVariant: 'default' },
  ]
  if (data.stats.length > 0) sections.push({ id: 'stats', name: 'Stats', component: 'Stats', required: false, priority: 40, layoutVariant: 'default' })
  if (data.services.length > 0) sections.push({ id: 'services', name: 'Services', component: 'Features', required: false, priority: 70, maxItems: 6, layoutVariant: 'grid' })
  if (data.portfolio.length > 0) sections.push({ id: 'portfolio', name: 'Portfolio', component: 'Gallery', required: false, priority: 60, maxItems: 6, layoutVariant: 'grid' })
  if (data.testimonials.length > 0) sections.push({ id: 'testimonials', name: 'Testimonials', component: 'Testimonials', required: false, priority: 55, maxItems: 6, layoutVariant: 'carousel' })
  if (data.cta) sections.push({ id: 'cta', name: 'CTA', component: 'CTA', required: false, priority: 50, layoutVariant: 'default' })
  if (data.faqs.length > 0) sections.push({ id: 'faq', name: 'FAQ', component: 'FAQ', required: false, priority: 35, maxItems: 8, layoutVariant: 'accordion' })
  if (data.posts.length > 0) sections.push({ id: 'blog', name: 'Blog', component: 'BlogGrid', required: false, priority: 45, maxItems: 6, layoutVariant: 'grid' })
  if (data.contact) sections.push({ id: 'contact', name: 'Contact', component: 'Contact', required: false, priority: 40, layoutVariant: 'split' })
  if (data.newsletter) sections.push({ id: 'newsletter', name: 'Newsletter', component: 'Newsletter', required: false, priority: 30, layoutVariant: 'inline' })
  sections.push({ id: 'footer', name: 'Footer', component: 'Footer', required: true, priority: 100, layoutVariant: 'default' })
  return sections
}

function buildAgencySections(data: NormalizedSiteData): SectionConfig[] {
  const sections: SectionConfig[] = [
    { id: 'navbar', name: 'Navigation', component: 'Navbar', required: true, priority: 100, layoutVariant: 'glass' },
    { id: 'hero', name: 'Hero Section', component: 'Hero', required: true, priority: 90, layoutVariant: 'split' },
  ]
  if (data.stats.length > 0) sections.push({ id: 'stats', name: 'Stats', component: 'Stats', required: false, priority: 50, layoutVariant: 'counters' })
  if (data.services.length > 0) sections.push({ id: 'services', name: 'Services', component: 'Features', required: false, priority: 75, maxItems: 6, layoutVariant: 'cards' })
  if (data.portfolio.length > 0) sections.push({ id: 'portfolio', name: 'Portfolio', component: 'Gallery', required: false, priority: 80, maxItems: 9, layoutVariant: 'masonry' })
  if (data.testimonials.length > 0) sections.push({ id: 'testimonials', name: 'Testimonials', component: 'Testimonials', required: false, priority: 65, maxItems: 8, layoutVariant: 'carousel' })
  if (data.team.length > 0) sections.push({ id: 'team', name: 'Team', component: 'Team', required: false, priority: 55, maxItems: 8, layoutVariant: 'grid' })
  if (data.cta) sections.push({ id: 'cta', name: 'CTA', component: 'CTA', required: false, priority: 70, layoutVariant: 'gradient' })
  if (data.posts.length > 0) sections.push({ id: 'blog', name: 'Blog', component: 'BlogGrid', required: false, priority: 45, maxItems: 3, layoutVariant: 'grid' })
  if (data.contact) sections.push({ id: 'contact', name: 'Contact', component: 'Contact', required: false, priority: 50, layoutVariant: 'split' })
  sections.push({ id: 'footer', name: 'Footer', component: 'Footer', required: true, priority: 100, layoutVariant: 'default' })
  return sections
}

function buildSaaSSections(data: NormalizedSiteData): SectionConfig[] {
  const sections: SectionConfig[] = [
    { id: 'navbar', name: 'Navigation', component: 'Navbar', required: true, priority: 100, layoutVariant: 'default' },
    { id: 'hero', name: 'Hero Section', component: 'Hero', required: true, priority: 90, layoutVariant: 'centered' },
  ]
  if (data.stats.length > 0) sections.push({ id: 'stats', name: 'Stats', component: 'Stats', required: false, priority: 60, layoutVariant: 'default' })
  if (data.services.length > 0) sections.push({ id: 'features', name: 'Features', component: 'Features', required: false, priority: 80, maxItems: 6, layoutVariant: 'grid' })
  if (data.cta) sections.push({ id: 'cta', name: 'CTA', component: 'CTA', required: false, priority: 75, layoutVariant: 'default' })
  if (data.testimonials.length > 0) sections.push({ id: 'testimonials', name: 'Testimonials', component: 'Testimonials', required: false, priority: 65, maxItems: 6, layoutVariant: 'grid' })
  if (data.faqs.length > 0) sections.push({ id: 'faq', name: 'FAQ', component: 'FAQ', required: false, priority: 50, maxItems: 8, layoutVariant: 'accordion' })
  if (data.products.length > 0) sections.push({ id: 'pricing', name: 'Pricing', component: 'Pricing', required: false, priority: 55, maxItems: 4, layoutVariant: 'tiers' })
  if (data.posts.length > 0) sections.push({ id: 'blog', name: 'Blog', component: 'BlogGrid', required: false, priority: 40, maxItems: 3, layoutVariant: 'grid' })
  if (data.contact) sections.push({ id: 'contact', name: 'Contact', component: 'Contact', required: false, priority: 35, layoutVariant: 'split' })
  sections.push({ id: 'footer', name: 'Footer', component: 'Footer', required: true, priority: 100, layoutVariant: 'default' })
  return sections
}

function buildMedicalSections(data: NormalizedSiteData): SectionConfig[] {
  const sections: SectionConfig[] = [
    { id: 'navbar', name: 'Navigation', component: 'Navbar', required: true, priority: 100, layoutVariant: 'default' },
    { id: 'hero', name: 'Hero Section', component: 'Hero', required: true, priority: 90, layoutVariant: 'centered' },
  ]
  if (data.stats.length > 0) sections.push({ id: 'stats', name: 'Stats', component: 'Stats', required: false, priority: 50, layoutVariant: 'default' })
  if (data.services.length > 0) sections.push({ id: 'services', name: 'Services', component: 'Features', required: false, priority: 75, maxItems: 6, layoutVariant: 'grid' })
  if (data.team.length > 0) sections.push({ id: 'team', name: 'Team', component: 'Team', required: false, priority: 65, maxItems: 6, layoutVariant: 'grid' })
  if (data.testimonials.length > 0) sections.push({ id: 'testimonials', name: 'Testimonials', component: 'Testimonials', required: false, priority: 55, maxItems: 6, layoutVariant: 'carousel' })
  if (data.faqs.length > 0) sections.push({ id: 'faq', name: 'FAQ', component: 'FAQ', required: false, priority: 45, maxItems: 8, layoutVariant: 'accordion' })
  if (data.cta) sections.push({ id: 'cta', name: 'CTA', component: 'CTA', required: false, priority: 60, layoutVariant: 'default' })
  if (data.contact) sections.push({ id: 'contact', name: 'Contact', component: 'Contact', required: false, priority: 70, layoutVariant: 'split' })
  if (data.posts.length > 0) sections.push({ id: 'blog', name: 'Blog', component: 'BlogGrid', required: false, priority: 35, maxItems: 3, layoutVariant: 'grid' })
  sections.push({ id: 'footer', name: 'Footer', component: 'Footer', required: true, priority: 100, layoutVariant: 'default' })
  return sections
}

function buildPortfolioSections(data: NormalizedSiteData): SectionConfig[] {
  const sections: SectionConfig[] = [
    { id: 'navbar', name: 'Navigation', component: 'Navbar', required: true, priority: 100, layoutVariant: 'glass' },
    { id: 'hero', name: 'Hero Section', component: 'Hero', required: true, priority: 90, layoutVariant: 'fullscreen' },
  ]
  if (data.portfolio.length > 0) sections.push({ id: 'portfolio', name: 'Work', component: 'Gallery', required: false, priority: 85, maxItems: 12, layoutVariant: 'masonry' })
  if (data.services.length > 0) sections.push({ id: 'services', name: 'Services', component: 'Features', required: false, priority: 65, maxItems: 4, layoutVariant: 'cards' })
  if (data.testimonials.length > 0) sections.push({ id: 'testimonials', name: 'Testimonials', component: 'Testimonials', required: false, priority: 55, maxItems: 6, layoutVariant: 'carousel' })
  if (data.cta) sections.push({ id: 'cta', name: 'CTA', component: 'CTA', required: false, priority: 70, layoutVariant: 'gradient' })
  if (data.gallery.length > 0) sections.push({ id: 'gallery', name: 'Gallery', component: 'Gallery', required: false, priority: 50, maxItems: 12, layoutVariant: 'grid' })
  if (data.contact) sections.push({ id: 'contact', name: 'Contact', component: 'Contact', required: false, priority: 60, layoutVariant: 'split' })
  sections.push({ id: 'footer', name: 'Footer', component: 'Footer', required: true, priority: 100, layoutVariant: 'default' })
  return sections
}

function buildBlogSections(data: NormalizedSiteData): SectionConfig[] {
  const sections: SectionConfig[] = [
    { id: 'navbar', name: 'Navigation', component: 'Navbar', required: true, priority: 100, layoutVariant: 'minimal' },
    { id: 'hero', name: 'Hero', component: 'Hero', required: true, priority: 90, layoutVariant: 'centered' },
  ]
  if (data.posts.length > 0) sections.push({ id: 'featured', name: 'Featured Posts', component: 'BlogGrid', required: false, priority: 80, maxItems: 3, layoutVariant: 'featured' })
  if (data.categories.length > 0) sections.push({ id: 'categories', name: 'Categories', component: 'Stats', required: false, priority: 50, layoutVariant: 'pills' })
  if (data.posts.length > 0) sections.push({ id: 'blog', name: 'All Posts', component: 'BlogGrid', required: false, priority: 70, maxItems: 12, layoutVariant: 'grid' })
  if (data.newsletter) sections.push({ id: 'newsletter', name: 'Newsletter', component: 'Newsletter', required: false, priority: 55, layoutVariant: 'inline' })
  if (data.cta) sections.push({ id: 'cta', name: 'CTA', component: 'CTA', required: false, priority: 45, layoutVariant: 'default' })
  sections.push({ id: 'footer', name: 'Footer', component: 'Footer', required: true, priority: 100, layoutVariant: 'minimal' })
  return sections
}

function buildNewsSections(data: NormalizedSiteData): SectionConfig[] {
  const sections: SectionConfig[] = [
    { id: 'navbar', name: 'Navigation', component: 'Navbar', required: true, priority: 100, layoutVariant: 'news' },
    { id: 'ticker', name: 'News Ticker', component: 'Stats', required: false, priority: 85, maxItems: 10, layoutVariant: 'ticker' },
    { id: 'hero', name: 'Breaking News', component: 'Hero', required: true, priority: 90, layoutVariant: 'overlay' },
  ]
  if (data.categories.length > 0) sections.push({ id: 'categories', name: 'Categories', component: 'Stats', required: false, priority: 60, maxItems: 8, layoutVariant: 'pills' })
  if (data.posts.length > 0) sections.push({ id: 'featured', name: 'Featured Stories', component: 'BlogGrid', required: false, priority: 80, maxItems: 6, layoutVariant: 'featured' })
  if (data.gallery.length > 0) sections.push({ id: 'gallery', name: 'Gallery', component: 'Gallery', required: false, priority: 45, maxItems: 8, layoutVariant: 'grid' })
  if (data.newsletter) sections.push({ id: 'newsletter', name: 'Newsletter', component: 'Newsletter', required: false, priority: 50, layoutVariant: 'inline' })
  sections.push({ id: 'footer', name: 'Footer', component: 'Footer', required: true, priority: 100, layoutVariant: 'default' })
  return sections
}

export const LAYOUT_GENERATORS = LAYOUTS
