export { AIEngine, createAIEngine } from './engine'
export { recommendTemplate, recommendLayout, recommendSections, generateRecommendations } from './recommendation-engine'
export { detectBrand } from './brand-detector'
export { scoreContent, getFeaturedContent, getSectionDistribution } from './content-scorer'
export { generateHomepage } from './homepage-generator'
export type {
  AIAnalysisResult, AIRecommendation, TemplateRecommendation,
  LayoutRecommendation, SectionRecommendation, BrandProfile,
  ContentScore, ContentSignal, HomepageBlueprint, BlueprintSection,
  AIConfig,
} from './types'
