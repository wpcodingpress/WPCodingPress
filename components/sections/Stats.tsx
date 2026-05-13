'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { StatItem } from '@/types/content-schema'

interface StatsProps {
  stats: StatItem[]
  title?: string
  subtitle?: string
  variant?: 'default' | 'counters' | 'pills' | 'ticker'
  className?: string
}

function Counter({ value, suffix, prefix, duration = 2 }: { value: number; suffix: string; prefix: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const counted = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true
          let start = 0
          const increment = value / (duration * 60)
          const timer = setInterval(() => {
            start += increment
            if (start >= value) {
              setCount(value)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, 1000 / 60)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count}{suffix}
    </span>
  )
}

export default function Stats({ stats, title, subtitle, variant = 'default', className = '' }: StatsProps) {
  if (stats.length === 0) return null

  if (variant === 'pills') {
    return (
      <section className={`py-8 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {title && <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>}
          <div className="flex flex-wrap gap-3">
            {stats.map((stat) => (
              <span key={stat.id} className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                {stat.label}
              </span>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'ticker') {
    return (
      <div className={`bg-gray-900 text-white py-3 overflow-hidden ${className}`}>
        <div className="ticker-animate flex whitespace-nowrap" style={{ animation: 'ticker-scroll 40s linear infinite' } as React.CSSProperties}>
          {[...stats, ...stats].map((stat, i) => (
            <span key={`${stat.id}-${i}`} className="mx-8 text-sm font-medium">
              {stat.label}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className={`py-16 md:py-20 ${className}`}>
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
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="text-center"
            >
              <div className={`text-4xl md:text-5xl font-bold text-gray-900 mb-2 ${variant === 'counters' ? '' : ''}`}>
                {variant === 'counters' ? (
                  <Counter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                ) : (
                  <>{stat.prefix}{stat.value}{stat.suffix}</>
                )}
              </div>
              <p className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
