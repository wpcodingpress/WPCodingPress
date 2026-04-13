"use client"

import Link from "next/link"
import Head from "next/head"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  ArrowRight, Check, Star, Zap, Shield, Code, Palette,
  ShoppingCart, Search, Layers, Cloud, Play, Menu, X,
  Bot, TrendingUp, Users, Globe, Sparkles, Layout, Server,
  Lock, Gauge, Headphones, ArrowRightLeft, Eye, ExternalLink,
  ChevronDown, Rocket, Target, Award, Clock, Code2, Database, Globe2, ArrowUpRight,
  Terminal, GitBranch, Package, BarChart3, Cpu, RefreshCcw, ShieldCheck, SearchCheck, Globe as GlobeIcon, FileCode, Database as DatabaseIcon, Server as ServerIcon, Boxes, Accessibility, Download, Zap as ZapIcon, Clock3, MessageCircle, Star as StarIcon, CheckCircle2, Settings, Move3d, Wand2, Heart, ThumbsUp, Bell
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"


gsap.registerPlugin(ScrollTrigger)

const plansData = [
  { name: "Free", planId: "free", price: "$0", period: "forever", description: "Perfect for getting started with WordPress to Next.js conversion", features: ["1 WordPress site conversion", "Basic Next.js template", "Community support", "No custom domain"], href: "/register", popular: false },
  { name: "Pro", planId: "pro", price: "$19", period: "month", description: "Convert 1 WordPress site to Next.js", features: ["1 WordPress site conversion", "Live deployment", "Advanced Next.js template", "Priority email support", "Custom domain", "Analytics dashboard", "Auto content sync"], href: "/register?plan=pro", popular: true },
  { name: "Enterprise", planId: "enterprise", price: "$99", period: "month", description: "Convert 3 WordPress sites to Next.js", features: ["3 WordPress site conversions", "Live deployments", "Advanced Next.js templates", "Priority email support", "Custom domains", "Analytics dashboard", "Auto content sync", "White-label option"], href: "/contact", popular: false },
]

const portfolioItems = [
  { id: 1, title: "HomePicks Daily", category: "E-Commerce", client: "Beth Moran", liveUrl: "https://homepicksdaily.com", image: "/portfolio/HomePicksDaily- A Woocommerce Based Dropshipping E-Commerce Website Front Page.jpeg" },
  { id: 2, title: "Trip Monarch", category: "Travel", client: "Trip Monarch", liveUrl: "https://tripmonarch.com", image: "/portfolio/tripmonarch.png" },
  { id: 3, title: "RankUpper", category: "SEO Agency", client: "RankUpper", liveUrl: "https://rankupper.io", image: "/portfolio/RankUpper.png" },
  { id: 4, title: "Pro Consultant", category: "Consulting", client: "Pro Consultant UK", liveUrl: "https://proconsultant.co.uk", image: "/portfolio/Pro Consultant.png" },
  { id: 5, title: "Masjid Press", category: "Non-Profit", client: "Masjid Press", liveUrl: "https://masjidpress.com", image: "/portfolio/masjidpress.com.png" },
  { id: 6, title: "EcomGiantz", category: "E-Commerce", client: "EcomGiantz", liveUrl: "https://ecomgiantz.com", image: "/portfolio/ecomgianrtz.png" },
]

const serviceIcons: Record<string, string> = {
  code: "⚡", palette: "🎨", "shopping-cart": "🛒", zap: "📈", globe: "🌐", settings: "☁️",
}

const serviceColors: Record<string, string> = {
  code: "from-indigo-500 to-purple-500", palette: "from-pink-500 to-rose-500", "shopping-cart": "from-green-500 to-emerald-500",
  zap: "from-orange-500 to-amber-500", globe: "from-blue-500 to-cyan-500", settings: "from-slate-500 to-gray-500",
}

const productColors: Record<string, string> = {
  plugin: "from-blue-500 to-cyan-500", theme: "from-green-500 to-emerald-500", template: "from-violet-500 to-purple-500",
  mcp_server: "from-pink-500 to-rose-500", ai_agent: "from-orange-500 to-amber-500",
}

const productIcons: Record<string, string> = {
  plugin: "🔌", theme: "🎨", template: "⚛️", mcp_server: "🤖", ai_agent: "🧠",
}

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
  { name: "Free", planId: "free", price: "$0", period: "forever", description: "Perfect for getting started with WordPress to Next.js conversion", features: ["1 WordPress site conversion", "Basic Next.js template", "Community support", "Basic SEO setup"], cta: "Get Started", href: "/register", popular: false },
  { name: "Pro", planId: "pro", price: "$19", period: "month", description: "Convert 1 WordPress site to Next.js", features: ["1 WordPress site", "Live deployment", "Advanced Next.js template", "Priority email support", "Custom domain", "Analytics dashboard", "Auto content sync"], cta: "Start Pro", href: "/register?plan=pro", popular: true },
  { name: "Enterprise", planId: "enterprise", price: "$99", period: "month", description: "Convert 3 WordPress sites to Next.js", features: ["3 WordPress sites", "Live deployments", "Advanced Next.js templates", "Priority email support", "Custom domains", "Analytics dashboard", "Auto content sync", "White-label option"], cta: "Contact Sales", href: "/contact", popularity: false },
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
  { q: "How long does WordPress to Next.js migration take?", a: "Most conversions are completed within 24-72 hours depending on the size and complexity of your WordPress site." },
  { q: "Will my SEO rankings be preserved after migration?", a: "Absolutely! We preserve all URLs, meta tags, sitemaps, and SEO structure during migration to ensure your rankings remain intact." },
  { q: "Can I still manage my content in WordPress?", a: "Yes! We connect your WordPress admin to Next.js using WPGraphQL, allowing you to manage content while enjoying Next.js performance." },
  { q: "What happens to my WordPress plugins?", a: "We migrate plugin functionality to modern, faster Next.js alternatives. You get better performance without plugin vulnerabilities." },
  { q: "Do you offer ongoing support?", a: "Yes! We provide 24/7 support, regular maintenance, and security updates for all converted websites." },
  { q: "Which platforms do you deploy to?", a: "We deploy to Vercel, Netlify, or any hosting platform of your choice with free SSL and CDN." },
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
  const [isDemoStarted, setIsDemoStarted] = useState(false)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [gameScore, setGameScore] = useState(0)
  const [clicks, setClicks] = useState(0)
  const [highestClicks, setHighestClicks] = useState(0)
  const [isConverting, setIsConverting] = useState(false)
  const [conversionStep, setConversionStep] = useState(0)
  const [userPlan, setUserPlan] = useState<string | null>(null)
  const [isLoadingPlan, setIsLoadingPlan] = useState(true)
  const [homepageServices, setHomepageServices] = useState<any[]>([])
  const [homepageProducts, setHomepageProducts] = useState<any[]>([])

  useEffect(() => {
    fetchUserPlan()
    fetchHomepageData()
  }, [])

  const fetchHomepageData = async () => {
    try {
      const [servicesRes, productsRes] = await Promise.all([
        fetch('/api/public/services'),
        fetch('/api/products')
      ])
      const servicesData = await servicesRes.json()
      const productsData = await productsRes.json()
      setHomepageServices(servicesData)
      
      const typeMap: Record<string, string> = { plugin: 'plugin', theme: 'theme', template: 'template', mcp_server: 'mcp_server', ai_agent: 'ai_agent' }
      const seen = new Set<string>()
      const uniqueProducts = productsData.filter((p: any) => {
        const t = typeMap[p.type] || p.type
        if (seen.has(t)) return false
        seen.add(t)
        return true
      }).slice(0, 5)
      setHomepageProducts(uniqueProducts)
    } catch (e) {
      console.error('Error fetching homepage data:', e)
    }
  }

  const fetchUserPlan = async () => {
    try {
      const res = await fetch('/api/subscriptions')
      const data = await res.json()
      if (data.subscription?.plan) {
        setUserPlan(data.subscription.plan)
      }
    } catch (e) {
      console.error('Error fetching plan:', e)
    } finally {
      setIsLoadingPlan(false)
    }
  }

  useEffect(() => {
    const savedHighest = localStorage.getItem('highestClicks')
    if (savedHighest) {
      setHighestClicks(parseInt(savedHighest, 10))
    }
  }, [])

  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])

  const conversionSteps = [
    { text: '→ Installing WPCodingPress Plugin...', delay: 0 },
    { text: '→ Connecting to WordPress site...', delay: 0.3 },
    { text: '→ Fetching WordPress data...', delay: 0.6 },
    { text: '→ Converting 250 posts, 50 pages...', delay: 0.9 },
    { text: '→ Building Next.js components...', delay: 1.2 },
    { text: '→ Optimizing 450+ images...', delay: 1.5 },
    { text: '→ Deploying to edge network...', delay: 1.8 },
  ]

  useEffect(() => {
    const autoConvert = () => {
      setIsConverting(true)
      setConversionStep(0)
      let step = 0
      const interval = setInterval(() => {
        step++
        if (step >= conversionSteps.length) {
          clearInterval(interval)
          setTimeout(() => {
            setIsConverting(false)
            setConversionStep(0)
          }, 4000)
        } else {
          setConversionStep(step)
        }
      }, 350)
    }
    const timer = setTimeout(autoConvert, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Always running conversion steps animation (like ticker)
  useEffect(() => {
    let step = 0
    const tickerInterval = setInterval(() => {
      step = (step + 1) % conversionSteps.length
      setConversionStep(step)
    }, 800)
    return () => clearInterval(tickerInterval)
  }, [])

  const startConversion = () => {
    setIsConverting(true)
    setConversionStep(0)
    let step = 0
    const interval = setInterval(() => {
      step++
      if (step >= conversionSteps.length) {
        clearInterval(interval)
        setTimeout(() => {
          setIsConverting(false)
          setConversionStep(0)
        }, 3000)
      } else {
        setConversionStep(step)
      }
    }, 400)
  }

  const startGame = () => {
    setIsGameStarted(true)
    setGameScore(20)
    setClicks(0)
    const gameInterval = setInterval(() => {
      setGameScore(prev => {
        if (prev >= 100) {
          clearInterval(gameInterval)
          const finalClicks = clicks
          if (finalClicks > highestClicks) {
            setHighestClicks(finalClicks)
            localStorage.setItem('highestClicks', finalClicks.toString())
          }
          return 100
        }
        return prev + 3
      })
    }, 100)
  }

  const playGame = () => {
    if (gameScore < 100) {
      setGameScore(prev => Math.min(prev + 8, 100))
      setClicks(prev => prev + 1)
      if (clicks + 1 > highestClicks) {
        setHighestClicks(clicks + 1)
        localStorage.setItem('highestClicks', (clicks + 1).toString())
      }
    }
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-animate",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power2.out", delay: 0.1 }
      )

      gsap.fromTo(".float-element",
        { y: 0 },
        { y: -25, duration: 3, repeat: -1, yoyo: true, ease: "power1.inOut", stagger: 0.3 }
      )

      gsap.to(".float-element", {
        x: (i) => Math.sin(i * 1.5) * 40,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      })

      gsap.fromTo(".scroll-reveal",
        { opacity: 0, y: 100, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".scroll-reveal",
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      )

      gsap.utils.toArray('.parallax-section').forEach((section: any) => {
        gsap.to(section, {
          y: -50,
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        })
      })

      gsap.to(".hero-glow", {
        scale: 1.2,
        opacity: 0.8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      })

      gsap.fromTo(".game-particle",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, stagger: 0.1 }
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
      {/* SEO Metadata */}
      <Head>
        <title>WPCodingPress | WordPress to Next.js Migration & Web Development Services</title>
        <meta name="description" content="Transform your WordPress website to Next.js for lightning-fast performance, better SEO rankings, and enhanced security. Join 700+ happy clients with AI-powered migration." />
        <meta name="keywords" content="WordPress to Next.js, web development, SEO services, WooCommerce, React development, website migration, performance optimization" />
        <meta property="og:title" content="WPCodingPress | Professional WordPress to Next.js Migration" />
        <meta property="og:description" content="Lightning-fast, SEO-optimized websites that load in milliseconds. Convert automatically with our AI-powered platform." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://wpcodingpress.com" />
      </Head>

      {/* Hero Section - Light Purple Gradient with Centered Text */}
      <section 
        ref={heroRef} 
        className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-violet-50"
      >
        {/* Enhanced Animated Background */}
        <motion.div 
          className="absolute inset-0 overflow-hidden"
          style={{ opacity: heroOpacity }}
        >
          <motion.div 
            className="hero-glow absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-purple-400/50 to-violet-400/50 rounded-full blur-[120px]"
            animate={{
              scale: [1, 1.1, 1],
              x: [0, 20, 0],
              y: [0, 10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-indigo-400/40 to-purple-400/40 rounded-full blur-[100px]"
            animate={{
              scale: [1, 1.15, 1],
              x: [0, -25, 0],
              y: [0, -15, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </motion.div>

        {/* Enhanced Floating Background Elements */}
        <motion.div 
          className="absolute top-32 right-10 w-24 h-24 bg-purple-300/60 rounded-3xl float-element"
          animate={{
            y: [-25, 25],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-48 left-20 w-20 h-20 bg-violet-300/60 rounded-2xl float-element"
          animate={{
            y: [-25, 25],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3
          }}
        />
        <motion.div 
          className="absolute bottom-40 right-1/4 w-16 h-16 bg-pink-300/60 rounded-full float-element"
          animate={{
            y: [-25, 25],
            x: [0, 15],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6
          }}
        />
        <motion.div 
          className="absolute top-1/3 left-10 w-18 h-18 bg-indigo-300/60 rounded-xl float-element"
          animate={{
            y: [-25, 25],
            x: [0, -10],
          }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-20 w-14 h-14 bg-purple-400/60 rounded-lg float-element"
          animate={{
            y: [-25, 25],
            rotate: [0, 8, 0],
          }}
          transition={{
            duration: 3.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/3 w-10 h-10 bg-violet-400/50 rounded-full float-element"
          animate={{
            y: [-30, 30],
            x: [0, 20],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-10 w-8 h-8 bg-indigo-400/50 rounded-full float-element"
          animate={{
            y: [-20, 20],
            x: [0, -15],
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #8b5cf6 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }} />
        
        {/* Blur Circles */}
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-purple-300/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-1/4 w-[500px] h-[500px] bg-violet-300/40 rounded-full blur-[120px]" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-purple-400/30 rounded-full blur-[80px]" />
        <div className="absolute bottom-20 left-1/4 w-[500px] h-[500px] bg-violet-400/30 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-10 w-[200px] h-[200px] bg-indigo-400/25 rounded-full blur-[60px]" />
        <div className="absolute bottom-1/3 right-10 w-[250px] h-[250px] bg-pink-400/25 rounded-full blur-[70px]" />

        {/* Additional Floating Elements */}
        <motion.div className="absolute top-40 right-1/3 w-12 h-12 bg-blue-400/40 rounded-2xl" animate={{ y: [-15, 15], rotate: [0, 10] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute top-1/3 right-20 w-8 h-8 bg-amber-400/40 rounded-full" animate={{ y: [-20, 20], x: [0, 10] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} />
        <motion.div className="absolute bottom-1/2 left-20 w-10 h-10 bg-cyan-400/40 rounded-xl" animate={{ y: [-18, 18], rotate: [0, -8] }} transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} />
        <motion.div className="absolute top-2/3 left-1/4 w-14 h-14 bg-orange-400/30 rounded-lg" animate={{ y: [-22, 22], x: [0, -12] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }} />
        <motion.div className="absolute bottom-20 right-1/3 w-6 h-6 bg-teal-400/40 rounded-full" animate={{ y: [-12, 12], x: [0, 8] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} />
        <motion.div className="absolute top-1/4 left-1/3 w-16 h-16 bg-rose-400/30 rounded-2xl" animate={{ y: [-25, 25], rotate: [0, 12] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
        <motion.div className="absolute top-60 left-1/2 w-7 h-7 bg-emerald-400/40 rounded-full" animate={{ y: [-14, 14] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} />
        <motion.div className="absolute bottom-1/4 right-1/2 w-9 h-9 bg-sky-400/40 rounded-xl" animate={{ y: [-16, 16], rotate: [0, -6] }} transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          {/* Hero Content - Centered */}
          <div className="max-w-4xl mx-auto text-center">
            <div className="hero-animate inline-flex items-center gap-2 px-5 py-2.5 bg-purple-100 border border-purple-200 rounded-full text-purple-700 text-sm font-semibold mb-6 sm:mb-8 shadow-sm">
              <Sparkles className="w-4 h-4" />
              AI-Powered Web Development Agency
            </div>

            <h1 className="hero-animate text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 bg-clip-text text-transparent">
                WordPress to Next.js
              </span>
            </h1>

            <p className="hero-animate text-base sm:text-lg md:text-xl text-slate-600 mb-8 sm:mb-10 max-w-xl sm:max-w-2xl mx-auto leading-relaxed">
              Lightning-fast, SEO-optimized websites that load in milliseconds. 
              Convert automatically with our AI-powered platform.
            </p>

            <div className="hero-animate flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
              <Link href="/register">
                <Button size="xl" className="w-full sm:w-auto min-w-[220px] bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 hover:from-purple-700 hover:via-violet-700 hover:to-purple-700 text-white font-bold px-8 py-4 shadow-xl shadow-purple-500/30 text-base sm:text-lg">
                  <Zap className="mr-2 w-5 h-5" />
                  Convert Your Site Free
                </Button>
              </Link>
              <Link href="/order">
                <Button size="xl" variant="outline" className="w-full sm:w-auto min-w-[220px] border-2 border-violet-300 text-violet-700 hover:bg-violet-50 hover:border-violet-400 px-8 py-4 font-semibold text-base sm:text-lg">
                  <Globe className="mr-2 w-5 h-5" />
                  Order Now
                </Button>
              </Link>
            </div>

            <div className="hero-animate flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-slate-500 mb-16">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>100+ Sites Migrated</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>1-Minute Average</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>99 SEO Score</span>
              </div>
            </div>
          </div>

          {/* Terminal Visual - User Dashboard Flow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="relative max-w-4xl mx-auto mb-16"
          >
            {/* Terminal Window */}
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-purple-200 via-violet-200 to-purple-200 rounded-2xl blur-xl opacity-50" />
              <div className="relative bg-white border-2 border-purple-200 rounded-2xl shadow-2xl overflow-hidden">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 to-violet-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-white/80" />
                    <div className="w-3 h-3 rounded-full bg-white/80" />
                    <div className="w-3 h-3 rounded-full bg-white/80" />
                  </div>
                  <span className="text-white text-sm font-medium">WPCodingPress Dashboard - Add & Convert Site</span>
                  <div className="w-20" />
                </div>

                {/* Terminal Content - Dashboard Flow Animation */}
                <div className="p-4 sm:p-6">
                  {/* Step 1: Install Plugin */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mb-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                      <span className="text-sm font-semibold text-slate-700">Install WPCodingPress Plugin</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-slate-800">WPCodingPress Plugin</span>
                          <span className="block text-xs text-green-600">✓ Installed & Active</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Step 2: My Sites */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    className="mb-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                      <span className="text-sm font-semibold text-slate-700">User Dashboard → My Sites</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3">
                      <Globe className="w-8 h-8 text-violet-500" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-800">mywordpress.com</span>
                          <span className="text-xs text-slate-500">WordPress</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                          <div className="bg-green-500 h-2 rounded-full w-[100%]" />
                        </div>
                      </div>
                      <Button size="sm" className="bg-green-500 text-white text-xs cursor-default">Connected</Button>
                    </div>
                  </motion.div>

                  {/* Step 3: Convert Button */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 }}
                    className="mb-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                      <span className="text-sm font-semibold text-slate-700">Click Convert</span>
                    </div>
                    <div className="flex justify-center">
                      <motion.button
                        whileHover={!isConverting ? { scale: 1.05 } : {}}
                        whileTap={!isConverting ? { scale: 0.95 } : {}}
                        onClick={startConversion}
                        disabled={isConverting}
                        className={`bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-purple-500/30 flex items-center gap-2 ${isConverting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Zap className="w-5 h-5" />
                        {isConverting ? 'CONVERTING...' : 'CONVERT TO NEXT.JS'}
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Step 4: Progress Animation - only show during conversion */}
                  {isConverting && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mb-4"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                        <span className="text-sm font-semibold text-slate-700">Converting...</span>
                      </div>
                      <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs space-y-1">
                        {conversionSteps.map((step, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: conversionStep >= index ? 1 : 0.3 }}
                            transition={{ delay: step.delay }}
                            className={conversionStep > index ? "text-green-400" : conversionStep === index ? "text-purple-400 animate-pulse" : "text-slate-500"}
                          >
                            {step.text}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 5: Success - only show during conversion */}
                  {isConverting && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-green-600">🎉 Site Converted Successfully!</div>
                          <div className="text-xs text-green-500">Live at: mywordpress-next.vercel.app • 180ms • 99 SEO</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
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

      {/* Interactive Demo Section - Business Focused */}
      <section className="py-24 px-6 bg-gradient-to-br from-purple-50 via-white to-violet-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 px-4 py-1.5 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              See It In Action
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Watch Your WordPress Transform to <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Next.js</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto mb-8">
              Our AI-powered converter automatically migrates your entire WordPress site including posts, pages, 
              WooCommerce products, and media to a blazing-fast Next.js application.
            </p>
          </div>

          {/* Advanced Interactive Game - WordPress vs Next.js Battle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-700 overflow-hidden">
              {/* Game Background */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)' }} />
                <div className="absolute bottom-0 right-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(34, 197, 94, 0.3) 0%, transparent 50%)' }} />
              </div>
              
              <div className="relative z-10">
                {/* Game Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 md:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-3xl sm:text-4xl">⚔️</span>
                    <div>
                      <h3 className="text-white font-bold text-base sm:text-xl">WP vs Next.js Speed Challenge</h3>
                      <p className="text-slate-400 text-xs sm:text-sm">Click the buttons to race!</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-slate-400">🏆 Highest Clicks</p>
                      <p className="text-white font-bold text-lg">{highestClicks}</p>
                    </div>
                    <Button 
                      onClick={startGame}
                      className="bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold text-xs sm:text-sm px-3 sm:px-4 py-2"
                    >
                      {isGameStarted ? 'Restart' : 'Start Race'}
                    </Button>
                  </div>
                </div>

                {/* Game Arena */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* WordPress Lane */}
                  <div className="bg-slate-800/50 rounded-xl md:rounded-2xl p-4 border border-slate-700">
                    <div className="flex items-center gap-2 mb-3 md:mb-4">
                      <span className="text-2xl md:text-3xl">📝</span>
                      <span className="text-white font-bold text-sm md:text-base">WordPress</span>
                    </div>
                    <div className="relative h-24 md:h-32 bg-slate-700 rounded-xl overflow-hidden">
                      <motion.div 
                        className="absolute bottom-0 left-0 h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                        animate={{ width: isGameStarted ? `${gameScore}%` : '20%' }}
                        transition={{ duration: 0.5 }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xl md:text-2xl">{isGameStarted ? gameScore : 20}%</span>
                      </div>
                    </div>
                    <p className="text-slate-400 text-xs mt-2 hidden md:block">Loading: 3.2s | PageSpeed: 52</p>
                    <p className="text-slate-400 text-xs mt-2 md:hidden">3.2s | 52</p>
                  </div>

                  {/* Next.js Lane */}
                  <div className="bg-slate-800/50 rounded-xl md:rounded-2xl p-4 border border-slate-700">
                    <div className="flex items-center gap-2 mb-3 md:mb-4">
                      <span className="text-2xl md:text-3xl">🚀</span>
                      <span className="text-white font-bold text-sm md:text-base">Next.js</span>
                    </div>
                    <div className="relative h-24 md:h-32 bg-slate-700 rounded-xl overflow-hidden">
                      <motion.div 
                        className="absolute bottom-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        animate={{ width: isGameStarted ? `${gameScore + 20}%` : '20%' }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xl md:text-2xl">{isGameStarted ? Math.min(gameScore + 20, 100) : 20}%</span>
                      </div>
                    </div>
                    <p className="text-slate-400 text-xs mt-2 hidden md:block">Loading: 180ms | PageSpeed: 98</p>
                    <p className="text-slate-400 text-xs mt-2 md:hidden">180ms | 98</p>
                  </div>
                </div>

                {/* Game Controls */}
                <div className="mt-4 md:mt-6">
                  <p className="text-slate-400 text-xs sm:text-sm mb-3 text-center">Click rapidly to power the Next.js conversion!</p>
                  <div className="flex justify-center gap-3">
                    {isGameStarted ? (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={playGame}
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 text-base sm:text-lg"
                      >
                        ⚡ Click ({clicks})
                      </motion.button>
                    ) : (
                      <div className="text-center p-4">
                        <Terminal className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500 mx-auto mb-2" />
                        <p className="text-slate-400 text-xs sm:text-sm">Click "Start Race" to begin!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Winner Announcement */}
                {gameScore >= 100 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-xl text-center"
                  >
                    <p className="text-2xl">🏆 Next.js wins with <span className="text-green-400 font-bold">10x faster</span> performance!</p>
                    <p className="text-slate-400 text-sm mt-2">That's the power of WordPress to Next.js migration</p>
                  </motion.div>
                )}
              </div>
</div>
            </motion.div>
        </div>
      </section>

      {/* Pricing Section - Below Game */}
      <section className="py-24 px-6 bg-gradient-to-br from-purple-50 via-white to-violet-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 px-4 py-1.5 text-sm font-medium mb-6">
              Pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Choose Your <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Plan</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Start free, upgrade when you're ready. No hidden fees.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                className={`relative bg-white border-2 rounded-2xl p-8 ${
                  plan.popular ? 'border-purple-500 shadow-xl' : 'border-slate-200 hover:border-slate-300'
                }`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full">Most Popular</span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className={`inline-flex p-3 rounded-full mb-4 ${
                    plan.planId === 'pro' ? 'bg-purple-100' :
                    plan.planId === 'enterprise' ? 'bg-amber-100' :
                    'bg-slate-100'
                  }`}>
                    {plan.planId === 'pro' ? <ZapIcon className="h-6 w-6 text-purple-600" /> :
                     plan.planId === 'enterprise' ? <StarIcon className="h-6 w-6 text-amber-600" /> :
                     <Rocket className="h-6 w-6 text-slate-600" />}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{(plan as any).description}</p>
                </div>

                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500">/{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-slate-600">
                      <div className={`p-1 rounded-full ${
                        plan.planId === 'pro' ? 'bg-purple-100' :
                        plan.planId === 'enterprise' ? 'bg-amber-100' :
                        'bg-slate-100'
                      }`}>
                        <CheckCircle2 className={`h-3 w-3 ${
                          plan.planId === 'pro' ? 'text-purple-600' :
                          plan.planId === 'enterprise' ? 'text-amber-600' :
                          'text-slate-600'
                        }`} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                {(() => {
                  const isCurrentPlan = userPlan === plan.planId || (!userPlan && plan.planId === 'free')
                  return isCurrentPlan ? (
                    <Button className={`w-full ${plan.popular ? 'bg-purple-600 cursor-default' : 'border-2 border-slate-200 text-slate-700'}`} disabled>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Current Plan
                    </Button>
                  ) : (
                    <Link href={plan.href} className="block">
                      <Button className={`w-full ${plan.popular ? 'bg-purple-600 hover:bg-purple-700' : plan.price === '$99' ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                        {plan.price === '$0' ? 'Get Started' : 'Subscribe Now'}
                      </Button>
                    </Link>
                  )
                })()}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison Table */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 px-4 py-1.5 text-sm font-medium mb-6">
              Compare Plans
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              See What's <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">Included</span>
            </h2>
            <p className="text-slate-600">Choose the plan that fits your needs. All plans include free SSL.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-200 overflow-hidden border border-indigo-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                    <th className="text-left py-5 px-6 text-white font-bold text-lg">Feature</th>
                    <th className="text-center py-5 px-6 text-white font-bold text-lg bg-white/10">Free</th>
                    <th className="text-center py-5 px-6 text-white font-bold text-lg bg-white/20">Pro</th>
                    <th className="text-center py-5 px-6 text-white font-bold text-lg bg-white/10">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "WordPress Site Conversions", free: "1", pro: "1", enterprise: "3" },
                    { feature: "Live Deployment", free: false, pro: true, enterprise: true },
                    { feature: "Custom Domain", free: false, pro: true, enterprise: true },
                    { feature: "Analytics Dashboard", free: false, pro: true, enterprise: true },
                    { feature: "Auto Content Sync", free: false, pro: true, enterprise: true },
                    { feature: "Priority Support", free: false, pro: true, enterprise: true },
                    { feature: "White-label Option", free: false, pro: false, enterprise: true },
                  ].map((row, i) => (
                    <tr key={i} className={`border-b border-indigo-50 ${i % 2 === 0 ? 'bg-slate-50/50' : ''}`}>
                      <td className="py-4 px-6 text-slate-700 font-medium">{row.feature}</td>
                      <td className="text-center py-4 px-6">
                        {typeof row.free === 'boolean' ? (
                          row.free ? <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" /> : <X className="w-6 h-6 text-slate-300 mx-auto" />
                        ) : <span className="text-indigo-600 font-bold">{row.free}</span>}
                      </td>
                      <td className="text-center py-4 px-6 bg-indigo-50/30">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" /> : <X className="w-6 h-6 text-slate-300 mx-auto" />
                        ) : <span className="text-indigo-600 font-bold">{row.pro}</span>}
                      </td>
                      <td className="text-center py-4 px-6">
                        {typeof row.enterprise === 'boolean' ? (
                          row.enterprise ? <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" /> : <X className="w-6 h-6 text-slate-300 mx-auto" />
                        ) : <span className="text-indigo-600 font-bold">{row.enterprise}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            {homepageServices.length > 0 ? homepageServices.map((service, i) => {
              const colorClass = serviceColors[service.icon] || "from-indigo-500 to-purple-500"
              const iconEmoji = serviceIcons[service.icon] || "⚡"
              return (
              <motion.div
                key={i}
                className="group p-8 bg-white border border-slate-200 rounded-2xl hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100 transition-all hover:-translate-y-1"
                whileHover={{ y: -8 }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform text-3xl`}>
                  {iconEmoji}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">
                  {service.name}
                </h3>
                <p className="text-slate-600 mb-6">{service.description?.substring(0, 60)}</p>
                <Link href={`/services/${service.slug}`}>
                  <Button variant="ghost" className="p-0 h-auto text-purple-600 hover:text-purple-700 font-medium">
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
              )
            }) : (
              <motion.div
                key="loading"
                className="col-span-full text-center py-12 text-slate-500"
              >
                Loading services...
              </motion.div>
            )}
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

      {/* Products Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200 px-4 py-1.5 text-sm font-medium mb-6">
              Premium Products
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Powerful <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Tools</span> for Your Projects
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Premium WordPress plugins, Next.js templates, MCP servers, and AI agents to supercharge your development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {homepageProducts.length > 0 ? homepageProducts.map((product: any, i: number) => {
              const typeMap: Record<string, { name: string, href: string }> = {
                plugin: { name: "WordPress Plugins", href: "/products/plugins" },
                theme: { name: "WordPress Themes", href: "/products/themes" },
                template: { name: "Next.js Templates", href: "/products/templates" },
                mcp_server: { name: "MCP Servers", href: "/products/mcp-servers" },
                ai_agent: { name: "AI Agents", href: "/products/ai-agents" },
              }
              const productInfo = typeMap[product.type] || { name: product.name || product.type, href: "/products" }
              const colorClass = productColors[product.type] || "from-indigo-500 to-purple-500"
              const iconEmoji = productIcons[product.type] || "📦"
              return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6 hover:border-cyan-300 hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                  {iconEmoji}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors">
                  {productInfo.name}
                </h3>
                <p className="text-slate-600 text-sm mb-4">Premium {productInfo.name.toLowerCase()} for your projects</p>
                <Link href={productInfo.href}>
                  <Button variant="ghost" className="p-0 h-auto text-cyan-600 hover:text-cyan-700 font-medium text-sm">
                    Learn More
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
              )
            }) : (
              <div className="col-span-full text-center py-12 text-slate-500">
                Loading products...
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="outline" className="border-2 border-cyan-200 text-cyan-700 hover:bg-cyan-50 font-medium px-8">
                View All Products
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
            <Link href="/order">
              <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100 text-lg px-10 py-6 font-semibold shadow-xl">
                Order Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
