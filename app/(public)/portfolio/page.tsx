"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ExternalLink, Eye, ArrowRight, Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const portfolioItems = [
  {
    id: 1,
    title: "HomePicks Daily",
    category: "E-Commerce",
    description: "WooCommerce dropshipping e-commerce website with payment integration",
    client: "Beth Moran",
    tech: ["WordPress", "WooCommerce", "Elementor"],
    color: "from-green-500 to-emerald-500",
    liveUrl: "#"
  },
  {
    id: 2,
    title: "Trip Monarch",
    category: "Travel Portal",
    description: "Flight and bus booking travel portal with booking system",
    client: "Trip Monarch",
    tech: ["WordPress", "Booking System", "Elementor"],
    color: "from-blue-500 to-cyan-500",
    liveUrl: "#"
  },
  {
    id: 3,
    title: "RankUpper",
    category: "SEO Agency",
    description: "Professional SEO agency website with lead generation",
    client: "RankUpper",
    tech: ["WordPress", "Elementor Pro", "SEO Tools"],
    color: "from-purple-500 to-pink-500",
    liveUrl: "#"
  },
  {
    id: 4,
    title: "Pro Consultant",
    category: "Consulting",
    description: "Professional consultant portfolio and booking website",
    client: "Pro Consultant UK",
    tech: ["WordPress", "Elementor", "Custom Plugin"],
    color: "from-orange-500 to-amber-500",
    liveUrl: "#"
  },
  {
    id: 5,
    title: "Masjid Press",
    category: "Non-Profit",
    description: "Islamic organization website with donation system",
    client: "Masjid Press",
    tech: ["WordPress", "Donation Plugin", "Elementor"],
    color: "from-indigo-500 to-purple-500",
    liveUrl: "#"
  },
  {
    id: 6,
    title: "Movie Server",
    category: "Entertainment",
    description: "Video streaming and server management platform",
    client: "Movie Server BD",
    tech: ["WordPress", "Custom Theme", "Video Plugin"],
    color: "from-red-500 to-pink-500",
    liveUrl: "#"
  },
  {
    id: 7,
    title: "Construction BD",
    category: "Construction",
    description: "Construction company portfolio with project showcase",
    client: "BuildTech BD",
    tech: ["WordPress", "Elementor", "Portfolio"],
    color: "from-yellow-500 to-orange-500",
    liveUrl: "#"
  },
  {
    id: 8,
    title: "Virtual Assistant",
    category: "Services",
    description: "Virtual assistant services website with booking",
    client: "Beth VA Services",
    tech: ["WordPress", "Elementor Pro", "Booking"],
    color: "from-cyan-500 to-blue-500",
    liveUrl: "#"
  },
  {
    id: 9,
    title: "E-Commerce Giant",
    category: "E-Commerce",
    description: "Full-featured dropshipping e-commerce store",
    client: "EcomGiantz",
    tech: ["WordPress", "WooCommerce", "Payment"],
    color: "from-pink-500 to-rose-500",
    liveUrl: "#"
  }
]

const categories = ["All", "E-Commerce", "Travel Portal", "SEO Agency", "Consulting", "Non-Profit", "Entertainment", "Construction", "Services"]

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  
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
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Card className="overflow-hidden bg-slate-900/50 border-slate-700/50 hover:border-slate-500 transition-all duration-500">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-full h-full bg-gradient-to-br ${item.color} opacity-20`} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Globe className={`h-20 w-20 ${item.color.replace('from-', 'text-')} opacity-50`} />
                        <span className="mt-4 text-lg font-semibold text-white">{item.title}</span>
                        <span className="text-sm text-slate-400">{item.category}</span>
                      </div>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className={`absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 transition-opacity duration-300 ${hoveredId === item.id ? 'opacity-100' : 'opacity-0'}`}>
                      <Button 
                        variant="outline" 
                        className="bg-white/10 border-white/20 hover:bg-white/20"
                        onClick={() => window.open(item.liveUrl, '_blank')}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visit Live Site
                      </Button>
                      <Link href={`/portfolio/${item.id}`}>
                        <Button variant="ghost" className="text-white">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <Badge 
                      variant="outline"
                      className={`mb-4 bg-gradient-to-r ${item.color} text-white border-0`}
                    >
                      {item.category}
                    </Badge>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.tech.map((tech, tIndex) => (
                        <span key={tIndex} className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-800">
                      <span className="text-xs text-slate-500">Client: </span>
                      <span className="text-xs text-slate-300">{item.client}</span>
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
            <Link href="/order">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}