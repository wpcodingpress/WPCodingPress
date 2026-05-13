'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { HeroContent } from '@/types/content-schema'

interface HeroProps {
  content: HeroContent
  siteName: string
  variant?: 'centered' | 'split' | 'fullscreen' | 'overlay'
  className?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] } },
}

export default function Hero({ content, siteName, variant = 'centered', className = '' }: HeroProps) {
  const title = content.title || siteName
  const bgImage = content.backgroundImage?.url
  const bgVideo = content.backgroundVideo

  if (variant === 'fullscreen') {
    return (
      <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}>
        {bgVideo ? (
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src={bgVideo} type="video/mp4" />
          </video>
        ) : bgImage ? (
          <div className="absolute inset-0">
            <img src={bgImage} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900" />
        )}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6">
            {title}
          </motion.h1>
          {content.description && (
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8">
              {content.description}
            </motion.p>
          )}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center">
            {content.ctaPrimary && (
              <Link
                href={content.ctaPrimary.url}
                className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-gray-900 font-semibold text-lg hover:bg-gray-100 transition-all hover:scale-105"
              >
                {content.ctaPrimary.label}
              </Link>
            )}
            {content.ctaSecondary && (
              <Link
                href={content.ctaSecondary.url}
                className="inline-flex items-center px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-all"
              >
                {content.ctaSecondary.label}
              </Link>
            )}
          </motion.div>
        </motion.div>
      </section>
    )
  }

  if (variant === 'overlay' && bgImage) {
    return (
      <section className={`relative min-h-[70vh] flex items-center overflow-hidden ${className}`}>
        <div className="absolute inset-0">
          <img src={bgImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
        >
          <div className="max-w-2xl">
            <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              {title}
            </motion.h1>
            {content.description && (
              <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-300 mb-8">
                {content.description}
              </motion.p>
            )}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              {content.ctaPrimary && (
                <Link href={content.ctaPrimary.url} className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-all">
                  {content.ctaPrimary.label}
                </Link>
              )}
              {content.ctaSecondary && (
                <Link href={content.ctaSecondary.url} className="inline-flex items-center px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all">
                  {content.ctaSecondary.label}
                </Link>
              )}
            </motion.div>
          </div>
        </motion.div>
      </section>
    )
  }

  return (
    <section className={`relative py-20 md:py-32 lg:py-40 overflow-hidden ${className}`}>
      {bgImage && (
        <div className="absolute inset-0">
          <img src={bgImage} alt="" className="w-full h-full object-cover opacity-20" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50" />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
          {title}
        </motion.h1>
        {content.description && (
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            {content.description}
          </motion.p>
        )}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center">
          {content.ctaPrimary && (
            <Link href={content.ctaPrimary.url} className="inline-flex items-center px-8 py-4 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all hover:scale-105 shadow-lg">
              {content.ctaPrimary.label}
            </Link>
          )}
          {content.ctaSecondary && (
            <Link href={content.ctaSecondary.url} className="inline-flex items-center px-8 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-900 hover:text-gray-900 transition-all">
              {content.ctaSecondary.label}
            </Link>
          )}
        </motion.div>
      </motion.div>
    </section>
  )
}
