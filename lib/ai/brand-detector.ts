import type { BrandProfile } from './types'

const COMMON_FONTS = [
  'Inter', 'Roboto', 'Open Sans', 'Poppins', 'Lato', 'Montserrat',
  'Playfair Display', 'Merriweather', 'Outfit', 'DM Sans',
  'Source Sans Pro', 'Nunito', 'Raleway', 'Ubuntu', 'Oswald',
]

const MODERN_FONTS = ['Inter', 'Outfit', 'DM Sans', 'Poppins', 'Clash Display', 'Cabinet Grotesk', 'Satoshi']
const EDITORIAL_FONTS = ['Merriweather', 'Playfair Display', 'Source Serif Pro', 'Lora', 'Crimson Text']

const COLOR_PAIRS: Record<string, string[]> = {
  blue: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd'],
  purple: ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd'],
  green: ['#059669', '#10b981', '#34d399', '#6ee7b7'],
  red: ['#b91c1c', '#dc2626', '#ef4444', '#fca5a5'],
  orange: ['#ea580c', '#f97316', '#fb923c', '#fdba74'],
  teal: ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4'],
  pink: ['#be185d', '#ec4899', '#f472b6', '#f9a8d4'],
  indigo: ['#4338ca', '#6366f1', '#818cf8', '#a5b4fc'],
}

const TONE_CLASSIFIERS = [
  { keywords: ['professional', 'corporate', 'enterprise', 'solution', 'consulting', 'law', 'finance'], tone: 'professional' as const },
  { keywords: ['creative', 'studio', 'design', 'art', 'photography', 'fashion', 'music'], tone: 'creative' as const },
  { keywords: ['care', 'health', 'wellness', 'family', 'community', 'support', 'heart'], tone: 'warm' as const },
  { keywords: ['innovation', 'disrupt', 'startup', 'tech', 'future', 'digital', 'transform'], tone: 'bold' as const },
  { keywords: ['simple', 'clean', 'elegant', 'minimal', 'sleek', 'modern', 'refined'], tone: 'minimal' as const },
  { keywords: ['luxury', 'premium', 'exclusive', 'elite', 'boutique', 'high-end', 'bespoke'], tone: 'luxury' as const },
]

export function detectBrand(
  siteInfo: Record<string, unknown>,
  content: string[]
): BrandProfile {
  const start = Date.now()

  const detectedColors = extractColors(siteInfo, content)
  const { primary, secondary, accent, bg, text } = classifyColors(detectedColors)
  const contrast = determineContrast(bg, text)
  const logoStyle = detectLogoStyle(siteInfo)
  const visualTone = detectVisualTone(siteInfo, content)
  const modernity = calculateModernity(siteInfo, content, visualTone)

  const fontHeadings = suggestHeadingFont(visualTone, modernity)
  const fontBody = suggestBodyFont(visualTone, modernity)

  return {
    primaryColor: primary,
    secondaryColor: secondary,
    accentColor: accent,
    backgroundColor: bg,
    textColor: text,
    fontHeadings,
    fontBody,
    logoStyle,
    visualTone,
    detectedColors,
    contrast,
    modernity,
    recommendations: {
      modernizeColors: suggestModernPalette(primary, visualTone),
      suggestedFonts: suggestFontPairing(visualTone),
      toneShift: suggestToneShift(visualTone, modernity),
    },
  }
}

function extractColors(siteInfo: Record<string, unknown>, content: string[]): string[] {
  const colors: string[] = []

  const colorFields = ['primary_color', 'secondary_color', 'accent_color', 'background_color', 'text_color', 'theme_color']
  colorFields.forEach(field => {
    const val = siteInfo[field]
    if (typeof val === 'string' && /^#[0-9a-f]{6}$/i.test(val)) {
      colors.push(val)
    }
  })

  const cssColors = siteInfo.custom_css
  if (typeof cssColors === 'string') {
    const hexMatches = cssColors.match(/#[0-9a-f]{6}/gi)
    if (hexMatches) colors.push(...hexMatches)
  }

  if (colors.length === 0) {
    const combined = content.join(' ')
    const hexMatches = combined.match(/#[0-9a-f]{6}/gi)
    if (hexMatches) colors.push(...hexMatches.slice(0, 5))
  }

  return [...new Set(colors)].slice(0, 8)
}

function classifyColors(colors: string[]): { primary: string; secondary: string; accent: string; bg: string; text: string } {
  const defaultColors = { primary: '#7c3aed', secondary: '#6366f1', accent: '#ec4899', bg: '#ffffff', text: '#0f172a' }

  if (colors.length === 0) return defaultColors

  const nonWhite = colors.filter(c => {
    const hex = c.replace('#', '').toLowerCase()
    return hex !== 'ffffff' && hex !== '000000' && hex !== 'fff' && hex !== '000'
  })

  if (nonWhite.length === 0) return defaultColors

  return {
    primary: nonWhite[0] || defaultColors.primary,
    secondary: nonWhite[1] || adjustColor(nonWhite[0], -20),
    accent: nonWhite[2] || adjustColor(nonWhite[0], 40),
    bg: colors.find(c => /^#f[0-9a-f]{5}$/i.test(c) || c === '#ffffff') || '#ffffff',
    text: colors.find(c => /^#[01][0-9a-f]{5}$/i.test(c)) || '#0f172a',
  }
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xFF) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xFF) + amount))
  const b = Math.min(255, Math.max(0, (num & 0xFF) + amount))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

function determineContrast(bg: string, text: string): 'light' | 'dark' | 'mixed' {
  const bgLum = luminance(bg)
  const textLum = luminance(text)
  if (bgLum > 0.5 && textLum < 0.3) return 'light'
  if (bgLum < 0.3 && textLum > 0.5) return 'dark'
  return 'mixed'
}

function luminance(hex: string): number {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = ((num >> 16) & 0xFF) / 255
  const g = ((num >> 8) & 0xFF) / 255
  const b = (num & 0xFF) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function detectLogoStyle(siteInfo: Record<string, unknown>): BrandProfile['logoStyle'] {
  if (siteInfo.logo) {
    const logo = String(siteInfo.logo)
    if (logo.endsWith('.svg') && !logo.includes('icon')) return 'minimal'
    if (logo.includes('icon') || logo.includes('mark')) return 'icon'
    if (logo.includes('text') || logo.includes('wordmark')) return 'text'
    return 'detailed'
  }
  return 'text'
}

function detectVisualTone(siteInfo: Record<string, unknown>, content: string[]): BrandProfile['visualTone'] {
  const text = [String(siteInfo.name || ''), String(siteInfo.description || ''), ...content].join(' ').toLowerCase()

  for (const classifier of TONE_CLASSIFIERS) {
    if (classifier.keywords.some(k => text.includes(k))) {
      return classifier.tone
    }
  }

  return 'professional'
}

function calculateModernity(siteInfo: Record<string, unknown>, content: string[], tone: string): number {
  let score = 50
  const text = [String(siteInfo.name || ''), String(siteInfo.description || ''), ...content].join(' ').toLowerCase()

  if (tone === 'minimal' || tone === 'bold') score += 20
  if (tone === 'creative') score += 15
  if (tone === 'professional') score += 5

  const modernTerms = ['react', 'next.js', 'tailwind', 'modern', 'responsive', 'optimized', 'lightning', 'fast']
  modernTerms.forEach(t => { if (text.includes(t)) score += 5 })

  const outdatedTerms = ['flash', 'ie', 'jquery', 'table layout', 'table-based']
  outdatedTerms.forEach(t => { if (text.includes(t)) score -= 10 })

  return Math.min(100, Math.max(0, score))
}

function suggestHeadingFont(tone: BrandProfile['visualTone'], modernity: number): string {
  if (modernity > 70) return tone === 'minimal' ? 'Inter' : 'Outfit'
  if (tone === 'warm' || tone === 'luxury') return 'Playfair Display'
  return 'Inter'
}

function suggestBodyFont(tone: BrandProfile['visualTone'], modernity: number): string {
  if (modernity > 60) return 'Inter'
  if (tone === 'minimal' || tone === 'creative') return 'Merriweather'
  return 'Inter'
}

function suggestModernPalette(primary: string, tone: BrandProfile['visualTone']): string[] {
  const hex = primary.replace('#', '').toLowerCase()
  for (const [, colors] of Object.entries(COLOR_PAIRS)) {
    if (colors.some(c => c.includes(hex.substring(0, 3)))) {
      if (tone === 'professional') return ['#1e293b', '#3b82f6', '#f8fafc', '#0f172a']
      if (tone === 'creative') return ['#7c3aed', '#ec4899', '#fdf4ff', '#0f172a']
      if (tone === 'warm') return ['#059669', '#f59e0b', '#f0fdf4', '#0f172a']
      return colors
    }
  }
  return ['#7c3aed', '#6366f1', '#ec4899', '#f5f3ff']
}

function suggestFontPairing(tone: BrandProfile['visualTone']): string[] {
  const pairings: Record<string, string[]> = {
    professional: ['Inter', 'Outfit'],
    creative: ['Outfit', 'DM Sans'],
    warm: ['Lora', 'Source Sans Pro'],
    bold: ['Clash Display', 'Inter'],
    minimal: ['Inter', 'Inter'],
    luxury: ['Playfair Display', 'Lato'],
  }
  return pairings[tone] || ['Inter', 'Inter']
}

function suggestToneShift(tone: BrandProfile['visualTone'], modernity: number): string {
  if (modernity < 40) return 'Consider modernizing with bolder typography and vibrant gradients'
  if (tone === 'professional') return 'Your brand is well-positioned. Subtle animations can enhance engagement.'
  if (tone === 'creative') return 'Your creative tone is strong. Consider adding micro-interactions.'
  return 'Your brand identity is clear. Maintaining consistency across all touchpoints is key.'
}
