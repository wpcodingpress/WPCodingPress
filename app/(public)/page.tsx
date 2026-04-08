"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { 
  ArrowRight, 
  Code2, 
  Palette,
  ShoppingCart, 
  Zap, 
  Sparkles,
  CheckCircle2,
  Star,
  Users,
  Clock,
  TrendingUp,
  Monitor,
  Server,
  Shield,
  Rocket,
  Globe,
  Search,
  Megaphone,
  Database,
  Repeat,
  Bot,
  Layers,
  Gauge,
  HeadphonesIcon,
  Menu,
  X,
  ChevronDown,
  Play,
  Quote,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  UserCheck,
  Heart,
  
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const stats = [
  { icon: Users, value: "500+", label: "Happy Clients", color: "text-blue-400" },
  { icon: Clock, value: "5+", label: "Years Experience", color: "text-purple-400" },
  { icon: Star, value: "4.9", label: "Client Rating", color: "text-yellow-400" },
  { icon: TrendingUp, value: "1000+", label: "Projects Delivered", color: "text-green-400" }
]

const services = [
  {
    icon: Code2,
    title: "Headless WordPress to Next.js",
    description: "Automate your WordPress to modern Next.js conversion. Build lightning-fast news portals, blogs, and portfolios that load in milliseconds.",
    features: ["Auto Content Sync", "SEO Optimized", "Lightning Fast", "Real-time Updates", "API Ready", "Server Side Rendered"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Palette,
    title: "Elementor Pro Design",
    description: "Stunning, conversion-focused designs using Elementor page builder. Pixel-perfect templates tailored to your brand identity.",
    features: ["Custom Design", "Mobile Responsive", "WooCommerce Ready", "Fast Loading", "Animations", "Pixel Perfect"],
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: ShoppingCart,
    title: "WooCommerce Stores",
    description: "Full-featured e-commerce solutions with seamless payment integration and inventory management.",
    features: ["Secure Payments", "Inventory System", "Order Tracking", "Multi-vendor Support", "Coupons", "Shipping"],
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Megaphone,
    title: "SEO & Digital Marketing",
    description: "Advanced SEO strategies and digital marketing to grow your online presence and drive conversions.",
    features: ["Technical SEO", "Content Strategy", "Analytics Setup", "Growth Hacking", "Link Building", "Rankings"],
    color: "from-orange-500 to-yellow-500"
  }
]

const subscriptionPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for testing and small projects",
    features: [
      "1 WordPress Site Conversion",
      "Basic Next.js Template",
      "Community Support",
      "5GB Bandwidth",
      "Basic SEO"
    ],
    color: "from-slate-600 to-slate-700",
    borderColor: "border-slate-500",
    cta: "Start Free"
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "Ideal for growing businesses and agencies",
    features: [
      "5 WordPress Site Conversions",
      "Advanced Next.js Templates",
      "Priority Support",
      "100GB Bandwidth",
      "Custom Domain",
      "Analytics Dashboard"
    ],
    color: "from-blue-600 to-purple-600",
    borderColor: "border-blue-500",
    popular: true,
    cta: "Start Pro"
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For agencies and high-volume needs",
    features: [
      "Unlimited Conversions",
      "White-label Solution",
      "24/7 Dedicated Support",
      "Unlimited Bandwidth",
      "Custom Development",
      "API Access"
    ],
    color: "from-amber-600 to-orange-600",
    borderColor: "border-amber-500",
    cta: "Contact Sales"
  }
]

const whyChooseUs = [
  { icon: Rocket, title: "Lightning Fast", desc: "Next.js powered sites load in milliseconds, not seconds" },
  { icon: Shield, title: "Secure & Safe", desc: "Enterprise-grade security with best practices" },
  { icon: Gauge, title: "SEO Optimized", desc: "Built-in SEO tools for better Google rankings" },
  { icon: Repeat, title: "Auto Sync", desc: "Real-time content sync from WordPress" },
  { icon: Bot, title: "AI-Powered", desc: "Smart automation for repetitive tasks" },
  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Round-the-clock expert assistance" }
]

const processSteps = [
  { number: "01", title: "Consultation", desc: "We discuss your requirements and goals" },
  { number: "02", title: "Strategy", desc: "Create a detailed project roadmap" },
  { number: "03", title: "Development", desc: "Build your solution with quality code" },
  { number: "04", title: "Testing", desc: "Rigorous testing for perfection" },
  { number: "05", title: "Launch", desc: "Deploy and monitor your project" },
  { number: "06", title: "Support", desc: "Ongoing maintenance and improvements" }
]

const portfolioItems = [
  { title: "HomePicks Daily", category: "E-Commerce", icon: ShoppingCart },
  { title: "Trip Monarch", category: "Travel Portal", icon: Globe },
  { title: "RankUpper", category: "SEO Agency", icon: TrendingUp },
  { title: "Pro Consultant", category: "Consulting", icon: Briefcase },
  { title: "Masjid Press", category: "Non-Profit", icon: Heart },
  { title: "Virtual Assistant", category: "Services", icon: UserCheck }
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechStart",
    content: "WPCodingPress transformed our WordPress site to Next.js. Our load times went from 3s to 300ms! Incredible work.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Founder, EcomHub",
    content: "Our WooCommerce store redesign increased sales by 40%. The team understood our vision perfectly.",
    rating: 5
  },
  {
    name: "Emma Williams",
    role: "Marketing Director",
    content: "Best investment we made. The SEO improvements helped us rank #1 for our main keywords within 3 months.",
    rating: 5
  }
]

const faqs = [
  { q: "How long does a typical project take?", a: "Most projects are completed within 2-4 weeks depending on complexity. We'll provide a detailed timeline during consultation." },
  { q: "Do you offer ongoing support?", a: "Yes! We offer monthly maintenance packages starting at $99/month to keep your site secure and updated." },
  { q: "Can I migrate my existing content?", a: "Absolutely. We handle all content migration from any platform to your new site." },
  { q: "What's included in SEO package?", a: "Our SEO package includes technical audit, on-page optimization, schema markup,.speed improvements, and analytics setup." },
  { q: "Do you offer refunds?", a: "We offer a 7-day money-back guarantee if you're not satisfied with our work." },
  { q: "How do I get started?", a: "Simply click 'Start Your Project' and fill out our consultation form. We'll get back to you within 24 hours." }
]

function FadeIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  )
}

export default function HomePage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center overflow-hidden">
        <motion.div style={{ y, opacity }} className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80"
            alt="Tech Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/95 via-purple-950/90 to-slate-950/95" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </motion.div>
        
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-pink-500/20 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '3s' }} />
        
        <div className="container mx-auto px-4 relative z-10 py-20">
          <motion.div 
            className="max-w-5xl mx-auto text-center"
            initial="initial"
            animate="animate"
          >
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-sm text-blue-300 backdrop-blur-sm">
                <Sparkles className="h-5 w-5" />
                AI-Powered Web Development Agency
              </span>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-white">Transform Your</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                WordPress to Next.js
              </span>
              <br />
              <span className="text-white">Automatically</span>
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Automate your headless WordPress conversion with our cutting-edge SaaS platform. 
              Build lightning-fast news portals, blogs, and portfolios that load in milliseconds, not seconds.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/pricing">
                <Button size="lg" className="w-full sm:w-auto text-lg font-semibold px-10 py-7 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/25">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-10 py-7 bg-white/10 border-white/20 hover:bg-white/20">
                  View Our Work
                  <Play className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Hero Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-4xl md:text-5xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="h-8 w-8 text-white/50" />
        </motion.div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-12 bg-gradient-to-r from-indigo-950/50 to-purple-950/50 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60">
            {["WordPress", "Elementor", "WooCommerce", "Next.js", "React", "TypeScript"].map((tech, i) => (
              <span key={i} className="text-xl md:text-2xl font-bold text-slate-500">{tech}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950" />
        
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">Our Services</Badge>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Everything You Need to <span className="gradient-text">Succeed Online</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                From WordPress to Next.js conversion, from design to marketing - we provide end-to-end web solutions 
                that help your business grow.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <FadeIn key={service.title} delay={index * 0.1}>
                <Card className="h-full bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 group overflow-hidden relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <CardContent className="p-8 relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                    <p className="text-slate-400 mb-5">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-2 text-sm text-slate-300">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="text-center mt-16">
              <Link href="/services">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                  View All Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Subscription Plans Highlight */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80"
            alt="Pricing Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-purple-950/90 to-slate-950/95" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">Pricing Plans</Badge>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Simple, <span className="gradient-text">Transparent</span> Pricing
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Choose the perfect plan for your needs. Start free and scale as you grow. 
                No hidden fees, no surprises.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {subscriptionPlans.map((plan, index) => (
              <FadeIn key={plan.name} delay={index * 0.1}>
                <Card className={`h-full relative bg-gradient-to-br ${plan.color} border-2 ${plan.borderColor} overflow-hidden`}>
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1.5 text-xs font-bold rounded-b-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <CardContent className="p-8 pt-12">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-5xl font-black text-white">{plan.price}</span>
                      {plan.period && <span className="text-sm text-white/70">{plan.period}</span>}
                    </div>
                    <p className="text-white/80 mb-6">{plan.description}</p>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-2 text-sm text-white/90">
                          <CheckCircle2 className="h-5 w-5 text-green-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href="/pricing">
                      <Button className={`w-full ${plan.popular ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-white/20 hover:bg-white/30 text-white'}`}>
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-indigo-950/30" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">Why Choose Us</Badge>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Industry-<span className="gradient-text">Leading</span> Features
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                We combine cutting-edge technology with best practices to deliver exceptional results for your business.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {whyChooseUs.map((feature, index) => (
              <FadeIn key={feature.title} delay={index * 0.1}>
                <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-500/50 transition-colors">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 via-slate-950 to-slate-950" />
        
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <Badge className="mb-4 bg-orange-500/20 text-orange-300 border-orange-500/30">Our Process</Badge>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                How We <span className="gradient-text">Work</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                A proven 6-step process that delivers results on time and within budget.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {processSteps.map((step, index) => (
              <FadeIn key={step.number} delay={index * 0.1}>
                <div className="text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
                  <div className="text-5xl font-black gradient-text mb-3">{step.number}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&q=80"
            alt="Portfolio Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-purple-950/90 to-slate-950/95" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <Badge className="mb-4 bg-pink-500/20 text-pink-300 border-pink-500/30">Portfolio</Badge>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Featured <span className="gradient-text">Projects</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                A showcase of our finest work and successful client collaborations.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.1}>
                <Card className="overflow-hidden bg-white/5 border-white/10 hover:border-white/30 transition-all duration-500 group">
                  <div className="aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <item.icon className="h-16 w-16 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                  <CardContent className="p-6">
                    <Badge className={`mb-3 ${item.category === 'E-Commerce' ? 'bg-green-500/20 text-green-300' : item.category === 'Travel Portal' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}`}>
                      {item.category}
                    </Badge>
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    <p className="text-slate-400 text-sm mt-2">View Project</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="text-center mt-16">
              <Link href="/portfolio">
                <Button size="lg" className="bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-500 hover:to-orange-500">
                  View Full Portfolio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950" />
        
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <Badge className="mb-4 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Testimonials</Badge>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                What Our <span className="gradient-text">Clients Say</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Don't just take our word for it. Here's what our clients have to say about working with us.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <FadeIn key={testimonial.name} delay={index * 0.1}>
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-8">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Quote className="h-8 w-8 text-primary/30 mb-4" />
                    <p className="text-lg text-slate-300 mb-6 italic">"{testimonial.content}"</p>
                    <div className="border-t border-white/10 pt-4">
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-slate-400">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-6xl font-bold text-white mb-2">500+</div>
              <div className="text-white/80">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl md:text-6xl font-bold text-white mb-2">98%</div>
              <div className="text-white/80">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl md:text-6xl font-bold text-white mb-2">50+</div>
              <div className="text-white/80">Custom Plugins</div>
            </div>
            <div>
              <div className="text-4xl md:text-6xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/80">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-indigo-950/30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <Badge className="mb-4 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">FAQ</Badge>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Frequently Asked <span className="gradient-text">Questions</span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <FadeIn key={faq.q} delay={index * 0.1}>
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                    <p className="text-slate-400">{faq.a}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&q=80"
            alt="CTA Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-purple-950/85 to-indigo-950/90" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[150px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
                Ready to <span className="bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
                  Transform Your Business?
                </span>
              </h2>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                Join hundreds of businesses already using our automation platform to grow their online presence.
                Get a free consultation today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pricing">
                  <Button size="lg" className="text-lg font-semibold px-12 py-7 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-purple-500/25">
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="text-lg px-12 py-7 bg-white/10 border-white/20 hover:bg-white/20">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white">Start Your Project Today</h3>
              <p className="text-white/80">Get 20% off your first project when you mention this ad!</p>
            </div>
            <Link href="/order">
              <Button size="lg" className="bg-white text-green-600 hover:bg-slate-100">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}