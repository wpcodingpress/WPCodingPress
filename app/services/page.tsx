"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Zap, Palette, ShoppingCart, Search, Code2, Cloud, Globe, ArrowRight, Check, Clock, Shield, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { FloatingButtons } from "@/components/floating-buttons"

const services = [
  {
    icon: Zap,
    title: "WordPress to Next.js",
    description: "Transform your WordPress site into a lightning-fast Next.js application with automatic content sync and 10x better performance.",
    href: "/services/wordpress-to-nextjs",
    color: "from-indigo-500 to-indigo-600",
    popular: true,
    features: ["Auto Content Sync", "Lightning Fast", "SEO Optimized", "Global CDN"],
  },
  {
    icon: Palette,
    title: "Elementor Pro Design",
    description: "Stunning custom designs built with Elementor Pro that convert visitors into customers with beautiful, responsive layouts.",
    href: "/services/elementor-pro-design",
    color: "from-violet-500 to-violet-600",
    popular: false,
    features: ["Custom Design", "Mobile First", "Fast Loading", "Animations"],
  },
  {
    icon: ShoppingCart,
    title: "WooCommerce Stores",
    description: "Full-featured e-commerce solutions with secure payments, inventory management, and optimized checkout experiences.",
    href: "/services/woocommerce-stores",
    color: "from-pink-500 to-pink-600",
    popular: false,
    features: ["Secure Payments", "Inventory System", "Order Tracking", "Multi-vendor"],
  },
  {
    icon: Search,
    title: "SEO & Marketing",
    description: "Dominate search rankings with our proven SEO strategies, technical optimization, and data-driven marketing campaigns.",
    href: "/services/seo-marketing",
    color: "from-cyan-500 to-cyan-600",
    popular: false,
    features: ["Technical SEO", "Content Strategy", "Analytics", "Rank Tracking"],
  },
  {
    icon: Code2,
    title: "Web Applications",
    description: "Custom web applications built with React and Next.js for your unique business needs, from dashboards to SaaS platforms.",
    href: "/services/web-applications",
    color: "from-emerald-500 to-emerald-600",
    popular: false,
    features: ["React/Next.js", "Custom APIs", "Dashboards", "SaaS Apps"],
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    description: "Modern cloud infrastructure setup with CI/CD pipelines, Docker containers, and automated deployment workflows.",
    href: "/services/cloud-devops",
    color: "from-blue-500 to-blue-600",
    popular: false,
    features: ["AWS/Azure", "CI/CD Pipeline", "Docker", "Monitoring"],
  },
  {
    icon: Globe,
    title: "Domain & Hosting",
    description: "Complete domain management and hosting setup with ongoing technical support, security updates, and performance optimization.",
    href: "/services/domain-hosting",
    color: "from-amber-500 to-amber-600",
    popular: false,
    features: ["Domain Setup", "SSL Certificates", "24/7 Support", "Security Updates"],
  },
]

const process = [
  { icon: Clock, title: "Discovery", description: "We analyze your requirements and goals" },
  { icon: Palette, title: "Design", description: "Create stunning mockups and prototypes" },
  { icon: Code2, title: "Develop", description: "Build with clean, optimized code" },
  { icon: Rocket, title: "Deploy", description: "Launch to production with confidence" },
]

const whyChooseUs = [
  { icon: Shield, title: "Secure & Reliable", description: "Enterprise-grade security for your website" },
  { icon: Rocket, title: "Lightning Fast", description: "Sub-second load times guaranteed" },
  { icon: Search, title: "SEO Optimized", description: "Built-in best practices for rankings" },
  { icon: Clock, title: "24/7 Support", description: "Expert help anytime you need it" },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <FloatingButtons />
      
      <section className="pt-32 pb-20 bg-gradient-to-b from-indigo-50 via-white to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-200/30 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 px-4 py-1.5 text-sm font-semibold mb-6">
              Our Services
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              Professional <span className="gradient-text">Web Development</span> Services
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              From WordPress migrations to custom web applications, we provide end-to-end solutions 
              that help your business grow online with lightning-fast performance and beautiful designs.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={service.href}>
                  <Card className="h-full bg-white border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${service.color}`} />
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <service.icon className="w-7 h-7 text-white" />
                        </div>
                        {service.popular && (
                          <Badge className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-slate-600 mb-6 leading-relaxed">
                        {service.description}
                      </p>
                      <div className="space-y-2 mb-6">
                        {service.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2 text-sm text-slate-500">
                            <Check className="w-4 h-4 text-emerald-500" />
                            {feature}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center text-indigo-600 font-semibold group-hover:gap-3 transition-all">
                        Learn More <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
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
            <Badge className="bg-violet-100 text-violet-700 border-violet-200 px-4 py-1.5 text-sm font-semibold mb-4">
              How It Works
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
              Simple 4-Step <span className="gradient-text">Process</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <Card className="bg-white border-slate-100 p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 text-sm">{step.description}</p>
                </Card>
                {i < process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-indigo-300" />
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
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-4 py-1.5 text-sm font-semibold mb-4">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
              Industry-Leading <span className="gradient-text">Features</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.description}</p>
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
              Get started today with our professional services and see the difference quality makes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-white text-indigo-600 hover:bg-indigo-50 text-lg px-10 py-6 h-auto font-bold shadow-xl">
                  Get Started Now
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 text-lg px-10 py-6 h-auto font-semibold">
                  View Pricing
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
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
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
