"use client"

import Link from "next/link"
import { Zap, Mail, ArrowRight } from "lucide-react"

const footerLinks = {
  services: [
    { href: "/services/wordpress-to-nextjs", label: "WordPress to Next.js" },
    { href: "/services/elementor-pro-design", label: "Elementor Pro Design" },
    { href: "/services/woocommerce-stores", label: "WooCommerce Stores" },
    { href: "/services/seo-marketing", label: "SEO & Marketing" },
    { href: "/services/web-applications", label: "Web Applications" },
    { href: "/services/cloud-devops", label: "Cloud & DevOps" },
    { href: "/services/domain-hosting", label: "Domain & Hosting" },
  ],
  products: [
    { href: "/products/plugins", label: "WordPress Plugins" },
    { href: "/products/themes", label: "WordPress Themes" },
    { href: "/products/templates", label: "Next.js Templates" },
    { href: "/products/mcp-servers", label: "MCP Servers" },
    { href: "/products/ai-agents", label: "AI Agents" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
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
                <a href="mailto:support@wpcodingpress.com" className="text-sm text-slate-600 hover:text-purple-600 transition-colors">
                  support@wpcodingpress.com
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
