"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Palette, ArrowRight, Check, ChevronDown, Layers, Palette as Themes, MousePointer, Layout, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { FloatingButtons } from "@/components/floating-buttons"

const features = [
  { icon: Layout, title: "Custom Designs", description: "Unique designs tailored to your brand identity, not generic templates." },
  { icon: MousePointer, title: "Conversion Focused", description: "Designs optimized for user engagement and conversion rate optimization." },
  { icon: Sparkles, title: "Modern Aesthetics", description: "Clean, contemporary designs that make your business stand out." },
  { icon: Themes, title: "Brand Consistency", description: "Cohesive visual language across all pages and touchpoints." },
  { icon: Layers, title: "Responsive Design", description: "Pixel-perfect across all devices: desktop, tablet, and mobile." },
  { icon: Palette, title: "Unlimited Revisions", description: "We refine until you're 100% satisfied with the final design." },
]

const process = [
  { number: "01", title: "Discovery", description: "We learn about your business, goals, target audience, and competitors." },
  { number: "02", title: "Wireframing", description: "Create layout blueprints to establish structure and user flow." },
  { number: "03", title: "Design", description: "Craft stunning visuals with attention to typography, colors, and imagery." },
  { number: "04", title: "Review & Launch", description: "Present designs, gather feedback, and prepare for development." },
]

const pricingTiers = [
  { name: "Starter", pages: "Up to 5 pages", price: "$199", features: ["Custom Design", "Mobile Responsive", "Basic SEO", "Contact Form"] },
  { name: "Professional", pages: "Up to 15 pages", price: "$399", popular: true, features: ["Everything in Starter", "Advanced Animations", "Custom Illustrations", "Icon Pack", "Priority Support"] },
  { name: "Enterprise", pages: "Unlimited pages", price: "$799", features: ["Everything in Pro", "Brand Guidelines", "Design System", "Source Files", "Dedicated Designer"] },
]

const faqs = [
  { q: "What makes your Elementor design services different?", a: "We don't just use Elementor's drag-and-drop features. We create custom widgets, dynamic content templates, and advanced CSS to achieve truly unique designs that generic Elementor sites can't match." },
  { q: "Can you work with our existing brand guidelines?", a: "Absolutely! We integrate seamlessly with existing brand identities and can help develop or refine brand guidelines if you don't have them yet." },
  { q: "Do you provide source files after the project?", a: "Yes, depending on your plan. Professional and Enterprise plans include Elementor template files, and Enterprise clients receive complete source files and brand guidelines." },
  { q: "How long does a typical design project take?", a: "A typical Elementor design project takes 2-4 weeks depending on complexity. We'll provide a detailed timeline after our discovery call." },
]

export default function ElementorProDesignPage() {
  return (
    <div className="min-h-screen bg-white">
      <FloatingButtons />
      
      <section className="pt-32 pb-20 bg-gradient-to-b from-violet-50 via-white to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="bg-violet-100 text-violet-700 border-violet-200 px-4 py-1.5 text-sm font-semibold mb-6">
                <Palette className="w-4 h-4 mr-2" />
                Premium Design Service
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Stunning <span className="gradient-text">Elementor Pro</span> Designs That Convert
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Transform your online presence with custom Elementor Pro designs that capture your brand essence 
                and drive real business results. From concept to launch, we create websites that stand out.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/order">
                  <Button className="btn-primary text-lg px-8 py-6 h-auto w-full sm:w-auto">
                    Start Your Project <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/portfolio">
                  <Button className="btn-secondary text-lg px-8 py-6 h-auto w-full sm:w-auto">
                    View Our Work
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="relative">
              <div className="bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-6">
                    <h3 className="text-white text-xl font-bold">Sample Design</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="h-32 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center">
                      <Palette className="w-16 h-16 text-violet-300" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-4 bg-slate-100 rounded w-1/2" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex-1" />
                      <div className="h-10 border-2 border-violet-200 rounded-lg flex-1" />
                    </div>
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
            <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 px-4 py-1.5 text-sm font-semibold mb-4">Why Choose Us</Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">Design Excellence <span className="gradient-text">Guaranteed</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-8 bg-white rounded-2xl border border-slate-100 hover:border-violet-200 hover:shadow-xl transition-all">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-6 shadow-lg">
                  <f.icon className="w-7 h-7 text-white" />
                </div>
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
            <Badge className="bg-pink-100 text-pink-700 border-pink-200 px-4 py-1.5 text-sm font-semibold mb-4">Our Process</Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">4 Steps to <span className="gradient-text">Design Excellence</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((s, i) => (
              <motion.div key={s.number} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative">
                <Card className="bg-white border-slate-100 p-6">
                  <div className="text-5xl font-black text-violet-100 mb-4">{s.number}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-slate-600 text-sm">{s.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200 px-4 py-1.5 text-sm font-semibold mb-4">Pricing</Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">Transparent <span className="gradient-text">Pricing</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <motion.div key={tier.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`relative ${tier.popular ? "md:-mt-4 md:mb-[-16px]" : ""}`}>
                {tier.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2"><Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-4 py-1 shadow-lg">Most Popular</Badge></div>}
                <Card className={`bg-white border-2 ${tier.popular ? "border-violet-400 shadow-xl" : "border-slate-100"} p-8 h-full`}>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{tier.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">{tier.pages}</p>
                  <div className="mb-6"><span className="text-4xl font-black text-slate-900">{tier.price}</span></div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map(f => <li key={f} className="flex items-center gap-2 text-slate-600"><Check className="w-5 h-5 text-emerald-500" />{f}</li>)}
                  </ul>
                  <Link href="/order"><Button className={`w-full ${tier.popular ? "btn-primary" : "btn-secondary"}`}>Get Started</Button></Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Stand Out?</h2>
            <p className="text-xl text-white/80 mb-10">Let's create something beautiful together.</p>
            <Link href="/contact"><Button className="bg-white text-violet-600 hover:bg-indigo-50 text-lg px-10 py-6 h-auto font-bold shadow-xl">Get Your Free Consultation</Button></Link>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 lg:px-8 text-center text-slate-400">
          © {new Date().getFullYear()} WPCodingPress. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
