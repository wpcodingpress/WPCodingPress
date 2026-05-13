'use client'

import { motion } from 'framer-motion'
import type { ServiceItem } from '@/types/content-schema'

interface FeaturesProps {
  services: ServiceItem[]
  title?: string
  subtitle?: string
  variant?: 'grid' | 'cards'
  columns?: number
  maxItems?: number
  className?: string
}

export default function Features({ services, title, subtitle, variant = 'grid', columns = 3, className = '' }: FeaturesProps) {
  if (services.length === 0) return null

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            {title && <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>}
            {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
          </div>
        )}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className={`grid grid-cols-1 ${gridCols[columns as keyof typeof gridCols] || 'md:grid-cols-2 lg:grid-cols-3'} gap-6 md:gap-8`}
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{ y: -5 }}
              className={`group p-6 md:p-8 rounded-2xl transition-all duration-300 ${
                variant === 'cards'
                  ? 'bg-white shadow-lg hover:shadow-xl border border-gray-100'
                  : 'bg-white/50 hover:bg-white border border-gray-100 hover:border-gray-200'
              }`}
            >
              {service.icon && (
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-4">{service.description}</p>
              {service.features.length > 0 && (
                <ul className="space-y-2">
                  {service.features.slice(0, 4).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
