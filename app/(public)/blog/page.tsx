"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, Clock, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  author: string
  category: string
  tags: string
  publishedAt: string
  readingTime: number
}

const defaultPosts: BlogPost[] = [
  { id: "1", slug: "wordpress-to-nextjs-migration-guide", title: "Complete Guide to Migrating from WordPress to Next.js in 2026", excerpt: "Learn the step-by-step process of migrating your WordPress website to Next.js.", content: "", coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", author: "WPCodingPress Team", category: "Development", tags: "WordPress,Next.js,Migration", publishedAt: "2026-04-10", readingTime: 15 },
  { id: "2", slug: "saas-business-growth-strategies", title: "10 Proven Strategies to Grow Your SaaS Business in 2026", excerpt: "Discover the most effective tactics for scaling your SaaS startup.", content: "", coverImage: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&q=80", author: "WPCodingPress Team", category: "Business", tags: "SaaS,Growth", publishedAt: "2026-04-05", readingTime: 12 },
  { id: "3", slug: "ai-web-development-future", title: "How AI is Revolutionizing Web Development in 2026", excerpt: "Explore how AI and ML are transforming the way we build websites.", content: "", coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad9be?w=800&q=80", author: "WPCodingPress Team", category: "Technology", tags: "AI,Web Development", publishedAt: "2026-03-28", readingTime: 10 },
]

const categories = ["All", "Development", "Business", "Technology"]

const plans = [
  { name: "Free", price: "$0", period: "forever", features: ["1 WordPress site conversion", "Basic Next.js template", "Community support", "No custom domain"], buttonText: "Get Started", href: "/register" },
  { name: "Pro", price: "$19", period: "/month", features: ["1 WordPress site conversion", "Live deployment", "Advanced Next.js template", "Priority email support", "Custom domain", "Analytics dashboard", "Auto content sync"], popular: true, buttonText: "Subscribe Now", href: "/dashboard/subscription?plan=pro" },
  { name: "Enterprise", price: "$99", period: "/month", features: ["3 WordPress site conversions", "Live deployments", "Advanced Next.js templates", "Priority email support", "Custom domains", "Analytics dashboard", "Auto content sync", "White-label option"], buttonText: "Subscribe Now", href: "/dashboard/subscription?plan=enterprise" },
]

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/blog")
        if (res.ok) {
          const data = await res.json()
          if (data.length > 0) {
            setPosts(data)
          } else {
            setPosts(defaultPosts)
          }
        } else {
          setPosts(defaultPosts)
        }
      } catch (error) {
        console.error("Error fetching posts:", error)
        setPosts(defaultPosts)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1920&q=80"
            alt="Blog Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-900/90 to-slate-950/95" />
        </div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[150px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Our <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Blog</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Insights, tutorials, and updates from the WPCodingPress team
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent backdrop-blur-sm"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-violet-600 text-white"
                    : "bg-white/10 text-slate-300 hover:bg-white/20"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-16 text-slate-400">Loading...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg">No articles found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="bg-slate-800/50 rounded-2xl overflow-hidden border border-white/10 hover:border-violet-500/50 transition-all hover:shadow-2xl hover:shadow-violet-500/10">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full bg-violet-600/90 text-white text-xs font-medium">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(post.publishedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.readingTime} min read
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-3 group-hover:text-violet-400 transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500">{post.author}</span>
                          <span className="flex items-center gap-1 text-violet-400 text-sm font-medium group-hover:gap-2 transition-all">
                            Read more <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Badge className="bg-violet-100 text-violet-700 border-violet-200 px-4 py-1.5 text-sm font-medium mb-6">
              Pricing Plans
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Choose Your <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Plan</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-slate-800/50 rounded-2xl border ${plan.popular ? 'border-violet-500' : 'border-white/10'} p-8 hover:border-violet-500/50 transition-all`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-violet-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-400">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <ArrowRight className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href={plan.href} className="block">
                  <button className={`w-full py-3 rounded-lg font-medium transition-all ${
                    plan.popular 
                      ? 'bg-violet-600 hover:bg-violet-700 text-white' 
                      : plan.name === 'Enterprise'
                        ? 'bg-white text-slate-900 hover:bg-slate-100'
                        : 'border-2 border-white/20 text-white hover:bg-white/10'
                  }`}>
                    {plan.buttonText}
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}