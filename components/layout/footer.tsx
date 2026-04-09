"use client"

import Link from "next/link"
import { Zap, Mail, Phone, ArrowRight } from "lucide-react"

const footerLinks = {
  services: [
    { href: "/services/wordpress-to-nextjs", label: "WordPress to Next.js" },
    { href: "/services/elementor-pro-design", label: "Elementor Pro Design" },
    { href: "/services/woocommerce-stores", label: "WooCommerce Stores" },
    { href: "/services/seo-marketing", label: "SEO & Marketing" },
    { href: "/services/web-applications", label: "Web Applications" },
  ],
  products: [
    { href: "/products/plugins", label: "WordPress Plugins" },
    { href: "/products/templates", label: "Next.js Templates" },
    { href: "/products/mcp-servers", label: "MCP Servers" },
    { href: "/products/ai-agents", label: "AI Agents" },
    { href: "/products/themes", label: "WordPress Themes" },
  ],
  company: [
    { href: "/portfolio", label: "Portfolio" },
    { href: "/contact", label: "Contact" },
    { href: "/pricing", label: "Pricing" },
    { href: "/order", label: "Start Project" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-slate-50 text-slate-900 border-t border-slate-200">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-slate-900">WPCoding</span>
                <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Press</span>
              </span>
            </Link>
            <p className="text-slate-600 leading-relaxed max-w-sm">
              AI-powered web development agency specializing in WordPress to Next.js migrations. 
              Build lightning-fast, SEO-optimized websites that drive results.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center hover:bg-purple-500 transition-colors">
                <svg className="h-4 w-4 text-slate-700 hover:text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center hover:bg-purple-500 transition-colors">
                <svg className="h-4 w-4 text-slate-700 hover:text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center hover:bg-purple-500 transition-colors">
                <svg className="h-4 w-4 text-slate-700 hover:text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-purple-600 transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Products</h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-purple-600 transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-purple-600 transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-purple-600 mt-0.5" />
                <a href="mailto:contact@wpcodingpress.com" className="text-sm text-slate-600 hover:text-purple-600 transition-colors">
                  contact@wpcodingpress.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-purple-600 mt-0.5" />
                <a href="tel:+8801943429727" className="text-sm text-slate-600 hover:text-purple-600 transition-colors">
                  +880 1943 429727
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} WPCodingPress. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className="text-sm text-slate-500 hover:text-purple-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
