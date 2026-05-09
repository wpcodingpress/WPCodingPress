"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Check, ArrowRight, Zap, Star, Crown, Rocket, CheckCircle2, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"

const subscriptions = [
  {
    name: "Free",
    planId: "free",
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
    planId: "pro",
    price: "$19",
    period: "/month",
description: "Convert 1 WordPress site to headless Next.js",
      icon: Star,
      features: [
        "1 WordPress to Next.js conversion",
        "Live deployed site",
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
    planId: "enterprise",
    price: "$99",
    period: "/month",
description: "Convert 3 WordPress sites to Next.js",
      icon: Crown,
      features: [
        "3 WordPress site conversions",
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
  { q: "How long does WordPress to Next.js migration take?", a: "Most conversions are completed within 24-72 hours depending on the size and complexity of your WordPress site." },
  { q: "Will my SEO rankings be preserved after migration?", a: "Absolutely! We preserve all URLs, meta tags, sitemaps, and SEO structure during migration to ensure your rankings remain intact." },
  { q: "Can I still manage my content in WordPress?", a: "Yes! We connect your WordPress admin to Next.js using WPGraphQL, allowing you to manage content while enjoying Next.js performance." },
  { q: "What happens to my WordPress plugins?", a: "We migrate plugin functionality to modern, faster Next.js alternatives. You get better performance without plugin vulnerabilities." },
  { q: "Do you offer ongoing support?", a: "Yes! We provide 24/7 support, regular maintenance, and security updates for all converted websites." },
  { q: "Which platforms do you deploy to?", a: "We deploy to Vercel, Netlify, or any hosting platform of your choice with free SSL and CDN." },
]

export default function PricingPage() {
  const [userPlan, setUserPlan] = useState<string | null>(null)
  const [isLoadingPlan, setIsLoadingPlan] = useState(true)

  useEffect(() => {
    fetchUserPlan()
  }, [])

  const fetchUserPlan = async () => {
    try {
      const res = await fetch('/api/subscriptions')
      const data = await res.json()
      if (data.automation?.plan) {
        setUserPlan(data.automation.plan)
      }
    } catch (e) {
      console.error('Error fetching plan:', e)
    } finally {
      setIsLoadingPlan(false)
    }
  }

  return (
    <div className="relative">
      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] opacity-20 pointer-events-none" />
      
      {/* Hero */}
      <section className="relative py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Simple, <span className="gradient-text">Transparent</span> Pricing
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Choose the perfect plan for your needs. Start free and scale as you grow. 
              No hidden fees, no surprises.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
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
                    <Link href={sub.planId === 'free' ? '/register' : '/dashboard/subscription'} className="w-full">
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

      {/* See What's Included - Table */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
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
    </div>
  )
}