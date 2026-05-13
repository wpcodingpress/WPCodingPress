'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { ContentPost } from '@/types/content-schema'

interface BlogGridProps {
  posts: ContentPost[]
  title?: string
  subtitle?: string
  variant?: 'grid' | 'featured'
  maxItems?: number
  className?: string
}

export default function BlogGrid({ posts, title, subtitle, variant = 'grid', maxItems = 6, className = '' }: BlogGridProps) {
  if (posts.length === 0) return null

  const displayPosts = posts.slice(0, maxItems)

  if (variant === 'featured') {
    const featured = displayPosts[0]
    const rest = displayPosts.slice(1, 4)
    return (
      <section className={`py-16 md:py-24 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(title || subtitle) && (
            <div className="text-center max-w-3xl mx-auto mb-12">
              {title && <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>}
              {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
            </div>
          )}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <Link href={`/post/${featured.slug}`} className="group block">
                <div className="relative aspect-[21/9] rounded-2xl overflow-hidden">
                  {featured.featuredImage?.url ? (
                    <img src={featured.featuredImage.url} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{featured.title}</h3>
                    <p className="text-gray-200 line-clamp-2">{featured.excerpt}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
          {rest.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6">
              {rest.map((post, i) => (
                <BlogCard key={post.id} post={post} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center max-w-3xl mx-auto mb-12">
            {title && <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>}
            {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
          </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayPosts.map((post, i) => (
            <BlogCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function BlogCard({ post, index }: { post: ContentPost; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link href={`/post/${post.slug}`}>
        <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4">
          {post.featuredImage?.url ? (
            <img src={post.featuredImage.url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
          )}
        </div>
        <div className="space-y-2">
          {post.categories.length > 0 && (
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{post.categories[0].name}</span>
          )}
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition line-clamp-2">{post.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center gap-3 text-xs text-gray-400 pt-2">
            <span>{post.author.name}</span>
            <span>·</span>
            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            {post.readingTime > 0 && (
              <>
                <span>·</span>
                <span>{post.readingTime} min read</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
