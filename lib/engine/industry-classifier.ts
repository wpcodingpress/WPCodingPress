import type { SiteCategory } from '@/types/content-schema'
import type { IndustryAnalysis, IndustrySignal } from './types'
import type { FeatureMap } from './types'

export function classifyIndustry(wpRaw: Record<string, unknown>, features: FeatureMap): IndustryAnalysis {
  const signals: IndustrySignal[] = []
  const posts = (wpRaw.posts || []) as Array<Record<string, unknown>>
  const pages = (wpRaw.pages || []) as Array<Record<string, unknown>>
  const categories = (wpRaw.categories || []) as Array<Record<string, unknown>>
  const siteInfo = (wpRaw.site_info || {}) as Record<string, unknown>
  const siteDescription = (siteInfo.description || '').toString().toLowerCase()
  const siteName = (siteInfo.name || '').toString().toLowerCase()

  const allContent = [...posts, ...pages]
  const allSlugs = allContent.map(p => p.slug?.toString().toLowerCase() || '')
  const allTitles = allContent.map(p => p.title?.toString().toLowerCase() || '')
  const allContentText = allContent.map(p => (p.content || '').toString().toLowerCase()).join(' ')

  const categoryNames = categories.map(c => c.name?.toString().toLowerCase() || '')
  const postCount = posts.length
  const categoryCount = categories.length
  const hasMultipleAuthors = new Set(posts.map(p => p.author ? JSON.stringify(p.author) : '')).size > 1

  // News signals
  const newsKeywords = ['news', 'breaking', 'headline', 'daily', 'press', 'journal', 'report', 'current affairs', 'media', 'newspaper']
  const newsScore = computeKeywordScore(siteName + ' ' + siteDescription, newsKeywords) +
    computeKeywordScore(allTitles.join(' ') + ' ' + categoryNames.join(' '), newsKeywords) * 2 +
    (postCount > 20 ? 30 : postCount > 10 ? 15 : 0) +
    (categoryCount > 5 ? 10 : 0) +
    (features.hasMultilingual ? 15 : 0)

  signals.push({ type: 'keyword_match', value: newsScore, weight: 0.3, source: 'news_analysis' })
  if (newsScore > 30) {
    signals.push({ type: 'industry_signal', value: 'news', weight: newsScore, source: 'news_detection' })
  }

  // Blog signals
  const blogPct = (postCount / Math.max(postCount + pages.length, 1)) * 100
  const blogScore = computeKeywordScore(allTitles.join(' '), ['blog', 'story', 'article', 'post', 'update']) +
    (blogPct > 80 ? 30 : blogPct > 60 ? 15 : 0) +
    (hasMultipleAuthors ? 15 : 0) +
    (features.hasComments ? 15 : 0)

  signals.push({ type: 'keyword_match', value: blogScore, weight: 0.25, source: 'blog_analysis' })
  if (blogScore > 25 && blogPct > 60) {
    signals.push({ type: 'industry_signal', value: 'blog', weight: blogScore, source: 'blog_detection' })
  }

  // Business signals
  const businessKeywords = ['business', 'company', 'corporate', 'enterprise', 'solution', 'service', 'consulting', 'professional', 'firm', 'industry']
  const businessScore = computeKeywordScore(siteName + ' ' + siteDescription, businessKeywords) * 2 +
    computeKeywordScore(allTitles.join(' ') + ' ' + allSlugs.join(' '), businessKeywords) +
    (features.hasServices ? 20 : 0) +
    (features.hasPricing ? 15 : 0) +
    (features.hasTeam ? 10 : 0)

  signals.push({ type: 'keyword_match', value: businessScore, weight: 0.3, source: 'business_analysis' })
  if (businessScore > 25) {
    signals.push({ type: 'industry_signal', value: 'business', weight: businessScore, source: 'business_detection' })
  }

  // Medical signals
  const medicalKeywords = ['medical', 'doctor', 'clinic', 'hospital', 'health', 'patient', 'dental', 'healthcare', 'wellness', 'treatment', 'surgery']
  const medicalScore = computeKeywordScore(siteName + ' ' + siteDescription, medicalKeywords) * 3 +
    computeKeywordScore(allContentText + ' ' + allTitles.join(' '), medicalKeywords) * 2

  signals.push({ type: 'keyword_match', value: medicalScore, weight: 0.35, source: 'medical_analysis' })
  if (medicalScore > 30) {
    signals.push({ type: 'industry_signal', value: 'medical', weight: medicalScore, source: 'medical_detection' })
  }

  // Portfolio signals
  const portfolioScore = (features.hasPortfolio ? 30 : 0) +
    (features.hasGalleries ? 20 : 0) +
    computeKeywordScore(siteName + ' ' + siteDescription, ['portfolio', 'gallery', 'showcase', 'work', 'creative', 'my work']) * 2

  signals.push({ type: 'keyword_match', value: portfolioScore, weight: 0.2, source: 'portfolio_analysis' })
  if (portfolioScore > 30) {
    signals.push({ type: 'industry_signal', value: 'portfolio', weight: portfolioScore, source: 'portfolio_detection' })
  }

  // Agency signals
  const agencyKeywords = ['agency', 'studio', 'creative', 'design', 'digital', 'marketing', 'brand', 'production', 'collective']
  const agencyScore = computeKeywordScore(siteName + ' ' + siteDescription, agencyKeywords) * 2 +
    (features.hasPortfolio ? 20 : 0) +
    (features.hasServices ? 15 : 0) +
    (features.hasTeam ? 15 : 0) +
    (features.hasTestimonials ? 10 : 0)

  signals.push({ type: 'keyword_match', value: agencyScore, weight: 0.25, source: 'agency_analysis' })
  if (agencyScore > 25) {
    signals.push({ type: 'industry_signal', value: 'agency', weight: agencyScore, source: 'agency_detection' })
  }

  // SaaS signals
  const saasKeywords = ['saas', 'software', 'app', 'platform', 'dashboard', 'tool', 'integration', 'api', 'cloud', 'automation']
  const saasScore = computeKeywordScore(siteName + ' ' + siteDescription, saasKeywords) * 2 +
    computeKeywordScore(allContentText + ' ' + allTitles.join(' '), saasKeywords) +
    (features.hasPricing ? 15 : 0) +
    (features.hasAuth ? 15 : 0) +
    (features.hasForms ? 10 : 0)

  signals.push({ type: 'keyword_match', value: saasScore, weight: 0.25, source: 'saas_analysis' })
  if (saasScore > 25) {
    signals.push({ type: 'industry_signal', value: 'saas', weight: saasScore, source: 'saas_detection' })
  }

  // E-commerce signals
  const ecommerceKeywords = ['shop', 'store', 'product', 'cart', 'checkout', 'buy', 'order', 'shipping', 'payment', 'ecommerce', 'e-commerce', 'woocommerce', 'merchandise', 'catalog', 'retail']
  let ecommerceScore = computeKeywordScore(siteName + ' ' + siteDescription, ecommerceKeywords) * 2 +
    computeKeywordScore(allContentText + ' ' + allTitles.join(' '), ecommerceKeywords)

  if (features.hasWooCommerce) {
    ecommerceScore += 50
  }

  const rawProducts = (wpRaw.products || []) as Array<Record<string, unknown>>
  const rawWooCommerce = wpRaw.woocommerce as Record<string, unknown> | undefined
  const productCount = Array.isArray(rawProducts) ? rawProducts.length : 0
  const hasWooCommerceData = rawWooCommerce !== undefined && rawWooCommerce !== null

  if (productCount > 0) {
    ecommerceScore += Math.min(productCount * 2, 30)
  }
  if (hasWooCommerceData) {
    ecommerceScore += 20
  }
  if (features.hasMemberships) {
    ecommerceScore += 10
  }
  if (features.hasBookings) {
    ecommerceScore += 10
  }

  signals.push({ type: 'keyword_match', value: ecommerceScore, weight: 0.3, source: 'ecommerce_analysis' })
  if (ecommerceScore > 30) {
    signals.push({ type: 'industry_signal', value: 'ecommerce', weight: ecommerceScore, source: 'ecommerce_detection' })
  }

  const category = determineCategory(signals)
  const confidence = calculateConfidence(signals, category)

  return { category, confidence, signals }
}

function computeKeywordScore(text: string, keywords: string[]): number {
  const lower = text.toLowerCase()
  return keywords.filter(k => lower.includes(k.toLowerCase())).length * 5
}

function determineCategory(signals: IndustrySignal[]): SiteCategory {
  const industryScores: Record<string, number> = {}

  signals.forEach(s => {
    if (s.type === 'industry_signal' && typeof s.value === 'string') {
      industryScores[s.value] = (industryScores[s.value] || 0) + s.weight
    }
  })

  const entries = Object.entries(industryScores)
  if (entries.length === 0) return 'unknown'

  entries.sort(([, a], [, b]) => b - a)
  return entries[0][0] as SiteCategory
}

function calculateConfidence(signals: IndustrySignal[], category: SiteCategory): number {
  const categorySignal = signals.find(s => s.type === 'industry_signal' && s.value === category)
  if (!categorySignal) return 0

  const totalWeight = signals
    .filter(s => s.type === 'industry_signal')
    .reduce((sum, s) => sum + s.weight, 0)

  if (totalWeight === 0) return 0

  const ratio = (categorySignal.weight as number) / totalWeight
  return Math.min(Math.round(ratio * 100), 100)
}
