import type {
  TemplateRecommendation, LayoutRecommendation, SectionRecommendation,
  AIRecommendation,
} from './types'
import type { NormalizedSiteData, SiteCategory } from '@/types/content-schema'
import type { FeatureMap, IndustryAnalysis } from '@/lib/engine'

export function recommendTemplate(
  site: NormalizedSiteData,
  industry: IndustryAnalysis,
  features: FeatureMap
): TemplateRecommendation {
  const { category, confidence } = industry

  const templateMap: Record<string, { id: string; name: string; reason: string }> = {
    news: { id: 'adaptive', name: 'Intelligent Adaptive', reason: 'News/magazine sites benefit from dynamic layouts with featured stories, category browsing, and ticker-based navigation.' },
    blog: { id: 'adaptive', name: 'Intelligent Adaptive', reason: 'Content-heavy blogs need clean typography, featured post carousels, and category-based content grids.' },
    business: { id: 'adaptive', name: 'Intelligent Adaptive', reason: 'Business sites require professional layouts with service showcases, testimonials, and conversion-focused CTAs.' },
    medical: { id: 'adaptive', name: 'Intelligent Adaptive', reason: 'Medical practices need trustworthy designs with doctor profiles, service listings, and appointment CTAs.' },
    portfolio: { id: 'adaptive', name: 'Intelligent Adaptive', reason: 'Portfolios demand visually immersive layouts with masonry galleries and fullscreen hero sections.' },
    agency: { id: 'adaptive', name: 'Intelligent Adaptive', reason: 'Creative agencies need bold, animated layouts that showcase work and capabilities.' },
    saas: { id: 'adaptive', name: 'Intelligent Adaptive', reason: 'SaaS products benefit from feature-focused layouts with pricing tiers and demo CTAs.' },
    ecommerce: { id: 'adaptive', name: 'Intelligent Adaptive', reason: 'Online stores need product-focused layouts with category navigation and featured collections.' },
  }

  const defaultRec = templateMap[category] || templateMap.business

  return {
    templateId: defaultRec.id,
    templateName: defaultRec.name,
    confidence: Math.max(confidence, 70),
    reason: defaultRec.reason,
    alternatives: generateAlternatives(category),
  }
}

function generateAlternatives(category: SiteCategory): { templateId: string; templateName: string; confidence: number }[] {
  const alternatives: Record<string, { templateId: string; templateName: string; confidence: number }[]> = {
    news: [
      { templateId: 'advanced', templateName: 'Advanced News', confidence: 65 },
      { templateId: 'modern', templateName: 'Modern Minimal', confidence: 30 },
    ],
    blog: [
      { templateId: 'modern', templateName: 'Modern Minimal', confidence: 60 },
      { templateId: 'business', templateName: 'Business Corporate', confidence: 25 },
    ],
    business: [
      { templateId: 'modern', templateName: 'Modern Minimal', confidence: 45 },
      { templateId: 'news', templateName: 'News Magazine', confidence: 20 },
    ],
    medical: [
      { templateId: 'business', templateName: 'Business Corporate', confidence: 50 },
      { templateId: 'modern', templateName: 'Modern Minimal', confidence: 35 },
    ],
    portfolio: [
      { templateId: 'modern', templateName: 'Modern Minimal', confidence: 55 },
      { templateId: 'agency', templateName: 'Creative Agency' as never, confidence: 40 },
    ],
    agency: [
      { templateId: 'portfolio', templateName: 'Portfolio Showcase' as never, confidence: 50 },
      { templateId: 'business', templateName: 'Business Corporate', confidence: 35 },
    ],
    saas: [
      { templateId: 'business', templateName: 'Business Corporate', confidence: 55 },
      { templateId: 'modern', templateName: 'Modern Minimal', confidence: 30 },
    ],
  }
  return alternatives[category] || []
}

export function recommendLayout(
  site: NormalizedSiteData,
  industry: IndustryAnalysis,
  features: FeatureMap
): LayoutRecommendation {
  const category = industry.category
  const hasBackground = !!site.hero?.backgroundImage || !!site.hero?.backgroundVideo
  const hasMultipleCTA = !!site.hero?.ctaPrimary && !!site.hero?.ctaSecondary
  const postCount = site.posts.length
  const hasServices = site.services.length > 0
  const hasSidebar = category === 'blog' || category === 'news'

  let heroLayout: LayoutRecommendation['heroLayout'] = 'centered'
  if (category === 'portfolio') heroLayout = 'fullscreen'
  else if (category === 'news') heroLayout = 'overlay'
  else if (hasBackground && hasMultipleCTA) heroLayout = 'split'
  else if (hasBackground) heroLayout = 'overlay'

  let contentWidth: LayoutRecommendation['contentWidth'] = 'default'
  if (category === 'blog') contentWidth = 'narrow'
  else if (category === 'news' || category === 'portfolio') contentWidth = 'wide'
  else if (category === 'agency') contentWidth = 'full'

  let gridLayout: LayoutRecommendation['gridLayout'] = 'full'
  if (hasSidebar && postCount > 10) gridLayout = 'sidebar'
  else if (category === 'news') gridLayout = 'magazine'

  let cardStyle: LayoutRecommendation['cardStyle'] = 'default'
  if (category === 'agency' || category === 'portfolio') cardStyle = 'glass'
  else if (category === 'saas') cardStyle = 'bordered'
  else if (category === 'blog') cardStyle = 'minimal'
  else if (hasServices) cardStyle = 'elevated'

  const animationMap: Record<string, string> = {
    business: 'smooth', agency: 'energetic', saas: 'smooth',
    medical: 'smooth', portfolio: 'cinematic', blog: 'smooth', news: 'cinematic',
  }

  const spacingMap: Record<string, string> = {
    business: 'comfortable', agency: 'spacious', saas: 'comfortable',
    medical: 'compact', portfolio: 'spacious', blog: 'comfortable', news: 'compact',
  }

  return {
    heroLayout,
    contentWidth,
    gridLayout,
    cardStyle,
    animationPreset: animationMap[category] || 'smooth',
    spacingScale: spacingMap[category] || 'comfortable',
    reasoning: [
      `${category} industry recommends ${heroLayout} hero for optimal impact`,
      `Content density suggests ${contentWidth} content width`,
      `${gridLayout} grid layout for ${category === 'news' ? 'magazine-style' : 'full-width'} browsing`,
      `${cardStyle} card style matches ${category} visual expectations`,
    ],
  }
}

export function recommendSections(
  site: NormalizedSiteData,
  industry: IndustryAnalysis,
  features: FeatureMap
): SectionRecommendation[] {
  const sections: SectionRecommendation[] = []
  const { category } = industry

  const addSection = (section: string, base: number, reason: string, variant = 'default', maxItems?: number) => {
    let boost = 0
    if (section === 'hero') boost = 20
    if (section === 'services' && site.services.length > 3) boost = 15
    if (section === 'testimonials' && site.testimonials.length > 3) boost = 10
    if (section === 'blogGrid' && site.posts.length > 6) boost = 15
    if (section === 'portfolio' && site.portfolio.length > 4) boost = 20
    if (section === 'team' && site.team.length > 2) boost = 10
    if (section === 'cta' && site.cta) boost = 10
    if (section === 'faq' && site.faqs.length > 4) boost = 10

    sections.push({ section, priority: Math.min(base + boost, 100), reason, layoutVariant: variant, maxItems })
  }

  if (category === 'news' || category === 'blog') {
    addSection('navbar', 100, 'Primary navigation', category === 'news' ? 'news' : 'minimal')
    addSection('hero', 95, 'Featured headline', 'overlay')
    addSection('stats', 40, 'Trending topics', 'pills')
    if (site.posts.length > 0) addSection('blogGrid', 90, 'Latest stories', 'featured', 6)
    if (site.categories.length > 0) addSection('stats', 50, 'Browse categories', 'pills')
    if (site.gallery.length > 0) addSection('gallery', 45, 'Photo gallery', 'grid')
    if (site.newsletter) addSection('newsletter', 55, 'Email subscription', 'inline')
    addSection('footer', 100, 'Site footer', category === 'blog' ? 'minimal' : 'default')
  } else if (category === 'business' || category === 'agency' || category === 'saas') {
    addSection('navbar', 100, 'Brand navigation', category === 'agency' ? 'glass' : 'default')
    addSection('hero', 95, 'Brand hero', category === 'agency' ? 'split' : 'centered')
    if (site.stats.length > 0) addSection('stats', 55, 'Key metrics', 'counters')
    if (site.services.length > 0) addSection('services', 80, 'Core offerings', category === 'agency' ? 'cards' : 'grid', 6)
    if (site.portfolio.length > 0) addSection('portfolio', 70, 'Work showcase', category === 'agency' ? 'masonry' : 'grid')
    if (site.testimonials.length > 0) addSection('testimonials', 65, 'Social proof', 'carousel')
    if (site.team.length > 0) addSection('team', 55, 'Our people', 'grid')
    if (site.cta) addSection('cta', 75, 'Conversion CTA', category === 'agency' ? 'gradient' : 'default')
    if (site.faqs.length > 0) addSection('faq', 40, 'Common questions', 'accordion')
    if (site.posts.length > 0) addSection('blogGrid', 50, 'Latest insights', 'grid', 3)
    if (site.contact) addSection('contact', 55, 'Get in touch', 'split')
    addSection('footer', 100, 'Site footer', 'default')
  } else if (category === 'medical') {
    addSection('navbar', 100, 'Medical navigation', 'default')
    addSection('hero', 95, 'Practice hero', 'centered')
    if (site.stats.length > 0) addSection('stats', 60, 'Practice metrics', 'default')
    if (site.services.length > 0) addSection('services', 85, 'Medical services', 'grid', 6)
    if (site.team.length > 0) addSection('team', 70, 'Our doctors', 'grid')
    if (site.testimonials.length > 0) addSection('testimonials', 60, 'Patient reviews', 'carousel')
    if (site.cta) addSection('cta', 65, 'Book appointment', 'default')
    if (site.faqs.length > 0) addSection('faq', 55, 'Common questions', 'accordion')
    if (site.posts.length > 0) addSection('blogGrid', 45, 'Health articles', 'grid', 3)
    if (site.contact) addSection('contact', 75, 'Contact & location', 'split')
    addSection('footer', 100, 'Site footer', 'default')
  } else if (category === 'portfolio') {
    addSection('navbar', 100, 'Portfolio navigation', 'glass')
    addSection('hero', 95, 'Creative hero', 'fullscreen')
    if (site.portfolio.length > 0) addSection('portfolio', 90, 'My work', 'masonry', 12)
    if (site.services.length > 0) addSection('services', 65, 'What I do', 'cards', 4)
    if (site.testimonials.length > 0) addSection('testimonials', 55, 'Client feedback', 'carousel')
    if (site.cta) addSection('cta', 70, 'Hire me', 'gradient')
    if (site.gallery.length > 0) addSection('gallery', 50, 'Visual gallery', 'grid')
    if (site.contact) addSection('contact', 60, 'Let\'s talk', 'split')
    addSection('footer', 100, 'Site footer', 'default')
  }

  sections.sort((a, b) => b.priority - a.priority)
  return sections
}

export function generateRecommendations(
  site: NormalizedSiteData,
  industry: IndustryAnalysis,
  features: FeatureMap
): AIRecommendation[] {
  const recommendations: AIRecommendation[] = []
  const { category } = industry

  if (features.hasWooCommerce) {
    recommendations.push({
      id: 'woo-headless',
      type: 'section',
      title: 'Enable Headless WooCommerce',
      description: 'Your site uses WooCommerce. Activate headless cart, checkout, and product pages for a seamless shopping experience.',
      confidence: 85,
      priority: 'high',
      data: { requires: 'woocommerce-adapter' },
      reasoning: ['WooCommerce detected', 'Headless ecommerce increases conversion rates by 30%', 'Phase 3 feature available'],
    })
  }

  if (features.hasAuth) {
    recommendations.push({
      id: 'auth-ui',
      type: 'section',
      title: 'Modern Authentication UI',
      description: 'Login and registration detected. Generate premium login/register pages with social auth support.',
      confidence: 90,
      priority: 'high',
      data: { requires: 'auth-adapter' },
      reasoning: ['Authentication system detected', 'Modern auth UI improves user engagement', 'Phase 3 feature available'],
    })
  }

  if (features.hasForms) {
    recommendations.push({
      id: 'form-modernize',
      type: 'section',
      title: 'Modernize Contact Forms',
      description: 'Replace WordPress forms with animated React forms featuring validation and real-time submission.',
      confidence: 80,
      priority: 'medium',
      data: { detected: features.hasForms, plugin: 'contact-form-7' },
      reasoning: ['Form plugin detected', 'React forms provide better UX', 'Reduce form abandonment'],
    })
  }

  if (features.hasMultilingual) {
    recommendations.push({
      id: 'i18n-support',
      type: 'style',
      title: 'Multilingual Navigation',
      description: 'Multi-language site detected. Generate language switcher with proper hreflang SEO tags.',
      confidence: 95,
      priority: 'high',
      data: { languages: site.settings.language },
      reasoning: ['WPML or Polylang detected', 'Multilingual SEO best practice', 'Global audience optimization'],
    })
  }

  if (features.hasComments && site.posts.length > 0) {
    recommendations.push({
      id: 'comment-enhance',
      type: 'content',
      title: 'Enhanced Comment System',
      description: 'Replace WordPress comments with a modern React comment system featuring threaded replies and real-time updates.',
      confidence: 70,
      priority: 'medium',
      data: { commentCount: site.posts.reduce((sum, p) => sum + p.commentCount, 0) },
      reasoning: ['Comments enabled on posts', 'React comments improve engagement', 'Phase 3 feature available'],
    })
  }

  if (features.hasSearch) {
    recommendations.push({
      id: 'live-search',
      type: 'content',
      title: 'Enable Live Search',
      description: 'Replace basic search with a live search overlay featuring instant results and keyboard navigation.',
      confidence: 85,
      priority: 'medium',
      data: { requires: 'search-adapter' },
      reasoning: ['Search functionality detected', 'Live search improves UX significantly', 'Phase 3 feature available'],
    })
  }

  if (site.posts.length === 0 && category !== 'portfolio') {
    recommendations.push({
      id: 'content-gap',
      type: 'content',
      title: 'Content Development Recommended',
      description: 'Your site has limited content. Consider adding blog posts or case studies to improve engagement and SEO.',
      confidence: 60,
      priority: 'low',
      data: { postCount: 0 },
      reasoning: ['No posts detected', 'Content drives 3x more traffic', 'SEO improvement opportunity'],
    })
  }

  if (site.services.length > 4) {
    recommendations.push({
      id: 'service-categories',
      type: 'layout',
      title: 'Group Services by Category',
      description: 'With multiple services, consider grouping them into categories for better navigation and user experience.',
      confidence: 75,
      priority: 'medium',
      data: { serviceCount: site.services.length },
      reasoning: [`${site.services.length} services detected`, 'Categorized services improve findability', 'Better content organization'],
    })
  }

  return recommendations
}
