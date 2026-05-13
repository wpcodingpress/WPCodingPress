'use client'

import type { NormalizedSiteData } from '@/types/content-schema'
import type { IndustryLayout } from '@/lib/layouts'
import type { ColorPalette } from '@/lib/design-tokens/colors'
import type { TypographyPreset } from '@/lib/design-tokens/typography'
import type { AnimationPreset } from '@/lib/design-tokens/animations'
import type { FeatureMap } from '@/lib/engine'
import type { IndustryAnalysis, LayoutRecommendation } from '@/lib/engine'

interface AdaptiveLayoutProps {
  site: NormalizedSiteData
  features: FeatureMap
  industry: IndustryAnalysis
  layout: LayoutRecommendation
  industryLayout: IndustryLayout
  colors: ColorPalette
  typography: TypographyPreset
  animations: AnimationPreset
  children: React.ReactNode
}

export default function AdaptiveLayout({
  site,
  features,
  industry,
  layout,
  industryLayout,
  colors,
  typography,
  animations,
  children,
}: AdaptiveLayoutProps) {
  return (
    <div
      className="min-h-screen"
      style={{
        '--primary': colors.primary,
        '--primary-dark': colors.primaryDark,
        '--primary-light': colors.primaryLight,
        '--secondary': colors.secondary,
        '--accent': colors.accent,
        '--font-heading': typography.headingFont,
        '--font-body': typography.bodyFont,
      } as React.CSSProperties}
    >
      <style>{`
        :root {
          --primary: ${colors.primary};
          --primary-dark: ${colors.primaryDark};
          --primary-light: ${colors.primaryLight};
          --secondary: ${colors.secondary};
          --accent: ${colors.accent};
          --font-heading: ${typography.headingFont};
          --font-body: ${typography.bodyFont};
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: var(--font-heading);
        }
        body {
          font-family: var(--font-body);
        }
      `}</style>
      {children}
    </div>
  )
}
