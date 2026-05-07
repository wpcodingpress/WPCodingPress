"use client"

import { motion } from "framer-motion"
import { Clock, MessageSquare, ArrowRight, CheckSquare, Paperclip, RefreshCw, Trash2 } from "lucide-react"
import type { ActivityData } from "@/lib/project-management"

interface ActivityFeedProps {
  activities: ActivityData[]
}

const ACTION_ICONS: Record<string, React.ElementType> = {
  task_created: Clock,
  task_updated: RefreshCw,
  task_moved: ArrowRight,
  comment_added: MessageSquare,
  checklist_updated: CheckSquare,
  attachment_added: Paperclip,
  task_deleted: Trash2,
}

const ACTION_COLORS: Record<string, string> = {
  task_created: "text-blue-500 bg-blue-100",
  task_updated: "text-amber-500 bg-amber-100",
  task_moved: "text-purple-500 bg-purple-100",
  comment_added: "text-green-500 bg-green-100",
  checklist_updated: "text-teal-500 bg-teal-100",
  attachment_added: "text-rose-500 bg-rose-100",
  task_deleted: "text-red-500 bg-red-100",
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm text-slate-400">No activity yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {activities.map((activity) => {
        const Icon = ACTION_ICONS[activity.action] || Clock
        const color = ACTION_COLORS[activity.action] || "text-slate-500 bg-slate-100"

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className={`p-1.5 rounded-lg ${color} flex-shrink-0`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-800">{activity.userName}</span>
                <span className="text-xs text-slate-400">
                  {new Date(activity.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </div>
              {activity.details && (
                <p className="text-xs text-slate-500 mt-0.5">{activity.details}</p>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
