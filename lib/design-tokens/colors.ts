export interface ColorPalette {
  primary: string
  primaryDark: string
  primaryLight: string
  secondary: string
  accent: string
  background: string
  foreground: string
  muted: string
  mutedForeground: string
  border: string
  success: string
  warning: string
  destructive: string
  gradients: {
    primary: string
    hero: string
    cta: string
    dark: string
  }
}

export const INDUSTRY_COLORS: Record<string, ColorPalette> = {
  business: {
    primary: '#2563eb',
    primaryDark: '#1d4ed8',
    primaryLight: '#3b82f6',
    secondary: '#7c3aed',
    accent: '#f59e0b',
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    border: '#e2e8f0',
    success: '#10b981',
    warning: '#f59e0b',
    destructive: '#ef4444',
    gradients: {
      primary: 'from-blue-600 via-blue-700 to-indigo-800',
      hero: 'from-blue-50 via-white to-indigo-50',
      cta: 'from-blue-600 via-indigo-600 to-purple-700',
      dark: 'from-slate-900 via-slate-800 to-indigo-950',
    },
  },
  agency: {
    primary: '#7c3aed',
    primaryDark: '#6d28d9',
    primaryLight: '#8b5cf6',
    secondary: '#ec4899',
    accent: '#f97316',
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#f5f3ff',
    mutedForeground: '#6b7280',
    border: '#e9d5ff',
    success: '#10b981',
    warning: '#f59e0b',
    destructive: '#ef4444',
    gradients: {
      primary: 'from-violet-600 via-purple-600 to-pink-600',
      hero: 'from-violet-50 via-fuchsia-50 to-white',
      cta: 'from-violet-600 via-purple-600 to-pink-600',
      dark: 'from-gray-950 via-purple-950 to-fuchsia-950',
    },
  },
  saas: {
    primary: '#0891b2',
    primaryDark: '#0e7490',
    primaryLight: '#06b6d4',
    secondary: '#6366f1',
    accent: '#14b8a6',
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#ecfeff',
    mutedForeground: '#64748b',
    border: '#cffafe',
    success: '#10b981',
    warning: '#f59e0b',
    destructive: '#ef4444',
    gradients: {
      primary: 'from-cyan-600 via-teal-600 to-indigo-700',
      hero: 'from-cyan-50 via-teal-50 to-indigo-50',
      cta: 'from-cyan-600 via-teal-600 to-indigo-700',
      dark: 'from-slate-900 via-teal-950 to-cyan-950',
    },
  },
  medical: {
    primary: '#059669',
    primaryDark: '#047857',
    primaryLight: '#10b981',
    secondary: '#0284c7',
    accent: '#0ea5e9',
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#f0fdf4',
    mutedForeground: '#6b7280',
    border: '#dcfce7',
    success: '#10b981',
    warning: '#f59e0b',
    destructive: '#ef4444',
    gradients: {
      primary: 'from-emerald-600 via-green-600 to-teal-700',
      hero: 'from-emerald-50 via-green-50 to-teal-50',
      cta: 'from-emerald-600 via-green-600 to-teal-700',
      dark: 'from-slate-900 via-emerald-950 to-teal-950',
    },
  },
  portfolio: {
    primary: '#d946ef',
    primaryDark: '#c026d3',
    primaryLight: '#e879f9',
    secondary: '#6366f1',
    accent: '#f43f5e',
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#fdf4ff',
    mutedForeground: '#6b7280',
    border: '#fae8ff',
    success: '#10b981',
    warning: '#f59e0b',
    destructive: '#ef4444',
    gradients: {
      primary: 'from-fuchsia-600 via-pink-600 to-rose-600',
      hero: 'from-fuchsia-50 via-pink-50 to-rose-50',
      cta: 'from-fuchsia-600 via-pink-600 to-rose-600',
      dark: 'from-slate-900 via-fuchsia-950 to-pink-950',
    },
  },
  blog: {
    primary: '#1e293b',
    primaryDark: '#0f172a',
    primaryLight: '#334155',
    secondary: '#6366f1',
    accent: '#f59e0b',
    background: '#fafafa',
    foreground: '#1e293b',
    muted: '#f5f5f4',
    mutedForeground: '#78716c',
    border: '#e7e5e4',
    success: '#10b981',
    warning: '#f59e0b',
    destructive: '#ef4444',
    gradients: {
      primary: 'from-stone-800 via-stone-700 to-stone-900',
      hero: 'from-stone-50 via-white to-stone-100',
      cta: 'from-stone-800 via-stone-700 to-stone-900',
      dark: 'from-stone-950 via-stone-900 to-neutral-950',
    },
  },
  news: {
    primary: '#b91c1c',
    primaryDark: '#991b1b',
    primaryLight: '#dc2626',
    secondary: '#1d4ed8',
    accent: '#eab308',
    background: '#fafafa',
    foreground: '#0c0a09',
    muted: '#f5f5f4',
    mutedForeground: '#78716c',
    border: '#e7e5e4',
    success: '#10b981',
    warning: '#f59e0b',
    destructive: '#ef4444',
    gradients: {
      primary: 'from-red-700 via-red-600 to-red-800',
      hero: 'from-neutral-100 via-white to-red-50',
      cta: 'from-red-700 via-red-600 to-red-800',
      dark: 'from-neutral-950 via-red-950 to-stone-950',
    },
  },
}

export function getIndustryColors(industry: string): ColorPalette {
  return INDUSTRY_COLORS[industry] || INDUSTRY_COLORS.business
}

export function generateCSSVariables(palette: ColorPalette): Record<string, string> {
  const hexToHSL = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return '0 0% 0%'
    const r = parseInt(result[1], 16) / 255
    const g = parseInt(result[2], 16) / 255
    const b = parseInt(result[3], 16) / 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2
    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
  }

  return {
    '--primary': hexToHSL(palette.primary),
    '--primary-dark': hexToHSL(palette.primaryDark),
    '--primary-light': hexToHSL(palette.primaryLight),
    '--secondary': hexToHSL(palette.secondary),
    '--accent': hexToHSL(palette.accent),
    '--background': hexToHSL(palette.background),
    '--foreground': hexToHSL(palette.foreground),
    '--muted': hexToHSL(palette.muted),
    '--muted-foreground': hexToHSL(palette.mutedForeground),
    '--border': hexToHSL(palette.border),
    '--success': hexToHSL(palette.success),
    '--warning': hexToHSL(palette.warning),
    '--destructive': hexToHSL(palette.destructive),
  }
}
