"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ArrowRight, Star, Shield, Clock, CreditCard, RefreshCw, HeartHandshake, ChevronDown, Loader2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WEB_DEV_PLANS, type BillingCycle, type WebDevPlan } from "@/lib/web-dev-service"
import Link from "next/link"

const PLANS = [
  {
    ...WEB_DEV_PLANS.STARTER,
    id: "STARTER" as WebDevPlan,
    description: "Perfect if you already have a domain and hosting. We handle everything else.",
    cta: "Get Started",
    href: "#",
    popular: false,
  },
  {
    ...WEB_DEV_PLANS.COMPLETE,
    id: "COMPLETE" as WebDevPlan,
    description: "We handle everything — domain, hosting, design, development, and launch.",
    cta: "Get Started",
    href: "#",
    popular: true,
  },
]

const comparisonFeatures = [
  { feature: "Dedicated Project Manager", starter: true, complete: true },
  { feature: "Professional Design Team", starter: true, complete: true },
  { feature: "Content Writing Team", starter: true, complete: true },
  { feature: "Development Team", starter: true, complete: true },
  { feature: "Full Testing & QA", starter: true, complete: true },
  { feature: "SEO-Optimized Website", starter: true, complete: true },
  { feature: "100% Responsive Design", starter: true, complete: true },
  { feature: "Platform of Your Choice", starter: true, complete: true },
  { feature: "Delivery Within 3 Business Days", starter: true, complete: true },
  { feature: "Monthly Maintenance & Updates", starter: true, complete: true },
  { feature: "Domain Registration", starter: false, complete: true },
  { feature: "Premium Hosting", starter: false, complete: true },
  { feature: "SSL Certificate", starter: false, complete: true },
  { feature: "Professional Email Setup", starter: false, complete: true },
]

const faqs = [
  {
    q: "How does the subscription billing work?",
    a: "You pay a fixed monthly or annual fee. With the annual plan, you get two months free compared to monthly billing. All payments are processed securely through Gumroad.",
  },
  {
    q: "What if I already have a domain and hosting?",
    a: "The Starter Plan is perfect for you! Just provide us with your domain name and hosting login details, and we'll handle the rest. Your existing hosting and domain will be fully utilized.",
  },
  {
    q: "Can I switch from Starter to Complete later?",
    a: "Absolutely! You can upgrade anytime. We'll prorate the difference and handle the transition smoothly. Just contact your project manager or upgrade from your dashboard.",
  },
  {
    q: "What platforms can you build on?",
    a: "We build on WordPress, Elementor, WooCommerce, Next.js, and React. You choose what works best for your needs, and our team will recommend the optimal platform based on your project requirements.",
  },
  {
    q: "Is 3-day delivery really guaranteed?",
    a: "Yes! For most standard projects, we deliver within 3 business days after the project discussion. Complex projects may take 5-7 business days. We'll confirm the timeline during the discussion phase.",
  },
  {
    q: "What happens if I cancel my subscription?",
    a: "You can cancel anytime. Your website will remain live and you'll retain access until the end of your billing period. We'll provide you with all the files and credentials before cancellation takes effect.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes, we offer a 14-day money-back guarantee on all plans. If you're not satisfied with the initial design concepts, we'll refund your first month's payment in full.",
  },
  {
    q: "How do I communicate with my project manager?",
    a: "You'll be assigned a dedicated project manager who will communicate with you via WhatsApp, email, or your preferred channel. We also have a dashboard where you can track project progress in real-time.",
  },
]

const trustItems = [
  { icon: Clock, label: "3-Day Delivery", desc: "Fast turnaround guaranteed" },
  { icon: RefreshCw, label: "Cancel Anytime", desc: "No long-term contracts" },
  { icon: Shield, label: "No Hidden Fees", desc: "Transparent pricing" },
  { icon: HeartHandshake, label: "100% Satisfaction", desc: "14-day money-back guarantee" },
]

export default function WebDevPlansPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly")
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleGetStarted = async (plan: WebDevPlan) => {
    setLoadingPlan(plan)
    try {
      const response = await fetch("/api/web-dev-subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billingCycle }),
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error("Failed to get checkout URL:", data)
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="relative">
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-[0.03]" />

      {/* Hero */}
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-4 px-4 py-1.5 text-sm bg-purple-100 text-purple-700 border-purple-200">
              🚀 Web Development Subscription
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
              Your Website,{" "}
              <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
                Delivered in 3 Days
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Stop struggling with website development. Get a professional, SEO-optimized website built by experts — with a dedicated team, fast delivery, and ongoing support.
            </p>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            className="mt-10 flex flex-wrap justify-center gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {trustItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
                <item.icon className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Toggle */}
          <motion.div
            className="mt-10 flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className={`text-sm font-medium transition-colors ${billingCycle === "monthly" ? "text-slate-900" : "text-slate-400"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
              className="relative w-16 h-8 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 cursor-pointer"
              aria-label={`Switch to ${billingCycle === "monthly" ? "annual" : "monthly"} billing`}
            >
              <motion.div
                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
                animate={{ left: billingCycle === "annual" ? "calc(100% - 28px)" : "4px" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${billingCycle === "annual" ? "text-slate-900" : "text-slate-400"}`}>
              Annual
            </span>
            {billingCycle === "annual" && (
              <Badge className="bg-green-100 text-green-700 border-green-200 text-xs font-medium">
                Save up to $118/year
              </Badge>
            )}
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              {PLANS.map((plan, index) => (
                <motion.div
                  key={`${plan.id}-${billingCycle}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 + 0.2 }}
                  className={`relative ${plan.popular ? "lg:-mt-4 lg:mb-[-1rem]" : ""}`}
                >
                  <div className={`h-full bg-white rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 ${
                    plan.popular
                      ? "border-purple-500 shadow-xl shadow-purple-500/10"
                      : "border-slate-200 hover:border-purple-300"
                  }`}>
                    {plan.popular && (
                      <div className="relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                          <Badge className="px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-purple-600 to-violet-600 text-white border-0 shadow-lg shadow-purple-500/30">
                            <Star className="w-3 h-3 mr-1 inline-block" />
                            MOST POPULAR
                          </Badge>
                        </div>
                      </div>
                    )}

                    <div className="p-6 sm:p-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${plan.popular ? "bg-purple-100" : "bg-violet-100"}`}>
                            <Zap className={`w-5 h-5 ${plan.popular ? "text-purple-600" : "text-violet-600"}`} />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900">{plan.name} Plan</h3>
                        </div>
                        <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-semibold px-3 py-1">
                          🚀 Live in 3 Days
                        </Badge>
                      </div>

                      <p className="text-slate-500 text-sm mb-6">{plan.description}</p>

                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl sm:text-5xl font-bold text-slate-900">
                            ${billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice}
                          </span>
                          <span className="text-slate-400 text-sm">
                            /{billingCycle === "monthly" ? "month" : "year"}
                          </span>
                        </div>
                        {billingCycle === "annual" && (
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-slate-500">
                              ~${plan.monthlyEquivalent}/mo billed annually
                            </p>
                            <Badge className="bg-green-50 text-green-700 border-green-200 text-xs font-medium">
                              Save ${plan.annualSavings}/year
                            </Badge>
                          </div>
                        )}
                      </div>

                      <Button
                        className={`w-full h-12 text-base font-semibold mb-6 ${
                          plan.popular
                            ? "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg shadow-purple-500/25"
                            : "bg-slate-900 hover:bg-slate-800 text-white"
                        }`}
                        onClick={() => handleGetStarted(plan.id)}
                        disabled={loadingPlan === plan.id}
                      >
                        {loadingPlan === plan.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Redirecting...
                          </>
                        ) : (
                          <>
                            {plan.cta}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>

                      <ul className="space-y-3">
                        {(billingCycle === "annual" ? plan.features : plan.features.filter(f => !f.startsWith("~$"))).map((feature, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm">
                            <div className={`p-0.5 rounded-full mt-0.5 flex-shrink-0 ${plan.popular ? "bg-purple-100" : "bg-slate-100"}`}>
                              <Check className={`w-3.5 h-3.5 ${plan.popular ? "text-purple-600" : "text-slate-600"}`} />
                            </div>
                            <span className="text-slate-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-purple-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Compare <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">Plans</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Choose the plan that fits your needs. Both plans include our 3-day delivery guarantee and 14-day money-back guarantee.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl shadow-xl shadow-purple-200/20 overflow-hidden border border-slate-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500">
                    <th className="text-left py-4 px-6 text-white font-semibold">Feature</th>
                    <th className="text-center py-4 px-6 text-white font-semibold bg-white/10">Starter</th>
                    <th className="text-center py-4 px-6 text-white font-semibold bg-white/20">Complete</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row, i) => (
                    <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-slate-50/50" : "bg-white"}`}>
                      <td className="py-3.5 px-6 text-slate-700 font-medium text-sm">{row.feature}</td>
                      <td className="text-center py-3.5 px-6">
                        {row.starter ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-slate-300 text-sm">—</span>
                        )}
                      </td>
                      <td className="text-center py-3.5 px-6 bg-purple-50/30">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-slate-500">Everything you need to know about our web development subscription.</p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-purple-200 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex items-center justify-between w-full p-5 text-left"
                  aria-expanded={openFaq === i}
                >
                  <h3 className="font-semibold text-slate-900 pr-4 text-sm sm:text-base">{faq.q}</h3>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                    openFaq === i ? "bg-purple-600 text-white rotate-180" : "bg-purple-100 text-purple-600"
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0 border-t border-slate-100">
                        <p className="text-slate-600 text-sm mt-3">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-purple-600 via-violet-600 to-pink-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Launch Your Website?
            </h2>
            <p className="text-purple-100 text-lg mb-8">
              Join hundreds of satisfied clients. Get your professional website in just 3 days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-purple-700 hover:bg-purple-50 font-semibold text-base px-8 h-14 shadow-xl"
                onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Zap className="w-5 h-5 mr-2" />
                Get Started Now
              </Button>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-300 text-white hover:bg-purple-500 font-semibold text-base px-8 h-14"
                >
                  Talk to Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "WPCodingPress Web Development Subscription",
            description: "Professional web development subscription service with dedicated team and 3-day delivery.",
            offers: [
              {
                "@type": "Offer",
                name: "Starter Plan",
                price: "29.00",
                priceCurrency: "USD",
                priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
                description: "Perfect if you have domain and hosting already.",
                availability: "https://schema.org/InStock",
                url: "https://wpcodingpress.com/web-dev-plans",
              },
              {
                "@type": "Offer",
                name: "Complete Plan",
                price: "59.00",
                priceCurrency: "USD",
                priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
                description: "Domain, hosting, and everything included.",
                availability: "https://schema.org/InStock",
                url: "https://wpcodingpress.com/web-dev-plans",
              },
            ],
          }),
        }}
      />
    </div>
  )
}
