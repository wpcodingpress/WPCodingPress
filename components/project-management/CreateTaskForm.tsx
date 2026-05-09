"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ColumnData, TaskWithRelations } from "@/lib/project-management"

interface CreateTaskFormProps {
  boardId: string
  columns: ColumnData[]
  onTaskCreated: (task: TaskWithRelations) => void
  onCancel: () => void
}

const DEFAULT_COLUMN_INDEX = 1 // "To Do"

export function CreateTaskForm({
  boardId,
  columns,
  onTaskCreated,
  onCancel,
}: CreateTaskFormProps) {
  const [title, setTitle] = useState("")
  const [columnId, setColumnId] = useState(
    columns[DEFAULT_COLUMN_INDEX]?.id || columns[0]?.id || ""
  )
  const [priority, setPriority] = useState("medium")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !columnId || isSubmitting) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/project-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boardId,
          columnId,
          title: title.trim(),
          priority,
        }),
      })
      const data = await res.json()
      if (data.task) {
        onTaskCreated(data.task)
        setTitle("")
      }
    } catch (error) {
      console.error("Error creating task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: -10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -10, height: 0 }}
      onSubmit={handleSubmit}
      className="mb-4 p-4 bg-white rounded-xl border-2 border-purple-200 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-3">
        <Plus className="w-4 h-4 text-purple-600" />
        <span className="text-sm font-semibold text-slate-800">New Task</span>
      </div>

      <div className="space-y-3">
        <input
          autoFocus
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-slate-900"
        />

        <div className="flex gap-2">
          <select
            value={columnId}
            onChange={(e) => setColumnId(e.target.value)}
            className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:border-purple-400 outline-none bg-white text-slate-900"
          >
            {columns.map((col) => (
              <option key={col.id} value={col.id}>
                {col.title}
              </option>
            ))}
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:border-purple-400 outline-none bg-white text-slate-900"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-slate-500"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!title.trim() || isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-violet-600 text-white"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
            ) : (
              <Plus className="w-3.5 h-3.5 mr-1" />
            )}
            Add Task
          </Button>
        </div>
      </div>
    </motion.form>
  )
}
