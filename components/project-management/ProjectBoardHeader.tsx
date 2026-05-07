"use client"

import { Plus, Columns3 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProjectBoardHeaderProps {
  title: string
  description: string | null
  taskCount: number
  onAddTask: () => void
}

export function ProjectBoardHeader({
  title,
  description,
  taskCount,
  onAddTask,
}: ProjectBoardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500">
          <Columns3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          {description && (
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          )}
          <p className="text-xs text-slate-400 mt-0.5">{taskCount} tasks</p>
        </div>
      </div>
      <Button
        onClick={onAddTask}
        className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-md"
        size="sm"
      >
        <Plus className="w-4 h-4 mr-1.5" />
        Add Task
      </Button>
    </div>
  )
}
