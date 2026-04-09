"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Check, ArrowRight, Zap, Star, Crown, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"

const subscriptions = [
  {
    name: "Free",
    price: "Free",
    period: "forever",
    description: "Perfect for getting started with WordPress to Next.js conversion",
    icon: Rocket,
    features: [
      "1 WordPress site conversion",
      "Basic Next.js template",
      "Community support",
      "Basic SEO setup"
    ],
    popular: false,
    color: "from-slate-600 to-slate-700",
    borderColor: "border-slate-500",
    cta: "Start Free"
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "Convert up to 5 WordPress sites to headless Next.js",
    icon: Star,
    features: [
      "5 WordPress to Headless conversions",
      "Live deployed sites (Vercel/Render)",
      "Advanced Next.js templates",
      "Priority email support",
      "Custom domain support",
      "Analytics dashboard",
      "Auto content sync"
    ],
    popular: true,
    color: "from-blue-600 to-purple-600",
    borderColor: "border-blue-500",
    cta: "Start Pro"
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "Unlimited conversions for agencies and businesses",
    icon: Crown,
    features: [
      "Unlimited conversions",
      "White-label deployment",
      "24/7 Dedicated support",
      "Custom domain included",
      "API access",
      "Advanced analytics",
      "Team collaboration",
      "Custom integrations"
    ],
    popular: false,
    color: "from-amber-600 to-orange-600",
    borderColor: "border-amber-500",
    cta: "Contact Sales"
  }
]

const servicePricing = [
  {
    name: "Elementor Pro Design",
    basic: 100,
    standard: 200,
    premium: 350,
    desc: "Professional Elementor website design"
  },
  {
    name: "WooCommerce Store",
    basic: 250,
    standard: 450,
    premium: 700,
    desc: "Full e-commerce solution"
  },
  {
    name: "SEO & Marketing",
    basic: 150,
    standard: 300,
    premium: 500,
    desc: "Digital marketing services"
  },
  {
    name: "Website Redesign",
    basic: 200,
    standard: 400,
    premium: 600,
    desc: "Modernize your existing site"
  }
]

const faqs = [
  {
    q: "What's included in the Free plan?",
    a: "The Free plan includes 1 WordPress site conversion with basic Next.js template, community support, and 5GB bandwidth. Perfect for testing our platform."
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes! You can cancel your subscription at any time. No questions asked. Your access continues until the end of your billing period."
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a 7-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund."
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans."
  },
  {
    q: "Can I upgrade or downgrade my plan?",
    a: "Absolutely! You can change your plan at any time. We'll prorate the difference based on your new plan."
  },
  {
    q: "Is there a setup fee?",
    a: "No setup fees for any plan. You can start using our platform immediately after signing up."
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
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Simple, <span className="gradient-text">Transparent</span> Pricing
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose the perfect plan for your needs. Start free and scale as you grow. 
              No hidden fees, no surprises.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {subscriptions.map((sub, index) => (
              <motion.div
                key={sub.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full relative bg-gradient-to-br ${sub.color} border-2 ${sub.borderColor} overflow-hidden`}>
                  {sub.popular && (
                    <div className="absolute -top-0 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1.5 text-xs font-bold rounded-b-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4 pt-8">
                    <sub.icon className="h-10 w-10 mx-auto mb-4 text-white" />
                    <CardTitle className="text-2xl text-white">{sub.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-5xl font-black text-white">{sub.price}</span>
                      {sub.period && <span className="text-sm text-white/70">{sub.period}</span>}
                    </div>
                    <CardDescription className="mt-2 text-white/80">{sub.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-3">
                      {sub.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-white/90">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-6">
                    <Link href="/register" className="w-full">
                      <Button className={`w-full ${sub.popular ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-white/20 hover:bg-white/30 text-white'}`}>
                        {sub.cta}
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

      {/* One-time Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              One-Time <span className="gradient-text">Services</span>
            </h2>
            <p className="text-muted-foreground">Need a custom project? Choose a one-time service package</p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-foreground font-semibold">Service</th>
                  <th className="text-center py-4 px-4 text-foreground font-semibold">Basic</th>
                  <th className="text-center py-4 px-4 text-foreground font-semibold">Standard</th>
                  <th className="text-center py-4 px-4 text-foreground font-semibold">Premium</th>
                  <th className="text-center py-4 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {servicePricing.map((service, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium text-foreground">{service.name}</div>
                      <div className="text-sm text-muted-foreground">{service.desc}</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-lg font-bold gradient-text">${service.basic}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-lg font-bold gradient-text">${service.standard}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-lg font-bold gradient-text">${service.premium}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Link href={`/order?service=${service.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}>
                        <Button size="sm" variant="outline">
                          Order
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                <h3 className="text-2xl font-bold text-foreground mb-4">
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
            <h2 className="text-3xl font-bold text-foreground mb-4">
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
                    <h3 className="text-lg font-semibold text-foreground mb-2">{faq.q}</h3>
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