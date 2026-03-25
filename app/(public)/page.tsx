"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { 
  ArrowRight, 
  Code2, 
  Palette,
  ShoppingCart, 
  Zap, 
  Sparkles,
  CheckCircle2,
  Star,
  Users,
  Clock,
  TrendingUp,
  Monitor,
  Server,
  Shield,
  Rocket
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const services = [
  {
    icon: Code2,
    title: "WordPress Development",
    description: "Custom themes, plugins, and headless WordPress solutions built for performance.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Palette,
    title: "Elementor Pro Design",
    description: "Stunning, conversion-focused designs using Elementor page builder.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: ShoppingCart,
    title: "WooCommerce Stores",
    description: "Full-featured e-commerce solutions with seamless payment integration.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Zap,
    title: "Website Redesign",
    description: "Modernize your existing website with cutting-edge design and technology.",
    color: "from-orange-500 to-yellow-500"
  }
]

const stats = [
  { icon: Users, value: "150+", label: "Happy Clients", color: "text-blue-400" },
  { icon: Clock, value: "8+", label: "Years Experience", color: "text-purple-400" },
  { icon: Star, value: "5.0", label: "Client Rating", color: "text-yellow-400" },
  { icon: TrendingUp, value: "300+", label: "Projects Delivered", color: "text-green-400" }
]

const testimonials = [
  {
    name: "Beth Moran",
    role: "UK Business Owner",
    content: "From start to finish, the process was smooth, professional, and even enjoyable. They translated my vision into a site that is not only beautiful, but functional, fast, and easy to navigate.",
    rating: 5
  }
]

const portfolioImages = [
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
  "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80"
]

const features = [
  { icon: Monitor, title: "Responsive Design", desc: "Perfect on all devices" },
  { icon: Rocket, title: "Lightning Fast", desc: "Optimized for speed" },
  { icon: Shield, title: "Secure & Safe", desc: "Best security practices" },
  { icon: Server, title: "Reliable Hosting", desc: "99.9% uptime guaranteed" },
]

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80"
            alt="Tech Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-purple-950/80 to-slate-950/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>
        
        {/* Animated Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="initial"
            animate="animate"
          >
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-sm text-blue-300 backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                AI-Powered Web Development Agency
              </span>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-white">Transform Your</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Digital Vision
              </span>
              <br />
              <span className="text-white">Into Reality</span>
            </motion.h1>

            <motion.p 
              className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              We build modern, high-performance websites using WordPress, Elementor, and cutting-edge technologies. 
              From startups to enterprises, we deliver solutions that drive results.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/order">
                <Button size="lg" className="w-full sm:w-auto text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/25">
                  Start Your Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base bg-white/10 border-white/20 hover:bg-white/20">
                  View Our Work
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <stat.icon className={`h-7 w-7 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/50 to-slate-950" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Services</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Comprehensive web development solutions tailored to your business needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 group overflow-hidden relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <CardContent className="p-6 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
                    <p className="text-sm text-slate-400 mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {["Custom Development", "SEO Optimized", "Fast Loading", "Mobile First"].map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-2 text-sm text-slate-300">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Preview Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
            alt="Team Working"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-purple-950/90 to-slate-950/95" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured <span className="bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">Portfolio</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              A showcase of our finest work and successful client collaborations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolioImages.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
              >
                <Image 
                  src={img}
                  alt={`Project ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-500/30 text-blue-300">WordPress</span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-500/30 text-purple-300">Elementor</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Project {index + 1}</h3>
                  <p className="text-sm text-slate-300">Professional business website</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/portfolio">
              <Button size="lg" className="bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-500 hover:to-orange-500">
                View Full Portfolio
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-indigo-950/30" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-500/50 transition-colors"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 via-slate-950 to-slate-950" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Transparent <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Pricing</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Choose the perfect package for your project needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Basic",
                price: "$150",
                description: "Perfect for landing pages and small business sites",
                features: ["5 Pages", "Elementor Design", "Mobile Responsive", "Contact Form", "Basic SEO"],
                color: "from-slate-700 to-slate-800",
                borderColor: "border-slate-600"
              },
              {
                name: "Standard",
                price: "$300",
                description: "Ideal for growing businesses with e-commerce needs",
                features: ["10 Pages", "WooCommerce Setup", "Payment Integration", "Speed Optimization", "Priority Support"],
                color: "from-blue-600 to-purple-600",
                borderColor: "border-blue-500",
                popular: true
              },
              {
                name: "Premium",
                price: "$500+",
                description: "Full custom solution for complex requirements",
                features: ["Unlimited Pages", "Custom Development", "Booking System", "Stripe/PayPal", "24/7 Support"],
                color: "from-amber-600 to-orange-600",
                borderColor: "border-amber-500"
              }
            ].map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full relative bg-gradient-to-br ${plan.color} border-2 ${plan.borderColor} overflow-hidden`}>
                  {plan.popular && (
                    <div className="absolute -top-0 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1.5 text-xs font-bold rounded-b-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <CardContent className="p-6 pt-10">
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-black text-white">{plan.price}</span>
                    </div>
                    <p className="text-sm text-white/80 mb-6">{plan.description}</p>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-2 text-sm text-white/90">
                          <CheckCircle2 className="h-5 w-5 text-green-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href="/order" className="block">
                      <Button className={`w-full ${plan.popular ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-white/20 hover:bg-white/30 text-white'}`}>
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80"
            alt="Office"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/95 via-purple-950/90 to-slate-950/95" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-white">
                  BM
                </div>
                <div className="flex gap-1 justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-lg md:text-xl text-white mb-6 italic leading-relaxed">
                  "{testimonials[0].content}"
                </blockquote>
                <div className="border-t border-white/20 pt-6">
                  <div className="font-bold text-white text-lg">{testimonials[0].name}</div>
                  <div className="text-sm text-slate-300">{testimonials[0].role}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&q=80"
            alt="Meeting"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-purple-950/85 to-indigo-950/90" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[150px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your <span className="bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">Project?</span>
            </h2>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
              Let&apos;s discuss your project requirements and bring your vision to life. 
              Get a free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/order">
                <Button size="lg" className="text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-purple-500/25 px-10">
                  Start Your Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-base bg-white/10 border-white/20 hover:bg-white/20 px-10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
