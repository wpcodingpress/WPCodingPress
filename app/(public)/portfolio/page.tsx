"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Eye, ArrowRight, Globe, X, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const portfolioItems = [
  { id: 1, title: "HomePicks Daily", category: "E-Commerce", client: "Beth Moran", liveUrl: "https://homepicksdaily.com", image: "/portfolio/HomePicksDaily- A Woocommerce Based Dropshipping E-Commerce Website Front Page.jpeg", description: "WooCommerce dropshipping e-commerce website with payment integration" },
  { id: 2, title: "Trip Monarch", category: "Travel", client: "Trip Monarch", liveUrl: "https://tripmonarch.com", image: "/portfolio/tripmonarch.png", description: "Flight and bus booking travel portal with booking system" },
  { id: 3, title: "RankUpper", category: "SEO Agency", client: "RankUpper", liveUrl: "https://rankupper.io", image: "/portfolio/RankUpper.png", description: "Professional SEO agency website with lead generation" },
  { id: 4, title: "Pro Consultant", category: "Consulting", client: "Pro Consultant UK", liveUrl: "https://proconsultant.co.uk", image: "/portfolio/Pro Consultant.png", description: "Professional consultant portfolio and booking website" },
  { id: 5, title: "Masjid Press", category: "Non-Profit", client: "Masjid Press", liveUrl: "https://masjidpress.com", image: "/portfolio/masjidpress.com.png", description: "Islamic organization website with donation system" },
  { id: 6, title: "EcomGiantz", category: "E-Commerce", client: "EcomGiantz", liveUrl: "https://ecomgiantz.com", image: "/portfolio/ecomgianrtz.png", description: "Full-featured dropshipping e-commerce store" },
]

const categories = ["All", "E-Commerce", "Travel", "SEO Agency", "Consulting", "Non-Profit"]

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedItem, setSelectedItem] = useState<typeof portfolioItems[0] | null>(null)
  
  const filteredItems = activeCategory === "All" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory)
  
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 px-4 py-1.5 text-sm font-medium mb-6">
              Our Portfolio
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Featured <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Projects</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Real websites we've transformed for our clients. Each project represents our commitment to quality and excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${
                  activeCategory === category 
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25" 
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                }`}
              >
                {category}
              </motion.button>
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
                <div 
                  className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/80 flex items-center justify-center backdrop-blur-sm">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
                      {item.category}
                    </Badge>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-sm mb-4">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Client: {item.client}</span>
                      {item.liveUrl && (
                        <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          <Button size="sm" variant="ghost" className="text-indigo-400 hover:text-indigo-300">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Visit
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
                <button
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-900/80 flex items-center justify-center hover:bg-slate-800 backdrop-blur-sm"
                  onClick={() => setSelectedItem(null)}
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="p-8">
                <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-4">
                  {selectedItem.category}
                </Badge>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedItem.title}</h2>
                <p className="text-slate-400 mb-6">{selectedItem.description}</p>
                <div className="flex gap-4">
                  {selectedItem.liveUrl && (
                    <a href={selectedItem.liveUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Live Site
                      </Button>
                    </a>
                  )}
                  <Button variant="outline" onClick={() => setSelectedItem(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="py-24 px-6 bg-slate-800/50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Add Your Project Here?
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join our satisfied clients and get your website transformed today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/order">
              <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-10 py-6 h-auto font-bold">
                Start Your Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-2 border-slate-600 text-white hover:bg-slate-800 px-10 py-6 h-auto">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
