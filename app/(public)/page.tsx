"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  ArrowRight, Check, Star, Zap, Shield, Code, Palette,
  ShoppingCart, Search, Layers, Cloud, Play, Menu, X,
  Bot, TrendingUp, Users, Globe, Sparkles, Layout, Server,
  Lock, Gauge, Headphones, ArrowRightLeft, Eye, ExternalLink,
  ChevronDown, Rocket, Target, Award, Clock, Code2, Database, Globe2, ArrowUpRight,
  Terminal, GitBranch, Package, BarChart3, Cpu, RefreshCcw, ShieldCheck, SearchCheck, Globe as GlobeIcon, FileCode, Database as DatabaseIcon, Server as ServerIcon, Boxes, Accessibility, Download, Zap as ZapIcon, Clock3, MessageCircle, Star as StarIcon, CheckCircle2, Settings
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FloatingButtons } from "@/components/floating-buttons"

gsap.registerPlugin(ScrollTrigger)

const portfolioItems = [
  { id: 1, title: "HomePicks Daily", category: "E-Commerce", client: "Beth Moran", liveUrl: "https://homepicksdaily.com", image: "/portfolio/HomePicksDaily- A Woocommerce Based Dropshipping E-Commerce Website Front Page.jpeg" },
  { id: 2, title: "Trip Monarch", category: "Travel", client: "Trip Monarch", liveUrl: "https://tripmonarch.com", image: "/portfolio/tripmonarch.png" },
  { id: 3, title: "RankUpper", category: "SEO Agency", client: "RankUpper", liveUrl: "https://rankupper.io", image: "/portfolio/RankUpper.png" },
  { id: 4, title: "Pro Consultant", category: "Consulting", client: "Pro Consultant UK", liveUrl: "https://proconsultant.co.uk", image: "/portfolio/Pro Consultant.png" },
  { id: 5, title: "Masjid Press", category: "Non-Profit", client: "Masjid Press", liveUrl: "https://masjidpress.com", image: "/portfolio/masjidpress.com.png" },
  { id: 6, title: "EcomGiantz", category: "E-Commerce", client: "EcomGiantz", liveUrl: "https://ecomgiantz.com", image: "/portfolio/ecomgianrtz.png" },
]

const services = [
  { icon: ArrowRightLeft, title: "WordPress to Next.js", description: "Lightning-fast conversion with auto-sync", color: "from-purple-600 to-violet-600", href: "/services/wordpress-to-nextjs" },
  { icon: Palette, title: "Elementor Pro Design", description: "Stunning designs that convert", color: "from-pink-500 to-rose-500", href: "/services/elementor-pro-design" },
  { icon: ShoppingCart, title: "WooCommerce Stores", description: "Full e-commerce solutions", color: "from-green-500 to-emerald-500", href: "/services/woocommerce-stores" },
  { icon: Search, title: "SEO & Marketing", description: "Dominate search rankings", color: "from-orange-500 to-amber-500", href: "/services/seo-marketing" },
]

const stats = [
  { value: "700+", label: "Happy Clients", icon: Users },
  { value: "9+", label: "Years Experience", icon: Clock },
  { value: "5", label: "Star Rating", icon: Star },
  { value: "1200+", label: "Projects Done", icon: TrendingUp },
]

const features = [
  { icon: Gauge, title: "10x Faster", desc: "Sub-300ms load times" },
  { icon: Shield, title: "More Secure", desc: "No plugin vulnerabilities" },
  { icon: Search, title: "SEO Preserved", desc: "Keep your rankings" },
  { icon: ArrowRightLeft, title: "Auto Sync", desc: "Real-time updates" },
  { icon: Bot, title: "AI-Powered", desc: "Smart automation" },
  { icon: Headphones, title: "24/7 Support", desc: "Expert help anytime" },
]

const plans = [
  { name: "Free", price: "$0", period: "forever", features: ["1 WordPress Site Conversion", "Basic Next.js Template", "Community Support", "Basic SEO Setup"], cta: "Get Started", href: "/register", popular: false },
  { name: "Pro", price: "$19", period: "/month", features: ["5 WordPress Site Conversions", "Advanced Next.js Templates", "Priority Support", "Custom Domain", "Analytics Dashboard", "Auto Content Sync"], cta: "Start Pro", href: "/register?plan=pro", popular: true },
  { name: "Enterprise", price: "$99", period: "/month", features: ["Unlimited Conversions", "White-label Solution", "24/7 Dedicated Support", "Unlimited Bandwidth", "Custom Development", "API Access"], cta: "Contact Sales", href: "/contact", popular: false },
]

const testimonials = [
  { name: "Sarah Johnson", role: "CEO, TechStart", content: "WPCodingPress transformed our WP to Next.js. Load times went from 3s to 300ms!" },
  { name: "Michael Chen", role: "Founder, EcomHub", content: "Our WooCommerce redesign increased sales by 40%. Incredible results!" },
  { name: "Emma Williams", role: "Marketing Director", content: "SEO improvements helped us rank #1 within 3 months." },
]

const techStack = [
  { name: "Next.js", desc: "React framework with SSG/SSR", icon: "⚛️" },
  { name: "TypeScript", desc: "Type-safe JavaScript", icon: "📘" },
  { name: "Tailwind CSS", desc: "Utility-first styling", icon: "🎨" },
  { name: "Prisma", desc: "Next-gen ORM", icon: "🔷" },
  { name: "Vercel", desc: "Edge deployment", icon: "▲" },
  { name: "Sanity CMS", desc: "Headless content", icon: "📦" },
]

const integrations = [
  { name: "Vercel", logo: "▲", desc: "Instant deployments" },
  { name: "Sanity", logo: "☁️", desc: "Headless CMS" },
  { name: "Stripe", logo: "💳", desc: "Payments" },
  { name: "Cloudinary", logo: "🖼️", desc: "Images" },
  { name: "Algolia", logo: "🔍", desc: "Search" },
  { name: "Resend", logo: "📧", desc: "Email" },
]

const faqs = [
  { q: "How long does migration take?", a: "Most projects are completed within 24-72 hours depending on complexity." },
  { q: "Will my SEO rankings be affected?", a: "No! We preserve all URLs, meta tags, and sitemaps during migration." },
  { q: "Can I still use WordPress?", a: "Yes! We connect WordPress admin to Next.js using WPGraphQL." },
  { q: "What about my plugins?", a: "We migrate functionality to modern, faster alternatives." },
]

const processSteps = [
  { icon: Download, title: "Connect", desc: "Link your WordPress site" },
  { icon: Settings, title: "Configure", desc: "Choose your options" },
  { icon: Zap, title: "Convert", desc: "AI handles the migration" },
  { icon: Rocket, title: "Deploy", desc: "Go live instantly" },
]

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const [selectedPortfolio, setSelectedPortfolio] = useState<typeof portfolioItems[0] | null>(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-animate",
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.3 }
      )

      gsap.fromTo(".float-element",
        { y: 0 },
        { y: -20, duration: 2, repeat: -1, yoyo: true, ease: "power1.inOut", stagger: 0.2 }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-screen bg-white">
      <FloatingButtons />

      {/* Hero Section - Light Purple Gradient with Centered Text */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-violet-50">
        {/* Floating Background Elements */}
        <div className="absolute top-32 right-10 w-20 h-20 bg-purple-200/50 rounded-3xl float-element animate-float-slow opacity-60" />
        <div className="absolute top-48 left-20 w-16 h-16 bg-violet-200/50 rounded-2xl float-element animate-float-slow opacity-60" />
        <div className="absolute bottom-40 right-1/4 w-12 h-12 bg-pink-200/50 rounded-full float-element animate-float-slow opacity-60" />
        <div className="absolute top-1/3 left-10 w-14 h-14 bg-indigo-200/50 rounded-xl float-element animate-float-slow opacity-60" />
        <div className="absolute bottom-1/3 right-20 w-10 h-10 bg-purple-300/50 rounded-lg float-element animate-float-slow opacity-60" />
        
        {/* Blur Circles */}
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-purple-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-1/4 w-[500px] h-[500px] bg-violet-200/30 rounded-full blur-[120px]" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          {/* Hero Content - Centered */}
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hero-animate inline-flex items-center gap-2 px-5 py-2.5 bg-purple-100 border border-purple-200 rounded-full text-purple-700 text-sm font-semibold mb-8 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Web Development Agency
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hero-animate text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight"
            >
              Transform Your
              <span className="block bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 bg-clip-text text-transparent">
                WordPress to Next.js
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="hero-animate text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto"
            >
              Lightning-fast, SEO-optimized websites that load in milliseconds. 
              Convert automatically with our AI-powered platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="hero-animate flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold px-10 py-6 shadow-lg shadow-purple-500/25 text-lg">
                  Start Free Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/services/wordpress-to-nextjs">
                <Button size="lg" variant="outline" className="border-2 border-purple-300 text-purple-700 hover:bg-purple-100 hover:border-purple-400 px-10 py-6 font-semibold text-lg">
                  Learn More
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="hero-animate flex items-center gap-6 justify-center text-sm text-slate-500 mb-16"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Free forever plan</span>
              </div>
            </motion.div>
          </div>

          {/* Terminal Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative max-w-3xl mx-auto"
          >
            {/* Floating Elements Around Terminal */}
            <div className="absolute -top-4 -right-4 bg-white border border-purple-100 rounded-2xl p-4 shadow-lg float-element">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900">+40%</div>
                  <div className="text-xs text-slate-500">Performance</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white border border-purple-100 rounded-2xl p-4 shadow-lg float-element">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900">180ms</div>
                  <div className="text-xs text-slate-500">Load Time</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 to-violet-400 rounded-3xl blur-xl opacity-20" />
              <div className="relative bg-white border-2 border-purple-200 rounded-3xl p-8 shadow-2xl shadow-purple-200/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-sm text-slate-500 font-medium">Terminal</span>
                </div>
                <div className="font-mono text-sm space-y-2">
                  <div className="text-slate-400"># Convert your WordPress site to Next.js</div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">$</span>
                    <span className="text-slate-800">npx wpcodingpress convert</span>
                  </div>
                  <div className="text-purple-600 animate-pulse">Converting your site...</div>
                  <div className="text-green-600">✓ Analyzing WordPress content...</div>
                  <div className="text-green-600">✓ Building Next.js pages...</div>
                  <div className="text-green-600">✓ Optimizing images & assets...</div>
                  <div className="text-green-600">✓ Deploying to global CDN...</div>
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="text-green-600 font-bold">🚀 Live in 3 minutes!</div>
                    <div className="text-green-500 text-sm">Load time: 180ms • SEO Score: 98</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="text-center p-6 bg-white border border-purple-100 rounded-2xl shadow-sm hover:shadow-lg hover:border-purple-200 transition-all"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-slate-600 font-medium text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 px-4 py-1.5 text-sm font-medium mb-6">
              How It Works
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Four Simple Steps to <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Success</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-violet-100 text-violet-700 border-violet-200 px-4 py-1.5 text-sm font-medium mb-6">
              Our Services
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Succeed Online</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              From WordPress migrations to custom web applications, we deliver high-performance solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={i}
                className="group p-8 bg-white border border-slate-200 rounded-2xl hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100 transition-all hover:-translate-y-1"
                whileHover={{ y: -8 }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-600 mb-6">{service.description}</p>
                <Link href={service.href}>
                  <Button variant="ghost" className="p-0 h-auto text-purple-600 hover:text-purple-700 font-medium">
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button variant="outline" className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 font-medium px-8">
                View All Services
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-purple-50 via-white to-violet-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 px-4 py-1.5 text-sm font-medium mb-6">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Industry-Leading <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Features</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="text-center p-6 bg-white border border-purple-100 rounded-2xl"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <Badge className="bg-pink-100 text-pink-700 border-pink-200 px-4 py-1.5 text-sm font-medium mb-6">
                Portfolio
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Featured <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Projects</span>
              </h2>
            </div>
            <Link href="/portfolio" className="mt-6 md:mt-0">
              <Button variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50 font-medium">
                View All Projects
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.slice(0, 6).map((item, i) => (
              <motion.div
                key={item.id}
                className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:border-pink-300 hover:shadow-xl transition-all"
                whileHover={{ y: -8 }}
                onClick={() => setSelectedPortfolio(item)}
              >
                <div className="aspect-video relative overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <Eye className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div className="p-6">
                  <Badge className="bg-purple-100 text-purple-700 border border-purple-200 mb-3">{item.category}</Badge>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-slate-500 text-sm">Client: {item.client}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Modal */}
      <AnimatePresence>
        {selectedPortfolio && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPortfolio(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video relative overflow-hidden">
                <img src={selectedPortfolio.image} alt={selectedPortfolio.title} className="w-full h-full object-cover" />
                <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white" onClick={() => setSelectedPortfolio(null)}>
                  <X className="w-5 h-5 text-slate-700" />
                </button>
              </div>
              <div className="p-8">
                <Badge className="bg-purple-100 text-purple-700 border border-purple-200 mb-4">{selectedPortfolio.category}</Badge>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">{selectedPortfolio.title}</h2>
                <p className="text-slate-600 mb-6">Client: {selectedPortfolio.client}</p>
                <div className="flex gap-4">
                  {selectedPortfolio.liveUrl && (
                    <a href={selectedPortfolio.liveUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="bg-gradient-to-r from-purple-600 to-violet-600">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Live Site
                      </Button>
                    </a>
                  )}
                  <Button variant="outline" onClick={() => setSelectedPortfolio(null)}>Close</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tech Stack Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-purple-50 via-white to-violet-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200 px-4 py-1.5 text-sm font-medium mb-6">
                Modern Stack
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Built with <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Industry-Leading</span> Tech
              </h2>
              <p className="text-slate-600 text-lg mb-8">
                We use the most modern and performant technologies to build websites that scale.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {techStack.map((tech, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-4 bg-white border border-purple-100 rounded-xl"
                  >
                    <span className="text-2xl">{tech.icon}</span>
                    <div>
                      <div className="font-semibold text-slate-900">{tech.name}</div>
                      <div className="text-xs text-slate-500">{tech.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 to-violet-400 rounded-3xl blur-xl opacity-20" />
              <div className="relative bg-white border border-purple-100 rounded-3xl p-6 shadow-2xl font-mono text-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-sm text-slate-400">package.json</span>
                </div>
                <div className="space-y-2">
                  <div className="text-slate-400">{"{"}</div>
                  <div className="text-purple-600 pl-4">"dependencies": {"{"}</div>
                  <div className="text-green-600 pl-8">"next": <span className="text-orange-500">"^14.0.0"</span>,</div>
                  <div className="text-green-600 pl-8">"react": <span className="text-orange-500">"^18.2.0"</span>,</div>
                  <div className="text-green-600 pl-8">"typescript": <span className="text-orange-500">"^5.0.0"</span>,</div>
                  <div className="text-green-600 pl-8">"tailwindcss": <span className="text-orange-500">"^3.4.0"</span>,</div>
                  <div className="text-green-600 pl-8">"prisma": <span className="text-orange-500">"^5.0.0"</span>,</div>
                  <div className="text-purple-600 pl-4">{"}"}</div>
                  <div className="text-slate-400">{"}"}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Performance Comparison */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-700 border-green-200 px-4 py-1.5 text-sm font-medium mb-6">
              Performance
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              See the <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Difference</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-red-50 border border-red-200 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <Code className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">WordPress</h3>
                  <p className="text-sm text-red-600">Before Migration</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Load Time", value: "3.2s", color: "bg-red-500", width: "w-1/4" },
                  { label: "PageSpeed", value: "52", color: "bg-red-500", width: "w-1/2" },
                ].map((metric, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">{metric.label}</span>
                      <span className="text-red-600 font-mono font-medium">{metric.value}</span>
                    </div>
                    <div className="h-2 bg-red-100 rounded-full overflow-hidden">
                      <div className={`h-full ${metric.color} ${metric.width} rounded-full`} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-green-50 border border-green-200 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Next.js</h3>
                  <p className="text-sm text-green-600">After Migration</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Load Time", value: "180ms", color: "bg-green-500", width: "w-full" },
                  { label: "PageSpeed", value: "98", color: "bg-green-500", width: "w-full" },
                ].map((metric, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">{metric.label}</span>
                      <span className="text-green-600 font-mono font-medium">{metric.value}</span>
                    </div>
                    <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                      <div className={`h-full ${metric.color} ${metric.width} rounded-full`} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-purple-50 via-white to-violet-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 px-4 py-1.5 text-sm font-medium mb-6">
              Pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Simple, <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Transparent</span> Pricing
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Start free, upgrade when you're ready. No hidden fees.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                className={`relative bg-white border rounded-3xl p-8 ${
                  plan.popular ? 'border-purple-400 shadow-xl shadow-purple-100 ring-2 ring-purple-300' : 'border-slate-200'
                }`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-1 shadow-lg">Most Popular</Badge>
                  </div>
                )}
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className="block">
                  <Button className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 px-4 py-1.5 text-sm font-medium mb-6">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              What Our <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Clients Say</span>
            </h2>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-3xl p-10 text-center"
            >
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-2xl text-slate-800 italic mb-8">"{testimonials[currentTestimonial].content}"</p>
              <div className="border-t border-purple-100 pt-6">
                <div className="font-bold text-slate-900 text-lg">{testimonials[currentTestimonial].name}</div>
                <div className="text-slate-600">{testimonials[currentTestimonial].role}</div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentTestimonial(i)}
                className={`w-3 h-3 rounded-full transition-all ${i === currentTestimonial ? "bg-purple-600 w-8" : "bg-slate-300 hover:bg-slate-400"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-purple-50 via-white to-violet-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 px-4 py-1.5 text-sm font-medium mb-6">
              Integrations
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Seamless <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Connections</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {integrations.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 bg-white border border-purple-100 rounded-2xl text-center hover:border-amber-300 hover:shadow-lg transition-all group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{item.logo}</div>
                <h4 className="font-semibold text-slate-900 mb-1">{item.name}</h4>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-1.5 text-sm font-medium mb-6">
              FAQ
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Frequently Asked <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Questions</span>
            </h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-purple-200 transition-colors"
              >
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <h3 className="font-semibold text-slate-900 pr-4">{faq.q}</h3>
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 group-open:bg-purple-600 group-open:rotate-180 transition-all">
                      <ChevronDown className="w-4 h-4 text-purple-600 group-open:text-white" />
                    </div>
                  </summary>
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-slate-600">{faq.a}</p>
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-purple-600 via-violet-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to <span className="bg-gradient-to-r from-amber-300 to-pink-300 bg-clip-text text-transparent">Transform</span> Your Website?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Join 500+ happy clients who switched to lightning-fast Next.js.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 text-lg px-10 py-6 shadow-xl font-bold">
                Start Free Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 text-lg px-10 py-6 font-semibold">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
