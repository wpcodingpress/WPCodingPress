import type { ContentScore, ContentSignal } from './types'
import type { NormalizedSiteData, ContentPost, ServiceItem } from '@/types/content-schema'

export function scoreContent(site: NormalizedSiteData): ContentScore[] {
  const scores: ContentScore[] = []

  site.posts.forEach((post, i) => {
    const signals = generatePostSignals(post, i, site.posts.length)
    const totalScore = signals.reduce((sum, s) => sum + s.value, 0)
    scores.push({
      contentId: post.id,
      contentType: 'post',
      title: post.title,
      score: totalScore,
      signals,
      recommendedSection: determineSection(post),
      priority: scoreToPriority(totalScore),
    })
  })

  site.services.forEach((service, i) => {
    const signals = generateServiceSignals(service, i, site.services.length)
    const totalScore = signals.reduce((sum, s) => sum + s.value, 0)
    scores.push({
      contentId: service.id,
      contentType: 'service',
      title: service.title,
      score: totalScore,
      signals,
      recommendedSection: 'services',
      priority: scoreToPriority(totalScore),
    })
  })

  scores.sort((a, b) => b.score - a.score)
  return scores
}

function generatePostSignals(post: ContentPost, index: number, total: number): ContentSignal[] {
  const signals: ContentSignal[] = []

  signals.push({
    type: 'recency',
    value: calculateRecencyScore(post.date),
    label: `${daysSince(post.date)} days old`,
  })

  signals.push({
    type: 'featured_image',
    value: post.featuredImage ? 15 : 0,
    label: post.featuredImage ? 'Has featured image' : 'No featured image',
  })

  signals.push({
    type: 'content_length',
    value: Math.min(post.content.length / 100, 20),
    label: `${Math.round(post.content.length / 100)}00+ chars`,
  })

  signals.push({
    type: 'comments',
    value: Math.min(post.commentCount * 5, 15),
    label: `${post.commentCount} comments`,
  })

  signals.push({
    type: 'categories',
    value: Math.min(post.categories.length * 8, 15),
    label: `${post.categories.length} categories`,
  })

  signals.push({
    type: 'excerpt_quality',
    value: post.excerpt.length > 50 ? 10 : post.excerpt.length > 20 ? 5 : 0,
    label: post.excerpt.length > 50 ? 'Good excerpt' : 'Short excerpt',
  })

  signals.push({
    type: 'position_boost',
    value: Math.max(20 - index * 2, 0),
    label: `Position #${index + 1}`,
  })

  return signals
}

function generateServiceSignals(service: ServiceItem, index: number, total: number): ContentSignal[] {
  const signals: ContentSignal[] = []

  signals.push({
    type: 'features_count',
    value: Math.min(service.features.length * 5, 20),
    label: `${service.features.length} features`,
  })

  signals.push({
    type: 'description_length',
    value: Math.min(service.description.length / 50, 15),
    label: `${Math.round(service.description.length / 50)}0+ chars description`,
  })

  signals.push({
    type: 'has_price',
    value: service.price ? 10 : 0,
    label: service.price ? 'Has pricing' : 'No pricing',
  })

  signals.push({
    type: 'has_icon',
    value: service.icon ? 10 : 0,
    label: service.icon ? 'Has icon' : 'No icon',
  })

  return signals
}

function calculateRecencyScore(dateStr: string): number {
  const days = daysSince(dateStr)
  if (days <= 1) return 25
  if (days <= 7) return 20
  if (days <= 30) return 15
  if (days <= 90) return 10
  if (days <= 365) return 5
  return 0
}

function daysSince(dateStr: string): number {
  const date = new Date(dateStr)
  const now = new Date()
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
}

function determineSection(post: ContentPost): string {
  const categoryNames = post.categories.map(c => c.name.toLowerCase())
  if (categoryNames.some(n => ['news', 'breaking'].includes(n))) return 'hero'
  if (categoryNames.some(n => ['featured', 'editorial', 'trending'].includes(n))) return 'featuredPosts'
  if (post.featuredImage) return 'hero'
  return 'blogGrid'
}

function scoreToPriority(score: number): ContentScore['priority'] {
  if (score >= 60) return 'featured'
  if (score >= 40) return 'high'
  if (score >= 20) return 'medium'
  return 'low'
}

export function getFeaturedContent(scores: ContentScore[], limit = 3): ContentScore[] {
  return scores.filter(s => s.priority === 'featured').slice(0, limit)
}

export function getSectionDistribution(scores: ContentScore[]): Record<string, number> {
  const distribution: Record<string, number> = {}
  scores.forEach(s => {
    distribution[s.recommendedSection] = (distribution[s.recommendedSection] || 0) + 1
  })
  return distribution
}
