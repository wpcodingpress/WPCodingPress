import type { AIAnalysisResult, TemplateRecommendation, LayoutRecommendation, SectionRecommendation, BrandProfile, ContentScore, HomepageBlueprint, AIRecommendation, AIConfig } from './types'
import type { NormalizedSiteData } from '@/types/content-schema'
import type { FeatureMap, IndustryAnalysis } from '@/lib/engine'
import type { WPExportRaw } from '@/lib/engine/types'
import { recommendTemplate, recommendLayout, recommendSections, generateRecommendations } from './recommendation-engine'
import { detectBrand } from './brand-detector'
import { scoreContent } from './content-scorer'
import { generateHomepage } from './homepage-generator'
import { detectFeaturesForAdapter } from '@/lib/adapters'

export class AIEngine {
  private config: AIConfig

  constructor(config: Partial<AIConfig> = {}) {
    this.config = { enabled: true, provider: 'rule-based', ...config }
  }

  analyze(
    site: NormalizedSiteData,
    industry: IndustryAnalysis,
    features: FeatureMap,
    siteInfo?: Record<string, unknown>,
    rawContent?: string[],
    wpRaw?: WPExportRaw
  ): AIAnalysisResult {
    const start = Date.now()

    const template = recommendTemplate(site, industry, features)
    const layout = recommendLayout(site, industry, features)
    const sections = recommendSections(site, industry, features)
    const contentScores = scoreContent(site)
    const brand = detectBrand(siteInfo || {}, rawContent || [])
    const homepage = generateHomepage(site, industry, features, sections, contentScores)
    const recommendations = generateRecommendations(site, industry, features)

    const adapters = wpRaw ? detectFeaturesForAdapter(wpRaw, features) : undefined

    return {
      template,
      layout,
      sections,
      brand,
      contentScores,
      homepage,
      recommendations,
      adapters,
      processingTime: Date.now() - start,
      modelVersion: `wpai-${this.config.provider}-1.0`,
    }
  }

  getConfig(): AIConfig {
    return { ...this.config }
  }

  updateConfig(config: Partial<AIConfig>): void {
    this.config = { ...this.config, ...config }
  }
}

export function createAIEngine(config?: Partial<AIConfig>): AIEngine {
  return new AIEngine(config)
}
