"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, Eye, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
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
  content: string
  coverImage: string
  author: string
  category: string
  tags: string
  publishedAt: string
  readingTime: number
}

export default function AdminBlogPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    author: "",
    category: "Development",
    tags: "",
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin-login")
    } else if (status === "authenticated") {
      const userRole = (session?.user as any)?.role
      if (userRole !== 'admin') {
        router.push("/dashboard")
      } else {
        fetchPosts()
      }
    }
  }, [status, session, router])

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/blog")
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenDialog = (post?: BlogPost) => {
    setError("")
    if (post) {
      setEditingPost(post)
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content || "",
        coverImage: post.coverImage,
        author: post.author,
        category: post.category,
        tags: post.tags || "",
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
        tags: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.title || !formData.excerpt || !formData.coverImage) {
      setError("Please fill in all required fields")
      return
    }

    setIsSaving(true)
    setError("")

    try {
      if (editingPost) {
        const res = await fetch(`/api/blog?id=${editingPost.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        })
        
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || "Failed to update post")
        }
        
        const updated = await res.json()
        setPosts(posts.map(p => p.id === editingPost.id ? updated : p))
      } else {
        const res = await fetch("/api/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        })
        
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || "Failed to create post")
        }
        
        const newPost = await res.json()
        setPosts([newPost, ...posts])
      }
      setIsDialogOpen(false)
    } catch (err: any) {
      console.error("Error saving post:", err)
      setError(err.message || "Failed to save post")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        const res = await fetch(`/api/blog?id=${id}`, { method: "DELETE" })
        if (res.ok) {
          setPosts(posts.filter(p => p.id !== id))
        }
      } catch (error) {
        console.error("Error deleting post:", error)
      }
    }
  }

  if (isLoading || status === "loading") {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    )
  }

  const categories = ["Development", "Business", "Technology"]

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
        {posts.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No blog posts yet. Create your first post!
          </div>
        ) : (
          posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4"
            >
              <img
                src={post.coverImage || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&q=80"}
                alt={post.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 truncate">{post.title}</h3>
                <p className="text-sm text-slate-500 truncate">{post.excerpt}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{post.category}</span>
                  <span className="text-xs text-slate-400">{new Date(post.publishedAt).toLocaleDateString()}</span>
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
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white text-slate-900 border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-slate-900">{editingPost ? "Edit Post" : "Create New Post"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter post title"
                className="bg-white border-slate-200 text-slate-900"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Excerpt *</label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Enter short description"
                rows={3}
                className="bg-white border-slate-200 text-slate-900"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Content</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your blog post content here..."
                rows={10}
                className="bg-white border-slate-200 text-slate-900"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Cover Image URL *</label>
              <Input
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="bg-white border-slate-200 text-slate-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Author</label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name"
                  className="bg-white border-slate-200 text-slate-900"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <Button 
              onClick={handleSave} 
              className="w-full bg-violet-600 hover:bg-violet-700" 
              disabled={isSaving || !formData.title || !formData.excerpt || !formData.coverImage}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : editingPost ? "Update Post" : "Publish Post"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}