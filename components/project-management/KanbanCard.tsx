"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  Calendar,
  MessageSquare,
  Paperclip,
  CheckSquare,
  GripVertical,
} from "lucide-react"
import { getPriorityColor } from "@/lib/project-management"
import type { TaskWithRelations } from "@/lib/project-management"

interface KanbanCardProps {
  task: TaskWithRelations
  isDragOverlay?: boolean
  onClick?: (task: TaskWithRelations) => void
}

export function KanbanCard({ task, isDragOverlay, onClick }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled: isDragOverlay,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const completedChecklists = task.checklists.filter((c) => c.completed).length
  const totalChecklists = task.checklists.length

  return (
    <div
      ref={isDragOverlay ? undefined : setNodeRef}
      style={isDragOverlay ? undefined : style}
      onClick={() => !isDragOverlay && onClick?.(task)}
      className={`group bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer ${
        isDragOverlay ? "shadow-xl border-purple-300 bg-white" : ""
      }`}
    >
      <div className="p-3">
        {/* Drag Handle + Priority */}
        <div className="flex items-start gap-2">
          {!isDragOverlay && (
            <button
              {...attributes}
              {...listeners}
              className="mt-0.5 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing flex-shrink-0"
            >
              <GripVertical className="w-4 h-4" />
            </button>
          )}

          <div className="flex-1 min-w-0">
            {/* Priority Badge */}
            <span
              className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${getPriorityColor(task.priority)}`}
            >
              {task.priority}
            </span>

            {/* Title */}
            <p className="text-sm font-medium text-slate-800 mt-1.5 leading-snug">
              {task.title}
            </p>

            {/* Description preview */}
            {task.description && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Footer: Meta info */}
        <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-100">
          {/* Assignees */}
          {task.assignees.length > 0 && (
            <div className="flex items-center -space-x-1.5">
              {task.assignees.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-[8px] font-bold text-white ring-1 ring-white"
                  title={a.userName}
                >
                  {a.userName.charAt(0).toUpperCase()}
                </div>
              ))}
              {task.assignees.length > 3 && (
                <span className="text-[10px] text-slate-400 ml-1">
                  +{task.assignees.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <Calendar className="w-3 h-3" />
              {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          )}

          {/* Comments count */}
          {task.comments.length > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <MessageSquare className="w-3 h-3" />
              {task.comments.length}
            </div>
          )}

          {/* Attachments count */}
          {task.attachments.length > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Paperclip className="w-3 h-3" />
              {task.attachments.length}
            </div>
          )}

          {/* Checklist progress */}
          {totalChecklists > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <CheckSquare className="w-3 h-3" />
              {completedChecklists}/{totalChecklists}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
