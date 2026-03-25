"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Check, ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"

const packages = [
  {
    name: "Basic",
    price: 150,
    description: "Perfect for landing pages, portfolios, and small business websites.",
    features: [
      "5 Pages",
      "Elementor Design",
      "Mobile Responsive",
      "Contact Form",
      "Basic SEO Setup",
      "Social Media Links",
      "Hosting Setup",
      "5 Revisions"
    ],
    popular: false,
    premium: false
  },
  {
    name: "Standard",
    price: 300,
    description: "Ideal for growing businesses needing e-commerce and advanced features.",
    features: [
      "10 Pages",
      "WooCommerce Setup",
      "Payment Integration",
      "Speed Optimization",
      "Advanced SEO",
      "Email Marketing Setup",
      "Inventory Management",
      "Unlimited Revisions"
    ],
    popular: true,
    premium: false
  },
  {
    name: "Premium",
    price: 500,
    description: "Full custom solution for complex requirements and enterprise projects.",
    features: [
      "Unlimited Pages",
      "Custom Development",
      "Booking System",
      "Stripe & PayPal",
      "24/7 Priority Support",
      "HIPAA Compliance (if needed)",
      "Multi-language Support",
      "Custom Animations"
    ],
    popular: false,
    premium: true
  }
]

const faqs = [
  {
    q: "What's included in every package?",
    a: "Every package includes responsive design, contact forms, social media integration, and basic SEO optimization."
  },
  {
    q: "Can I upgrade my package later?",
    a: "Absolutely! You can upgrade at any time. We'll prorate the cost based on what's already been completed."
  },
  {
    q: "Do you offer payment plans?",
    a: "Yes, we offer milestone-based payments. You pay as we complete each phase of your project."
  },
  {
    q: "What if I'm not satisfied with the work?",
    a: "We offer free revisions until you're 100% satisfied. If we can't meet your requirements, we offer a satisfaction guarantee."
  }
]

export default function PricingPage() {
  return (
    <div className="relative">
      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] opacity-20 pointer-events-none" />
      
      {/* Hero */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Transparent <span className="gradient-text">Pricing</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              No hidden fees. No surprises. Get a professional website at a price that fits your budget.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full relative ${pkg.popular ? 'border-primary/50 bg-gradient-to-b from-primary/5 to-transparent' : ''} ${pkg.premium ? 'bg-gradient-to-b from-secondary/5 to-transparent' : ''}`}>
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-4 py-1 text-sm font-semibold rounded-full bg-primary text-white">
                        <Zap className="h-4 w-4" />
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl text-white">{pkg.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-5xl font-bold gradient-text">${pkg.price}</span>
                    </div>
                    <CardDescription className="mt-4">{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-3">
                      {pkg.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-6">
                    <Link href={`/order?package=${pkg.name.toLowerCase()}`} className="w-full">
                      <Button className="w-full" variant={pkg.popular ? "glow" : "outline"}>
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Quote */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Need a Custom Solution?
                </h3>
                <p className="text-muted-foreground mb-6">
                  If your project has unique requirements that don't fit our standard packages, 
                  let's discuss a custom quote tailored to your needs.
                </p>
                <Link href="/contact">
                  <Button variant="outline">
                    Request Custom Quote
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 pb-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
