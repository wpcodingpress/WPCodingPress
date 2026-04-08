"use client"

import Link from "next/link"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { 
  Cpu, Zap, Code, Palette, ShoppingCart, Layers, Rocket, Shield, Gauge, Bot, HeadphonesIcon, 
  Users, Clock, Star, TrendingUp, CheckCircle2, Play, Quote, ArrowRight, ArrowDown, ArrowLeft,
  ChevronRight, ExternalLink, X, Maximize2, Globe, Search, BarChart3, PenTool, Lightbulb,
  RefreshCw, Award, Heart, Mail, Phone, MapPin, Menu, X as XIcon, Layers as LayoutIcon,
  FileCode, Database, Cloud, Smartphone, Monitor, Zap as FastIcon, Search as SEOTarget,
  TrendingDown, Smile, Building2, ShoppingBag, DollarSign, Calendar, Gift, Video, FileText,
  Briefcase, Users as TeamIcon, Target, Award as TrophyIcon, Lightbulb as IdeaIcon, 
  ChevronLeft, ChevronRight as ChevronRightIcon, Eye, ArrowUpRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CodeIllustration, ServerIllustration, RocketIllustration, DeviceIllustration, SeoIllustration, EcommerceIllustration, CloudIllustration } from "@/components/illustrations"

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
  { icon: Users, value: "500+", label: "Happy Clients", color: "text-violet-500", bg: "bg-violet-100" },
  { icon: Clock, value: "5+", label: "Years Experience", color: "text-orange-500", bg: "bg-orange-100" },
  { icon: Star, value: "4.9", label: "Client Rating", color: "text-yellow-500", bg: "bg-yellow-100" },
  { icon: TrendingUp, value: "1000+", label: "Projects Delivered", color: "text-emerald-500", bg: "bg-emerald-100" }
]

const services = [
  { icon: Code, title: "WordPress to Next.js", desc: "Convert your WordPress site to lightning-fast Next.js", features: ["Auto Sync", "SEO Optimized", "SSR", "API Ready"], color: "from-violet-500 to-purple-500", illustration: <CodeIllustration className="w-full h-24" /> },
  { icon: PenTool, title: "Elementor Pro Design", desc: "Stunning custom designs that convert", features: ["Custom Design", "Mobile First", "Fast Loading", "Animations"], color: "from-orange-500 to-amber-500", illustration: <DeviceIllustration className="w-full" /> },
  { icon: ShoppingBag, title: "WooCommerce Stores", desc: "Full-featured e-commerce solutions", features: ["Secure Payments", "Inventory", "Order Tracking", "Multi-vendor"], color: "from-emerald-500 to-teal-500", illustration: <EcommerceIllustration className="w-full" /> },
  { icon: SEOTarget, title: "SEO & Marketing", desc: "Grow your online presence", features: ["Technical SEO", "Content Strategy", "Analytics", "Rankings"], color: "from-blue-500 to-cyan-500", illustration: <SeoIllustration className="w-24 h-16" /> },
  { icon: LayoutIcon, title: "Web Applications", desc: "Custom web apps for your business", features: ["React/Next.js", "Custom APIs", "Dashboards", "SaaS Apps"], color: "from-pink-500 to-rose-500", illustration: <RocketIllustration className="w-16 h-16" /> },
  { icon: Cloud, title: "Cloud & DevOps", desc: "Modern cloud infrastructure", features: ["AWS/Azure", "CI/CD", "Docker", "Monitoring"], color: "from-indigo-500 to-violet-500", illustration: <CloudIllustration className="w-24 h-16" /> },
]

const subscriptionPlans = [
  { name: "Starter", price: "Free", features: ["1 Site", "Basic Template", "Community Support", "5GB Bandwidth"], color: "from-slate-500 to-slate-600", cta: "Start Free" },
  { name: "Pro", price: "$19/mo", features: ["5 Sites", "Advanced Templates", "Priority Support", "100GB Bandwidth", "Analytics"], color: "from-violet-500 to-purple-500", popular: true, cta: "Start Pro" },
  { name: "Enterprise", price: "$99/mo", features: ["Unlimited Sites", "White-label", "24/7 Support", "Custom Development"], color: "from-orange-500 to-red-500", cta: "Contact Sales" }
]

const processSteps = [
  { icon: Lightbulb, title: "Discovery", desc: "We analyze your requirements and goals", num: "01" },
  { icon: PenTool, title: "Design", desc: "Create stunning mockups and prototypes", num: "02" },
  { icon: Code, title: "Develop", desc: "Build with clean, optimized code", num: "03" },
  { icon: Rocket, title: "Deploy", desc: "Launch to production with confidence", num: "04" },
  { icon: Gauge, title: "Optimize", desc: "Fine-tune for maximum performance", num: "05" },
  { icon: Shield, title: "Maintain", desc: "Ongoing support and updates", num: "06" }
]

const whyChooseUs = [
  { icon: FastIcon, title: "Lightning Fast", desc: "Next.js sites load in milliseconds" },
  { icon: Shield, title: "Secure", desc: "Enterprise-grade security" },
  { icon: SEOTarget, title: "SEO Ready", desc: "Built-in SEO tools" },
  { icon: RefreshCw, title: "Auto Sync", desc: "Real-time content sync" },
  { icon: Bot, title: "AI-Powered", desc: "Smart automation" },
  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Expert assistance" }
]

const portfolioItems = [
  { id: 1, title: "HomePicks Daily", category: "E-Commerce", image: "HomePicksDaily- A Woocommerce Based Dropshipping E-Commerce Website Front Page.jpeg", client: "Beth Moran", liveUrl: "https://homepicksdaily.com", tech: ["WordPress", "WooCommerce", "Elementor"] },
  { id: 2, title: "Trip Monarch", category: "Travel Portal", image: "tripmonarch.png", client: "Trip Monarch", liveUrl: "https://tripmonarch.com", tech: ["WordPress", "Booking System"] },
  { id: 3, title: "RankUpper", category: "SEO Agency", image: "RankUpper.png", client: "RankUpper", liveUrl: "https://rankupper.io", tech: ["WordPress", "Elementor Pro"] },
  { id: 4, title: "Pro Consultant", category: "Consulting", image: "Pro Consultant.png", client: "Pro Consultant UK", liveUrl: "https://proconsultant.co.uk", tech: ["WordPress", "Custom Plugin"] },
  { id: 5, title: "Masjid Press", category: "Non-Profit", image: "masjidpress.com.png", client: "Masjid Press", liveUrl: "https://masjidpress.com", tech: ["WordPress", "Donation Plugin"] },
  { id: 6, title: "E-Commerce Giant", category: "E-Commerce", image: "ecomgianrtz.png", client: "EcomGiantz", liveUrl: "https://ecomgiantz.com", tech: ["WooCommerce", "Payment Gateway"] },
]

const testimonials = [
  { name: "Sarah Johnson", role: "CEO, TechStart", content: "WPCodingPress transformed our WP to Next.js. Load times went from 3s to 300ms! Incredible work.", rating: 5 },
  { name: "Michael Chen", role: "Founder, EcomHub", content: "Our WooCommerce redesign increased sales by 40%. The team understood our vision perfectly.", rating: 5 },
  { name: "Emma Williams", role: "Marketing Director", content: "SEO improvements helped us rank #1 within 3 months. Best investment!", rating: 5 },
  { name: "David Lee", role: "CEO, StartupX", content: "Professional, timely, and excellent communication throughout the project.", rating: 5 },
]

const techStack = ["WordPress", "Elementor", "WooCommerce", "Next.js", "React", "TypeScript", "Tailwind", "Node.js", "AWS", "Docker", "MySQL", "Prisma"]

const faqs = [
  { q: "How long does a typical project take?", a: "Most projects are completed within 2-4 weeks, depending on complexity." },
  { q: "Do you offer ongoing support?", a: "Yes! All our plans include ongoing support and maintenance options." },
  { q: "Can you migrate my existing site?", a: "Absolutely! We specialize in seamless WordPress to Next.js migrations." },
  { q: "What's included in SEO optimization?", a: "Technical SEO, on-page optimization, speed improvements, and analytics setup." },
]

export default function HomePage() {
  const [selectedPortfolio, setSelectedPortfolio] = useState<typeof portfolioItems[0] | null>(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [portfolioFilter, setPortfolioFilter] = useState("All")
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [currentPortfolioIndex, setCurrentPortfolioIndex] = useState(0)
  const heroRef = useRef(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const horizontalScrollRef = useRef<HTMLDivElement>(null)
  const portfolioScrollRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: heroRef })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200])
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-text", 
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.3 }
      )

      gsap.fromTo(".hero-btn",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.7)", delay: 0.8 }
      )

      gsap.fromTo(".floating-el",
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.8, stagger: 0.2, ease: "back.out(1.7)", delay: 0.5 }
      )

      gsap.to(".parallax-slow", {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: ".parallax-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      })

      gsap.to(".parallax-fast", {
        y: -150,
        ease: "none",
        scrollTrigger: {
          trigger: ".parallax-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      })

      const sections = gsap.utils.toArray(".service-card")
      gsap.fromTo(sections,
        { opacity: 0, y: 100, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".services-section",
            start: "top 70%",
            once: true,
          },
        }
      )

      const processItems = gsap.utils.toArray(".process-item")
      gsap.fromTo(processItems,
        { opacity: 0, x: 100, rotation: 10 },
        {
          opacity: 1,
          x: 0,
          rotation: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".process-section",
            start: "top 70%",
            once: true,
          },
        }
      )

      const whyItems = gsap.utils.toArray(".why-item")
      gsap.fromTo(whyItems,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".why-section",
            start: "top 70%",
            once: true,
          },
        }
      )

      const statNumbers = gsap.utils.toArray<HTMLElement>(".stat-number")
      statNumbers.forEach((stat) => {
        gsap.fromTo(stat,
          { opacity: 0, scale: 0.5 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: stat,
              start: "top 85%",
              once: true,
            },
          }
        )
      })

      gsap.fromTo(".pricing-card",
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".pricing-section",
            start: "top 70%",
            once: true,
          },
        }
      )

      const portfolioCards = gsap.utils.toArray(".portfolio-card")
      gsap.fromTo(portfolioCards,
        { opacity: 0, scale: 0.8, rotation: -5 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".portfolio-section",
            start: "top 70%",
            once: true,
          },
        }
      )

      const testimonialElements = gsap.utils.toArray(".testimonial-el")
      gsap.fromTo(testimonialElements,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".testimonial-section",
            start: "top 70%",
            once: true,
          },
        }
      )

      gsap.fromTo(".cta-section",
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cta-section",
            start: "top 80%",
            once: true,
          },
        }
      )

      if (portfolioScrollRef.current) {
        const scrollWidth = portfolioScrollRef.current.scrollWidth
        gsap.to(portfolioScrollRef.current, {
          x: () => -(scrollWidth - window.innerWidth + 100),
          ease: "none",
          scrollTrigger: {
            trigger: portfolioScrollRef.current,
            start: "top top",
            end: () => "+=" + scrollWidth,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const filteredPortfolio = portfolioFilter === "All" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === portfolioFilter)

  const categories = ["All", ...Array.from(new Set(portfolioItems.map(item => item.category)))]

  return (
    <div ref={containerRef} className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-violet-200/30 to-purple-200/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1], x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-orange-100/30 to-pink-100/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Cpu className="h-6 w-6 text-white" />
                </div>
              </motion.div>
              <span className="text-xl font-bold">
                <span className="text-slate-800">WPCoding</span>
                <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">Press</span>
              </span>
            </Link>
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login"><Button variant="ghost" size="sm">Login</Button></Link>
              <Link href="/register"><Button size="sm" className="bg-gradient-to-r from-violet-500 to-purple-500">Get Started</Button></Link>
            </div>
          </div>
        </div>
      </nav>

      <section ref={heroRef} className="relative min-h-[100vh] flex items-center pt-16 overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-white to-purple-50/50" />
        </motion.div>

        <div className="floating-el absolute top-32 left-[10%] hidden lg:block">
          <motion.div 
            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-100 to-purple-100 border border-violet-200 flex items-center justify-center shadow-xl"
            animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Code className="h-10 w-10 text-violet-500" />
          </motion.div>
        </div>
        <div className="floating-el absolute top-48 right-[12%] hidden lg:block">
          <motion.div 
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 flex items-center justify-center shadow-xl"
            animate={{ y: [0, 25, 0], rotate: [0, -5, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          >
            <Zap className="h-8 w-8 text-orange-500" />
          </motion.div>
        </div>
        <div className="floating-el absolute bottom-32 left-[15%] hidden lg:block">
          <motion.div 
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 border border-emerald-200 flex items-center justify-center shadow-xl"
            animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <Rocket className="h-7 w-7 text-emerald-500" />
          </motion.div>
        </div>

        <motion.div className="absolute top-[20%] left-[25%] w-3 h-3 bg-violet-400/40 rounded-sm rotate-45" animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
        <motion.div className="absolute top-[35%] right-[30%] w-4 h-4 bg-pink-400/30 rounded-full" animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }} />

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-5xl mx-auto text-center">
            <div className="hero-text">
              <Badge className="mb-6 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border-violet-200 px-6 py-2 text-sm font-semibold">
                <Star className="h-4 w-4 mr-2 fill-violet-500" />
                AI-Powered Web Development Agency
              </Badge>
            </div>

            <div className="hero-text">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                <span className="text-slate-800">Build </span>
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Amazing</span>
                <br />
                <span className="text-slate-800">Web Experiences</span>
              </h1>
            </div>

            <div className="hero-text">
              <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                From WordPress to Next.js, from design to deployment - we create stunning, 
                <span className="text-violet-600 font-semibold"> high-performance websites</span> that drive results.
              </p>
            </div>

            <div className="hero-btn flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Link href="/pricing">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:shadow-xl shadow-purple-500/25">
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {stats.map((stat, i) => (
                <motion.div key={i} whileHover={{ y: -5 }} className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100 shadow-lg">
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="stat-number text-3xl font-bold text-slate-800">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ArrowDown className="h-8 w-8 text-slate-400" />
        </motion.div>
      </section>

      <section className="py-12 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4">
          <p className="text-center text-slate-500 mb-8 font-medium">POWERED BY</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {techStack.map((tech, i) => (
              <motion.span 
                key={i} 
                className="text-xl md:text-2xl font-bold text-slate-300 hover:text-violet-500 transition-colors cursor-default"
                whileHover={{ scale: 1.1 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      <section className="services-section py-32 bg-gradient-to-b from-white via-violet-50/30 to-white">
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
              <motion.div 
                key={i} 
                whileHover={{ y: -8, scale: 1.02 }}
                className="service-card p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  {service.illustration}
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 shadow-lg`}>
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
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button size="lg" className="bg-gradient-to-r from-violet-500 to-pink-500">
                Explore All Services <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="process-section py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">Our Process</Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-800">How We <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Work</span></h2>
            <p className="text-xl text-slate-600 mt-4">A streamlined approach to deliver exceptional results</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {processSteps.map((step, i) => (
              <motion.div 
                key={i}
                className="process-item p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-lg text-center"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-7 w-7 text-violet-600" />
                </div>
                <div className="text-4xl font-black text-violet-200 mb-2">{step.num}</div>
                <h3 className="font-bold text-slate-800">{step.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="stat-number"><div className="text-4xl md:text-6xl font-bold text-white">500+</div><div className="text-white/80">Projects</div></div>
            <div className="stat-number"><div className="text-4xl md:text-6xl font-bold text-white">98%</div><div className="text-white/80">Satisfaction</div></div>
            <div className="stat-number"><div className="text-4xl md:text-6xl font-bold text-white">50+</div><div className="text-white/80">Plugins</div></div>
            <div className="stat-number"><div className="text-4xl md:text-6xl font-bold text-white">24/7</div><div className="text-white/80">Support</div></div>
          </div>
        </div>
      </section>

      <section className="pricing-section py-32 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200">Pricing</Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-800">Simple, <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Transparent</span> Pricing</h2>
            <p className="text-xl text-slate-600 mt-4">Choose the plan that fits your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {subscriptionPlans.map((plan, i) => (
              <motion.div 
                key={i} 
                className={`pricing-card h-full relative bg-white border-2 ${plan.popular ? 'border-violet-400 shadow-2xl shadow-violet-500/20' : 'border-slate-100'}`}
                whileHover={{ y: -10 }}
              >
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
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-2 border-violet-200">
                Compare All Plans <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="portfolio-section py-32 bg-gradient-to-b from-white via-pink-50/30 to-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-pink-100 text-pink-700 border-pink-200">Portfolio</Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-800">Featured <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Projects</span></h2>
            <p className="text-xl text-slate-600 mt-4">Click any project to view details, see full image, or visit live site</p>
          </div>

          <div className="flex gap-3 justify-center mb-8 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setPortfolioFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  portfolioFilter === cat
                    ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPortfolio.map((item, i) => (
              <motion.div 
                key={item.id}
                className="portfolio-card group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedPortfolio(item)}
              >
                <Card className="overflow-hidden bg-white border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="aspect-[4/3] bg-gradient-to-br from-violet-100 to-pink-100 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Globe className="h-20 w-20 text-violet-300 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                          <Eye className="h-5 w-5 text-slate-700" />
                        </div>
                        <div className="w-12 h-12 rounded-full bg-violet-500 flex items-center justify-center">
                          <ExternalLink className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <Badge className="mb-3 bg-violet-100 text-violet-700">{item.category}</Badge>
                    <h3 className="text-xl font-bold text-slate-800">{item.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">Client: {item.client}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.tech.map((t, j) => (
                        <span key={j} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">{t}</span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/portfolio">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-rose-500">View All Projects <ArrowRight className="ml-2 h-5 w-5" /></Button>
            </Link>
          </div>
        </div>

        <AnimatePresence>
          {selectedPortfolio && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setSelectedPortfolio(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="aspect-video bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100 relative flex items-center justify-center overflow-hidden">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-2xl">
                      <Globe className="h-16 w-16 text-white" />
                    </div>
                  </motion.div>
                  <motion.div 
                    className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                  <button 
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                    onClick={() => setSelectedPortfolio(null)}
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-white/90 text-slate-800">{selectedPortfolio.category}</Badge>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-3xl font-bold text-slate-800 mb-2">{selectedPortfolio.title}</h3>
                  <p className="text-slate-600 mb-4">Client: {selectedPortfolio.client}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedPortfolio.tech.map((t, j) => (
                      <span key={j} className="text-sm px-3 py-1 bg-slate-100 text-slate-600 rounded-full">{t}</span>
                    ))}
                  </div>
                  <div className="flex gap-4 flex-wrap">
                    <a href={selectedPortfolio.liveUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="bg-gradient-to-r from-violet-500 to-purple-500 hover:shadow-lg">
                        <ExternalLink className="mr-2 h-4 w-4" /> Visit Live Site
                      </Button>
                    </a>
                    <Link href="/portfolio">
                      <Button variant="outline">
                        View Full Case Study
                      </Button>
                    </Link>
                    <Button variant="ghost" onClick={() => setSelectedPortfolio(null)}>Close</Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className="why-section py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-700 border-orange-200">Why Choose Us</Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-800">Industry-<span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Leading</span> Features</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {whyChooseUs.map((item, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -5, scale: 1.05 }}
                className="why-item text-center p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-100 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="h-7 w-7 text-violet-600" />
                </div>
                <h3 className="font-semibold text-slate-800">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonial-section py-32 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-100 text-yellow-700 border-yellow-200">Testimonials</Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-800">What <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">Clients Say</span></h2>
          </div>

          <div className="max-w-4xl mx-auto testimonial-el">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <Card className="bg-white border border-slate-100 shadow-xl">
                  <CardContent className="p-12">
                    <div className="flex justify-center gap-1 mb-6">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, j) => (
                        <Star key={j} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Quote className="h-12 w-12 text-violet-200 mx-auto mb-6" />
                    <p className="text-2xl text-slate-700 italic mb-8">"{testimonials[currentTestimonial].content}"</p>
                    <div className="border-t border-slate-100 pt-6">
                      <div className="font-bold text-slate-800 text-lg">{testimonials[currentTestimonial].name}</div>
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
                  className={`w-3 h-3 rounded-full transition-all ${i === currentTestimonial ? 'bg-violet-500 w-8' : 'bg-slate-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-violet-100 text-violet-700 border-violet-200">FAQ</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800">Frequently Asked <span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">Questions</span></h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 text-left flex items-center justify-between"
                >
                  <span className="font-semibold text-slate-800">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowDown className="h-5 w-5 text-slate-400" />
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-slate-600">{faq.a}</div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Transform?</span>
            </h2>
            <p className="text-xl text-slate-300 mb-10">Let's build something amazing together. Start your project today.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="text-lg px-12 py-7 bg-gradient-to-r from-violet-500 to-pink-500 hover:shadow-2xl">
                  Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="text-lg px-12 py-7 border-white/20 text-white hover:bg-white/10">
                  Learn More <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                  <Cpu className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">WPCodingPress</span>
              </div>
              <p className="text-slate-400 text-sm">Your trusted web development partner.</p>
              <div className="flex gap-3 mt-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-violet-500 transition-colors">
                  <Star className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-violet-500 transition-colors">
                  <Globe className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-violet-500 transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/services" className="hover:text-violet-400 transition-colors">WordPress Development</Link></li>
                <li><Link href="/services" className="hover:text-violet-400 transition-colors">Next.js Development</Link></li>
                <li><Link href="/services" className="hover:text-violet-400 transition-colors">WooCommerce Stores</Link></li>
                <li><Link href="/services" className="hover:text-violet-400 transition-colors">SEO Services</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/about" className="hover:text-violet-400 transition-colors">About Us</Link></li>
                <li><Link href="/portfolio" className="hover:text-violet-400 transition-colors">Portfolio</Link></li>
                <li><Link href="/contact" className="hover:text-violet-400 transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-violet-400 transition-colors">Careers</Link></li>
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
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <span>© {new Date().getFullYear()} WPCodingPress. All rights reserved.</span>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-violet-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-violet-400 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
