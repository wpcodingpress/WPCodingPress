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
  Sparkles,
  CheckCircle2,
  Star,
  Users,
  Clock,
  TrendingUp,
  Rocket,
  Globe,
  Megaphone,
  Bot,
  HeadphonesIcon,
  ChevronDown,
  Play,
  Quote,
  Menu,
  X,
  Zap,
  Target,
  Award,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Send,
  Search,
  BarChart3,
  Layers,
  Database,
  Shield,
  Gauge,
  Layers3,
  Repeat,
  TestTube,
  Wallet,
  Building2,
  FileCode,
  Lightbulb,
  UserCheck,
  Heart,
  ArrowDownUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const stats = [
  { icon: Users, value: "500+", label: "Happy Clients", color: "text-sky-500" },
  { icon: Clock, value: "5+", label: "Years Experience", color: "text-orange-500" },
  { icon: Star, value: "4.9", label: "Client Rating", color: "text-yellow-500" },
  { icon: TrendingUp, value: "1000+", label: "Projects Delivered", color: "text-teal-500" }
]

const services = [
  {
    icon: Code2,
    title: "Headless WordPress to Next.js",
    description: "Automate your WordPress to modern Next.js conversion. Build lightning-fast news portals, blogs, and portfolios.",
    features: ["Auto Content Sync", "SEO Optimized", "Lightning Fast", "Real-time Updates", "API Ready", "SSR"],
    color: "from-sky-500 to-cyan-500",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200"
  },
  {
    icon: Palette,
    title: "Elementor Pro Design",
    description: "Stunning, conversion-focused designs using Elementor page builder. Pixel-perfect templates tailored to your brand.",
    features: ["Custom Design", "Mobile Responsive", "WooCommerce Ready", "Fast Loading", "Animations", "Pixel Perfect"],
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
  },
  {
    icon: ShoppingCart,
    title: "WooCommerce Stores",
    description: "Full-featured e-commerce solutions with seamless payment integration and inventory management.",
    features: ["Secure Payments", "Inventory System", "Order Tracking", "Multi-vendor Support", "Coupons", "Shipping"],
    color: "from-teal-500 to-emerald-500",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200"
  },
  {
    icon: Megaphone,
    title: "SEO & Digital Marketing",
    description: "Advanced SEO strategies and digital marketing to grow your online presence and drive conversions.",
    features: ["Technical SEO", "Content Strategy", "Analytics Setup", "Growth Hacking", "Link Building", "Rankings"],
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200"
  }
]

const subscriptionPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for testing and small projects",
    features: ["1 WordPress Site", "Basic Next.js Template", "Community Support", "5GB Bandwidth", "Basic SEO"],
    color: "from-slate-500 to-slate-600",
    borderColor: "border-slate-300",
    cta: "Start Free"
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "Ideal for growing businesses and agencies",
    features: ["5 WordPress Sites", "Advanced Templates", "Priority Support", "100GB Bandwidth", "Custom Domain", "Analytics"],
    color: "from-sky-500 to-cyan-500",
    borderColor: "border-sky-400",
    popular: true,
    cta: "Start Pro"
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For agencies and high-volume needs",
    features: ["Unlimited Sites", "White-label Solution", "24/7 Support", "Unlimited Bandwidth", "Custom Dev", "API Access"],
    color: "from-orange-500 to-red-500",
    borderColor: "border-orange-400",
    cta: "Contact Sales"
  }
]

const whyChooseUs = [
  { icon: Rocket, title: "Lightning Fast", desc: "Next.js sites load in milliseconds" },
  { icon: Shield, title: "Secure & Safe", desc: "Enterprise-grade security" },
  { icon: Gauge, title: "SEO Optimized", desc: "Better Google rankings" },
  { icon: Repeat, title: "Auto Sync", desc: "Real-time content sync" },
  { icon: Bot, title: "AI-Powered", desc: "Smart automation" },
  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Expert assistance" }
]

const processSteps = [
  { number: "01", title: "Consultation", desc: "Discuss your requirements" },
  { number: "02", title: "Strategy", desc: "Create project roadmap" },
  { number: "03", title: "Development", desc: "Build with quality code" },
  { number: "04", title: "Testing", desc: "Rigorous testing" },
  { number: "05", title: "Launch", desc: "Deploy your project" },
  { number: "06", title: "Support", desc: "Ongoing maintenance" }
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
    content: "WPCodingPress transformed our WordPress to Next.js. Load times went from 3s to 300ms! Incredible work.",
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
    content: "Best investment we made. SEO improvements helped us rank #1 for main keywords within 3 months.",
    rating: 5
  }
]

const faqs = [
  { q: "How long does a typical project take?", a: "Most projects are completed within 2-4 weeks depending on complexity." },
  { q: "Do you offer ongoing support?", a: "Yes! We offer monthly maintenance packages starting at $99/month." },
  { q: "Can I migrate my existing content?", a: "Absolutely. We handle all content migration from any platform." },
  { q: "What's included in SEO package?", a: "Technical audit, on-page optimization, schema markup, speed improvements." },
  { q: "Do you offer refunds?", a: "We offer a 7-day money-back guarantee if not satisfied." },
  { q: "How do I get started?", a: "Click 'Start Your Project' and fill our consultation form." }
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
  const y = useTransform(scrollYProgress, [0, 1], [0, 100])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.5])

  return (
    <div className="relative overflow-hidden bg-dots-pattern">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center overflow-hidden bg-gradient-to-br from-sky-50 via-white to-cyan-50">
        <motion.div style={{ y, opacity }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-100/50 via-white to-cyan-100/50" />
        </motion.div>
        
        {/* Animated decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-400/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-400/20 rounded-full blur-[80px]" />
        
        {/* Floating shapes */}
        <motion.div className="absolute top-32 right-[15%] w-20 h-20 bg-sky-400/30 rounded-2xl rotate-12 animate-float-slow" />
        <motion.div className="absolute bottom-32 left-[10%] w-16 h-16 bg-orange-400/30 rounded-full animate-float-reverse" />
        <motion.div className="absolute top-1/3 right-[10%] w-12 h-12 bg-teal-400/30 rounded-lg rotate-45 animate-float-slow" style={{ animationDelay: '1s' }} />
        
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
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-sky-100 to-cyan-100 border border-sky-300 text-sm text-sky-700 font-medium">
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
              <span className="text-slate-800">Transform Your</span>
              <br />
              <span className="gradient-text">
                WordPress to Next.js
              </span>
              <br />
              <span className="text-slate-800">Automatically</span>
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Automate your headless WordPress conversion with our cutting-edge SaaS platform. 
              Build lightning-fast news portals, blogs and portfolios that load in milliseconds.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/pricing">
                <Button size="lg" className="w-full sm:w-auto text-lg font-semibold px-10 py-7 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-10 py-7 border-2 border-slate-300 hover:border-sky-500 hover:bg-sky-50 transition-all">
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
                <div key={index} className="text-center p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg">
                  <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-4xl md:text-5xl font-bold text-slate-800">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
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
          <ChevronDown className="h-8 w-8 text-slate-400" />
        </motion.div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4">
          <p className="text-center text-slate-500 mb-6 font-medium">TRUSTED BY LEADING TECHNOLOGIES</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {["WordPress", "Elementor", "WooCommerce", "Next.js", "React", "TypeScript"].map((tech, i) => (
              <span key={i} className="text-xl md:text-2xl font-bold text-slate-400 hover:text-slate-600 transition-colors">{tech}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-gradient-to-b from-white to-sky-50">
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <Badge className="mb-4 bg-sky-100 text-sky-700 border-sky-300 px-4 py-1">Our Services</Badge>
              <h2 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
                Everything You Need to <span className="gradient-text">Succeed Online</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                From WordPress to Next.js conversion, from design to marketing - we provide end-to-end web solutions.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <FadeIn key={service.title} delay={index * 0.1}>
                <Card className={`h-full ${service.bgColor} border-2 ${service.borderColor} hover:shadow-xl transition-all duration-300 group`}>
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-3">{service.title}</h3>
                    <p className="text-slate-600 mb-5">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="h-4 w-4 text-sky-500" />
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
                <Button size="lg" className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600">
                  View All Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-32 bg-gradient-to-br from-slate-50 via-white to-sky-50">
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <Badge className="mb-4 bg-teal-100 text-teal-700 border-teal-300 px-4 py-1">Pricing Plans</Badge>
              <h2 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
                Simple, <span className="gradient-text">Transparent</span> Pricing
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Choose the perfect plan. Start free and scale as you grow.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {subscriptionPlans.map((plan, index) => (
              <FadeIn key={plan.name} delay={index * 0.1}>
                <Card className={`h-full relative bg-white border-2 ${plan.borderColor} shadow-lg hover:shadow-2xl transition-all ${plan.popular ? 'ring-4 ring-sky-400/30 scale-105' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <CardContent className="p-8 pt-12">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-5xl font-black text-slate-800">{plan.price}</span>
                      {plan.period && <span className="text-sm text-slate-500">{plan.period}</span>}
                    </div>
                    <p className="text-slate-600 mb-6">{plan.description}</p>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="h-5 w-5 text-sky-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href="/pricing">
                      <Button className={`w-full ${plan.popular ? 'bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600' : 'bg-slate-800 hover:bg-slate-900'}`}>
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
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <Badge className="mb-4 bg-orange-100 text-orange-700 border-orange-300 px-4 py-1">Why Choose Us</Badge>
              <h2 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
                Industry-<span className="gradient-text-alt">Leading</span> Features
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                We combine cutting-edge technology with best practices to deliver exceptional results.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {whyChooseUs.map((feature, index) => (
              <FadeIn key={feature.title} delay={index * 0.1}>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-500">{feature.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-32 bg-gradient-to-b from-sky-50 to-white">
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <Badge className="mb-4 bg-violet-100 text-violet-700 border-violet-300 px-4 py-1">Our Process</Badge>
              <h2 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
                How We <span className="gradient-text">Work</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                A proven 6-step process that delivers results on time and within budget.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {processSteps.map((step, index) => (
              <FadeIn key={step.number} delay={index * 0.1}>
                <div className="text-center p-6 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all">
                  <div className="text-5xl font-black gradient-text mb-3">{step.number}</div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <Badge className="mb-4 bg-pink-100 text-pink-700 border-pink-300 px-4 py-1">Portfolio</Badge>
              <h2 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
                Featured <span className="gradient-text-alt">Projects</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                A showcase of our finest work and successful client collaborations.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.1}>
                <Card className="overflow-hidden bg-gradient-to-br from-sky-50 to-white border-slate-200 hover:shadow-2xl transition-all group">
                  <div className="aspect-[4/3] bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center">
                    <item.icon className="h-16 w-16 text-sky-400 group-hover:text-sky-600 transition-colors" />
                  </div>
                  <CardContent className="p-6">
                    <Badge className={`mb-3 ${item.category === 'E-Commerce' ? 'bg-teal-100 text-teal-700' : item.category === 'Travel Portal' ? 'bg-sky-100 text-sky-700' : 'bg-violet-100 text-violet-700'}`}>
                      {item.category}
                    </Badge>
                    <h3 className="text-xl font-semibold text-slate-800">{item.title}</h3>
                    <p className="text-slate-500 text-sm mt-2">View Project</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="text-center mt-16">
              <Link href="/portfolio">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                  View Full Portfolio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <Badge className="mb-4 bg-yellow-100 text-yellow-700 border-yellow-300 px-4 py-1">Testimonials</Badge>
              <h2 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
                What Our <span className="gradient-text">Clients Say</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Don't just take our word for it. Here's what our clients have to say.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <FadeIn key={testimonial.name} delay={index * 0.1}>
                <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-all">
                  <CardContent className="p-8">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Quote className="h-8 w-8 text-sky-300 mb-4" />
                    <p className="text-lg text-slate-600 mb-6 italic">"{testimonial.content}"</p>
                    <div className="border-t border-slate-100 pt-4">
                      <div className="font-semibold text-slate-800">{testimonial.name}</div>
                      <div className="text-sm text-slate-500">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-sky-500 to-cyan-500">
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
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <Badge className="mb-4 bg-cyan-100 text-cyan-700 border-cyan-300 px-4 py-1">FAQ</Badge>
              <h2 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
                Frequently Asked <span className="gradient-text-alt">Questions</span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <FadeIn key={faq.q} delay={index * 0.1}>
                <Card className="bg-sky-50 border-sky-200 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">{faq.q}</h3>
                    <p className="text-slate-600">{faq.a}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
                Ready to <span className="gradient-text">Transform Your Business?</span>
              </h2>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                Join hundreds of businesses using our automation platform to grow their online presence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pricing">
                  <Button size="lg" className="text-lg font-semibold px-12 py-7 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 shadow-lg">
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="text-lg px-12 py-7 border-2 border-white/30 text-white hover:bg-white/10">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-pink-500">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white">Start Your Project Today</h3>
              <p className="text-white/80">Get 20% off your first project when you mention this ad!</p>
            </div>
            <Link href="/order">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-slate-100">
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