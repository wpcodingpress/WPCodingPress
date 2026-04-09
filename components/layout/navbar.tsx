"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, User, Bell, ArrowRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AnimatedLogo } from "@/components/logo"
import { NotificationProvider, useNotifications } from "@/components/notifications"

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
  const { unreadCount } = useNotifications()
  return (
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
          {unreadCount > 9 ? "9+" : unreadCount}
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

  const handleDropdownEnter = (dropdown: string) => {
    setActiveDropdown(dropdown)
  }

  const handleDropdownLeave = () => {
    setActiveDropdown(null)
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-lg border-b border-slate-200/50 dark:border-slate-800/50"
          : "bg-white dark:bg-slate-900"
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
                    onMouseEnter={() => handleDropdownEnter(link.label.toLowerCase())}
                    onMouseLeave={handleDropdownLeave}
                    className={cn(
                      "flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      activeDropdown === link.label.toLowerCase()
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
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
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      "text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                    )}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Mega Menu Dropdown */}
            <AnimatePresence>
              {activeDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  onMouseEnter={() => handleDropdownEnter(activeDropdown)}
                  onMouseLeave={handleDropdownLeave}
                  className="absolute top-full left-0 w-full bg-white dark:bg-slate-800 shadow-2xl border-t border-slate-200 dark:border-slate-700"
                >
                  <div className="container mx-auto px-4 py-8">
                    {activeDropdown === "services" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {services.map((service) => (
                          <Link
                            key={service.href}
                            href={service.href}
                            onClick={() => setActiveDropdown(null)}
                            className="group block p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">{service.icon}</span>
                              <span className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                {service.title}
                              </span>
                              {service.popular && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-full">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
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
                            className="group block p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-violet-500 dark:hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all text-center"
                          >
                            <span className="text-3xl mb-3 block">{product.icon}</span>
                            <span className="font-semibold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 block">
                              {product.title}
                            </span>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {product.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    )}
                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                      <Link
                        href={activeDropdown === "services" ? "/services" : "/products"}
                        onClick={() => setActiveDropdown(null)}
                        className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
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
                <NotificationProvider userType="user">
                  <NotificationBell />
                </NotificationProvider>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-slate-700 dark:text-slate-300">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/order">
                  <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                    Start Project
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-slate-700 dark:text-slate-300">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="lg:hidden p-2 text-slate-700 dark:text-slate-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-4 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 space-y-2 border-t border-slate-200 dark:border-slate-800">
                {session?.user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Dashboard</Button>
                    </Link>
                    <Link href="/order" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500">Start Project</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500">Get Started</Button>
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
