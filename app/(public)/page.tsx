"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  ArrowRight, Check, Star, Zap, Shield, Code, Palette,
  ShoppingCart, Search, Layers, Cloud, Play, Menu, X,
  Bot, TrendingUp, Users, Globe, Sparkles, Layout, Server,
  Lock, Gauge, Headphones, ArrowRightLeft, Eye, ExternalLink,
  ChevronDown, FileCode, Database, Server as ServerIcon, Globe2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FloatingButtons } from "@/components/floating-buttons"

gsap.registerPlugin(ScrollTrigger)

const portfolioImages = [
  "HomePicksDaily- A Woocommerce Based Dropshipping E-Commerce Website Front Page.jpeg",
  "tripmonarch.png",
  "RankUpper.png",
  "Pro Consultant.png",
  "masjidpress.com.png",
  "ecomgianrtz.png",
]

const portfolioItems = [
  { id: 1, title: "HomePicks Daily", category: "E-Commerce", client: "Beth Moran", liveUrl: "https://homepicksdaily.com", image: "/portfolio/HomePicksDaily- A Woocommerce Based Dropshipping E-Commerce Website Front Page.jpeg" },
  { id: 2, title: "Trip Monarch", category: "Travel", client: "Trip Monarch", liveUrl: "https://tripmonarch.com", image: "/portfolio/tripmonarch.png" },
  { id: 3, title: "RankUpper", category: "SEO Agency", client: "RankUpper", liveUrl: "https://rankupper.io", image: "/portfolio/RankUpper.png" },
  { id: 4, title: "Pro Consultant", category: "Consulting", client: "Pro Consultant UK", liveUrl: "https://proconsultant.co.uk", image: "/portfolio/Pro Consultant.png" },
  { id: 5, title: "Masjid Press", category: "Non-Profit", client: "Masjid Press", liveUrl: "https://masjidpress.com", image: "/portfolio/masjidpress.com.png" },
  { id: 6, title: "EcomGiantz", category: "E-Commerce", client: "EcomGiantz", liveUrl: "https://ecomgiantz.com", image: "/portfolio/ecomgianrtz.png" },
]

const services = [
  {
    icon: ArrowRightLeft,
    title: "WordPress to Next.js",
    description: "Lightning-fast conversion with auto-sync. Most popular service.",
    color: "from-indigo-500 to-violet-500",
    href: "/services/wordpress-to-nextjs",
  },
  {
    icon: Palette,
    title: "Elementor Pro Design",
    description: "Stunning custom designs that convert visitors into customers.",
    color: "from-pink-500 to-rose-500",
    href: "/services/elementor-pro-design",
  },
  {
    icon: ShoppingCart,
    title: "WooCommerce Stores",
    description: "Full-featured e-commerce solutions with secure payments.",
    color: "from-green-500 to-emerald-500",
    href: "/services/woocommerce-stores",
  },
  {
    icon: Search,
    title: "SEO & Marketing",
    description: "Dominate search rankings with proven SEO strategies.",
    color: "from-orange-500 to-amber-500",
    href: "/services/seo-marketing",
  },
]

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out",
    features: [
      "1 WordPress Site Conversion",
      "Basic Next.js Template",
      "Community Support",
      "Basic SEO Setup",
      "5GB Bandwidth",
    ],
    notIncluded: ["Custom Domain", "Analytics Dashboard", "Priority Support"],
    cta: "Get Started",
    href: "/register",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For growing businesses",
    features: [
      "5 WordPress Site Conversions",
      "Advanced Next.js Templates",
      "Priority Support",
      "Custom Domain",
      "Analytics Dashboard",
      "Auto Content Sync",
      "100GB Bandwidth",
    ],
    notIncluded: ["White-label Solution", "API Access"],
    cta: "Start Pro Trial",
    href: "/register?plan=pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For agencies & teams",
    features: [
      "Unlimited Conversions",
      "White-label Solution",
      "24/7 Dedicated Support",
      "Unlimited Bandwidth",
      "Custom Development",
      "API Access",
      "Advanced Caching",
      "Custom Integrations",
    ],
    notIncluded: [],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
  },
]

const stats = [
  { value: "500+", label: "Happy Clients" },
  { value: "5+", label: "Years Experience" },
  { value: "4.9", label: "Client Rating" },
  { value: "1000+", label: "Projects Done" },
]

const processSteps = [
  { number: "01", title: "Connect Your Site", description: "Link your WordPress website" },
  { number: "02", title: "AI Analysis", description: "Smart content analysis" },
  { number: "03", title: "Smart Conversion", description: "Automated migration" },
  { number: "04", title: "Go Live", description: "Deploy to fast CDN" },
]

const whyChooseUs = [
  { icon: Gauge, title: "10x Faster", desc: "Sub-300ms load times" },
  { icon: Shield, title: "More Secure", desc: "No plugin vulnerabilities" },
  { icon: Search, title: "SEO Preserved", desc: "Keep your rankings" },
  { icon: ArrowRightLeft, title: "Auto Sync", desc: "Real-time updates" },
  { icon: Bot, title: "AI-Powered", desc: "Smart automation" },
  { icon: Headphones, title: "24/7 Support", desc: "Expert help anytime" },
]

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedPortfolio, setSelectedPortfolio] = useState<typeof portfolioItems[0] | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-animate",
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out", delay: 0.3 }
      )
      
      gsap.fromTo(".stat-card",
        { opacity: 0, y: 40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.4)", delay: 0.8 }
      )
    }, containerRef)
    
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-screen bg-slate-900">
      <FloatingButtons />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hero-animate inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Web Development
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hero-animate text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Transform Your
              <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                WordPress to Next.js
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="hero-animate text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto"
            >
              Lightning-fast, SEO-optimized websites that load in milliseconds. 
              Convert your WordPress site automatically with our AI-powered platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="hero-animate flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-lg px-10 py-6 h-auto font-bold shadow-lg shadow-indigo-500/25">
                  Start Free Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/services/wordpress-to-nextjs">
                <Button size="lg" variant="outline" className="border-2 border-slate-600 text-white hover:bg-slate-800 text-lg px-10 py-6 h-auto">
                  Learn More
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="hero-animate flex items-center gap-6 justify-center text-sm text-slate-400"
            >
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span>Free forever plan</span>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="stat-card text-center p-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400">{stat.label}</div>
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

      {/* Services Section */}
      <section className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">Services</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              From WordPress migrations to custom web applications, we deliver high-performance solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <Link key={i} href={service.href}>
                <motion.div
                  className="group p-8 bg-slate-800/50 border border-slate-700/50 rounded-2xl hover:border-indigo-500/50 transition-all hover:-translate-y-1 h-full"
                  whileHover={{ y: -8 }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-400">{service.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button variant="outline" className="border-indigo-500 text-indigo-400 hover:bg-indigo-500/10">
                View All Services
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-slate-400">Four simple steps to your lightning-fast website</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                className="relative text-center p-8 bg-slate-800/50 border border-slate-700/50 rounded-2xl"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-5xl font-black text-indigo-500/20 mb-4">{step.number}</div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400">{step.description}</p>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-indigo-500/50" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Featured <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Projects</span>
              </h2>
              <p className="text-slate-400">Real websites we've transformed for our clients</p>
            </div>
            <Link href="/portfolio" className="mt-6 md:mt-0">
              <Button variant="outline" className="border-pink-500 text-pink-400 hover:bg-pink-500/10">
                View All Projects
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item, i) => (
              <motion.div
                key={item.id}
                className="group relative bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden cursor-pointer hover:border-pink-500/50 transition-all"
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setSelectedPortfolio(item)}
              >
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <Badge className="bg-indigo-500/20 text-indigo-300 mb-3">{item.category}</Badge>
                  <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-slate-400 text-sm">Client: {item.client}</p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/80 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
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
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPortfolio(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={selectedPortfolio.image} 
                  alt={selectedPortfolio.title}
                  className="w-full h-full object-cover"
                />
                <button
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-700/80 flex items-center justify-center hover:bg-slate-600"
                  onClick={() => setSelectedPortfolio(null)}
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="p-8">
                <Badge className="bg-indigo-500/20 text-indigo-300 mb-4">{selectedPortfolio.category}</Badge>
                <h3 className="text-3xl font-bold text-white mb-2">{selectedPortfolio.title}</h3>
                <p className="text-slate-400 mb-6">Client: {selectedPortfolio.client}</p>
                <div className="flex gap-4">
                  {selectedPortfolio.liveUrl && (
                    <a href={selectedPortfolio.liveUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="bg-gradient-to-r from-indigo-500 to-purple-500">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Live Site
                      </Button>
                    </a>
                  )}
                  <Button variant="outline" onClick={() => setSelectedPortfolio(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pricing Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Transparent</span> Pricing
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Start free, upgrade when you're ready. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                className={`relative bg-slate-800 border rounded-2xl p-8 ${
                  plan.popular ? 'border-indigo-500 shadow-lg shadow-indigo-500/20 md:-mt-4 md:mb-[-16px]' : 'border-slate-700'
                }`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 shadow-lg">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400">{plan.period}</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-slate-300">
                      <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-slate-500">
                      <svg className="w-5 h-5 text-slate-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link href={plan.href} className="block">
                  <Button className={`w-full ${plan.popular ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600' : 'bg-slate-700 hover:bg-slate-600'}`}>
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Choose Us</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={i}
                className="text-center p-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-indigo-400" />
                </div>
                <h3 className="font-bold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">Transform</span> Your Website?
          </h2>
          <p className="text-xl text-slate-400 mb-10">
            Join 500+ happy clients who switched to lightning-fast Next.js.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-lg px-12 py-6 h-auto font-bold shadow-xl">
                Start Free Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-2 border-slate-600 text-white hover:bg-slate-800 text-lg px-12 py-6 h-auto">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-16 border-t border-slate-800">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">
                  <span className="text-white">WPCoding</span>
                  <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">Press</span>
                </span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                Your trusted partner for WordPress to Next.js migrations. Fast, secure, and SEO-optimized websites.
              </p>
              <div className="flex gap-4">
                {["twitter", "github", "linkedin"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-indigo-500 transition-colors"
                  >
                    <span className="text-sm capitalize">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Services</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/services/wordpress-to-nextjs" className="hover:text-indigo-400 transition-colors">WordPress to Next.js</Link></li>
                <li><Link href="/services/elementor-pro-design" className="hover:text-indigo-400 transition-colors">Elementor Design</Link></li>
                <li><Link href="/services/woocommerce-stores" className="hover:text-indigo-400 transition-colors">WooCommerce</Link></li>
                <li><Link href="/services/seo-marketing" className="hover:text-indigo-400 transition-colors">SEO Services</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
                <li><Link href="/portfolio" className="hover:text-indigo-400 transition-colors">Portfolio</Link></li>
                <li><Link href="/contact" className="hover:text-indigo-400 transition-colors">Contact</Link></li>
                <li><Link href="/pricing" className="hover:text-indigo-400 transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-indigo-400 transition-colors">Cookie Policy</Link></li>
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
