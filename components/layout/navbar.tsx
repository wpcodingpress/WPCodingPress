"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, User, Bell, ArrowRight, ChevronDown, ShoppingBag, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AnimatedLogo } from "@/components/logo"

const iconMap: Record<string, string> = {
  code: "⚡", palette: "🎨", "shopping-cart": "🛒", zap: "📈", globe: "🌐", settings: "☁️",
}

const getServiceIcon = (icon: string) => iconMap[icon] || "⚡"

const mainNavLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/pricing", label: "Pricing" },
  { href: "/web-dev-plans", label: "Web Dev Plans" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
]

interface ServiceItem {
  title: string
  description: string
  icon: string
  href: string
  popular?: boolean
}

interface ProductItem {
  title: string
  description: string
  icon: string
  href: string
}

function NotificationBell() {
  const { data: session } = useSession()
  const [hasNotifications, setHasNotifications] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const notifType = ['admin', 'editor', 'manager'].includes(session?.user?.role as string) ? 'admin' : 'user'
        const res = await fetch(`/api/notifications?type=${notifType}`)
        const data = await res.json()
        setNotifications(data)
        setHasNotifications(data.filter((n: any) => !n.isRead).length > 0)
      } catch (e) {
        setHasNotifications(false)
      }
    }
    if (session?.user) {
      checkNotifications()
      const interval = setInterval(checkNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [session])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    return `${Math.floor(minutes / 60)}h ago`
  }

  const unreadCount = notifications.filter((n: any) => !n.isRead).length

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative text-slate-700 hover:text-purple-600 hover:bg-purple-50"
        onClick={() => setNotificationsOpen(!notificationsOpen)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-pulse px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
      
      {/* Notifications Dropdown */}
      {notificationsOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-[500px] overflow-hidden z-50"
        >
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-violet-600 p-4 flex items-center justify-between">
            <span className="text-white font-bold text-lg">Notifications</span>
            {unreadCount > 0 && (
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No notifications yet</p>
              <p className="text-xs text-gray-400 mt-1">We'll notify you when something happens</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {notifications.slice(0, 10).map((notif: any) => (
                <Link 
                  key={notif.id} 
                  href={notif.link || '/dashboard'}
                  onClick={() => setNotificationsOpen(false)}
                  className={`block p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 ${!notif.isRead ? 'bg-purple-50/50' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className={`p-2 rounded-xl ${notif.type === 'order' ? 'bg-blue-100 text-blue-600' : notif.type === 'subscriber' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>
                      {notif.type === 'order' ? <ShoppingBag className="w-4 h-4" /> : notif.type === 'subscriber' ? <Package className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900 truncate">{notif.title}</p>
                        {!notif.isRead && <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-1">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{formatTime(notif.createdAt)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <Link 
              href={['admin', 'editor', 'manager'].includes(session?.user?.role as string) ? '/admin/notifications' : '/dashboard'} 
              onClick={() => setNotificationsOpen(false)}
              className="block text-center text-sm text-purple-600 font-medium hover:text-purple-700"
            >
              View All Notifications →
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedMobileSubmenu, setExpandedMobileSubmenu] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()
  const pathname = usePathname()

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('chat-blur-active')
    } else {
      document.body.classList.remove('chat-blur-active')
    }
  }, [mobileMenuOpen])

  const [services, setServices] = useState<ServiceItem[]>([
    { title: "WordPress to Next.js", description: "Lightning-fast conversion", icon: "⚡", href: "/services/wordpress-to-nextjs", popular: true },
    { title: "Elementor Pro Design", description: "Stunning custom designs", icon: "🎨", href: "/services/elementor-pro-design", popular: false },
    { title: "WooCommerce Stores", description: "Full e-commerce solutions", icon: "🛒", href: "/services/woocommerce-stores", popular: false },
    { title: "SEO & Marketing", description: "Dominate search rankings", icon: "📈", href: "/services/seo-marketing", popular: false },
    { title: "Web Applications", description: "Custom React/Next.js apps", icon: "💻", href: "/services/web-applications", popular: false },
    { title: "Cloud & DevOps", description: "Modern infrastructure", icon: "☁️", href: "/services/cloud-devops", popular: false },
    { title: "Domain & Hosting", description: "Setup & ongoing support", icon: "🌐", href: "/services/domain-hosting", popular: false },
  ])

  const [products, setProducts] = useState<ProductItem[]>([
    { title: "WordPress Plugins", description: "Premium tools for your site", icon: "🔌", href: "/products/plugins" },
    { title: "WordPress Themes", description: "Beautiful & responsive", icon: "🎨", href: "/products/themes" },
    { title: "Next.js Templates", description: "Production-ready", icon: "⚛️", href: "/products/templates" },
    { title: "MCP Servers", description: "AI integration", icon: "🤖", href: "/products/mcp-servers" },
    { title: "AI Agents", description: "Smart automation", icon: "🧠", href: "/products/ai-agents" },
  ])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

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

  // Fetch services from database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/public/services")
        if (res.ok) {
          const data = await res.json()
          if (data.length > 0) {
            const mappedServices: ServiceItem[] = data.map((s: any) => ({
              title: s.name,
              description: s.description?.substring(0, 60) || "",
              icon: s.icon ? getServiceIcon(s.icon) : "⚡",
              href: `/services/${s.slug}`,
              popular: s.isActive
            }))
            setServices(mappedServices)
          }
        }
      } catch (error) {
        console.error("Error fetching services:", error)
      }
    }
    fetchServices()
  }, [])

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products")
        if (res.ok) {
          const data = await res.json()
          if (data.length > 0) {
            // Get unique types
            const typeArray = data.map((p: any) => p.type)
            const types = [...new Set(typeArray)] as string[]
            const typeLabels: Record<string, string> = {
              plugin: "WordPress Plugins",
              theme: "WordPress Themes", 
              template: "Next.js Templates",
              mcp_server: "MCP Servers",
              ai_agent: "AI Agents"
            }
            const typeIcons: Record<string, string> = {
              plugin: "🔌",
              theme: "🎨",
              template: "⚛️",
              mcp_server: "🤖",
              ai_agent: "🧠"
            }
            const typeHrefs: Record<string, string> = {
              plugin: "/products/plugins",
              theme: "/products/themes",
              template: "/products/templates",
              mcp_server: "/products/mcp-servers",
              ai_agent: "/products/ai-agents"
            }
            const mappedProducts: ProductItem[] = types.map((type: string) => ({
              title: typeLabels[type] || type,
              description: `Browse our ${typeLabels[type] || type}`,
              icon: typeIcons[type] || "📦",
              href: typeHrefs[type] || "/products"
            }))
            setProducts(mappedProducts)
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }
    fetchProducts()
  }, [])

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[60] transition-all duration-300 bg-white/95 backdrop-blur-xl border-b border-slate-200",
        isScrolled ? "shadow-lg" : "shadow-sm"
      )}
    >
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-16 lg:h-20 py-2 sm:py-0">
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
                      activeDropdown === link.label.toLowerCase() || isActive(link.href)
                        ? "text-violet-600 bg-violet-50"
                        : "text-slate-700 hover:text-violet-600 hover:bg-violet-50"
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
                      "px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
                      isActive(link.href)
                        ? "text-violet-600 bg-violet-50"
                        : "text-slate-700 hover:text-violet-600 hover:bg-violet-50"
                    )}
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
                {!['admin', 'editor', 'manager'].includes(session.user.role as string) && (
                <Link href="/dashboard">
                  <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:text-purple-800 hover:border-purple-400 font-medium">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                )}
                {['admin', 'editor', 'manager'].includes(session.user.role as string) ? (
                  <Link href="/admin">
                    <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 font-medium">
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                      Admin Panel
                    </Button>
                  </Link>
                ) : (
                  <Link href="/order">
                    <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-600 text-white font-semibold shadow-md">
                      Start Project
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
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
            className="lg:hidden p-2.5 sm:p-2.5 text-slate-700 hover:bg-slate-100 rounded-lg touch-manipulation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6 sm:h-6 sm:w-6" /> : <Menu className="h-6 w-6 sm:h-6 sm:w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 lg:hidden z-[59]"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 right-0 bg-white lg:hidden z-[70] shadow-2xl"
              style={{ paddingTop: '64px', maxHeight: '100vh', overflowY: 'auto' }}
            >
              <div className="container mx-auto px-3 py-4">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                  <span className="text-lg font-bold text-purple-600">Menu</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
                
                {mainNavLinks.map((link) => {
                  const isServices = link.label === "Services"
                  const isProducts = link.label === "Products"
                  
                  return (
                    <div key={link.href} className="border-b border-slate-100 last:border-b-0">
                      {(isServices || isProducts) ? (
                        <>
                          <button
                            onClick={() => setExpandedMobileSubmenu(expandedMobileSubmenu === (isServices ? "services" : "products") ? null : (isServices ? "services" : "products"))}
                            className="flex items-center justify-between w-full py-4 px-2 text-base text-slate-800 hover:bg-purple-50 font-semibold"
                          >
                            <span>{link.label}</span>
                            <ChevronDown className={`w-5 h-5 transition-transform duration-200 text-slate-500 ${expandedMobileSubmenu === (isServices ? "services" : "products") ? "rotate-180" : ""}`} />
                          </button>
                          
                          {isServices && expandedMobileSubmenu === "services" && (
                            <div className="pb-3 bg-purple-50/50">
                              {services.map((service) => (
                                <Link
                                  key={service.href}
                                  href={service.href}
                                  onClick={() => { setMobileMenuOpen(false); setExpandedMobileSubmenu(null); }}
                                  className="block py-2.5 px-6 text-sm text-slate-600 hover:text-purple-600 hover:bg-purple-50 border-l-2 border-transparent hover:border-purple-500"
                                >
                                  {service.title}
                                </Link>
                              ))}
                            </div>
                          )}
                          
                          {isProducts && expandedMobileSubmenu === "products" && (
                            <div className="pb-3 bg-violet-50/50">
                              {products.map((product) => (
                                <Link
                                  key={product.href}
                                  href={product.href}
                                  onClick={() => { setMobileMenuOpen(false); setExpandedMobileSubmenu(null); }}
                                  className="block py-2.5 px-6 text-sm text-slate-600 hover:text-violet-600 hover:bg-violet-50 border-l-2 border-transparent hover:border-violet-500"
                                >
                                  {product.title}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-4 px-2 text-base text-slate-800 hover:bg-purple-50 font-semibold"
                        >
                          {link.label}
                        </Link>
                      )}
                    </div>
                  )
                })}
                
                <div className="pt-4 pb-8 space-y-3">
                  {session?.user ? (
                    <>
                      {!['admin', 'editor', 'manager'].includes(session.user.role as string) && (
                      <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full text-base border-purple-300 text-purple-700 hover:bg-purple-50">Dashboard</Button>
                      </Link>
                      )}
                      {['admin', 'editor', 'manager'].includes(session.user.role as string) ? (
                        <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full text-base border-slate-300 text-slate-700 hover:bg-slate-100">Admin Panel</Button>
                        </Link>
                      ) : (
                        <Link href="/order" onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full text-base bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700">Start Project</Button>
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full text-base border-purple-300 text-purple-700 hover:bg-purple-50">Login</Button>
                      </Link>
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full text-base bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700">Get Started</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}
