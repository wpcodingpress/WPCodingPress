"use client"

import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"
import { Menu, X, Zap, User, LogIn, LogOut, ArrowRight, ChevronDown, Code, Palette, ShoppingCart, Layers, Cpu, Globe, Monitor, Smartphone, Cloud, Database, Lock, Gauge, Bot, HeadphonesIcon, Award, Users, Clock, Star, TrendingUp, CheckCircle2, Play, Quote, Mail, Phone, MapPin, Send, ArrowDown, ExternalLink, Layout, FileCode, PenTool, ShoppingBag, BarChart3, Lightbulb, Rocket, Shield, RefreshCw, Heart, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

function ScrollSection({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const stats = [
  { icon: Users, value: "500+", label: "Happy Clients", color: "text-violet-500", bg: "bg-violet-100" },
  { icon: Clock, value: "5+", label: "Years Experience", color: "text-orange-500", bg: "bg-orange-100" },
  { icon: Star, value: "4.9", label: "Client Rating", color: "text-yellow-500", bg: "bg-yellow-100" },
  { icon: TrendingUp, value: "1000+", label: "Projects Delivered", color: "text-emerald-500", bg: "bg-emerald-100" }
]

const services = [
  { icon: Code, title: "Headless WP to Next.js", desc: "Automate WordPress conversion to lightning-fast Next.js sites", color: "from-violet-500 to-purple-500", features: ["Auto Sync", "SEO Optimized", "Lightning Fast", "SSR", "API Ready"] },
  { icon: PenTool, title: "Elementor Pro Design", desc: "Stunning, conversion-focused designs for your brand", color: "from-orange-500 to-amber-500", features: ["Custom Design", "Mobile Responsive", "Fast Loading", "Animations"] },
  { icon: ShoppingBag, title: "WooCommerce Stores", desc: "Full-featured e-commerce with payment integration", color: "from-emerald-500 to-teal-500", features: ["Secure Payments", "Inventory", "Order Tracking", "Multi-vendor"] },
  { icon: BarChart3, title: "SEO & Digital Marketing", desc: "Grow your online presence with proven strategies", color: "from-blue-500 to-cyan-500", features: ["Technical SEO", "Content Strategy", "Analytics", "Rankings"] },
  { icon: Layout, title: "Web Application Dev", desc: "Custom web apps built with modern technologies", color: "from-pink-500 to-rose-500", features: ["React/Next.js", "Custom APIs", "Dashboards", "SaaS Apps"] },
  { icon: Cloud, title: "Cloud & DevOps", desc: "Cloud infrastructure and deployment solutions", color: "from-sky-500 to-indigo-500", features: ["AWS/Azure", "CI/CD", "Docker", "Monitoring"] }
]

const subscriptionPlans = [
  { name: "Starter", price: "Free", features: ["1 Site", "Basic Template", "Community Support", "5GB Bandwidth"], color: "from-slate-500 to-slate-600", cta: "Start Free" },
  { name: "Pro", price: "$19/mo", features: ["5 Sites", "Advanced Templates", "Priority Support", "100GB Bandwidth", "Analytics"], color: "from-violet-500 to-purple-500", popular: true, cta: "Start Pro" },
  { name: "Enterprise", price: "$99/mo", features: ["Unlimited Sites", "White-label", "24/7 Support", "Custom Development"], color: "from-orange-500 to-red-500", cta: "Contact Sales" }
]

const processSteps = [
  { icon: Lightbulb, title: "Discovery", desc: "We analyze your requirements" },
  { icon: PenTool, title: "Design", desc: "Create stunning mockups" },
  { icon: Code, title: "Develop", desc: "Build with clean code" },
  { icon: Rocket, title: "Deploy", desc: "Launch to production" },
  { icon: Gauge, title: "Optimize", desc: "Fine-tune performance" },
  { icon: Shield, title: "Maintain", desc: "Ongoing support" }
]

const whyChooseUs = [
  { icon: Zap, title: "Lightning Fast", desc: "Next.js sites load in milliseconds", color: "from-yellow-400 to-orange-400" },
  { icon: Shield, title: "Secure", desc: "Enterprise-grade security", color: "from-green-400 to-emerald-400" },
  { icon: BarChart3, title: "SEO Ready", desc: "Built-in SEO tools", color: "from-blue-400 to-cyan-400" },
  { icon: RefreshCw, title: "Auto Sync", desc: "Real-time content sync", color: "from-purple-400 to-pink-400" },
  { icon: Bot, title: "AI-Powered", desc: "Smart automation", color: "from-violet-400 to-purple-400" },
  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Expert assistance", color: "from-rose-400 to-pink-400" }
]

const portfolioItems = [
  { title: "HomePicks Daily", category: "E-Commerce", icon: ShoppingBag },
  { title: "Trip Monarch", category: "Travel Portal", icon: Globe },
  { title: "RankUpper", category: "SEO Agency", icon: TrendingUp },
  { title: "Pro Consultant", category: "Consulting", icon: Users },
  { title: "Masjid Press", category: "Non-Profit", icon: Heart },
  { title: "Virtual Assistant", category: "Services", icon: UserIcon }
]

const testimonials = [
  { name: "Sarah Johnson", role: "CEO, TechStart", content: "WPCodingPress transformed our WP to Next.js. Load times went from 3s to 300ms!", rating: 5 },
  { name: "Michael Chen", role: "Founder, EcomHub", content: "Our WooCommerce redesign increased sales by 40%. Incredible work!", rating: 5 },
  { name: "Emma Williams", role: "Marketing Director", content: "SEO improvements helped us rank #1 within 3 months. Best investment!", rating: 5 }
]

const techStack = ["WordPress", "Elementor", "WooCommerce", "Next.js", "React", "TypeScript", "Tailwind", "Node.js", "AWS", "Docker"]

export default function HomePage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-violet-200/30 to-purple-200/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1], x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-orange-100/30 to-pink-100/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-cyan-100/20 to-blue-100/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
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
                <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login"><Button variant="ghost" size="sm" className="text-slate-600">Login</Button></Link>
              <Link href="/register"><Button size="sm" className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600">Get Started</Button></Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center pt-16 overflow-hidden">
        <motion.div style={{ y, opacity: heroOpacity }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-white to-purple-50/50" />
        </motion.div>

        {/* Floating Elements */}
        <motion.div className="absolute top-32 left-[10%] hidden lg:block" animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 border border-violet-200 flex items-center justify-center">
            <Code className="h-8 w-8 text-violet-500" />
          </div>
        </motion.div>
        <motion.div className="absolute top-48 right-[12%] hidden lg:block" animate={{ y: [0, 25, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }}>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 flex items-center justify-center">
            <Zap className="h-7 w-7 text-orange-500" />
          </div>
        </motion.div>
        <motion.div className="absolute bottom-32 left-[15%] hidden lg:block" animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 6, repeat: Infinity }}>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 border border-emerald-200 flex items-center justify-center">
            <Rocket className="h-6 w-6 text-emerald-500" />
          </div>
        </motion.div>
        <motion.div className="absolute bottom-40 right-[10%] hidden lg:block" animate={{ y: [0, 20, 0] }} transition={{ duration: 4.5, repeat: Infinity, delay: 0.5 }}>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 border border-cyan-200 flex items-center justify-center">
            <Shield className="h-7 w-7 text-cyan-500" />
          </div>
        </motion.div>

        {/* Geometric Shapes */}
        <motion.div className="absolute top-[20%] left-[25%] w-3 h-3 bg-violet-400/40 rounded-sm rotate-45" animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
        <motion.div className="absolute top-[35%] right-[30%] w-4 h-4 bg-pink-400/30 rounded-full" animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }} />
        <motion.div className="absolute bottom-[30%] left-[30%] w-2 h-2 bg-orange-400/50 rounded-full" animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} />

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-5xl mx-auto text-center">
            <ScrollSection>
              <Badge className="mb-6 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border-violet-200 px-6 py-2 text-sm font-semibold">
                <Star className="h-4 w-4 mr-2 fill-violet-500" />
                AI-Powered Web Development Agency
              </Badge>
            </ScrollSection>

            <ScrollSection>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                <span className="text-slate-800">Build </span>
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Amazing</span>
                <br />
                <span className="text-slate-800">Web Experiences</span>
              </h1>
            </ScrollSection>

            <ScrollSection>
              <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                From WordPress to Next.js, from design to deployment - we create stunning, 
                <span className="text-violet-600 font-semibold"> high-performance websites</span> that drive results.
              </p>
            </ScrollSection>

            <ScrollSection>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
                <Link href="/pricing">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40">
                      Start Your Project
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/portfolio">
                  <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2 border-slate-200 hover:border-violet-300 hover:bg-violet-50">
                    View Our Work
                    <Play className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </ScrollSection>

            <ScrollSection>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {stats.map((stat, i) => (
                  <motion.div 
                    key={i}
                    className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100 shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ y: -5 }}
                  >
                    <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </ScrollSection>
          </div>
        </div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ArrowDown className="h-8 w-8 text-slate-400" />
        </motion.div>
      </section>

      {/* Tech Stack Marquee */}
      <ScrollSection className="py-12 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4">
          <p className="text-center text-slate-500 mb-8 font-medium">POWERED BY MODERN TECHNOLOGIES</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {techStack.map((tech, i) => (
              <span key={i} className="text-xl md:text-2xl font-bold text-slate-300 hover:text-violet-500 transition-colors cursor-default">{tech}</span>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* Services Section */}
      <ScrollSection className="py-32 bg-gradient-to-b from-white via-violet-50/30 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-violet-100 text-violet-700 border-violet-200">Services</Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-800 mb-4">
              Everything You Need to <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">Succeed Online</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Comprehensive web development solutions tailored to your business needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div key={i} whileHover={{ y: -8 }} className="group">
                <Card className="h-full bg-white/80 backdrop-blur-sm border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                      <service.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{service.title}</h3>
                    <p className="text-slate-600 mb-4">{service.desc}</p>
                    <ul className="space-y-2">
                      {service.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-slate-500">
                          <CheckCircle2 className="h-4 w-4 text-violet-500" /> {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* Pricing Section */}
      <ScrollSection className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200">Pricing</Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-800 mb-4">
              Simple, <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Transparent</span> Pricing
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {subscriptionPlans.map((plan, i) => (
              <Card key={i} className={`h-full relative bg-white border-2 ${plan.popular ? 'border-violet-400 shadow-2xl shadow-violet-500/20' : 'border-slate-100'} overflow-hidden`}>
                {plan.popular && <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500" />}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-slate-800">{plan.name}</h3>
                  <div className="text-4xl font-black text-slate-800 mt-2">{plan.price}</div>
                  <ul className="space-y-3 mt-6 mb-8">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-slate-600">
                        <CheckCircle2 className="h-5 w-5 text-violet-500" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.popular ? 'bg-gradient-to-r from-violet-500 to-purple-500' : 'bg-slate-800'}`}>{plan.cta}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* Process Section */}
      <ScrollSection className="py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">Process</Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-800">How We <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Work</span></h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {processSteps.map((step, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05 }} className="text-center p-6 rounded-2xl bg-white border border-slate-100 shadow-lg hover:shadow-xl hover:border-violet-200 transition-all">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-7 w-7 text-violet-600" />
                </div>
                <h3 className="font-semibold text-slate-800">{step.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* Why Choose Us */}
      <ScrollSection className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-700 border-orange-200">Why Choose Us</Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-800">Industry-<span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Leading</span> Features</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {whyChooseUs.map((item, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className="text-center p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-100 hover:border-violet-200 transition-all">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-3`}>
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* Portfolio */}
      <ScrollSection className="py-32 bg-gradient-to-b from-white via-pink-50/30 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-pink-100 text-pink-700 border-pink-200">Portfolio</Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-800">Featured <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Projects</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item, i) => (
              <motion.div key={i} whileHover={{ scale: 1.02 }} className="group">
                <Card className="overflow-hidden bg-white border border-slate-100 shadow-lg hover:shadow-2xl transition-all">
                  <div className="aspect-[4/3] bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center">
                    <item.icon className="h-16 w-16 text-violet-400 group-hover:text-violet-600 transition-colors" />
                  </div>
                  <CardContent className="p-6">
                    <Badge className="mb-3 bg-violet-100 text-violet-700">{item.category}</Badge>
                    <h3 className="text-xl font-bold text-slate-800">{item.title}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* Testimonials */}
      <ScrollSection className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-100 text-yellow-700 border-yellow-200">Testimonials</Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-800">What <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">Clients Say</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <Card key={i} className="bg-white border border-slate-100 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <Quote className="h-8 w-8 text-violet-200 mb-4" />
                  <p className="text-slate-600 mb-6 italic">"{t.content}"</p>
                  <div className="border-t border-slate-100 pt-4">
                    <div className="font-semibold text-slate-800">{t.name}</div>
                    <div className="text-sm text-slate-500">{t.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* Stats Banner */}
      <ScrollSection className="py-20 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div><div className="text-4xl md:text-6xl font-bold text-white">500+</div><div className="text-white/80">Projects</div></div>
            <div><div className="text-4xl md:text-6xl font-bold text-white">98%</div><div className="text-white/80">Satisfaction</div></div>
            <div><div className="text-4xl md:text-6xl font-bold text-white">50+</div><div className="text-white/80">Plugins</div></div>
            <div><div className="text-4xl md:text-6xl font-bold text-white">24/7</div><div className="text-white/80">Support</div></div>
          </div>
        </div>
      </ScrollSection>

      {/* FAQ */}
      <ScrollSection className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-cyan-100 text-cyan-700 border-cyan-200">FAQ</Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-800">Questions?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              "How long does a project take?",
              "Do you offer ongoing support?",
              "Can I migrate my content?",
              "What's included in SEO?"
            ].map((q, i) => (
              <Card key={i} className="bg-violet-50 border-violet-100">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-800">{q}</h3>
                  <p className="text-slate-600 mt-2 text-sm">Contact us for detailed answers to all your questions.</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* CTA */}
      <ScrollSection className="py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Transform?</span>
            </h2>
            <p className="text-xl text-slate-300 mb-10">Let's build something amazing together.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="text-lg px-12 py-7 bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600">Get Started</Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="text-lg px-12 py-7 border-white/20 text-white hover:bg-white/10">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                  <Cpu className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">WPCodingPress</span>
              </div>
              <p className="text-slate-400 text-sm">Your trusted web development partner.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>WordPress Development</li>
                <li>Next.js Development</li>
                <li>WooCommerce Stores</li>
                <li>SEO Services</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>About Us</li>
                <li>Portfolio</li>
                <li>Contact</li>
                <li>Careers</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>contact@wpcodingpress.com</li>
                <li>+880 1943 429727</li>
                <li>Dhaka, Bangladesh</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} WPCodingPress. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}