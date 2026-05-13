'use client'

import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import type { ContentNavigation } from '@/types/content-schema'

interface NavbarProps {
  navigation: ContentNavigation[]
  siteName: string
  logo?: { url: string; alt: string } | null
  variant?: 'default' | 'glass' | 'minimal' | 'news'
  className?: string
}

export default function Navbar({ navigation, siteName, logo, variant = 'default', className = '' }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const primaryNav = navigation.find(n => n.location === 'primary') || navigation[0]

  const variantStyles: Record<string, string> = {
    default: 'bg-white/95 backdrop-blur-md border-b border-gray-200/50',
    glass: 'bg-white/70 backdrop-blur-xl border-b border-white/20',
    minimal: 'bg-transparent border-b border-transparent',
    news: 'bg-gray-900 text-white border-b border-gray-800',
  }

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${variantStyles[variant]} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            {logo ? (
              <img src={logo.url} alt={logo.alt} className="h-8 w-auto" />
            ) : (
              <span className={`text-xl font-bold tracking-tight ${variant === 'news' ? 'text-white' : 'text-gray-900'}`}>
                {siteName}
              </span>
            )}
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {primaryNav?.items?.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  variant === 'news'
                    ? 'text-gray-300 hover:text-white hover:bg-white/10'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              variant === 'news' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`lg:hidden border-t ${variant === 'news' ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'}`}
        >
          <div className="px-4 py-4 space-y-1">
            {primaryNav?.items?.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  variant === 'news'
                    ? 'text-gray-300 hover:text-white hover:bg-white/10'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  )
}
