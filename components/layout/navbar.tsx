"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Cpu, User, LogIn, LogOut, ArrowRight, ChevronDown, Code, Palette, ShoppingCart, Layers } from "lucide-react"
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
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-white/95 backdrop-blur-xl shadow-lg py-2" : "bg-transparent py-4"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Cpu className="h-6 w-6 text-white" />
              </div>
            </motion.div>
            <span className="text-xl font-bold">
              <span className="text-slate-800">WPCoding</span>
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Press</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <div key={link.href} className="relative">
                {link.hasDropdown ? (
                  <button onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)} className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-purple-600 flex items-center gap-1">
                    {link.label}<ChevronDown className="h-4 w-4" />
                  </button>
                ) : (
                  <Link href={link.href} className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-purple-600">{link.label}</Link>
                )}
                <AnimatePresence>
                  {link.hasDropdown && servicesOpen && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                      {serviceDropdown.map((item) => (
                        <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-purple-50 hover:text-purple-600">
                          <item.icon className="h-5 w-5 text-purple-500" />{item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {session?.user ? (
              <>
                <Link href="/dashboard"><Button variant="ghost" size="sm"><User className="mr-2 h-4 w-4" />Dashboard</Button></Link>
                <Link href="/order"><Button size="sm" className="bg-gradient-to-r from-violet-500 to-purple-500">Start Project</Button></Link>
              </>
            ) : (
              <>
                <Link href="/login"><Button variant="ghost" size="sm">Login</Button></Link>
                <Link href="/register"><Button size="sm" className="bg-gradient-to-r from-violet-500 to-purple-500">Get Started</Button></Link>
              </>
            )}
          </div>

          <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden mt-4 pb-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="block py-3 text-slate-700">{link.label}</Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}