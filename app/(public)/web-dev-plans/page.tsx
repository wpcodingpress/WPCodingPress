"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  ArrowRight,
  Star,
  Shield,
  Clock,
  RefreshCw,
  HeartHandshake,
  ChevronDown,
  Loader2,
  Zap,
  Crown,
  Sparkles,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WEB_DEV_PLANS, type BillingCycle, type WebDevPlan } from "@/lib/web-dev-service"

const PLANS = [
  {
    ...WEB_DEV_PLANS.STARTER,
    id: "STARTER" as WebDevPlan,
    description: "Best if you already own a domain and hosting. We handle design, development, content, and launch.",
    cta: "Get Started",
    icon: Zap,
    popular: false,
  },
  {
    ...WEB_DEV_PLANS.COMPLETE,
    id: "COMPLETE" as WebDevPlan,
    description: "Fully managed — we register your domain, set up hosting, design, develop, and launch your site.",
    cta: "Get Started",
    icon: Crown,
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
  { feature: "Your Choice of Platform", starter: true, complete: true },
  { feature: "Delivery Within 3 Business Days*", starter: true, complete: true },
  { feature: "Monthly Maintenance & Updates", starter: true, complete: true },
  { feature: "Domain Registration", starter: false, complete: true },
  { feature: "Premium Hosting Included", starter: false, complete: true },
  { feature: "SSL Certificate", starter: false, complete: true },
  { feature: "Professional Email Setup", starter: false, complete: true },
]

const faqs = [
  {
    q: "How does the subscription billing work?",
    a: "You pay a fixed monthly or annual fee. With the annual plan, you save up to $118 compared to monthly billing. All payments are processed securely through Gumroad. You can cancel anytime.",
  },
  {
    q: "What if I already have a domain and hosting?",
    a: "The Starter Plan is perfect for you! Just provide us with your domain name and hosting login details during onboarding, and we'll handle the rest. Your existing hosting and domain will be fully utilized.",
  },
  {
    q: "Can I switch from Starter to Complete later?",
    a: "Absolutely! You can upgrade anytime from your dashboard. We'll prorate the difference and handle the transition smoothly. Your dedicated project manager will assist you with the upgrade process.",
  },
  {
    q: "What platforms can you build on?",
    a: "We build on WordPress, Elementor, WooCommerce, Next.js, and React. You choose what works best for your needs, and our team will recommend the optimal platform based on your project requirements.",
  },
  {
    q: "Is 3-day delivery really guaranteed?",
    a: "Yes! For most standard projects, we deliver within 3 business days after the project discussion. Complex projects may take 5-7 business days. We'll confirm the timeline during the initial discussion phase.",
  },
  {
    q: "What happens if I cancel my subscription?",
    a: "You can cancel anytime with no penalties. Your website will remain live and you'll retain full access until the end of your billing period. We'll provide you with all files, credentials, and a backup before cancellation takes effect.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes, we offer a 14-day money-back guarantee on all plans. If you're not satisfied with the initial design concepts, we'll refund your first payment in full, no questions asked.",
  },
  {
    q: "How do I communicate with my project manager?",
    a: "You'll be assigned a dedicated project manager who will communicate with you via WhatsApp, email, or your preferred channel. You can also track real-time project progress from your client dashboard.",
  },
]

const trustItems = [
  { icon: Clock, label: "3-Day Delivery" },
  { icon: RefreshCw, label: "Cancel Anytime" },
  { icon: Shield, label: "No Hidden Fees" },
  { icon: HeartHandshake, label: "100% Satisfaction" },
]

export default function WebDevPlansPage() {
  const router = useRouter()
  const { data: session, status: authStatus } = useSession()
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly")
  const [loadingPlan, setLoadingPlan] = useState<WebDevPlan | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGetStarted = async (plan: WebDevPlan) => {
    setError(null)

    if (authStatus === "unauthenticated") {
      router.push("/login?callbackUrl=/web-dev-plans")
      return
    }

    if (authStatus === "loading") {
      return
    }

    setLoadingPlan(plan)

    try {
      const response = await fetch("/api/web-dev-subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billingCycle }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login?callbackUrl=/web-dev-plans")
          return
        }
        setError(data.error || "Something went wrong. Please try again.")
        return
      }

      if (data.redirectTo) {
        router.push(data.redirectTo)
        return
      }

      if (data.url) {
        window.location.href = data.url
        return
      }

      if (data.alreadyActive) {
        router.push("/dashboard/web-dev")
        return
      }

      setError("Unexpected response. Please try again.")
    } catch (err) {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoadingPlan(null)
    }
  }

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-purple-100/60 blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-violet-100/50 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-pink-50/40 blur-[150px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Web Development Subscription</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-[1.1] tracking-tight">
              Your Professional Website,{" "}
              <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
                Delivered in 3 Days
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Stop struggling with website development. Get a stunning, SEO-optimized website built by a dedicated team of experts — with fast delivery, unlimited revisions, and ongoing support.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {trustItems.map((item) => (
                <div
                  key={item.label}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm"
                >
                  <item.icon className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div
            className="flex items-center justify-center gap-4 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span
              className={`text-sm font-semibold transition-colors duration-300 ${
                billingCycle === "monthly" ? "text-slate-900" : "text-slate-400"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
              className="relative w-16 h-8 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 shadow-md shadow-purple-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              aria-label={`Switch to ${billingCycle === "monthly" ? "annual" : "monthly"} billing`}
            >
              <motion.div
                className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-sm"
                animate={{ left: billingCycle === "annual" ? "calc(100% - 28px)" : "4px" }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            </button>
            <span
              className={`text-sm font-semibold transition-colors duration-300 ${
                billingCycle === "annual" ? "text-slate-900" : "text-slate-400"
              }`}
            >
              Annual
            </span>
            {billingCycle === "annual" && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200"
              >
                Save up to $118/year
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-red-50 border border-red-200 text-red-700 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3"
          >
            <span className="text-sm">{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              <span className="text-lg leading-none">&times;</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pricing Cards */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {PLANS.map((plan, index) => {
              const PlanIcon = plan.icon
              return (
                <motion.div
                  key={`${plan.id}-${billingCycle}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 + 0.3, duration: 0.6 }}
                  className={`relative ${plan.popular ? "lg:-mt-4 lg:mb-[-1rem]" : ""}`}
                >
                  <div
                    className={`h-full bg-white rounded-3xl border-2 overflow-hidden transition-all duration-300 ${
                      plan.popular
                        ? "border-purple-500 shadow-2xl shadow-purple-500/15"
                        : "border-slate-200 hover:border-purple-300 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-purple-500/10"
                    }`}
                  >
                    {plan.popular && (
                      <div className="relative h-2 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500" />
                    )}

                    {plan.popular && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white text-xs font-bold rounded-full shadow-lg shadow-purple-500/30 flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          MOST POPULAR
                        </div>
                      </div>
                    )}

                    <div className="p-6 sm:p-8 lg:p-10">
                      {/* Plan Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <div
                          className={`p-3 rounded-2xl ${
                            plan.popular ? "bg-purple-100" : "bg-slate-100"
                          }`}
                        >
                          <PlanIcon
                            className={`w-6 h-6 ${
                              plan.popular ? "text-purple-600" : "text-slate-600"
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">{plan.name} Plan</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-sm text-slate-500">{plan.description}</span>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mb-6 pb-6 border-b border-slate-100">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
                            ${billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice}
                          </span>
                          <span className="text-lg text-slate-400 font-medium">
                            /{billingCycle === "monthly" ? "month" : "year"}
                          </span>
                        </div>
                        {billingCycle === "annual" && (
                          <div className="flex items-center gap-3 mt-3">
                            <span className="text-sm text-slate-500">
                              ~${plan.monthlyEquivalent}/mo
                            </span>
                            <span className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200">
                              Save ${plan.annualSavings}/year
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 mt-2">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-xs text-amber-600 font-medium">
                            🚀 Live in 3 Business Days
                          </span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button
                        className={`w-full h-14 text-base font-semibold mb-6 rounded-xl transition-all duration-200 ${
                          plan.popular
                            ? "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 active:scale-[0.98]"
                            : "bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200 hover:shadow-xl active:scale-[0.98]"
                        }`}
                        onClick={() => handleGetStarted(plan.id)}
                        disabled={loadingPlan === plan.id || authStatus === "loading"}
                      >
                        {loadingPlan === plan.id ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : authStatus === "loading" ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Checking...
                          </>
                        ) : (
                          <>
                            {plan.cta}
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>

                      {/* Features */}
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">
                          Everything Included:
                        </h4>
                        <ul className="space-y-3">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm">
                              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-slate-600 leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Compare <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">Plans</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Both plans include our 3-day delivery guarantee, dedicated team, and 14-day money-back guarantee.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-bold text-slate-900 bg-slate-50 border-b border-slate-200">
                      Features
                    </th>
                    <th className="text-center py-4 px-6 text-sm font-bold text-slate-900 bg-slate-50 border-b border-slate-200">
                      Starter
                    </th>
                    <th className="text-center py-4 px-6 text-sm font-bold text-purple-900 bg-purple-50 border-b border-purple-200">
                      Complete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row, i) => (
                    <tr
                      key={i}
                      className={`border-b border-slate-100 transition-colors hover:bg-slate-50/50 ${
                        i % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                      }`}
                    >
                      <td className="py-4 px-6 text-slate-700 font-medium text-sm">{row.feature}</td>
                      <td className="text-center py-4 px-6">
                        {row.starter ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-slate-300 text-lg">&mdash;</span>
                        )}
                      </td>
                      <td className="text-center py-4 px-6 bg-purple-50/30">
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
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know about our web development subscription service.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex items-center justify-between w-full px-6 py-5 text-left"
                  aria-expanded={openFaq === i}
                >
                  <span className="font-semibold text-slate-900 pr-4 text-sm sm:text-base">{faq.q}</span>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                      openFaq === i
                        ? "bg-purple-600 text-white rotate-180"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-0 border-t border-slate-100">
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-4">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-20 left-0 w-80 h-80 bg-violet-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Ready to Launch Your Website?
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join hundreds of satisfied clients. Get your professional website in just 3 days — no hassle, no stress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100 font-semibold text-base px-8 h-14 shadow-xl rounded-xl"
                onClick={() =>
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-500 text-slate-200 hover:bg-slate-800 font-semibold text-base px-8 h-14 rounded-xl"
                asChild
              >
                <a href="/contact">Talk to Sales</a>
              </Button>
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
    </>
  )
}
