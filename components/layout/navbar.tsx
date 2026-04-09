"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, User, ChevronDown, Code, Palette, ShoppingCart, Layers, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AnimatedLogo } from "@/components/logo"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services", hasDropdown: true },
  { href: "/pricing", label: "Pricing" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
]

const serviceDropdown = [
  { href: "/services/wordpress-development", label: "WordPress Development", icon: Code },
  { href: "/services/elementor-pro", label: "Elementor Pro Design", icon: Palette },
  { href: "/services/woocommerce", label: "WooCommerce Store", icon: ShoppingCart },
  { href: "/services/website-redesign", label: "Website Redesign", icon: Layers },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
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
      isScrolled ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-emerald-500/5 border-b border-slate-100" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <AnimatedLogo size="md" />

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.href} className="relative">
                {link.hasDropdown ? (
                  <button 
                    onMouseEnter={() => setServicesOpen(true)} 
                    onMouseLeave={() => setServicesOpen(false)} 
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-emerald-600 flex items-center gap-1 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    {link.label}
                    <motion.span
                      animate={{ rotate: servicesOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.span>
                  </button>
                ) : (
                  <Link href={link.href} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
                    {link.label}
                  </Link>
                )}
                <AnimatePresence>
                  {link.hasDropdown && servicesOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
                    >
                      <div className="p-2">
                        {serviceDropdown.map((item) => (
                          <Link 
                            key={item.href} 
                            href={item.href} 
                            className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-cyan-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <item.icon className="h-5 w-5 text-emerald-600" />
                            </div>
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {session?.user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 font-medium">
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
                  <Button variant="ghost" className="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 font-medium">
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

          <button className="lg:hidden p-2 text-slate-600 hover:text-emerald-600" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 pb-4 bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
            >
              <div className="p-4 space-y-1">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    onClick={() => setIsOpen(false)} 
                    className="block py-3 px-4 text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="p-4 border-t border-slate-100 space-y-2">
                {session?.user ? (
                  <>
                    <Link href="/dashboard" className="block">
                      <Button variant="outline" className="w-full btn-secondary">Dashboard</Button>
                    </Link>
                    <Link href="/order" className="block">
                      <Button className="w-full btn-primary">Start Project</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block">
                      <Button variant="outline" className="w-full btn-secondary">Login</Button>
                    </Link>
                    <Link href="/register" className="block">
                      <Button className="w-full btn-primary">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
