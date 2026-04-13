"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, Eye, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  coverImage: string
  author: string
  category: string
  publishedAt: string
  readingTime: number
}

const defaultPosts: BlogPost[] = [
  { id: "1", slug: "wordpress-to-nextjs-migration-guide", title: "Complete Guide to Migrating from WordPress to Next.js in 2026", excerpt: "Learn the step-by-step process of migrating your WordPress website to Next.js.", coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", author: "WPCodingPress Team", category: "Development", publishedAt: "April 10, 2026", readingTime: 15 },
  { id: "2", slug: "saas-business-growth-strategies", title: "10 Proven Strategies to Grow Your SaaS Business in 2026", excerpt: "Discover the most effective tactics for scaling your SaaS startup.", coverImage: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&q=80", author: "WPCodingPress Team", category: "Business", publishedAt: "April 5, 2026", readingTime: 12 },
  { id: "3", slug: "ai-web-development-future", title: "How AI is Revolutionizing Web Development in 2026", excerpt: "Explore how AI and ML are transforming the way we build websites.", coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad9be?w=800&q=80", author: "WPCodingPress Team", category: "Technology", publishedAt: "March 28, 2026", readingTime: 10 },
  { id: "4", slug: "nextjs-performance-optimization", title: "Next.js Performance Optimization: The Ultimate Checklist", excerpt: "A comprehensive checklist for fast-loading Next.js applications.", coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", author: "WPCodingPress Team", category: "Development", publishedAt: "March 20, 2026", readingTime: 8 },
  { id: "5", slug: "custom-wordpress-solutions", title: "When to Choose Custom WordPress Development Over Themes", excerpt: "Learn when custom development makes more sense than themes.", coverImage: "https://images.unsplash.com/photo-1522542550221-31fd8575f5a5?w=800&q=80", author: "WPCodingPress Team", category: "Development", publishedAt: "March 15, 2026", readingTime: 7 },
  { id: "6", slug: "web-development-cost-guide", title: "Understanding Web Development Costs: A Complete Guide for 2026", excerpt: "Everything about budgeting for your next web project.", coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80", author: "WPCodingPress Team", category: "Business", publishedAt: "March 8, 2026", readingTime: 11 },
]

export default function AdminBlogPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>(defaultPosts)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    author: "",
    category: "Development",
  })

  useState(() => {
    if (status === "unauthenticated") {
      router.push("/admin-login")
    }
  })

  const categories = ["Development", "Business", "Technology"]

  const handleOpenDialog = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post)
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: "",
        coverImage: post.coverImage,
        author: post.author,
        category: post.category,
      })
    } else {
      setEditingPost(null)
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        coverImage: "",
        author: session?.user?.name || "WPCodingPress Team",
        category: "Development",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingPost) {
      setPosts(posts.map(p => p.id === editingPost.id ? {
        ...p,
        ...formData,
        readingTime: Math.max(5, Math.ceil((formData.content || "").split(" ").length / 200)),
      } : p))
    } else {
      const newPost: BlogPost = {
        id: Date.now().toString(),
        slug: formData.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        ...formData,
        publishedAt: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        readingTime: Math.max(5, Math.ceil((formData.content || "").split(" ").length / 200)),
      }
      setPosts([newPost, ...posts])
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter(p => p.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Blog Management</h1>
            <p className="text-slate-500">Create and manage blog posts</p>
          </div>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-violet-600 hover:bg-violet-700">
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4"
          >
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">{post.title}</h3>
              <p className="text-sm text-slate-500 truncate">{post.excerpt}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{post.category}</span>
                <span className="text-xs text-slate-400">{post.publishedAt}</span>
                <span className="text-xs text-slate-400">{post.readingTime} min read</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => window.open(`/blog/${post.slug}`, "_blank")}>
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleOpenDialog(post)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Edit Post" : "Create New Post"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter post title"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Excerpt</label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Enter short description"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Content</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your blog post content here..."
                rows={10}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Cover Image URL</label>
              <Input
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Author</label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <Button onClick={handleSave} className="w-full bg-violet-600 hover:bg-violet-700">
              {editingPost ? "Update Post" : "Publish Post"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}