"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Search, ArrowRight, Check, TrendingUp, FileText, Eye, Globe, Target, BarChart3, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { FloatingButtons } from "@/components/floating-buttons"

const features = [
  { icon: Search, title: "Technical SEO", description: "Site speed optimization, structured data, XML sitemaps, and technical audits." },
  { icon: TrendingUp, title: "Keyword Research", description: "In-depth analysis to find high-value keywords your audience is searching for." },
  { icon: FileText, title: "Content Strategy", description: "Data-driven content plans that attract and engage your target audience." },
  { icon: Eye, title: "On-Page Optimization", description: "Meta tags, headers, images, and internal linking for maximum visibility." },
  { icon: Globe, title: "Local SEO", description: "Google Business optimization and local citation building for local customers." },
  { icon: BarChart3, title: "Analytics & Reporting", description: "Track rankings, traffic, and ROI with detailed monthly reports." },
]

const pricingPlans = [
  { name: "Basic SEO", price: "$199/mo", features: ["Keyword Research", "On-Page SEO", "Monthly Reports", "5 Keywords Tracking", "Email Support"] },
  { name: "Professional SEO", price: "$499/mo", popular: true, features: ["Everything in Basic", "Content Creation (4/mo)", "Link Building", "20 Keywords Tracking", "Priority Support", "Technical Audit"] },
  { name: "Enterprise SEO", price: "$999/mo", features: ["Everything in Pro", "Content Creation (10/mo)", "PR & Outreach", "Unlimited Keywords", "Dedicated Manager", "Weekly Reports"] },
]

export default function SEOMarketingPage() {
  return (
    <div className="min-h-screen bg-white">
      <FloatingButtons />
      
      <section className="pt-32 pb-20 bg-gradient-to-b from-cyan-50 via-white to-white relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200 px-4 py-1.5 text-sm font-semibold mb-6">
                <Search className="w-4 h-4 mr-2" />
                Digital Marketing
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Dominate Search Rankings with <span className="gradient-text">SEO Excellence</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Climb to the top of Google and drive organic traffic that converts. 
                Our proven SEO strategies deliver real, measurable results for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/order"><Button className="btn-primary text-lg px-8 py-6 h-auto">Start Your SEO Journey <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
                <Button className="btn-secondary text-lg px-8 py-6 h-auto">Free SEO Audit</Button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative">
              <div className="bg-gradient-to-br from-cyan-100 via-blue-50 to-indigo-100 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center"><TrendingUp className="w-7 h-7 text-white" /></div>
                    <div><h3 className="text-2xl font-bold text-slate-900">Rankings</h3><p className="text-emerald-600">+15 positions this month</p></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl"><span className="text-slate-700">#1</span><span className="font-bold text-emerald-600">web development</span></div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl"><span className="text-slate-700">#3</span><span className="font-bold text-blue-600">wordpress to nextjs</span></div>
                    <div className="flex items-center justify-between p-3 bg-violet-50 rounded-xl"><span className="text-slate-700">#5</span><span className="font-bold text-violet-600">woocommerce development</span></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 px-4 py-1.5 text-sm font-semibold mb-4">Our Services</Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">Complete <span className="gradient-text">SEO Solutions</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-8 bg-white rounded-2xl border border-slate-100 hover:border-cyan-200 hover:shadow-xl transition-all">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-6 shadow-lg"><f.icon className="w-7 h-7 text-white" /></div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-600">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-4 py-1.5 text-sm font-semibold mb-4">Pricing</Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">Invest in Your <span className="gradient-text">Growth</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`relative ${plan.popular ? "md:-mt-4 md:mb-[-16px]" : ""}`}>
                {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2"><Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 shadow-lg">Most Popular</Badge></div>}
                <Card className={`bg-white border-2 ${plan.popular ? "border-cyan-400 shadow-xl" : "border-slate-100"} p-8 h-full`}>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="mb-6"><span className="text-4xl font-black text-slate-900">{plan.price}</span></div>
                  <ul className="space-y-3 mb-8">{plan.features.map(f => <li key={f} className="flex items-center gap-2 text-slate-600"><Check className="w-5 h-5 text-emerald-500" />{f}</li>)}</ul>
                  <Link href="/order"><Button className={`w-full ${plan.popular ? "btn-primary" : "btn-secondary"}`}>Get Started</Button></Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Rank #1?</h2>
            <p className="text-xl text-white/80 mb-10">Get a free SEO audit and discover your growth potential.</p>
            <Link href="/contact"><Button className="bg-white text-cyan-600 hover:bg-cyan-50 text-lg px-10 py-6 h-auto font-bold shadow-xl">Get Free Audit</Button></Link>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 lg:px-8 text-center text-slate-400">© {new Date().getFullYear()} WPCodingPress. All rights reserved.</div>
      </footer>
    </div>
  )
}
