"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Zap, ArrowRight, Check, Clock, Shield, Globe, Code2, Search, Rocket, ChevronDown, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { FloatingButtons } from "@/components/floating-buttons"

const features = [
  {
    icon: Zap,
    title: "Lightning-Fast Performance",
    description: "Transform your slow WordPress site into a blazing-fast Next.js application. Achieve load times under 300ms and improve Core Web Vitals.",
  },
  {
    icon: Search,
    title: "SEO Optimization",
    description: "Built-in SEO best practices including server-side rendering, semantic HTML, structured data, and optimized meta tags for better rankings.",
  },
  {
    icon: Code2,
    title: "Auto Content Sync",
    description: "Real-time synchronization between WordPress and Next.js. Update your content in WordPress and see changes instantly on your new site.",
  },
  {
    icon: Globe,
    title: "Global CDN Deployment",
    description: "Deploy to edge networks worldwide. Your visitors get served from the nearest server, ensuring fast access regardless of location.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Advanced security measures including DDoS protection, SSL certificates, and regular security audits to keep your site safe.",
  },
  {
    icon: Rocket,
    title: "Instant Deployment",
    description: "One-click deployment with automatic builds. Push your changes and see them live in seconds, not hours.",
  },
]

const process = [
  {
    number: "01",
    title: "Connect Your WordPress",
    description: "Link your existing WordPress site using our secure API connection. We analyze your content, themes, and plugins.",
  },
  {
    number: "02",
    title: "AI-Powered Analysis",
    description: "Our AI analyzes your site's structure, content, images, and SEO data to create an optimal conversion strategy.",
  },
  {
    number: "03",
    title: "Smart Conversion",
    description: "We convert your WordPress theme and content to Next.js with pixel-perfect accuracy while preserving SEO value.",
  },
  {
    number: "04",
    title: "Go Live",
    description: "Deploy to our optimized infrastructure with global CDN. Launch with confidence and monitor performance.",
  },
]

const pricing = [
  {
    name: "Basic",
    price: "$99",
    description: "Perfect for simple blogs and small business sites",
    features: ["Up to 20 pages", "Basic SEO setup", "Community support", "7-day delivery"],
  },
  {
    name: "Standard",
    price: "$199",
    description: "Best for business websites and portfolios",
    popular: true,
    features: ["Up to 50 pages", "Advanced SEO", "Priority support", "Auto content sync", "3-month maintenance"],
  },
  {
    name: "Premium",
    price: "$399",
    description: "For complex sites and e-commerce",
    features: ["Unlimited pages", "Custom integrations", "Dedicated support", "Auto content sync", "12-month maintenance", "API access"],
  },
]

const faqs = [
  {
    question: "How long does the WordPress to Next.js conversion take?",
    answer: "Conversion time depends on your site's complexity. A typical blog or small business site takes 3-7 days, while more complex e-commerce or membership sites may take 2-4 weeks. We provide a detailed timeline after analyzing your site.",
  },
  {
    question: "Will my SEO rankings be affected during the migration?",
    answer: "No! We take special care to preserve your SEO value. We maintain all URLs, implement 301 redirects where needed, and ensure all meta tags, structured data, and sitemaps are properly configured. Many clients actually see improved rankings after migration.",
  },
  {
    question: "Do I need to cancel my WordPress hosting?",
    answer: "Not immediately. We recommend keeping your WordPress installation active for 30 days after migration as a backup. You can then cancel it to save costs. We also offer a managed WordPress option where we handle everything.",
  },
  {
    question: "What happens to my WordPress plugins?",
    answer: "We evaluate each plugin's functionality and either convert it to Next.js equivalent or find alternative solutions. Popular plugins like Yoast SEO, Contact Form 7, and WooCommerce are fully supported.",
  },
  {
    question: "Can I still use WordPress to edit content?",
    answer: "Absolutely! With our auto-sync feature, you can continue using WordPress as your content management system. Changes sync automatically to your Next.js site in real-time.",
  },
  {
    question: "What kind of support do you provide after migration?",
    answer: "All plans include migration support. Standard and Premium plans include ongoing maintenance and priority support. We also offer extended support packages for clients who need dedicated assistance.",
  },
]

const portfolio = [
  { title: "HomePicks Daily", category: "E-Commerce", client: "Beth Moran", hasLiveUrl: true },
  { title: "RankUpper", category: "SEO Agency", client: "RankUpper", hasLiveUrl: true },
  { title: "Pro Consultant", category: "Consulting", client: "Pro Consultant UK", hasLiveUrl: true },
]

export default function WordPressToNextjsPage() {
  return (
    <div className="min-h-screen bg-white">
      <FloatingButtons />
      
      <section className="pt-32 pb-20 bg-gradient-to-b from-indigo-50 via-white to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-200/30 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 px-4 py-1.5 text-sm font-semibold mb-6">
                <Zap className="w-4 h-4 mr-2" />
                Most Popular Service
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Transform Your WordPress Site to{' '}
                <span className="gradient-text">Lightning-Fast Next.js</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Convert your WordPress website into a modern Next.js application with 10x better performance, 
                automatic content sync, and superior SEO capabilities. Join 500+ businesses who've made the switch.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/order">
                  <Button className="btn-primary text-lg px-8 py-6 h-auto w-full sm:w-auto">
                    Start Your Conversion
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/portfolio">
                  <Button className="btn-secondary text-lg px-8 py-6 h-auto w-full sm:w-auto">
                    View Portfolio
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-500" />
                  Free SEO Audit
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-500" />
                  30-Day Support
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-500" />
                  Money-Back Guarantee
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-indigo-100 via-violet-50 to-pink-100 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="bg-slate-900 px-4 py-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-4 text-slate-400 text-sm">yourwebsite.com</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">300ms</h3>
                        <p className="text-slate-500">Load Time</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl">
                        <span className="text-slate-700">Performance</span>
                        <span className="font-bold text-emerald-600">98/100</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                        <span className="text-slate-700">SEO Score</span>
                        <span className="font-bold text-blue-600">100/100</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-violet-50 rounded-xl">
                        <span className="text-slate-700">Accessibility</span>
                        <span className="font-bold text-violet-600">95/100</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-emerald-400 to-cyan-500 text-white px-6 py-3 rounded-2xl shadow-lg font-bold">
                  10x Faster!
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-violet-100 text-violet-700 border-violet-200 px-4 py-1.5 text-sm font-semibold mb-4">
              Key Features
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need for a <span className="gradient-text">High-Performance Site</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our WordPress to Next.js conversion service includes everything you need to succeed online.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mb-6 shadow-lg">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
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
              4 Simple Steps to <span className="gradient-text">Migration Success</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <Card className="bg-white border-slate-100 p-6 h-full">
                  <div className="text-5xl font-black text-indigo-100 mb-4">{step.number}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 text-sm">{step.description}</p>
                </Card>
                {i < process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-pink-100 text-pink-700 border-pink-200 px-4 py-1.5 text-sm font-semibold mb-4">
              Pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Transparent <span className="gradient-text">Pricing Plans</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Choose the plan that fits your needs. All plans include our core conversion features.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative ${plan.popular ? "md:-mt-4 md:mb-[-16px]" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-4 py-1 shadow-lg">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card className={`bg-white border-2 ${plan.popular ? "border-indigo-400 shadow-xl shadow-indigo-500/10" : "border-slate-100"} p-8 h-full`}>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                  </div>
                  <p className="text-slate-600 mb-6 text-sm">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-slate-600">
                        <Check className="w-5 h-5 text-emerald-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/order">
                    <Button className={`w-full ${plan.popular ? "btn-primary" : "btn-secondary"}`}>
                      Get Started
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 px-4 py-1.5 text-sm font-semibold mb-4">
              FAQ
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
              >
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <span className="font-semibold text-slate-900">{faq.question}</span>
                    <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Website?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Get a free consultation and see how we can help speed up your site.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-white text-indigo-600 hover:bg-indigo-50 text-lg px-10 py-6 h-auto font-bold shadow-xl">
                  Get Free Consultation
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 text-lg px-10 py-6 h-auto font-semibold">
                  View All Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Services</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/services/wordpress-to-nextjs" className="hover:text-white transition-colors">WordPress to Next.js</Link></li>
                <li><Link href="/services/elementor-pro-design" className="hover:text-white transition-colors">Elementor Pro Design</Link></li>
                <li><Link href="/services/woocommerce-stores" className="hover:text-white transition-colors">WooCommerce Stores</Link></li>
                <li><Link href="/services/seo-marketing" className="hover:text-white transition-colors">SEO & Marketing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-slate-400">
                <li>contact@wpcodingpress.com</li>
                <li>+880 1943 429727</li>
                <li>Dhaka, Bangladesh</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-slate-400">
            © {new Date().getFullYear()} WPCodingPress. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
