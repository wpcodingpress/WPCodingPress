"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowRight, 
  Zap, 
  Palette, 
  ShoppingCart, 
  Search, 
  Code2, 
  Cloud, 
  Globe,
  Package,
  Layers,
  Bot,
  Palette as ThemesIcon,
  ChevronRight,
  Server
} from "lucide-react"
import { Button } from "@/components/ui/button"

const services = [
  {
    title: "WordPress to Next.js",
    description: "Lightning-fast conversion",
    icon: Zap,
    href: "/services/wordpress-to-nextjs",
    color: "from-indigo-400 to-indigo-600",
    popular: true,
  },
  {
    title: "Elementor Pro Design",
    description: "Stunning custom designs",
    icon: Palette,
    href: "/services/elementor-pro-design",
    color: "from-violet-400 to-violet-600",
    popular: false,
  },
  {
    title: "WooCommerce Stores",
    description: "Full e-commerce solutions",
    icon: ShoppingCart,
    href: "/services/woocommerce-stores",
    color: "from-pink-400 to-pink-600",
    popular: false,
  },
  {
    title: "SEO & Marketing",
    description: "Dominate search rankings",
    icon: Search,
    href: "/services/seo-marketing",
    color: "from-cyan-400 to-cyan-600",
    popular: false,
  },
  {
    title: "Web Applications",
    description: "Custom React/Next.js apps",
    icon: Code2,
    href: "/services/web-applications",
    color: "from-emerald-400 to-emerald-600",
    popular: false,
  },
  {
    title: "Cloud & DevOps",
    description: "Modern infrastructure",
    icon: Cloud,
    href: "/services/cloud-devops",
    color: "from-blue-400 to-blue-600",
    popular: false,
  },
  {
    title: "Domain & Hosting",
    description: "Setup & ongoing support",
    icon: Globe,
    href: "/services/domain-hosting",
    color: "from-amber-400 to-amber-600",
    popular: false,
  },
]

const products = [
  {
    title: "WordPress Plugins",
    description: "Premium development tools",
    icon: Package,
    href: "/products/plugins",
    color: "from-indigo-400 to-violet-500",
  },
  {
    title: "Next.js Templates",
    description: "Ready-to-launch templates",
    icon: Layers,
    href: "/products/templates",
    color: "from-violet-400 to-pink-500",
  },
  {
    title: "MCP Servers",
    description: "Model Context Protocol",
    icon: Server,
    href: "/products/mcp-servers",
    color: "from-pink-400 to-rose-500",
  },
  {
    title: "AI Agents",
    description: "Intelligent automation",
    icon: Bot,
    href: "/products/ai-agents",
    color: "from-cyan-400 to-blue-500",
  },
  {
    title: "WordPress Themes",
    description: "Beautiful WordPress themes",
    icon: ThemesIcon,
    href: "/products/themes",
    color: "from-emerald-400 to-teal-500",
  },
]

interface MegaMenuProps {
  type: "services" | "products"
  isOpen: boolean
  onClose: () => void
}

export function MegaMenu({ type, isOpen, onClose }: MegaMenuProps) {
  const items = type === "services" ? services : products

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-slate-100 z-50"
          onMouseLeave={onClose}
        >
          <div className="container mx-auto px-4 py-8">
            {type === "services" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {items.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="group block p-5 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all duration-300"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${(item as typeof services[0]).color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {item.title}
                        </h3>
                        {(item as typeof services[0]).popular && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-1 group-hover:text-slate-600">
                        {item.description}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {items.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="group block p-5 rounded-2xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/50 transition-all duration-300 text-center"
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${(item as typeof products[0]).color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <item.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 group-hover:text-slate-600">
                        {item.description}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
              <Link href={type === "services" ? "/services" : "/products"} onClick={onClose}>
                <Button variant="ghost" className="text-slate-600 hover:text-indigo-600">
                  View All {type === "services" ? "Services" : "Products"}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing" onClick={onClose}>
                <Button className="btn-primary text-sm px-6 py-3">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface MobileMegaMenuProps {
  type: "services" | "products"
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
}

export function MobileMegaMenu({ type, isOpen, onToggle, onClose }: MobileMegaMenuProps) {
  const items = type === "services" ? services : products

  return (
    <div className="border-b border-slate-100">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 px-2 text-slate-700 font-medium hover:text-indigo-600 transition-colors"
      >
        <span className="flex items-center gap-2">
          {type === "services" ? "Services" : "Products"}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-4 space-y-1">
              {items.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 py-3 px-4 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${(item as typeof services[0]).color} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="font-medium">{item.title}</span>
                    {(item as typeof services[0]).popular && (
                      <span className="ml-2 px-1.5 py-0.5 text-[10px] font-medium bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                </Link>
              ))}
              <Link
                href={type === "services" ? "/services" : "/products"}
                onClick={onClose}
                className="flex items-center gap-2 py-3 px-4 text-indigo-600 font-medium"
              >
                View All {type === "services" ? "Services" : "Products"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
