"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, User, Bell, ArrowRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AnimatedLogo } from "@/components/logo"

const mainNavLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
]

const services = [
  { title: "WordPress to Next.js", description: "Lightning-fast conversion", icon: "⚡", href: "/services/wordpress-to-nextjs", popular: true },
  { title: "Elementor Pro Design", description: "Stunning custom designs", icon: "🎨", href: "/services/elementor-pro-design", popular: false },
  { title: "WooCommerce Stores", description: "Full e-commerce solutions", icon: "🛒", href: "/services/woocommerce-stores", popular: false },
  { title: "SEO & Marketing", description: "Dominate search rankings", icon: "📈", href: "/services/seo-marketing", popular: false },
  { title: "Web Applications", description: "Custom React/Next.js apps", icon: "💻", href: "/services/web-applications", popular: false },
  { title: "Cloud & DevOps", description: "Modern infrastructure", icon: "☁️", href: "/services/cloud-devops", popular: false },
  { title: "Domain & Hosting", description: "Setup & ongoing support", icon: "🌐", href: "/services/domain-hosting", popular: false },
]

const products = [
  { title: "WordPress Plugins", description: "Premium tools", icon: "🔌", href: "/products/plugins" },
  { title: "Next.js Templates", description: "Ready-to-launch", icon: "⚛️", href: "/products/templates" },
  { title: "MCP Servers", description: "AI integration", icon: "🤖", href: "/products/mcp-servers" },
  { title: "AI Agents", description: "Smart automation", icon: "🧠", href: "/products/ai-agents" },
  { title: "WordPress Themes", description: "Beautiful designs", icon: "🎨", href: "/products/themes" },
]

function NotificationBell() {
  const [hasNotifications, setHasNotifications] = useState(false)
  
  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const res = await fetch("/api/notifications?type=user")
        const data = await res.json()
        setHasNotifications(data.length > 0)
      } catch (e) {
        setHasNotifications(false)
      }
    }
    checkNotifications()
    const interval = setInterval(checkNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Button variant="ghost" size="icon" className="relative text-slate-700 hover:text-purple-600 hover:bg-purple-50">
      <Bell className="w-5 h-5" />
      {hasNotifications && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
          !
        </span>
      )}
    </Button>
  )
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[60] transition-all duration-300 bg-white/95 backdrop-blur-xl border-b border-slate-200",
        isScrolled ? "shadow-lg" : "shadow-sm"
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <AnimatedLogo size="md" />

          <div className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
            {mainNavLinks.map((link) => (
              <div key={link.href} className="relative">
                {link.label === "Services" || link.label === "Products" ? (
                  <button
                    onMouseEnter={() => setActiveDropdown(link.label.toLowerCase())}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className={cn(
                      "flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
                      activeDropdown === link.label.toLowerCase()
                        ? "text-purple-600 bg-purple-50"
                        : "text-slate-700 hover:text-purple-600 hover:bg-purple-50"
                    )}
                  >
                    {link.label}
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        activeDropdown === link.label.toLowerCase() && "rotate-180"
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors text-slate-700 hover:text-purple-600 hover:bg-purple-50"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}

            <AnimatePresence>
              {activeDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  onMouseEnter={() => setActiveDropdown(activeDropdown)}
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-0 w-full bg-white shadow-2xl border-t-2 border-purple-400"
                  style={{ zIndex: 100 }}
                >
                  <div className="container mx-auto px-4 py-8">
                    {activeDropdown === "services" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {services.map((service) => (
                          <Link
                            key={service.href}
                            href={service.href}
                            onClick={() => setActiveDropdown(null)}
                            className="group block p-5 rounded-2xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50 transition-all"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">{service.icon}</span>
                              <span className="font-semibold text-slate-900 group-hover:text-purple-600">
                                {service.title}
                              </span>
                              {service.popular && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-full">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-500">
                              {service.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    )}
                    {activeDropdown === "products" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {products.map((product) => (
                          <Link
                            key={product.href}
                            href={product.href}
                            onClick={() => setActiveDropdown(null)}
                            className="group block p-5 rounded-2xl border border-slate-200 hover:border-violet-400 hover:bg-violet-50 transition-all text-center"
                          >
                            <span className="text-3xl mb-3 block">{product.icon}</span>
                            <span className="font-semibold text-slate-900 group-hover:text-violet-600 block">
                              {product.title}
                            </span>
                            <p className="text-xs text-slate-500 mt-1">
                              {product.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    )}
                    <div className="mt-6 pt-6 border-t border-slate-200 flex justify-between items-center">
                      <Link
                        href={activeDropdown === "services" ? "/services" : "/products"}
                        onClick={() => setActiveDropdown(null)}
                        className="text-purple-600 font-medium hover:underline"
                      >
                        View All {activeDropdown === "services" ? "Services" : "Products"} →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {session?.user ? (
              <>
                <NotificationBell />
                <Link href="/dashboard">
                  <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:text-purple-800 hover:border-purple-400 font-medium">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/order">
                  <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold shadow-md">
                    Start Project
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-slate-700 hover:text-purple-600 hover:bg-purple-50 font-medium">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold shadow-md">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="lg:hidden p-2 text-slate-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-200"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-4 text-slate-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 space-y-2 border-t border-slate-200">
                {session?.user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50">Dashboard</Button>
                    </Link>
                    <Link href="/order" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700">Start Project</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50">Login</Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
