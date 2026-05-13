import type { SiteCategory, NormalizedSiteData } from '@/types/content-schema'

export interface FeatureMap {
  hasAuth: boolean
  hasRegistration: boolean
  hasForms: boolean
  hasWooCommerce: boolean
  hasMemberships: boolean
  hasComments: boolean
  hasSearch: boolean
  hasBookings: boolean
  hasMultilingual: boolean
  hasGalleries: boolean
  hasCustomPostTypes: boolean
  hasElementor: boolean
  hasSeoPlugin: boolean
  hasAnalytics: boolean
  hasNewsletter: boolean
  hasPortfolio: boolean
  hasTestimonials: boolean
  hasFAQ: boolean
  hasTeam: boolean
  hasServices: boolean
  hasPricing: boolean
  hasVideo: boolean
}

export interface IndustryAnalysis {
  category: SiteCategory
  confidence: number
  signals: IndustrySignal[]
}

export interface IndustrySignal {
  type: string
  value: string | number | boolean
  weight: number
  source: string
}

export interface SectionPriority {
  section: string
  priority: number
  reason: string
}

export interface LayoutRecommendation {
  industry: SiteCategory
  heroLayout: 'centered' | 'split' | 'fullscreen' | 'overlay'
  sectionOrder: SectionPriority[]
  gridColumns: number
  colorScheme: string
  typographyScale: string
  animationPreset: string
  featuredSections: string[]
}

export interface NormalizationResult {
  data: NormalizedSiteData
  features: FeatureMap
  industry: IndustryAnalysis
  layout: LayoutRecommendation
}

export interface WPExportRaw {
  posts?: unknown[]
  pages?: unknown[]
  menus?: unknown
  categories?: unknown[]
  tags?: unknown[]
  media?: unknown[]
  users?: unknown[]
  site_info?: Record<string, unknown>
  plugins?: unknown[]
  theme?: string
  woocommerce?: unknown
  forms?: unknown[]
  elementor?: unknown
  custom_post_types?: Record<string, unknown>
  services?: unknown[]
  portfolio?: unknown[]
  products?: unknown[]
  testimonials?: unknown[]
  team?: unknown[]
  faq?: unknown[]
  gallery?: unknown[]
  comment_count?: number
  commentCount?: number
}
