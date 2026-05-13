import type { NormalizedSiteData } from '@/types/content-schema'
import type { LayoutRecommendation, SectionPriority } from './types'
import type { IndustryAnalysis } from './types'

export function generateLayout(data: NormalizedSiteData, industry: IndustryAnalysis): LayoutRecommendation {
  const sectionOrder = determineSectionOrder(data, industry)
  const featuredSections = sectionOrder.filter(s => s.priority > 70).map(s => s.section)

  let heroLayout: LayoutRecommendation['heroLayout'] = 'centered'
  if (data.hero?.backgroundImage || data.hero?.backgroundVideo) {
    heroLayout = 'overlay'
  } else if (data.hero?.ctaPrimary && data.hero?.ctaSecondary) {
    heroLayout = 'split'
  } else if (data.posts.length > 5) {
    heroLayout = 'fullscreen'
  }

  let gridColumns = 3
  if (industry.category === 'news' || industry.category === 'blog') {
    gridColumns = data.categories.length > 6 ? 4 : 3
  } else if (industry.category === 'portfolio' || industry.category === 'agency') {
    gridColumns = 3
  } else if (industry.category === 'medical') {
    gridColumns = 2
  }

  return {
    industry: industry.category,
    heroLayout,
    sectionOrder,
    gridColumns,
    colorScheme: industry.category,
    typographyScale: industry.category,
    animationPreset: industry.category,
    featuredSections,
  }
}

function determineSectionOrder(data: NormalizedSiteData, industry: IndustryAnalysis): SectionPriority[] {
  const sections: SectionPriority[] = []
  const addSection = (section: string, baseScore: number, reason: string) => {
    const hasContent = checkSectionContent(section, data)
    if (hasContent) sections.push({ section, priority: baseScore, reason })
  }

  if (industry.category === 'news' || industry.category === 'blog') {
    addSection('hero', 100, 'Featured content')
    addSection('ticker', 90, 'Breaking news ticker')
    addSection('featuredPosts', 95, 'Featured articles')
    addSection('categories', 75, 'Browse by category')
    addSection('blogGrid', 90, 'Recent posts grid')
    addSection('newsletter', 65, 'Email subscription')
    addSection('gallery', 50, 'Photo gallery')
    addSection('cta', 50, 'Call to action')
    addSection('footer', 100, 'Site footer')
  } else if (industry.category === 'business' || industry.category === 'agency' || industry.category === 'saas') {
    addSection('hero', 100, 'Brand hero')
    addSection('stats', 70, 'Key metrics')
    addSection('services', 85, 'Services/features')
    addSection('portfolio', 70, 'Work showcase')
    addSection('testimonials', 75, 'Social proof')
    addSection('pricing', 60, 'Pricing plans')
    addSection('faq', 55, 'FAQ section')
    addSection('cta', 80, 'Conversion CTA')
    addSection('blogGrid', 60, 'Latest insights')
    addSection('contact', 65, 'Get in touch')
    addSection('footer', 100, 'Site footer')
  } else if (industry.category === 'medical') {
    addSection('hero', 100, 'Medical hero')
    addSection('stats', 70, 'Practice metrics')
    addSection('services', 90, 'Medical services')
    addSection('team', 75, 'Our doctors')
    addSection('testimonials', 70, 'Patient reviews')
    addSection('faq', 65, 'Common questions')
    addSection('contact', 85, 'Appointment booking')
    addSection('blogGrid', 55, 'Health articles')
    addSection('footer', 100, 'Site footer')
  } else if (industry.category === 'portfolio') {
    addSection('hero', 100, 'Creative hero')
    addSection('stats', 50, 'Achievements')
    addSection('portfolio', 95, 'Work showcase')
    addSection('services', 70, 'What I do')
    addSection('testimonials', 65, 'Client feedback')
    addSection('gallery', 60, 'Visual gallery')
    addSection('cta', 75, 'Hire me CTA')
    addSection('contact', 70, 'Contact form')
    addSection('footer', 100, 'Site footer')
  } else {
    addSection('hero', 100, 'Default hero')
    addSection('services', 75, 'Key offerings')
    addSection('blogGrid', 70, 'Content feed')
    addSection('testimonials', 60, 'Social proof')
    addSection('cta', 65, 'Call to action')
    addSection('contact', 60, 'Contact')
    addSection('footer', 100, 'Site footer')
  }

  sections.sort((a, b) => b.priority - a.priority)
  return sections
}

function checkSectionContent(section: string, data: NormalizedSiteData): boolean {
  switch (section) {
    case 'hero':
      return !!data.hero?.title
    case 'services':
      return data.services.length > 0
    case 'portfolio':
      return data.portfolio.length > 0
    case 'testimonials':
      return data.testimonials.length > 0
    case 'team':
      return data.team.length > 0
    case 'faq':
      return data.faqs.length > 0
    case 'gallery':
      return data.gallery.length > 0
    case 'stats':
      return data.stats.length > 0
    case 'cta':
      return !!data.cta
    case 'contact':
      return !!data.contact
    case 'newsletter':
      return !!data.newsletter
    case 'pricing':
      return data.products.length > 0 || data.services.length > 0
    case 'blogGrid':
      return data.posts.length > 0
    case 'featuredPosts':
      return data.posts.length > 2
    case 'categories':
      return data.categories.length > 0
    case 'ticker':
      return data.posts.length > 5
    case 'footer':
      return true
    default:
      return true
  }
}
