"use client"

import Link from "next/link"
import { Zap, Mail, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"

interface FooterLink {
  href: string
  label: string
}

export function Footer() {
  const [services, setServices] = useState<FooterLink[]>([])
  const [products, setProducts] = useState<FooterLink[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, productsRes] = await Promise.all([
          fetch('/api/public/services'),
          fetch('/api/products')
        ])
        const servicesData = await servicesRes.json()
        const productsData = await productsRes.json()
        
        setServices(servicesData.map((s: any) => ({
          href: `/services/${s.slug}`,
          label: s.name
        })))

        const typeMap: Record<string, string> = {
          plugin: 'WordPress Plugins',
          theme: 'WordPress Themes',
          template: 'Next.js Templates',
          mcp_server: 'MCP Servers',
          ai_agent: 'AI Agents'
        }
        const seen = new Set<string>()
        const uniqueProducts = productsData.filter((p: any) => {
          const t = p.type
          if (seen.has(t)) return false
          seen.add(t)
          return true
        }).map((p: any) => ({
          href: `/products/${typeMap[p.type]?.toLowerCase().replace(' ', '-') || p.type}`,
          label: typeMap[p.type] || p.name
        }))
        setProducts(uniqueProducts)
      } catch (e) {
        console.error('Error fetching footer data:', e)
      }
    }
    fetchData()
  }, [])

  const company = [
    { href: "/about", label: "About Us" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ]
  const legal = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ]
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
              {services.length > 0 ? services.map((link) => (
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
              {company.map((link) => (
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
            {legal.map((link) => (
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
