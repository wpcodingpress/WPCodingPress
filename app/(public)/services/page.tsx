"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Code2, Palette, ShoppingCart, Zap, Globe, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    icon: Code2,
    slug: "wordpress-development",
    title: "WordPress Development",
    description: "Custom WordPress solutions built for performance, security, and scalability. From simple blogs to complex enterprise websites.",
    basicPrice: 150,
    standardPrice: 300,
    premiumPrice: 500,
    basicFeatures: ["5 Pages", "Elementor Design", "Mobile Responsive", "Contact Form", "Basic SEO"],
    standardFeatures: ["10 Pages", "WooCommerce Setup", "Payment Integration", "Speed Optimization", "Priority Support"],
    premiumFeatures: ["Unlimited Pages", "Custom Development", "Booking System", "Stripe/PayPal", "24/7 Support"]
  },
  {
    icon: Palette,
    slug: "elementor-pro",
    title: "Elementor Pro Design",
    description: "Stunning, conversion-focused designs using Elementor page builder. Pixel-perfect templates tailored to your brand.",
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
    basicPrice: 250,
    standardPrice: 450,
    premiumPrice: 700,
    basicFeatures: ["Up to 20 Products", "Payment Gateway", "Cart & Checkout", "Mobile Responsive", "Basic Reports"],
    standardFeatures: ["Up to 100 Products", "Inventory System", "Shipping Options", "Coupons & Discounts", "Email Marketing"],
    premiumFeatures: ["Unlimited Products", "Subscriptions", "Multi-vendor", "Advanced Analytics", "API Integration"]
  },
  {
    icon: Zap,
    slug: "website-redesign",
    title: "Website Redesign",
    description: "Modernize your existing website with cutting-edge design, improved UX, and better performance.",
    basicPrice: 200,
    standardPrice: 400,
    premiumPrice: 600,
    basicFeatures: ["UI Refresh", "Mobile Optimization", "Content Migration", "Speed Boost", "3-5 Pages"],
    standardFeatures: ["Full Redesign", "UX Improvements", "SEO Preservation", "New Features", "10-15 Pages"],
    premiumFeatures: ["Complete Overhaul", "Custom Design", "Advanced Features", "CMS Training", "Ongoing Support"]
  }
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our <span className="gradient-text">Services</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive web development solutions tailored to your business needs. 
              From WordPress sites to custom applications, we deliver excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
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
                      <CardTitle className="text-2xl text-white mb-4">{service.title}</CardTitle>
                      <p className="text-muted-foreground mb-6">{service.description}</p>
                      <Link href={`/services/${service.slug}`}>
                        <Button variant="outline">
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
                                <span className="font-semibold text-white capitalize">{tier}</span>
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
                          <Button className="w-full" variant={service.slug === "wordpress-development" ? "glow" : "default"}>
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
    </div>
  )
}
