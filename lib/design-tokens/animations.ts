import type { Variants } from 'framer-motion'

export interface AnimationPreset {
  name: string
  fadeIn: Variants
  slideUp: Variants
  slideDown: Variants
  slideLeft: Variants
  slideRight: Variants
  scaleIn: Variants
  staggerContainer: Variants
  staggerItem: Variants
  heroContent: Variants
  cardHover: { scale?: number; y?: number }
}

export const ANIMATION_PRESETS: Record<string, AnimationPreset> = {
  smooth: {
    name: 'Smooth & Elegant',
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
    },
    slideUp: {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    },
    slideDown: {
      hidden: { opacity: 0, y: -20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    },
    slideLeft: {
      hidden: { opacity: 0, x: 30 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    },
    slideRight: {
      hidden: { opacity: 0, x: -30 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
    },
    staggerContainer: {
      hidden: {},
      visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
    },
    staggerItem: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    },
    heroContent: {
      hidden: { opacity: 0, y: 40 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] },
      },
    },
    cardHover: { scale: 1.03, y: -4 },
  },
  energetic: {
    name: 'Energetic & Bouncy',
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
    },
    slideUp: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 12 } },
    },
    slideDown: {
      hidden: { opacity: 0, y: -30 },
      visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 10 } },
    },
    slideLeft: {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120, damping: 12 } },
    },
    slideRight: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120, damping: 12 } },
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 150, damping: 15 } },
    },
    staggerContainer: {
      hidden: {},
      visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
    },
    staggerItem: {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 12 } },
    },
    heroContent: {
      hidden: { opacity: 0, y: 60, scale: 0.95 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: 'spring', stiffness: 100, damping: 12 },
      },
    },
    cardHover: { scale: 1.05, y: -8 },
  },
  cinematic: {
    name: 'Cinematic & Dramatic',
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 1, ease: [0.25, 0.4, 0.25, 1] } },
    },
    slideUp: {
      hidden: { opacity: 0, y: 60 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 0.4, 0.25, 1] } },
    },
    slideDown: {
      hidden: { opacity: 0, y: -40 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] } },
    },
    slideLeft: {
      hidden: { opacity: 0, x: 60 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.25, 0.4, 0.25, 1] } },
    },
    slideRight: {
      hidden: { opacity: 0, x: -60 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.25, 0.4, 0.25, 1] } },
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.85 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] } },
    },
    staggerContainer: {
      hidden: {},
      visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
    },
    staggerItem: {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] } },
    },
    heroContent: {
      hidden: { opacity: 0, y: 80, scale: 0.9 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 1.2, ease: [0.25, 0.4, 0.25, 1] },
      },
    },
    cardHover: { scale: 1.02, y: -6 },
  },
}

export const ANIMATION_BY_INDUSTRY: Record<string, string> = {
  business: 'smooth',
  agency: 'energetic',
  saas: 'smooth',
  medical: 'smooth',
  portfolio: 'cinematic',
  blog: 'smooth',
  news: 'cinematic',
}

export function getAnimationsForIndustry(industry: string): AnimationPreset {
  const key = ANIMATION_BY_INDUSTRY[industry] || 'smooth'
  return ANIMATION_PRESETS[key]
}
