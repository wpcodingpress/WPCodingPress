export interface AIRecommendation {
  id: string
  type: 'template' | 'layout' | 'section' | 'content' | 'style' | 'seo'
  title: string
  description: string
  confidence: number
  priority: 'critical' | 'high' | 'medium' | 'low'
  data: Record<string, unknown>
  reasoning: string[]
}

export interface TemplateRecommendation {
  templateId: string
  templateName: string
  confidence: number
  reason: string
  alternatives: { templateId: string; templateName: string; confidence: number }[]
}

export interface LayoutRecommendation {
  heroLayout: 'centered' | 'split' | 'fullscreen' | 'overlay'
  contentWidth: 'narrow' | 'default' | 'wide' | 'full'
  gridLayout: 'sidebar' | 'full' | 'magazine'
  cardStyle: 'default' | 'glass' | 'bordered' | 'minimal' | 'elevated'
  animationPreset: string
  spacingScale: string
  reasoning: string[]
}

export interface SectionRecommendation {
  section: string
  priority: number
  reason: string
  layoutVariant: string
  maxItems?: number
}

export interface BrandProfile {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  fontHeadings: string
  fontBody: string
  logoStyle: 'minimal' | 'detailed' | 'icon' | 'text' | 'none'
  visualTone: 'professional' | 'creative' | 'warm' | 'bold' | 'minimal' | 'luxury'
  detectedColors: string[]
  contrast: 'light' | 'dark' | 'mixed'
  modernity: number
  recommendations: {
    modernizeColors: string[]
    suggestedFonts: string[]
    toneShift: string
  }
}

export interface ContentScore {
  contentId: string
  contentType: 'post' | 'page' | 'service' | 'product'
  title: string
  score: number
  signals: ContentSignal[]
  recommendedSection: string
  priority: 'featured' | 'high' | 'medium' | 'low'
}

export interface ContentSignal {
  type: string
  value: number
  label: string
}

export interface HomepageBlueprint {
  sections: BlueprintSection[]
  visualHierarchy: string[]
  ctaPlacements: { position: string; type: string }[]
  contentDistribution: { section: string; contentCount: number }[]
  reasoning: string
}

export interface BlueprintSection {
  id: string
  component: string
  priority: number
  layoutVariant: string
  maxItems?: number
  title?: string
  contentSource: string[]
}

export interface AIAnalysisResult {
  template: TemplateRecommendation
  layout: LayoutRecommendation
  sections: SectionRecommendation[]
  brand: BrandProfile
  contentScores: ContentScore[]
  homepage: HomepageBlueprint
  recommendations: AIRecommendation[]
  adapters?: import('@/lib/adapters/types').FeatureAdapterResult
  processingTime: number
  modelVersion: string
}

export interface AIConfig {
  enabled: boolean
  provider: 'rule-based' | 'openai' | 'anthropic' | 'custom'
  apiKey?: string
  model?: string
  maxTokens?: number
  temperature?: number
}

export const DEFAULT_AI_CONFIG: AIConfig = {
  enabled: true,
  provider: 'rule-based',
}
