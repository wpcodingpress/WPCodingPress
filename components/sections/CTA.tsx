'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { CTAContent } from '@/types/content-schema'

interface CTAProps {
  content: CTAContent
  variant?: 'default' | 'gradient'
  className?: string
}

export default function CTA({ content, variant = 'default', className = '' }: CTAProps) {
  return (
    <section className={`relative overflow-hidden ${className}`}>
      {variant === 'gradient' ? (
        <div className="relative py-20 md:py-28 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-3xl mx-auto px-4 text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{content.title}</h2>
            {content.description && (
              <p className="text-lg text-purple-100 mb-8">{content.description}</p>
            )}
            <Link
              href={content.buttonUrl}
              className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-purple-700 font-semibold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
            >
              {content.buttonLabel}
            </Link>
          </motion.div>
        </div>
      ) : (
        <div className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{content.title}</h2>
              {content.description && (
                <p className="text-lg text-gray-600 mb-8">{content.description}</p>
              )}
              <Link
                href={content.buttonUrl}
                className="inline-flex items-center px-8 py-4 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all hover:scale-105 shadow-lg"
              >
                {content.buttonLabel}
              </Link>
            </motion.div>
          </div>
        </div>
      )}
    </section>
  )
}
