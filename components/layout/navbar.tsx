"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, User, ArrowRight, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AnimatedLogo } from "@/components/logo"
import { MegaMenu } from "@/components/mega-menu"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false)
  const [productsMenuOpen, setProductsMenuOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-indigo-500/5 border-b border-slate-100" : "bg-white"
    )}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <AnimatedLogo size="md" />

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button variant="ghost" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium px-4">
                  {link.label}
                </Button>
              </Link>
            ))}
            
            <div className="relative">
              <Button
                variant="ghost"
                className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium px-4"
                onMouseEnter={() => setServicesMenuOpen(true)}
                onMouseLeave={() => setServicesMenuOpen(false)}
              >
                Services
                <motion.span
                  animate={{ rotate: servicesMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-1"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.span>
              </Button>
              <MegaMenu
                type="services"
                isOpen={servicesMenuOpen}
                onClose={() => setServicesMenuOpen(false)}
              />
            </div>

            <div className="relative">
              <Button
                variant="ghost"
                className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium px-4"
                onMouseEnter={() => setProductsMenuOpen(true)}
                onMouseLeave={() => setProductsMenuOpen(false)}
              >
                Products
                <motion.span
                  animate={{ rotate: productsMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-1"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.span>
              </Button>
              <MegaMenu
                type="products"
                isOpen={productsMenuOpen}
                onClose={() => setProductsMenuOpen(false)}
              />
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {session?.user ? (
              <>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5 text-slate-600" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                </Button>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/order">
                  <Button className="btn-primary">
                    Start Project
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="btn-primary">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button className="lg:hidden p-2 text-slate-600 hover:text-indigo-600" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)} 
                  className="block py-3 px-4 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              
              <MobileServicesMenu 
                isOpen={mobileServicesOpen} 
                onToggle={() => setMobileServicesOpen(!mobileServicesOpen)}
                onClose={() => { setIsOpen(false); setMobileServicesOpen(false); }}
              />
              
              <MobileProductsMenu 
                isOpen={mobileProductsOpen} 
                onToggle={() => setMobileProductsOpen(!mobileProductsOpen)}
                onClose={() => { setIsOpen(false); setMobileProductsOpen(false); }}
              />
            </div>
            
            <div className="p-4 border-t border-slate-100 space-y-2">
              {session?.user ? (
                <>
                  <Link href="/dashboard" className="block" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full btn-secondary">Dashboard</Button>
                  </Link>
                  <Link href="/order" className="block" onClick={() => setIsOpen(false)}>
                    <Button className="w-full btn-primary">Start Project</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="block" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full btn-secondary">Login</Button>
                  </Link>
                  <Link href="/register" className="block" onClick={() => setIsOpen(false)}>
                    <Button className="w-full btn-primary">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function MobileServicesMenu({ isOpen, onToggle, onClose }: { isOpen: boolean, onToggle: () => void, onClose: () => void }) {
  const services = [
    { title: "WordPress to Next.js", href: "/services/wordpress-to-nextjs", popular: true },
    { title: "Elementor Pro Design", href: "/services/elementor-pro-design", popular: false },
    { title: "WooCommerce Stores", href: "/services/woocommerce-stores", popular: false },
    { title: "SEO & Marketing", href: "/services/seo-marketing", popular: false },
    { title: "Web Applications", href: "/services/web-applications", popular: false },
    { title: "Cloud & DevOps", href: "/services/cloud-devops", popular: false },
    { title: "Domain & Hosting", href: "/services/domain-hosting", popular: false },
  ]

  return (
    <div className="border-b border-slate-100">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 px-2 text-slate-700 font-medium hover:text-indigo-600 transition-colors"
      >
        <span>Services</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden pb-4"
          >
            <div className="space-y-1 pl-4">
              {services.map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  onClick={onClose}
                  className="flex items-center justify-between py-3 px-4 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                >
                  <span>{service.title}</span>
                  {service.popular && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-full">
                      Popular
                    </span>
                  )}
                </Link>
              ))}
              <Link
                href="/services"
                onClick={onClose}
                className="flex items-center gap-2 py-3 px-4 text-indigo-600 font-medium"
              >
                View All Services
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MobileProductsMenu({ isOpen, onToggle, onClose }: { isOpen: boolean, onToggle: () => void, onClose: () => void }) {
  const products = [
    { title: "WordPress Plugins", href: "/products/plugins" },
    { title: "Next.js Templates", href: "/products/templates" },
    { title: "MCP Servers", href: "/products/mcp-servers" },
    { title: "AI Agents", href: "/products/ai-agents" },
    { title: "WordPress Themes", href: "/products/themes" },
  ]

  return (
    <div className="border-b border-slate-100">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 px-2 text-slate-700 font-medium hover:text-indigo-600 transition-colors"
      >
        <span>Products</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden pb-4"
          >
            <div className="space-y-1 pl-4">
              {products.map((product) => (
                <Link
                  key={product.href}
                  href={product.href}
                  onClick={onClose}
                  className="flex items-center py-3 px-4 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                >
                  {product.title}
                </Link>
              ))}
              <Link
                href="/products"
                onClick={onClose}
                className="flex items-center gap-2 py-3 px-4 text-indigo-600 font-medium"
              >
                View All Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
