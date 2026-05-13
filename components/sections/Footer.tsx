'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { FooterContent } from '@/types/content-schema'

interface FooterProps {
  footer: FooterContent
  variant?: 'default' | 'minimal'
  className?: string
}

export default function Footer({ footer, variant = 'default', className = '' }: FooterProps) {
  if (!footer) return null

  if (variant === 'minimal') {
    return (
      <footer className={`border-t border-gray-100 py-8 ${className}`}>
        <div className="max-w-5xl mx-auto px-4 text-center">
          {footer.socialLinks.length > 0 && (
            <div className="flex items-center justify-center gap-4 mb-4">
              {footer.socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                >
                  <span className="text-xs font-medium">{link.platform.charAt(0).toUpperCase()}</span>
                </a>
              ))}
            </div>
          )}
          <p className="text-sm text-gray-400">{footer.copyright}</p>
        </div>
      </footer>
    )
  }

  return (
    <footer className={`bg-gray-900 text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div className="space-y-4">
            {footer.branding.logo?.url ? (
              <img src={footer.branding.logo.url} alt={footer.branding.name} className="h-8 w-auto" />
            ) : (
              <h3 className="text-xl font-bold">{footer.branding.name}</h3>
            )}
            <p className="text-gray-400 text-sm leading-relaxed">{footer.branding.tagline || footer.description}</p>
            {footer.socialLinks.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                {footer.socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white transition-colors text-xs"
                  >
                    {link.platform.charAt(0).toUpperCase()}
                  </a>
                ))}
              </div>
            )}
          </div>
          {footer.columns.map((col, i) => (
            <div key={i}>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <Link href={link.url} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-500">{footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
