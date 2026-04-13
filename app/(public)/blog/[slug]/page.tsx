"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, Share2, Link as LinkIcon, Mail, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

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

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copyLink, setCopyLink] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // First try to get all posts and find by slug
        const res = await fetch(`/api/blog`)
        if (res.ok) {
          const posts = await res.json()
          const found = posts.find((p: BlogPost) => p.slug === params.slug)
          if (found) {
            setPost(found)
            const related = posts
              .filter((p: BlogPost) => p.category === found.category && p.id !== found.id)
              .slice(0, 3)
            setRelatedPosts(related)
          } else {
            // Try fetching by ID directly if slug doesn't work
            const singleRes = await fetch(`/api/blog/${params.slug}`)
            if (singleRes.ok) {
              const data = await singleRes.json()
              setPost(data)
              // Fetch related from all posts
              const allRes = await fetch("/api/blog")
              if (allRes.ok) {
                const allPosts = await allRes.json()
                const related = allPosts
                  .filter((p: BlogPost) => p.category === data.category && p.id !== data.id)
                  .slice(0, 3)
                setRelatedPosts(related)
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching post:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPost()
  }, [params.slug])

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", { 
        month: "long", 
        day: "numeric", 
        year: "numeric" 
      })
    } catch {
      return dateStr
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopyLink(true)
    setTimeout(() => setCopyLink(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-violet-400">Loading...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-slate-400 mb-8">The article you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  const renderContent = (content: string) => {
    const paragraphs = content.split('\n\n')
    return paragraphs.map((para, index) => {
      if (para.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4">
            {para.replace('## ', '')}
          </h2>
        )
      }
      if (para.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-semibold text-white mt-6 mb-3">
            {para.replace('### ', '')}
          </h3>
        )
      }
      if (para.startsWith('- ')) {
        const items = para.split('\n').filter(line => line.startsWith('- '))
        return (
          <ul key={index} className="list-disc list-inside text-slate-300 space-y-2 mb-4 ml-4">
            {items.map((item, i) => (
              <li key={i} className="text-slate-300">{item.replace('- ', '')}</li>
            ))}
          </ul>
        )
      }
      if (para.match(/^\d+\./)) {
        const items = para.split('\n').filter(line => line.match(/^\d+\./))
        return (
          <ol key={index} className="list-decimal list-inside text-slate-300 space-y-2 mb-4 ml-4">
            {items.map((item, i) => (
              <li key={i} className="text-slate-300">{item.replace(/^\d+\.\s*/, '')}</li>
            ))}
          </ol>
        )
      }
      if (para.includes(':')) {
        const parts = para.split(':')
        if (parts.length >= 2 && parts[0].length < 30) {
          return (
            <p key={index} className="text-slate-300 mb-4">
              <span className="text-white font-medium">{parts[0]}:</span>
              {parts.slice(1).join(':')}
            </p>
          )
        }
      }
      return (
        <p key={index} className="text-slate-300 mb-4 leading-relaxed">
          {para}
        </p>
      )
    })
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image 
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-900/80 to-slate-900" />
        
        <div className="absolute top-0 left-0 right-0 p-4">
          <div className="container mx-auto px-4">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="relative -mt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.article 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            {/* Article Header */}
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-white/10 mb-8">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="px-3 py-1 rounded-full bg-violet-600 text-white text-sm font-medium">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-slate-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="flex items-center gap-1 text-slate-400 text-sm">
                  <Clock className="w-4 h-4" />
                  {post.readingTime} min read
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {post.title}
              </h1>
              
              <p className="text-lg text-slate-300 mb-6">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between border-t border-white/10 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 flex items-center justify-center text-white font-bold text-lg">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <span className="text-white font-medium block">{post.author}</span>
                    <span className="text-slate-400 text-sm">Author</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={copyToClipboard}
                    className="p-2 rounded-lg bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors"
                    title="Copy link"
                  >
                    {copyLink ? <span className="text-green-400 text-sm">Copied!</span> : <LinkIcon className="w-5 h-5" />}
                  </button>
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors"
                    title="Share on Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.413c0-3.008 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a 
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(post?.title || '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors"
                    title="Share on Twitter"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.22 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a 
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors"
                    title="Share on LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.158 4.267 4.97v5.76zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.745v20.507C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.254V1.745C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent(post?.title + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors"
                    title="Share on WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>
                  <a 
                    href={`mailto:?subject=${encodeURIComponent(post?.title || '')}&body=${encodeURIComponent('Check out this article: ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                    className="p-2 rounded-lg bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors"
                    title="Share via Email"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Article Body */}
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-white/10">
              <div className="prose prose-invert max-w-none">
                {renderContent(post.content)}
              </div>
              
              {/* Tags */}
              {post.tags && (
                <div className="border-t border-white/10 pt-6 mt-8">
                  <h4 className="text-white font-medium mb-3">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.split(',').map((tag, index) => (
                      <Link 
                        key={index}
                        href={`/blog?search=${tag.trim()}`}
                        className="px-3 py-1 rounded-full bg-white/10 text-slate-300 hover:bg-violet-600 hover:text-white transition-colors text-sm"
                      >
                        {tag.trim()}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.article>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 border-t border-white/10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {relatedPosts.map((related) => (
                <Link 
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="group"
                >
                  <div className="bg-slate-800/50 rounded-xl overflow-hidden border border-white/10 hover:border-violet-500/50 transition-all">
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={related.coverImage}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-white group-hover:text-violet-400 transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                        {related.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Image Credit */}
      <section className="py-8 bg-slate-950">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            Cover image by{' '}
            <a 
              href="https://unsplash.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-violet-400 hover:underline"
            >
              Unsplash
            </a>
            {' '}({post.category})
          </p>
        </div>
      </section>
    </div>
  )
}