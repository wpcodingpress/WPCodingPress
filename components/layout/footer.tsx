"use client"

import Link from "next/link"
import { Zap, Mail, Phone, MapPin, ArrowRight } from "lucide-react"

const footerLinks = {
  services: [
    { href: "/services/wordpress-development", label: "WordPress Development" },
    { href: "/services/elementor-pro", label: "Elementor Pro Setup" },
    { href: "/services/woocommerce", label: "WooCommerce Store" },
    { href: "/services/website-redesign", label: "Website Redesign" },
    { href: "/pricing", label: "Subscription Plans" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/contact", label: "Contact" },
    { href: "/order", label: "Start Project" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Zap className="h-7 w-7 text-sky-400 fill-sky-400" />
              <span className="text-xl font-bold tracking-tight">
                <span className="text-white">WP</span>
                <span className="gradient-text">CodingPress</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Your all-in-one web development agency. We build stunning WordPress sites, 
              powerful WooCommerce stores, and modern Next.js applications that drive results.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-sky-400 mt-0.5" />
                <a href="mailto:contact@wpcodingpress.com" className="text-sm text-slate-400 hover:text-sky-400 transition-colors">
                  contact@wpcodingpress.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-sky-400 mt-0.5" />
                <a href="tel:+8801943429727" className="text-sm text-slate-400 hover:text-sky-400 transition-colors">
                  +880 1943 429727
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-sky-400 mt-0.5" />
                <span className="text-sm text-slate-400">
                  Dhaka, Bangladesh
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} WPCodingPress. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className="text-sm text-slate-500 hover:text-sky-400 transition-colors"
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