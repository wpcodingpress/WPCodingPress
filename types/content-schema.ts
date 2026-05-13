export type SiteCategory = 'business' | 'blog' | 'news' | 'medical' | 'portfolio' | 'agency' | 'saas' | 'ecommerce' | 'education' | 'unknown'

export type ContentStatus = 'draft' | 'published' | 'pending'

export interface ContentMedia {
  url: string
  alt: string
  width: number
  height: number
  mimeType: string
  caption?: string
}

export interface ContentAuthor {
  id: string
  name: string
  avatar?: string
  bio?: string
  email?: string
}

export interface ContentCategory {
  id: string
  name: string
  slug: string
  description: string
  count: number
  parentId?: string
}

export interface ContentTag {
  id: string
  name: string
  slug: string
}

export interface ContentNavigationItem {
  id: string
  label: string
  url: string
  target?: '_self' | '_blank'
  children: ContentNavigationItem[]
  order: number
}

export interface ContentNavigation {
  id: string
  name: string
  location: 'primary' | 'secondary' | 'footer' | 'mobile'
  items: ContentNavigationItem[]
}

export interface ContentSeo {
  title: string
  description: string
  ogImage?: string
  ogTitle?: string
  ogDescription?: string
  canonicalUrl?: string
  noIndex: boolean
  schema?: Record<string, unknown>
}

export interface ContentPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  date: string
  modified: string
  status: ContentStatus
  featuredImage: ContentMedia | null
  categories: ContentCategory[]
  tags: ContentTag[]
  author: ContentAuthor
  seo: ContentSeo
  readingTime: number
  commentCount: number
  translations?: Record<string, { title: string; slug: string }>
}

export interface ContentPage {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage: ContentMedia | null
  template: string
  seo: ContentSeo
  translations?: Record<string, { title: string; slug: string }>
}

export interface HeroContent {
  title: string
  subtitle: string
  description: string
  backgroundImage: ContentMedia | null
  backgroundVideo: string | null
  ctaPrimary: { label: string; url: string } | null
  ctaSecondary: { label: string; url: string } | null
  layout: 'centered' | 'split' | 'fullscreen' | 'overlay'
}

export interface ServiceItem {
  id: string
  title: string
  description: string
  icon: string
  image: ContentMedia | null
  features: string[]
  price: string
  url: string
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  category: string
  image: ContentMedia
  images: ContentMedia[]
  url: string
  date: string
  client: string
  tags: string[]
}

export interface ProductItem {
  id: string
  name: string
  slug: string
  description: string
  price: number
  salePrice: number | null
  currency: string
  images: ContentMedia[]
  categories: ContentCategory[]
  type: 'simple' | 'variable' | 'external'
  url: string
}

export interface TestimonialItem {
  id: string
  name: string
  title: string
  company: string
  avatar: ContentMedia | null
  content: string
  rating: number
}

export interface TeamMember {
  id: string
  name: string
  title: string
  bio: string
  avatar: ContentMedia | null
  socialLinks: { platform: string; url: string }[]
}

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  order: number
}

export interface GalleryItem {
  id: string
  title: string
  description: string
  image: ContentMedia
  category: string
}

export interface StatItem {
  id: string
  label: string
  value: number
  suffix: string
  prefix: string
  icon: string
}

export interface CTAContent {
  title: string
  description: string
  buttonLabel: string
  buttonUrl: string
  backgroundType: 'color' | 'image' | 'gradient' | 'video'
  backgroundValue: string
}

export interface ContactInfo {
  email: string
  phone: string
  address: string
  latitude: number
  longitude: number
  formFields: { type: string; label: string; required: boolean; placeholder: string }[]
}

export interface NewsletterConfig {
  title: string
  description: string
  buttonLabel: string
  placeholder: string
}

export interface FooterContent {
  copyright: string
  description: string
  socialLinks: { platform: string; url: string; icon: string }[]
  columns: {
    title: string
    links: { label: string; url: string }[]
  }[]
  branding: {
    logo: ContentMedia | null
    name: string
    tagline: string
  }
}

export interface SiteSettings {
  name: string
  description: string
  url: string
  language: string
  logo: ContentMedia | null
  favicon: ContentMedia | null
  timezone: string
  dateFormat: string
  socialLinks: { platform: string; url: string }[]
  seo: ContentSeo
}

export interface NormalizedSiteData {
  settings: SiteSettings
  navigation: ContentNavigation[]
  posts: ContentPost[]
  pages: ContentPage[]
  categories: ContentCategory[]
  tags: ContentTag[]
  authors: ContentAuthor[]
  hero: HeroContent | null
  services: ServiceItem[]
  portfolio: PortfolioItem[]
  products: ProductItem[]
  testimonials: TestimonialItem[]
  team: TeamMember[]
  faqs: FAQItem[]
  gallery: GalleryItem[]
  stats: StatItem[]
  cta: CTAContent | null
  contact: ContactInfo | null
  newsletter: NewsletterConfig | null
  footer: FooterContent | null
  media: ContentMedia[]
}
