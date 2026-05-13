export interface TypographyScale {
  headingFont: string
  bodyFont: string
  display: { size: string; lineHeight: string; weight: string }
  h1: { size: string; lineHeight: string; weight: string }
  h2: { size: string; lineHeight: string; weight: string }
  h3: { size: string; lineHeight: string; weight: string }
  h4: { size: string; lineHeight: string; weight: string }
  body: { size: string; lineHeight: string; weight: string }
  small: { size: string; lineHeight: string; weight: string }
  caption: { size: string; lineHeight: string; weight: string }
}

export interface TypographyPreset {
  name: string
  headingFont: string
  bodyFont: string
  scale: TypographyScale
}

export const TYPOGRAPHY_PRESETS: Record<string, TypographyPreset> = {
  modern: {
    name: 'Modern Sans',
    headingFont: 'Outfit, sans-serif',
    bodyFont: 'Inter, sans-serif',
    scale: {
      headingFont: 'Outfit, sans-serif',
      bodyFont: 'Inter, sans-serif',
      display: { size: 'clamp(3rem, 8vw, 5rem)', lineHeight: '1.1', weight: '800' },
      h1: { size: 'clamp(2.25rem, 5vw, 3.5rem)', lineHeight: '1.15', weight: '700' },
      h2: { size: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: '1.2', weight: '700' },
      h3: { size: 'clamp(1.25rem, 3vw, 1.75rem)', lineHeight: '1.3', weight: '600' },
      h4: { size: 'clamp(1rem, 2vw, 1.25rem)', lineHeight: '1.4', weight: '600' },
      body: { size: '1rem', lineHeight: '1.65', weight: '400' },
      small: { size: '0.875rem', lineHeight: '1.5', weight: '400' },
      caption: { size: '0.75rem', lineHeight: '1.4', weight: '500' },
    },
  },
  editorial: {
    name: 'Editorial Serif',
    headingFont: 'Merriweather, Georgia, serif',
    bodyFont: 'Source Serif Pro, Georgia, serif',
    scale: {
      headingFont: 'Merriweather, Georgia, serif',
      bodyFont: 'Source Serif Pro, Georgia, serif',
      display: { size: 'clamp(2.75rem, 7vw, 4.5rem)', lineHeight: '1.15', weight: '900' },
      h1: { size: 'clamp(2rem, 4vw, 3rem)', lineHeight: '1.2', weight: '700' },
      h2: { size: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: '1.25', weight: '700' },
      h3: { size: 'clamp(1.125rem, 2.5vw, 1.5rem)', lineHeight: '1.35', weight: '600' },
      h4: { size: 'clamp(1rem, 1.5vw, 1.125rem)', lineHeight: '1.4', weight: '600' },
      body: { size: '1.125rem', lineHeight: '1.75', weight: '400' },
      small: { size: '0.875rem', lineHeight: '1.5', weight: '400' },
      caption: { size: '0.75rem', lineHeight: '1.4', weight: '500' },
    },
  },
  minimalist: {
    name: 'Minimalist Clean',
    headingFont: 'Inter, sans-serif',
    bodyFont: 'Inter, sans-serif',
    scale: {
      headingFont: 'Inter, sans-serif',
      bodyFont: 'Inter, sans-serif',
      display: { size: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: '1.05', weight: '700' },
      h1: { size: 'clamp(2rem, 4vw, 2.75rem)', lineHeight: '1.1', weight: '600' },
      h2: { size: 'clamp(1.5rem, 3vw, 2rem)', lineHeight: '1.2', weight: '600' },
      h3: { size: 'clamp(1.125rem, 2vw, 1.5rem)', lineHeight: '1.3', weight: '500' },
      h4: { size: 'clamp(1rem, 1.5vw, 1.125rem)', lineHeight: '1.4', weight: '500' },
      body: { size: '1rem', lineHeight: '1.6', weight: '400' },
      small: { size: '0.875rem', lineHeight: '1.5', weight: '400' },
      caption: { size: '0.75rem', lineHeight: '1.4', weight: '500' },
    },
  },
  playful: {
    name: 'Playful Display',
    headingFont: 'Outfit, sans-serif',
    bodyFont: 'DM Sans, sans-serif',
    scale: {
      headingFont: 'Outfit, sans-serif',
      bodyFont: 'DM Sans, sans-serif',
      display: { size: 'clamp(3.5rem, 10vw, 6rem)', lineHeight: '1', weight: '900' },
      h1: { size: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: '1.1', weight: '800' },
      h2: { size: 'clamp(1.75rem, 4vw, 2.75rem)', lineHeight: '1.2', weight: '700' },
      h3: { size: 'clamp(1.25rem, 3vw, 1.75rem)', lineHeight: '1.3', weight: '600' },
      h4: { size: 'clamp(1rem, 2vw, 1.25rem)', lineHeight: '1.4', weight: '600' },
      body: { size: '1rem', lineHeight: '1.65', weight: '400' },
      small: { size: '0.875rem', lineHeight: '1.5', weight: '400' },
      caption: { size: '0.75rem', lineHeight: '1.4', weight: '500' },
    },
  },
}

export const INDUSTRY_TYPOGRAPHY: Record<string, string> = {
  business: 'modern',
  agency: 'playful',
  saas: 'modern',
  medical: 'minimalist',
  portfolio: 'playful',
  blog: 'editorial',
  news: 'editorial',
  ecommerce: 'modern',
  education: 'editorial',
}

export function getTypographyForIndustry(industry: string): TypographyPreset {
  const presetKey = INDUSTRY_TYPOGRAPHY[industry] || 'modern'
  return TYPOGRAPHY_PRESETS[presetKey]
}
