"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingCart, ArrowRight, Check, CreditCard, Truck, Shield, Headphones, BarChart3, Globe, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { FloatingButtons } from "@/components/floating-buttons"

const features = [
  { icon: ShoppingCart, title: "Custom Store Design", description: "Beautiful, conversion-optimized storefronts that showcase your products perfectly." },
  { icon: CreditCard, title: "Secure Payments", description: "Integrate Stripe, PayPal, and 50+ payment gateways with fraud protection." },
  { icon: Truck, title: "Shipping Solutions", description: "Real-time shipping rates, label printing, and tracking integration." },
  { icon: BarChart3, title: "Advanced Analytics", description: "Track sales, customer behavior, and inventory with powerful dashboards." },
  { icon: Shield, title: "Security First", description: "PCI-compliant checkout, SSL encryption, and fraud detection built-in." },
  { icon: Headphones, title: "24/7 Support", description: "Ongoing support and maintenance to keep your store running smoothly." },
]

const pricingPlans = [
  { name: "Starter", price: "$299", features: ["Up to 50 products", "2 Payment Gateways", "Basic Shipping", "Email Support", "Mobile Responsive"] },
  { name: "Professional", price: "$599", popular: true, features: ["Up to 500 products", "All Payment Gateways", "Advanced Shipping", "Priority Support", "Analytics Dashboard", "Coupon System"] },
  { name: "Enterprise", price: "$999", features: ["Unlimited Products", "Multi-vendor Support", "Custom Integrations", "Dedicated Support", "API Access", "Custom Development"] },
]

export default function WooCommerceStoresPage() {
  return (
    <div className="min-h-screen bg-white">
      <FloatingButtons />
      
      <section className="pt-32 pb-20 bg-gradient-to-b from-pink-50 via-white to-white relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="bg-pink-100 text-pink-700 border-pink-200 px-4 py-1.5 text-sm font-semibold mb-6">
                <ShoppingCart className="w-4 h-4 mr-2" />
                E-Commerce Solutions
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Powerful <span className="gradient-text">WooCommerce</span> Stores That Sell
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Build a professional online store that converts visitors into customers. 
                From setup to launch, we create WooCommerce stores that drive sales.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/order"><Button className="btn-primary text-lg px-8 py-6 h-auto">Start Your Store <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
                <Link href="/portfolio"><Button className="btn-secondary text-lg px-8 py-6 h-auto">View Stores</Button></Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative">
              <div className="bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center"><ShoppingCart className="w-7 h-7 text-white" /></div>
                    <div><h3 className="text-2xl font-bold text-slate-900">Sales Dashboard</h3><p className="text-emerald-600">+40% this month</p></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-pink-50 rounded-xl text-center"><div className="text-2xl font-bold text-slate-900">156</div><div className="text-xs text-slate-500">Orders</div></div>
                    <div className="p-4 bg-emerald-50 rounded-xl text-center"><div className="text-2xl font-bold text-emerald-600">$12.4k</div><div className="text-xs text-slate-500">Revenue</div></div>
                    <div className="p-4 bg-violet-50 rounded-xl text-center"><div className="text-2xl font-bold text-violet-600">89%</div><div className="text-xs text-slate-500">Conv. Rate</div></div>
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
            <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 px-4 py-1.5 text-sm font-semibold mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">Everything You Need to <span className="gradient-text">Sell Online</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-8 bg-white rounded-2xl border border-slate-100 hover:border-pink-200 hover:shadow-xl transition-all">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-6 shadow-lg"><f.icon className="w-7 h-7 text-white" /></div>
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">Choose Your <span className="gradient-text">Plan</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`relative ${plan.popular ? "md:-mt-4 md:mb-[-16px]" : ""}`}>
                {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2"><Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-1 shadow-lg">Most Popular</Badge></div>}
                <Card className={`bg-white border-2 ${plan.popular ? "border-pink-400 shadow-xl" : "border-slate-100"} p-8 h-full`}>
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

      <section className="py-20 bg-gradient-to-br from-pink-600 via-rose-600 to-purple-600 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Launch Your Store?</h2>
            <p className="text-xl text-white/80 mb-10">Start selling today with a professional WooCommerce store.</p>
            <Link href="/contact"><Button className="bg-white text-pink-600 hover:bg-pink-50 text-lg px-10 py-6 h-auto font-bold shadow-xl">Get Started Now</Button></Link>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 lg:px-8 text-center text-slate-400">© {new Date().getFullYear()} WPCodingPress. All rights reserved.</div>
      </footer>
    </div>
  )
}
