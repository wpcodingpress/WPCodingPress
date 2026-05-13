import type { NormalizedSiteData, SiteCategory } from '@/types/content-schema'
import type { LayoutRecommendation } from '@/lib/engine/types'
import type { IndustryLayout } from '@/lib/layouts/index'
import { generateIndustryLayout } from '@/lib/layouts/index'
import { generateLayout } from '@/lib/engine/layout-engine'
import { classifyIndustry } from '@/lib/engine/industry-classifier'
import { detectFeatures } from '@/lib/engine/feature-detector'
import { normalizeWPData } from '@/lib/engine/content-mapper'
import { getIndustryColors, generateCSSVariables } from '@/lib/design-tokens/colors'
import { getTypographyForIndustry } from '@/lib/design-tokens/typography'
import { getSpacingForIndustry } from '@/lib/design-tokens/spacing'
import { getAnimationsForIndustry } from '@/lib/design-tokens/animations'
import type { ColorPalette } from '@/lib/design-tokens/colors'
import type { TypographyPreset } from '@/lib/design-tokens/typography'
import type { SpacingScale } from '@/lib/design-tokens/spacing'
import type { AnimationPreset } from '@/lib/design-tokens/animations'

export interface AdaptiveSiteConfig {
  site: NormalizedSiteData
  features: ReturnType<typeof detectFeatures>
  industry: ReturnType<typeof classifyIndustry>
  layout: LayoutRecommendation
  industryLayout: IndustryLayout
  colors: ColorPalette
  typography: TypographyPreset
  spacing: SpacingScale
  animations: AnimationPreset
  cssVariables: Record<string, string>
}

export function analyzeWordPressSite(wpRaw: Record<string, unknown>, wpBaseUrl: string): AdaptiveSiteConfig {
  const site = normalizeWPData(wpRaw, wpBaseUrl)
  const features = detectFeatures(wpRaw)
  const industry = classifyIndustry(wpRaw, features)
  const layout = generateLayout(site, industry)
  const industryLayout = generateIndustryLayout(site, industry.category)
  const colors = getIndustryColors(industry.category)
  const typography = getTypographyForIndustry(industry.category)
  const spacing = getSpacingForIndustry(industry.category)
  const animations = getAnimationsForIndustry(industry.category)
  const cssVariables = generateCSSVariables(colors)

  return {
    site,
    features,
    industry,
    layout,
    industryLayout,
    colors,
    typography,
    spacing,
    animations,
    cssVariables,
  }
}
