'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { NewsletterConfig } from '@/types/content-schema'

interface NewsletterProps {
  config: NewsletterConfig
  variant?: 'inline'
  className?: string
}

export default function Newsletter({ config, className = '' }: NewsletterProps) {
  if (!config) return null

  return (
    <section className={`py-16 md:py-20 ${className}`}>
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{config.title}</h2>
          {config.description && (
            <p className="text-gray-600 mb-8">{config.description}</p>
          )}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder={config.placeholder}
              required
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-0 outline-none transition-colors"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all hover:scale-105 whitespace-nowrap"
            >
              {config.buttonLabel}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
