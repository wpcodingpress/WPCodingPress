"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Code2, Palette, Zap, Users, Award, Clock, Star, CheckCircle2, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const skills = [
  { name: "WordPress Development", level: 95, color: "from-blue-500 to-cyan-500" },
  { name: "Elementor Pro", level: 90, color: "from-purple-500 to-pink-500" },
  { name: "WooCommerce", level: 88, color: "from-green-500 to-emerald-500" },
  { name: "React / Next.js", level: 85, color: "from-cyan-500 to-blue-500" },
  { name: "PHP / MySQL", level: 90, color: "from-indigo-500 to-purple-500" },
  { name: "SEO Optimization", level: 85, color: "from-yellow-500 to-orange-500" },
]

const values = [
  {
    icon: Users,
    title: "Client-First Approach",
    description: "Your success is our priority. We listen, understand, and deliver beyond expectations.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Zap,
    title: "Quality & Performance",
    description: "We build websites that are fast, secure, and scalable. No compromises on quality.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description: "We respect deadlines and communicate proactively throughout the project.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Award,
    title: "Continuous Support",
    description: "Our relationship doesn't end at delivery. We're here for ongoing maintenance and growth.",
    color: "from-orange-500 to-yellow-500"
  }
]

const experience = [
  { years: "8+", label: "Years Experience", color: "from-blue-600 to-cyan-500" },
  { years: "150+", label: "Happy Clients", color: "from-purple-600 to-pink-500" },
  { years: "300+", label: "Projects Completed", color: "from-green-600 to-emerald-500" },
  { years: "5.0", label: "Average Rating", color: "from-yellow-500 to-amber-500" },
]

export default function AboutPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-violet-50">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              About <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">WPCodingPress</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600">
              We're more than a web development agency. We're your partners in digital success, 
              combining technical expertise with creative vision.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Experience Stats */}
      <section className="py-16 bg-white">
        
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {experience.map((exp, index) => (
              <motion.div
                key={exp.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100"
              >
                <div className={`text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r ${exp.color} bg-clip-text text-transparent`}>
                  {exp.years}
                </div>
                <div className="text-slate-700 font-medium">{exp.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-violet-50">
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Our <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Story</span>
              </h2>
              <div className="space-y-5 text-slate-600">
                <p>
                  Founded with a passion for creating exceptional digital experiences, 
                  WPCodingPress has grown from a solo developer operation into a full-service 
                  web development agency.
                </p>
                <p>
                  With over 8 years of hands-on experience in WordPress development, we've 
                  helped businesses across industries transform their online presence. From 
                  medical spas to e-commerce stores, from local businesses to professional services, 
                  we've seen it all and delivered excellence every time.
                </p>
                <p>
                  Our approach combines technical expertise with a deep understanding of business 
                  goals. We don't just build websites – we create digital assets that drive 
                  real results: more leads, more sales, and more growth for your business.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <MapPin className="h-5 w-5 text-purple-400" />
                <span className="text-slate-300">Based in Dhaka, Bangladesh</span>
                <span className="text-slate-600">|</span>
                <Calendar className="h-5 w-5 text-blue-400" />
                <span className="text-slate-300">Est. 2016</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                      <Code2 className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">Rahman</h3>
                      <p className="text-slate-600">Founder & Lead Developer</p>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 italic leading-relaxed">
                    "I believe every business deserves a website that not only looks great 
                    but performs exceptionally. My mission is to make that a reality for 
                    each and every client."
                  </p>
                </CardContent>
              </Card>
              
              {/* Floating decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-pink-200 to-orange-200 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full blur-xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Expertise</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Years of experience and continuous learning keep us at the cutting edge
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-5 rounded-xl bg-slate-50 border border-slate-200"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-900 font-medium">{skill.name}</span>
                  <span className="text-slate-500 text-sm">{skill.level}%</span>
                </div>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.2 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-violet-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Us</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-white border-slate-200 hover:border-purple-300 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{value.title}</h3>
                    <p className="text-sm text-slate-600">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-slate-600 mb-6">
              Ready to work with us? Let's create something amazing together.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/order">
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500">
                  Start Your Project
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                  Get In Touch
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
