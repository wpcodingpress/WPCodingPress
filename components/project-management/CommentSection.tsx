"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CommentData } from "@/lib/project-management"

interface CommentSectionProps {
  taskId: string
  comments: CommentData[]
  onCommentAdded: (comment: CommentData) => void
}

export function CommentSection({ taskId, comments, onCommentAdded }: CommentSectionProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/project-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, content: content.trim() }),
      })
      const data = await res.json()
      if (data.comment) {
        onCommentAdded(data.comment)
        setContent("")
      }
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-purple-500" />
        Comments ({comments.length})
      </h4>

      {/* Comment List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 p-3 bg-slate-50 rounded-lg"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {comment.userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-slate-900">{comment.userName}</span>
                  <span className="text-xs text-slate-400">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-slate-900"
        />
        <Button
          type="submit"
          size="sm"
          disabled={!content.trim() || isSubmitting}
          className="bg-gradient-to-r from-purple-600 to-violet-600 text-white"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </div>
  )
}
