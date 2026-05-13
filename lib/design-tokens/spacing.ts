export interface SpacingScale {
  section: { mobile: string; desktop: string }
  container: { mobile: string; desktop: string }
  grid: { gap: string; column: string }
  content: { gap: string; padding: string }
}

export const SPACING_PRESETS: Record<string, SpacingScale> = {
  comfortable: {
    section: { mobile: 'py-16 md:py-24', desktop: 'py-24 md:py-32' },
    container: { mobile: 'px-4', desktop: 'max-w-7xl mx-auto px-6 lg:px-8' },
    grid: { gap: 'gap-6 md:gap-8', column: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' },
    content: { gap: 'space-y-4', padding: 'p-6 md:p-8' },
  },
  compact: {
    section: { mobile: 'py-12 md:py-16', desktop: 'py-16 md:py-20' },
    container: { mobile: 'px-4', desktop: 'max-w-7xl mx-auto px-6 lg:px-8' },
    grid: { gap: 'gap-4 md:gap-6', column: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' },
    content: { gap: 'space-y-2', padding: 'p-4 md:p-6' },
  },
  spacious: {
    section: { mobile: 'py-20 md:py-32', desktop: 'py-32 md:py-40' },
    container: { mobile: 'px-6', desktop: 'max-w-7xl mx-auto px-8 lg:px-12' },
    grid: { gap: 'gap-8 md:gap-12', column: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2' },
    content: { gap: 'space-y-6', padding: 'p-8 md:p-12' },
  },
}

export const SPACING_BY_INDUSTRY: Record<string, string> = {
  business: 'comfortable',
  agency: 'spacious',
  saas: 'comfortable',
  medical: 'compact',
  portfolio: 'spacious',
  blog: 'comfortable',
  news: 'compact',
  ecommerce: 'compact',
  education: 'comfortable',
}

export function getSpacingForIndustry(industry: string): SpacingScale {
  const key = SPACING_BY_INDUSTRY[industry] || 'comfortable'
  return SPACING_PRESETS[key]
}
