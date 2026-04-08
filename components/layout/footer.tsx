"use client"

import Link from "next/link"
import { Zap, Mail, Phone, MapPin, ArrowRight, CheckCircle } from "lucide-react"

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

const socialLinks = [
  { href: "#", label: "GitHub" },
  { href: "#", label: "LinkedIn" },
  { href: "#", label: "Twitter" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Zap className="h-7 w-7 text-primary fill-primary" />
              <span className="text-lg font-bold tracking-tight">
                <span className="text-foreground">WP</span>
                <span className="gradient-text">CodingPress</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Your all-in-one web development agency. We build stunning WordPress sites, 
              powerful WooCommerce stores, and modern Next.js applications that drive results.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a 
                  key={social.label}
                  href={social.href}
                  className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 transition-colors text-muted-foreground hover:text-foreground"
                  aria-label={social.label}
                >
                  <span className="text-xs font-medium">{social.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-primary mt-0.5" />
                <a href="mailto:contact@wpcodingpress.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  contact@wpcodingpress.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-primary mt-0.5" />
                <a href="tel:+8801943429727" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  +880 1943 429727
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Dhaka, Bangladesh
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} WPCodingPress. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
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