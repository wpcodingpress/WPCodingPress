'use client'

import { motion } from 'framer-motion'
import type { ProductItem } from '@/types/content-schema'

interface PricingProps {
  products: ProductItem[]
  title?: string
  subtitle?: string
  className?: string
}

export default function Pricing({ products, title, subtitle, className = '' }: PricingProps) {
  if (products.length === 0) return null

  const sorted = [...products].sort((a, b) => a.price - b.price)
  const middleIndex = Math.floor(sorted.length / 2)

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
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto"
        >
          {sorted.map((product, i) => {
            const isFeatured = i === middleIndex && sorted.length >= 3
            return (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                className={`relative rounded-2xl p-6 md:p-8 transition-all duration-300 ${
                  isFeatured
                    ? 'bg-gray-900 text-white shadow-2xl scale-105 border-2 border-gray-700'
                    : 'bg-white border border-gray-200 hover:shadow-lg'
                }`}
              >
                {isFeatured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gray-700 text-xs font-medium text-white">
                    Popular
                  </span>
                )}
                <h3 className={`text-lg font-semibold mb-2 ${isFeatured ? 'text-gray-300' : 'text-gray-900'}`}>{product.name}</h3>
                <p className={`text-sm mb-6 ${isFeatured ? 'text-gray-400' : 'text-gray-500'}`}>{product.description}</p>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${isFeatured ? 'text-white' : 'text-gray-900'}`}>
                    ${(product.salePrice || product.price) / 100}
                  </span>
                  {product.salePrice && product.salePrice < product.price && (
                    <span className={`ml-2 text-sm line-through ${isFeatured ? 'text-gray-500' : 'text-gray-400'}`}>
                      ${product.price / 100}
                    </span>
                  )}
                  <span className={`text-sm ml-1 ${isFeatured ? 'text-gray-400' : 'text-gray-500'}`}>{product.currency}</span>
                </div>
                <button
                  className={`w-full py-3 rounded-xl font-medium transition-all ${
                    isFeatured
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  Get Started
                </button>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
