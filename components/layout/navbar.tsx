"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Zap, User, LogIn, LogOut, ArrowRight, ChevronDown, Code, Palette, ShoppingCart, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-sky-500/5 py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                isScrolled 
                  ? "bg-gradient-to-br from-sky-500 to-cyan-500 shadow-lg shadow-sky-500/30" 
                  : "bg-white/90 backdrop-blur-sm shadow-xl"
              )}>
                <Zap className={cn(
                  "h-7 w-7",
                  isScrolled ? "text-white" : "text-sky-600"
                )} />
              </div>
              <motion.div 
                className="absolute -inset-1 bg-sky-400/30 rounded-full blur-md"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold tracking-tight block leading-none">
                <span className={isScrolled ? "text-slate-800" : "text-slate-800"}>WP</span>
                <span className="gradient-text">CodingPress</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">Web Development Agency</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <div key={link.href} className="relative">
                {link.hasDropdown ? (
                  <button
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors duration-200 rounded-lg hover:bg-sky-50 flex items-center gap-1"
                  >
                    {link.label}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors duration-200 rounded-lg hover:bg-sky-50"
                  >
                    {link.label}
                  </Link>
                )}

                {/* Services Dropdown */}
                <AnimatePresence>
                  {link.hasDropdown && servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-slate-100 overflow-hidden"
                      onMouseEnter={() => setServicesOpen(true)}
                      onMouseLeave={() => setServicesOpen(false)}
                    >
                      {serviceDropdown.map((item, index) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                        >
                          <item.icon className="h-5 w-5 text-sky-500" />
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {session?.user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="font-semibold text-slate-700">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/order">
                  <Button size="sm" className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 font-semibold shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40">
                    Start Project
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-semibold text-slate-700">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 font-semibold shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40">
                    <User className="mr-2 h-4 w-4" />
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 pb-4 border-t border-slate-200 pt-4"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 text-base font-medium text-slate-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" className="w-full border-slate-300">
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-sky-500 to-cyan-500">
                      <User className="mr-2 h-4 w-4" />
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}