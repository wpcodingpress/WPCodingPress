import type { HomepageBlueprint, BlueprintSection, ContentScore, SectionRecommendation } from './types'
import type { NormalizedSiteData } from '@/types/content-schema'
import type { FeatureMap, IndustryAnalysis } from '@/lib/engine'

export function generateHomepage(
  site: NormalizedSiteData,
  industry: IndustryAnalysis,
  features: FeatureMap,
  sections: SectionRecommendation[],
  contentScores: ContentScore[]
): HomepageBlueprint {
  const blueprintSections: BlueprintSection[] = []
  const ctaPlacements: { position: string; type: string }[] = []
  const contentDistribution: { section: string; contentCount: number }[] = []

  sections.forEach((sec) => {
    const source: string[] = []
    let count = 0

    switch (sec.section) {
      case 'hero':
        source.push('featured_content', 'hero_settings')
        if (site.posts.length > 0) source.push('latest_post')
        count = 1
        break
      case 'services':
        source.push('services')
        count = Math.min(sec.maxItems || site.services.length, site.services.length)
        ctaPlacements.push({ position: 'after_services', type: 'learn_more' })
        break
      case 'blogGrid':
        source.push('posts')
        count = Math.min(sec.maxItems || 6, site.posts.length)
        break
      case 'testimonials':
        source.push('testimonials')
        count = Math.min(sec.maxItems || site.testimonials.length, site.testimonials.length)
        break
      case 'portfolio':
        source.push('portfolio', 'gallery')
        count = Math.min(sec.maxItems || site.portfolio.length, site.portfolio.length)
        break
      case 'gallery':
        source.push('gallery', 'media')
        count = Math.min(sec.maxItems || site.gallery.length, site.gallery.length)
        break
      case 'team':
        source.push('team')
        count = Math.min(sec.maxItems || site.team.length, site.team.length)
        break
      case 'faq':
        source.push('faq')
        count = Math.min(sec.maxItems || site.faqs.length, site.faqs.length)
        break
      case 'stats':
        source.push('stats')
        count = site.stats.length
        break
      case 'cta':
        source.push('cta_settings')
        count = 1
        ctaPlacements.push({ position: sec.section, type: 'primary' })
        break
      case 'contact':
        source.push('contact')
        count = 1
        break
      case 'newsletter':
        source.push('newsletter')
        count = 1
        break
      default:
        source.push('content')
        count = 1
    }

    contentDistribution.push({ section: sec.section, contentCount: count })

    blueprintSections.push({
      id: sec.section,
      component: mapSectionToComponent(sec.section),
      priority: sec.priority,
      layoutVariant: sec.layoutVariant,
      maxItems: sec.maxItems,
      title: generateSectionTitle(sec.section, industry.category),
      contentSource: source,
    })
  })

  const visualHierarchy = blueprintSections
    .sort((a, b) => b.priority - a.priority)
    .map(s => s.id)

  return {
    sections: blueprintSections,
    visualHierarchy,
    ctaPlacements,
    contentDistribution,
    reasoning: generateReasoning(site, industry, blueprintSections),
  }
}

function mapSectionToComponent(section: string): string {
  const map: Record<string, string> = {
    navbar: 'Navbar', hero: 'Hero', services: 'Features', stats: 'Stats',
    testimonials: 'Testimonials', pricing: 'Pricing', blogGrid: 'BlogGrid',
    faq: 'FAQ', gallery: 'Gallery', contact: 'Contact', team: 'Team',
    cta: 'CTA', newsletter: 'Newsletter', footer: 'Footer',
    portfolio: 'Gallery', featured: 'BlogGrid', categories: 'Stats',
    ticker: 'Stats',
  }
  return map[section] || 'Hero'
}

function generateSectionTitle(section: string, industry: string): string {
  const titles: Record<string, Record<string, string>> = {
    hero: { news: 'Breaking News', business: 'Welcome', agency: 'We Create', saas: 'Build Faster', medical: 'Your Health', portfolio: 'Hello', blog: 'Latest' },
    services: { news: 'Sections', business: 'Our Services', agency: 'What We Do', saas: 'Features', medical: 'Treatments', portfolio: 'Expertise', blog: 'Topics' },
    testimonials: { news: 'Reader Reviews', business: 'Client Feedback', agency: 'Testimonials', saas: 'Customer Stories', medical: 'Patient Reviews', portfolio: 'Kind Words', blog: 'What Readers Say' },
    cta: { news: 'Subscribe', business: 'Get Started', agency: 'Work With Us', saas: 'Start Free Trial', medical: 'Book Appointment', portfolio: 'Hire Me', blog: 'Join Newsletter' },
    blogGrid: { news: 'Latest News', business: 'Latest Insights', agency: 'Our Journal', saas: 'Updates', medical: 'Health Articles', portfolio: 'Recent Work', blog: 'Recent Posts' },
    team: { news: 'Our Team', business: 'Leadership', agency: 'Creative Team', saas: 'Team', medical: 'Our Doctors', portfolio: 'About Me', blog: 'Contributors' },
    contact: { news: 'Contact Us', business: 'Get In Touch', agency: 'Let\'s Talk', saas: 'Contact', medical: 'Visit Us', portfolio: 'Say Hello', blog: 'Contact' },
    footer: { news: 'Footer', business: 'Footer', agency: 'Footer', saas: 'Footer', medical: 'Footer', portfolio: 'Footer', blog: 'Footer' },
  }

  const industryTitles = titles[section]
  if (industryTitles && industryTitles[industry]) return industryTitles[industry]
  if (industryTitles && industryTitles.business) return industryTitles.business

  const fallback: Record<string, string> = {
    hero: 'Featured', services: 'Our Services', stats: 'At a Glance',
    testimonials: 'Testimonials', blogGrid: 'Latest Posts',
    cta: 'Get Started', contact: 'Contact Us', team: 'Our Team',
    faq: 'FAQ', gallery: 'Gallery', pricing: 'Pricing',
    newsletter: 'Stay Updated', footer: 'Footer',
    portfolio: 'Our Work',
  }
  return fallback[section] || section
}

function generateReasoning(
  site: NormalizedSiteData,
  industry: IndustryAnalysis,
  sections: BlueprintSection[]
): string {
  const topSections = sections.slice(0, 4).map(s => s.id).join(', ')
  return `Generated adaptive homepage for a ${industry.category} website with ${site.posts.length} posts and ${site.services.length} services. ` +
    `Priority layout: ${topSections}. ` +
    `${site.testimonials.length > 0 ? `${site.testimonials.length} testimonials placed for social proof. ` : ''}` +
    `${site.cta ? 'CTA strategically positioned for maximum conversion.' : 'No CTA configured.'}`
}
