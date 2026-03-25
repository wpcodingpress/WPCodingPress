"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ExternalLink, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const portfolioItems = [
  {
    id: 1,
    title: "Medical Spa Website",
    category: "Healthcare",
    description: "Complete medical spa website with booking system and patient portal",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    title: "E-commerce Fashion Store",
    category: "E-commerce",
    description: "WooCommerce store with modern design and seamless checkout",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    color: "from-pink-500 to-rose-500"
  },
  {
    id: 3,
    title: "Law Firm Portal",
    category: "Professional Services",
    description: "Corporate website with case management and client portal",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
    color: "from-indigo-500 to-blue-500"
  },
  {
    id: 4,
    title: "Restaurant Booking App",
    category: "Food & Beverage",
    description: "Online ordering and reservation system with menu management",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    color: "from-orange-500 to-amber-500"
  },
  {
    id: 5,
    title: "Real Estate Platform",
    category: "Real Estate",
    description: "Property listings with advanced search and virtual tours",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    color: "from-emerald-500 to-green-500"
  },
  {
    id: 6,
    title: "Fitness Studio",
    category: "Health & Fitness",
    description: "Gym website with class scheduling and membership management",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    color: "from-red-500 to-pink-500"
  },
  {
    id: 7,
    title: "Online Academy",
    category: "Education",
    description: "Learning management system with video courses and progress tracking",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80",
    color: "from-purple-500 to-indigo-500"
  },
  {
    id: 8,
    title: "Beauty Salon",
    category: "Beauty",
    description: "Salon website with appointment booking and service showcase",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
    color: "from-rose-500 to-pink-500"
  },
  {
    id: 9,
    title: "SaaS Dashboard",
    category: "Technology",
    description: "Custom web application dashboard with analytics and reporting",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    color: "from-cyan-500 to-blue-500"
  }
]

const categories = ["All", "Healthcare", "E-commerce", "Professional Services", "Technology", "Education", "Real Estate", "Health & Fitness", "Food & Beverage", "Beauty"]

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  
  const filteredItems = activeCategory === "All" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory)
  
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&q=80"
            alt="Portfolio Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/95 via-purple-950/90 to-slate-950/95" />
        </div>
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[150px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Our <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Portfolio</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300">
              Explore our collection of successful projects. Each website represents our commitment 
              to quality, innovation, and client satisfaction.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950" />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActiveCategory(category)}
              >
                <Badge 
                  variant={activeCategory === category ? "default" : "outline"}
                  className={`px-4 py-2 text-sm cursor-pointer transition-all hover:scale-105 ${
                    activeCategory === category 
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500" 
                      : "border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500"
                  }`}
                >
                  {category}
                </Badge>
              </motion.div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group"
              >
                <Card className="overflow-hidden bg-slate-900/50 border-slate-700/50 hover:border-slate-500 transition-all duration-500">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image 
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                    
                    {/* Overlay Icons */}
                    <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300" style={{ transitionDelay: '50ms' }}>
                        <ExternalLink className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <Badge 
                      variant="outline"
                      className={`mb-4 bg-gradient-to-r ${item.color} text-white border-0`}
                    >
                      {item.category}
                    </Badge>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:${item.color} group-hover:bg-clip-text transition-all">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {item.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color}`} />
                      WordPress / Elementor
                    </div>
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
            <p className="text-slate-400 mb-6 text-lg">
              Ready to add your project to our portfolio?
            </p>
            <a 
              href="/order"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
            >
              Start Your Project
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
