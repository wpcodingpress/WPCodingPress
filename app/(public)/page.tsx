"use client"

import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  ArrowRight, ArrowUpRight, ChevronDown, Check, Star, Zap, Shield, Code, Palette,
  ShoppingCart, Search, Layers, Cloud, Play, Menu, X, Cpu, Bot, TrendingUp, Clock,
  Users, Globe, Sparkles, Layout, Server, Lock, Gauge, Headphones, ArrowRightLeft,
  MousePointer, Maximize2, ExternalLink, Eye, MessageCircle, Send, ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedLogo, LogoIcon } from "@/components/logo"
import { FloatingButtons } from "@/components/floating-buttons"

gsap.registerPlugin(ScrollTrigger)

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
]

const stats = [
  { value: "500+", label: "Happy Clients", icon: Users },
  { value: "5+", label: "Years Experience", icon: Clock },
  { value: "4.9", label: "Client Rating", icon: Star },
  { value: "1000+", label: "Projects Done", icon: TrendingUp },
]

const features = [
  {
    icon: ArrowRightLeft,
    title: "WordPress to Next.js",
    description: "Convert your WordPress site to lightning-fast Next.js with automatic sync",
    color: "from-emerald-400 to-teal-500",
    badge: "Most Popular",
  },
  {
    icon: Palette,
    title: "Elementor Pro Design",
    description: "Stunning custom designs built with Elementor Pro that convert visitors",
    color: "from-cyan-400 to-blue-500",
    badge: null,
  },
  {
    icon: ShoppingCart,
    title: "WooCommerce Stores",
    description: "Full-featured e-commerce solutions with secure payments and inventory",
    color: "from-blue-400 to-indigo-500",
    badge: null,
  },
  {
    icon: Search,
    title: "SEO & Marketing",
    description: "Dominate search rankings with our proven SEO strategies and techniques",
    color: "from-violet-400 to-purple-500",
    badge: null,
  },
]

const processSteps = [
  {
    number: "01",
    title: "Connect Your Site",
    description: "Link your existing WordPress website in just a few clicks",
    visual: "🔗",
  },
  {
    number: "02",
    title: "AI Analysis",
    description: "Our AI analyzes your content, design, and structure",
    visual: "🤖",
  },
  {
    number: "03",
    title: "Smart Conversion",
    description: "We convert your site to Next.js with all features preserved",
    visual: "⚡",
  },
  {
    number: "04",
    title: "Go Live",
    description: "Deploy to our lightning-fast CDN and watch your speed soar",
    visual: "🚀",
  },
]

const portfolioItems = [
  { id: 1, title: "HomePicks Daily", category: "E-Commerce", size: "large", image: "HomePicksDaily- A Woocommerce Based Dropshipping E-Commerce Website Front Page.jpeg", client: "Beth Moran", liveUrl: "https://homepicksdaily.com" },
  { id: 2, title: "Trip Monarch", category: "Travel", size: "small", image: "tripmonarch.png", client: "Trip Monarch", liveUrl: "https://tripmonarch.com" },
  { id: 3, title: "RankUpper", category: "SEO Agency", size: "small", image: "RankUpper.png", client: "RankUpper", liveUrl: "https://rankupper.io" },
  { id: 4, title: "Pro Consultant", category: "Consulting", size: "medium", image: "Pro Consultant.png", client: "Pro Consultant UK", liveUrl: "https://proconsultant.co.uk" },
  { id: 5, title: "Masjid Press", category: "Non-Profit", size: "medium", image: "masjidpress.com.png", client: "Masjid Press", liveUrl: "https://masjidpress.com" },
  { id: 6, title: "EcomGiantz", category: "E-Commerce", size: "large", image: "ecomgianrtz.png", client: "EcomGiantz", liveUrl: "https://ecomgiantz.com" },
]

const testimonials = [
  { name: "Sarah Johnson", role: "CEO, TechStart", content: "WPCodingPress transformed our WP to Next.js. Load times went from 3s to 300ms! Incredible work.", rating: 5 },
  { name: "Michael Chen", role: "Founder, EcomHub", content: "Our WooCommerce redesign increased sales by 40%. The team understood our vision perfectly.", rating: 5 },
  { name: "Emma Williams", role: "Marketing Director", content: "SEO improvements helped us rank #1 within 3 months. Best investment!", rating: 5 },
]

const plans = [
  { name: "Starter", price: "Free", features: ["1 Site", "Basic Template", "Community Support", "5GB Bandwidth"], highlight: false },
  { name: "Pro", price: "$19", period: "/mo", features: ["5 Sites", "Advanced Templates", "Priority Support", "100GB Bandwidth", "Analytics Dashboard"], highlight: true },
  { name: "Enterprise", price: "$99", period: "/mo", features: ["Unlimited Sites", "White-label", "24/7 Support", "Custom Development"], highlight: false },
]

const whyChooseUs = [
  { icon: Gauge, title: "Lightning Fast", desc: "Sub-300ms load times guaranteed" },
  { icon: Shield, title: "Secure", desc: "Enterprise-grade protection" },
  { icon: Search, title: "SEO Optimized", desc: "Built-in best practices" },
  { icon: ArrowRightLeft, title: "Auto Sync", desc: "Real-time content updates" },
  { icon: Bot, title: "AI-Powered", desc: "Smart automation" },
  { icon: Headphones, title: "24/7 Support", desc: "Expert help anytime" },
]

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [selectedPortfolio, setSelectedPortfolio] = useState<typeof portfolioItems[0] | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const portfolioRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({ target: heroRef })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-title", 
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.2 }
      )
      
      gsap.fromTo(".hero-btn",
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.4)", delay: 0.6 }
      )
      
      gsap.fromTo(".stat-card",
        { opacity: 0, y: 40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.4)", delay: 0.9 }
      )
      
      gsap.fromTo(".hero-visual",
        { opacity: 0, scale: 0.85, rotateY: -15 },
        { opacity: 1, scale: 1, rotateY: 0, duration: 1.2, ease: "power3.out", delay: 0.4 }
      )

      const featureCards = gsap.utils.toArray<HTMLElement>(".feature-card")
      gsap.fromTo(featureCards,
        { opacity: 0, y: 80, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 70%",
            once: true,
          },
        }
      )

      const processSteps = gsap.utils.toArray<HTMLElement>(".process-step")
      processSteps.forEach((step) => {
        gsap.fromTo(step,
          { opacity: 0, x: 100, rotation: 10 },
          {
            opacity: 1,
            x: 0,
            rotation: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
              once: true,
            },
          }
        )
      })

      const portfolioCards = gsap.utils.toArray<HTMLElement>(".portfolio-card")
      gsap.fromTo(portfolioCards,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: portfolioRef.current,
            start: "top 70%",
            once: true,
          },
        }
      )

      const whyCards = gsap.utils.toArray(".why-card")
      gsap.fromTo(whyCards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".why-section",
            start: "top 80%",
            once: true,
          },
        }
      )

      const planCards = gsap.utils.toArray(".plan-card")
      gsap.fromTo(planCards,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".pricing-section",
            start: "top 75%",
            once: true,
          },
        }
      )

      const parallaxElements = gsap.utils.toArray<HTMLElement>(".parallax-el")
      parallaxElements.forEach((el) => {
        gsap.to(el, {
          y: -60,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        })
      })

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
    <div ref={containerRef} className="relative overflow-hidden bg-white">
      <FloatingButtons />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <AnimatedLogo size="md" />
            
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button variant="ghost" className="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 font-medium px-4">
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
            
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-600 hover:text-emerald-600 font-medium">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="btn-primary text-base px-6 py-5 h-auto">
                  Get Started Free
                </Button>
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-emerald-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-slate-100"
            >
              <div className="container mx-auto px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-emerald-600">
                      {link.label}
                    </Button>
                  </Link>
                ))}
                <div className="pt-4 flex flex-col gap-2">
                  <Link href="/login">
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button className="btn-primary w-full">Get Started Free</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <section ref={heroRef} className="relative min-h-[100vh] flex items-center pt-20 lg:pt-24 overflow-hidden">
        <div className="absolute inset-0 animated-gradient-bg opacity-50" />
        <div className="absolute inset-0 bg-grid-pattern" />
        
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl parallax-el" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl parallax-el" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4" />
                AI-Powered Web Development
              </motion.div>

              <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-tight mb-6">
                <span>Build </span>
                <span className="gradient-text">Amazing</span>
                <br />
                <span>Web Experiences</span>
              </h1>

              <p className="hero-title text-lg md:text-xl text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Transform your WordPress site to Next.js in minutes. 
                <span className="text-emerald-600 font-semibold"> Lightning-fast, SEO-optimized,</span> 
                {" "}and ready to scale.
              </p>

              <div className="hero-btn flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Link href="/register">
                  <Button size="lg" className="btn-primary text-lg w-full sm:w-auto px-10 py-6 h-auto group">
                    Start Free Today
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button size="lg" variant="outline" className="btn-secondary text-lg w-full sm:w-auto px-10 py-6 h-auto">
                    <Play className="mr-2 w-5 h-5" />
                    Watch Demo
                  </Button>
                </Link>
              </div>

              <div className="hero-btn flex items-center gap-6 justify-center lg:justify-start text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span>Free forever plan</span>
                </div>
              </div>
            </div>

            <div className="relative hero-visual perspective-1000">
              <motion.div
                className="relative"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="relative bg-white rounded-3xl shadow-2xl shadow-emerald-500/10 p-6 border border-slate-100/50">
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-emerald-400 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    300ms Load Time!
                  </div>
                  <div className="bg-slate-900 rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="font-mono text-sm text-slate-300 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400">$</span>
                        <span>nextjs build --fast</span>
                      </div>
                      <div className="text-slate-500">Compiling...</div>
                      <div className="text-emerald-400">✓ Done in 2.3s</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {["⚡", "🚀", "💎"].map((emoji, i) => (
                      <div key={i} className="aspect-square bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-xl flex items-center justify-center text-2xl">
                        {emoji}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">+40%</div>
                    <div className="text-sm text-slate-500">Performance</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 lg:mt-24">
            {stats.map((stat, i) => (
              <motion.div key={i} className="stat-card text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-lg">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="w-8 h-8 text-slate-400" />
        </motion.div>
      </section>

      <section ref={featuresRef} className="py-24 lg:py-32 bg-white relative">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-4 py-1.5 text-sm font-semibold mb-4">
              Our Services
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need to <span className="gradient-text">Succeed Online</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From WordPress migrations to custom web applications, we've got you covered.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="feature-card group relative bg-white rounded-3xl border border-slate-100 p-8 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 overflow-hidden"
                whileHover={{ y: -8 }}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`} />
                
                {feature.badge && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-white text-xs px-2 py-1">
                      {feature.badge}
                    </Badge>
                  </div>
                )}

                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">{feature.description}</p>

                <Link href="/services">
                  <Button variant="ghost" className="group-hover:text-emerald-600 p-0 h-auto font-medium">
                    Learn more
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="process-section py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dots-pattern opacity-50" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200 px-4 py-1.5 text-sm font-semibold mb-4">
              How It Works
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Convert in <span className="gradient-text">4 Simple Steps</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our streamlined process gets you from WordPress to Next.js faster than ever.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                className="process-step relative"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="bg-white rounded-3xl border border-slate-100 p-8 h-full hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 group">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">{step.visual}</div>
                  <div className="text-4xl font-black text-emerald-100 mb-2">{step.number}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
                
                {i < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-emerald-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={portfolioRef} className="portfolio-section py-24 lg:py-32 bg-white relative">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
          >
            <div>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-1.5 text-sm font-semibold mb-4">
                Portfolio
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
                Featured <span className="gradient-text">Projects</span>
              </h2>
            </div>
            <Link href="/portfolio" className="mt-6 md:mt-0">
              <Button variant="outline" className="btn-secondary">
                View All Projects
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
            {portfolioItems.map((item, i) => (
              <motion.div
                key={item.id}
                className={`portfolio-card group relative bg-gradient-to-br from-emerald-100 via-cyan-50 to-blue-100 rounded-3xl overflow-hidden cursor-pointer ${
                  item.size === "large" ? "md:col-span-2 md:row-span-2" : item.size === "medium" ? "md:col-span-1 md:row-span-1" : ""
                }`}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedPortfolio(item)}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Globe className="w-24 h-24 text-emerald-300/50 group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Badge className="bg-white/20 text-white backdrop-blur-sm mb-2">{item.category}</Badge>
                  <h3 className="text-2xl font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-white/70 text-sm mb-4">Client: {item.client}</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-white text-slate-900 hover:bg-white/90">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit
                    </Button>
                  </div>
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {selectedPortfolio && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setSelectedPortfolio(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="aspect-video bg-gradient-to-br from-emerald-100 via-cyan-50 to-blue-100 relative flex items-center justify-center">
                  <Globe className="w-32 h-32 text-emerald-300" />
                  <button
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white"
                    onClick={() => setSelectedPortfolio(null)}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-8">
                  <Badge className="bg-emerald-100 text-emerald-700 mb-4">{selectedPortfolio.category}</Badge>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">{selectedPortfolio.title}</h3>
                  <p className="text-slate-600 mb-6">Client: {selectedPortfolio.client}</p>
                  <div className="flex gap-4">
                    <a href={selectedPortfolio.liveUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="btn-primary">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Live Site
                      </Button>
                    </a>
                    <Button variant="outline" onClick={() => setSelectedPortfolio(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className="pricing-section py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-violet-100 text-violet-700 border-violet-200 px-4 py-1.5 text-sm font-semibold mb-4">
              Pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Simple, <span className="gradient-text">Transparent</span> Pricing
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Start free, upgrade when you're ready. No hidden fees.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                className={`plan-card relative ${plan.highlight ? "md:-mt-4 md:mb-[-16px]" : ""}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-white px-4 py-1 shadow-lg">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <div className={`bg-white rounded-3xl border-2 ${plan.highlight ? "border-emerald-400 shadow-xl shadow-emerald-500/10" : "border-slate-100"} p-8 h-full relative overflow-hidden`}>
                  {plan.highlight && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-cyan-500/10 rounded-full blur-2xl" />
                  )}
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-black text-slate-900">{plan.price}</span>
                    {plan.period && <span className="text-slate-500">{plan.period}</span>}
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3 text-slate-600">
                        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.highlight ? "btn-primary" : "btn-secondary"}`}>
                    {plan.name === "Starter" ? "Start Free" : plan.name === "Pro" ? "Get Started" : "Contact Sales"}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="why-section py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 px-4 py-1.5 text-sm font-semibold mb-4">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
              Industry-<span className="gradient-text">Leading</span> Features
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={i}
                className="why-card text-center p-6 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-2xl flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonial-section py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-pink-100 text-pink-700 border-pink-200 px-4 py-1.5 text-sm font-semibold mb-4">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
              What <span className="gradient-text">Clients Say</span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white border-2 border-slate-100 shadow-xl">
                  <CardContent className="p-10 text-center">
                    <div className="flex justify-center gap-1 mb-6">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, j) => (
                        <Star key={j} className="w-6 h-6 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-2xl text-slate-700 italic leading-relaxed mb-8">
                      "{testimonials[currentTestimonial].content}"
                    </p>
                    <div className="border-t border-slate-100 pt-6">
                      <div className="font-bold text-slate-900 text-lg">{testimonials[currentTestimonial].name}</div>
                      <div className="text-slate-500">{testimonials[currentTestimonial].role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i === currentTestimonial ? "bg-emerald-500 w-8" : "bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section py-24 lg:py-32 bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to <span className="text-emerald-200">Transform</span> Your Website?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Join 500+ happy clients who switched to lightning-fast Next.js.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 text-lg px-12 py-6 h-auto font-bold shadow-xl">
                  Start Free Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 text-lg px-12 py-6 h-auto">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <AnimatedLogo size="md" className="mb-6" />
              <p className="text-slate-400 mb-6 max-w-md">
                Your trusted partner for WordPress to Next.js migrations. Fast, secure, and SEO-optimized websites.
              </p>
              <div className="flex gap-4">
                {["twitter", "github", "linkedin"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-emerald-500 transition-colors"
                  >
                    <span className="text-sm capitalize">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Services</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/services" className="hover:text-emerald-400 transition-colors">WordPress to Next.js</Link></li>
                <li><Link href="/services" className="hover:text-emerald-400 transition-colors">Elementor Design</Link></li>
                <li><Link href="/services" className="hover:text-emerald-400 transition-colors">WooCommerce</Link></li>
                <li><Link href="/services" className="hover:text-emerald-400 transition-colors">SEO Services</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
                <li><Link href="/portfolio" className="hover:text-emerald-400 transition-colors">Portfolio</Link></li>
                <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-emerald-400 transition-colors">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-emerald-400 transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <span>© {new Date().getFullYear()} WPCodingPress. All rights reserved.</span>
            <span className="mt-4 md:mt-0">Made with ❤️ for the web</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
