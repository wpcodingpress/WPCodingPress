'use client'

import { motion } from 'framer-motion'
import type { GalleryItem } from '@/types/content-schema'

interface GalleryProps {
  items: GalleryItem[]
  title?: string
  subtitle?: string
  variant?: 'grid' | 'masonry'
  className?: string
}

export default function Gallery({ items, title, subtitle, variant = 'grid', className = '' }: GalleryProps) {
  if (items.length === 0) return null

  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center max-w-3xl mx-auto mb-12">
            {title && <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>}
            {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
          </div>
        )}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
          className={
            variant === 'masonry'
              ? 'columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'
          }
        >
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
              }}
              className={`group relative overflow-hidden rounded-xl ${
                variant === 'masonry' ? 'break-inside-avoid' : ''
              }`}
            >
              <img
                src={item.image.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                <div className="p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-semibold">{item.title}</h3>
                  {item.description && <p className="text-gray-200 text-sm">{item.description}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
