"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Code2, ArrowRight, Check, Layout, Database, Globe, Zap, Shield, Code, Smartphone, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { FloatingButtons } from "@/components/floating-buttons"

const features = [
  { icon: Code, title: "React & Next.js", description: "Modern frameworks for fast, scalable, and SEO-friendly web applications." },
  { icon: Layout, title: "Custom Dashboards", description: "Data visualization and admin panels tailored to your business needs." },
  { icon: Database, title: "API Development", description: "RESTful and GraphQL APIs that power your applications seamlessly." },
  { icon: Smartphone, title: "Responsive Design", description: "Pixel-perfect interfaces that work flawlessly on all devices." },
  { icon: Shield, title: "Security First", description: "Enterprise-grade security with authentication, authorization, and encryption." },
  { icon: Server, title: "Scalable Architecture", description: "Cloud-native solutions that grow with your business." },
]

const pricingPlans = [
  { name: "Landing Page", price: "From $499", features: ["Single Page App", "Responsive Design", "Basic Animations", "Contact Form", "SEO Optimized"] },
  { name: "Web Application", price: "From $1,499", popular: true, features: ["Full Web App", "User Authentication", "Database Integration", "API Development", "Admin Dashboard", "Deployment"] },
  { name: "Custom SaaS", price: "From $4,999", features: ["Enterprise Solution", "Multi-tenancy", "Custom Integrations", "Billing System", "Priority Support", "Source Code"] },
]

export default function WebApplicationsPage() {
  return (
    <div className="min-h-screen bg-white">
      <FloatingButtons />
      
      <section className="pt-32 pb-20 bg-gradient-to-b from-emerald-50 via-white to-white relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-4 py-1.5 text-sm font-semibold mb-6">
                <Code2 className="w-4 h-4 mr-2" />
                Custom Development
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Build Powerful <span className="gradient-text">Web Applications</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                From idea to launch, we create custom web applications using cutting-edge technology. 
                React, Next.js, and cloud-native architecture for apps that scale.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/order"><Button className="btn-primary text-lg px-8 py-6 h-auto">Start Your Project <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
                <Link href="/portfolio"><Button className="btn-secondary text-lg px-8 py-6 h-auto">View Our Work</Button></Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative">
              <div className="bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 rounded-3xl p-8 shadow-2xl">
                <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg">
                  <div className="bg-slate-800 px-4 py-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-4 text-slate-400 text-sm">app.js</span>
                  </div>
                  <div className="p-6 font-mono text-sm">
                    <div className="text-slate-500">// Build something amazing</div>
                    <div className="text-emerald-400">const</div>
                    <div className="text-white"> app = <span className="text-amber-400">await</span> <span className="text-cyan-400">createApp</span>()</div>
                    <div className="text-white ml-4">.<span className="text-violet-400">use</span>(<span className="text-emerald-400">React</span>)</div>
                    <div className="text-white ml-4">.<span className="text-violet-400">deploy</span>()</div>
                    <div className="text-emerald-400 mt-2">console<span className="text-amber-400">.log</span>(<span className="text-green-400">"Launching..."</span>)</div>
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
            <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 px-4 py-1.5 text-sm font-semibold mb-4">What We Build</Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">Modern <span className="gradient-text">Web Solutions</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-8 bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6 shadow-lg"><f.icon className="w-7 h-7 text-white" /></div>
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
            <Badge className="bg-violet-100 text-violet-700 border-violet-200 px-4 py-1.5 text-sm font-semibold mb-4">Pricing</Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">Transparent <span className="gradient-text">Pricing</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`relative ${plan.popular ? "md:-mt-4 md:mb-[-16px]" : ""}`}>
                {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2"><Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1 shadow-lg">Most Popular</Badge></div>}
                <Card className={`bg-white border-2 ${plan.popular ? "border-emerald-400 shadow-xl" : "border-slate-100"} p-8 h-full`}>
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

      <section className="py-20 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Have a Project in Mind?</h2>
            <p className="text-xl text-white/80 mb-10">Let's discuss your requirements and build something amazing.</p>
            <Link href="/contact"><Button className="bg-white text-emerald-600 hover:bg-emerald-50 text-lg px-10 py-6 h-auto font-bold shadow-xl">Start Conversation</Button></Link>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 lg:px-8 text-center text-slate-400">© {new Date().getFullYear()} WPCodingPress. All rights reserved.</div>
      </footer>
    </div>
  )
}
