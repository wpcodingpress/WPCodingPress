"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Code2, Palette, ShoppingCart, Zap, Globe, CheckCircle2, ArrowRight, Search, Megaphone, Server, Database, Bot, Layers, Gauge, Repeat, HeadphonesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    icon: Code2,
    slug: "headless-wordpress-nextjs",
    title: "Headless WordPress to Next.js",
    description: "Automate your WordPress to modern Next.js conversion. Build lightning-fast news portals, blogs, and portfolios that load in milliseconds.",
    shortDesc: "Convert WordPress to Next.js Automatically",
    basicPrice: 0,
    standardPrice: 19,
    premiumPrice: 99,
    basicFeatures: [
      "1 WordPress Site Conversion",
      "Basic Next.js Template",
      "Community Support",
      "5GB Bandwidth",
      "Basic SEO Setup"
    ],
    standardFeatures: [
      "5 WordPress Site Conversions",
      "Advanced Next.js Templates",
      "Priority Support",
      "100GB Bandwidth",
      "Custom Domain",
      "Analytics Dashboard",
      "Auto Content Sync"
    ],
    premiumFeatures: [
      "Unlimited Conversions",
      "White-label Solution",
      "24/7 Dedicated Support",
      "Unlimited Bandwidth",
      "Custom Development",
      "API Access",
      "Advanced Caching"
    ]
  },
  {
    icon: Palette,
    slug: "elementor-pro",
    title: "Elementor Pro Design",
    description: "Stunning, conversion-focused designs using Elementor page builder. Pixel-perfect templates tailored to your brand identity.",
    shortDesc: "Professional Elementor Designs",
    basicPrice: 100,
    standardPrice: 200,
    premiumPrice: 350,
    basicFeatures: ["5 Sections", "Custom Header/Footer", "Mobile Responsive", "Contact Form", "Basic Animations"],
    standardFeatures: ["10 Sections", "Popups & Forms", "WooCommerce Elements", "Custom Widgets", "Advanced Animations"],
    premiumFeatures: ["Full Website", "Custom CSS/JS", "Dynamic Content", "Template Library", "Priority Support"]
  },
  {
    icon: ShoppingCart,
    slug: "woocommerce",
    title: "WooCommerce Store",
    description: "Full-featured e-commerce solutions with seamless payment integration, inventory management, and order tracking.",
    shortDesc: "Modern E-Commerce Solutions",
    basicPrice: 250,
    standardPrice: 450,
    premiumPrice: 700,
    basicFeatures: ["Up to 20 Products", "Payment Gateway", "Cart & Checkout", "Mobile Responsive", "Basic Reports"],
    standardFeatures: ["Up to 100 Products", "Inventory System", "Shipping Options", "Coupons & Discounts", "Email Marketing"],
    premiumFeatures: ["Unlimited Products", "Subscriptions", "Multi-vendor", "Advanced Analytics", "API Integration"]
  },
  {
    icon: Megaphone,
    slug: "seo-digital-marketing",
    title: "SEO & Digital Marketing",
    description: "Advanced SEO strategies and digital marketing to grow your online presence and drive more conversions.",
    shortDesc: "Growth Hacking Services",
    basicPrice: 150,
    standardPrice: 300,
    premiumPrice: 500,
    basicFeatures: ["Keyword Research", "On-page SEO", "Google Analytics", "Monthly Report", "5 Keywords"],
    standardFeatures: ["Technical SEO", "Content Strategy", "Link Building", "Social Media", "20 Keywords"],
    premiumFeatures: ["Full SEO Audit", "Competitor Analysis", "PR & Outreach", "Conversion Optimization", "Unlimited Keywords"]
  },
  {
    icon: Zap,
    slug: "website-redesign",
    title: "Website Redesign",
    description: "Modernize your existing website with cutting-edge design, improved UX, and better performance.",
    shortDesc: "Modernize Your Site",
    basicPrice: 200,
    standardPrice: 400,
    premiumPrice: 600,
    basicFeatures: ["UI Refresh", "Mobile Optimization", "Content Migration", "Speed Boost", "3-5 Pages"],
    standardFeatures: ["Full Redesign", "UX Improvements", "SEO Preservation", "New Features", "10-15 Pages"],
    premiumFeatures: ["Complete Overhaul", "Custom Design", "Advanced Features", "CMS Training", "Ongoing Support"]
  }
]

const processSteps = [
  { number: "01", title: "Consultation", desc: "We discuss your requirements and goals" },
  { number: "02", title: "Planning", desc: "Create a detailed project roadmap" },
  { number: "03", title: "Development", desc: "Build your solution with quality code" },
  { number: "04", title: "Launch", desc: "Deploy and monitor your project" },
  { number: "05", title: "Support", desc: "Ongoing maintenance and improvements" }
]

export default function ServicesPage() {
  return (
    <div className="relative">
      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      
      {/* Hero */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our <span className="gradient-text">Services</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive web development solutions tailored to your business needs. 
              From headless WordPress automation to custom development, we deliver excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 pb-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Our <span className="gradient-text">Process</span>
            </h2>
            <p className="text-muted-foreground">How we work with you</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors"
              >
                <div className="text-4xl font-black gradient-text mb-3">{step.number}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-12 pb-24">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {services.map((service, index) => (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-0">
                    <CardHeader className="p-8 bg-gradient-to-br from-primary/5 to-transparent">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                        <service.icon className="h-7 w-7 text-primary" />
                      </div>
                      <CardTitle className="text-2xl text-foreground mb-4">{service.title}</CardTitle>
                      <p className="text-muted-foreground mb-2">{service.description}</p>
                      <p className="text-sm text-primary font-medium">{service.shortDesc}</p>
                      <Link href={`/services/${service.slug}`}>
                        <Button variant="outline" className="mt-4">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardHeader>
                    <CardContent className="p-8 bg-card">
                      <div className="space-y-6">
                        {["basic", "standard", "premium"].map((tier, tierIndex) => {
                          const price = tier === "basic" ? service.basicPrice : tier === "standard" ? service.standardPrice : service.premiumPrice
                          const features = tier === "basic" ? service.basicFeatures : tier === "standard" ? service.standardFeatures : service.premiumFeatures
                          return (
                            <div key={tier} className={`p-4 rounded-lg ${tier === "standard" ? "bg-primary/10 border border-primary/30" : "bg-white/5"}`}>
                              <div className="flex items-center justify-between mb-3">
                                <span className="font-semibold text-foreground capitalize">{tier}</span>
                                <span className="text-xl font-bold gradient-text">${price}</span>
                              </div>
                              <ul className="space-y-2">
                                {features.map((feature, fIndex) => (
                                  <li key={fIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )
                        })}
                      </div>
                      <div className="mt-6">
                        <Link href={`/order?service=${service.slug}`}>
                          <Button className="w-full" variant={service.slug === "headless-wordpress-nextjs" ? "glow" : "default"}>
                            Order This Service
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-card to-primary/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to <span className="gradient-text">Get Started?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Contact us today for a free consultation and let's discuss your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary">
                  Get a Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}