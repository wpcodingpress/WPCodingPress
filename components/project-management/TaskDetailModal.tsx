"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import {
  X,
  Calendar,
  Clock,
  Save,
  Loader2,
  User,
  Trash2,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CommentSection } from "./CommentSection"
import { FileUpload } from "./FileUpload"
import { ChecklistWidget } from "./ChecklistWidget"
import { ActivityFeed } from "./ActivityFeed"
import { AssigneeSelect } from "./AssigneeSelect"
import { getPriorityColor, PRIORITY_LABELS, PRIORITY_ORDER } from "@/lib/project-management"
import type { TaskWithRelations, CommentData, AttachmentData, ChecklistData, ActivityData, AssigneeData } from "@/lib/project-management"

interface TaskDetailModalProps {
  task: TaskWithRelations
  columns: { id: string; title: string; color: string }[]
  onUpdate: (task: TaskWithRelations) => void
  onDelete: (taskId: string) => void
  onClose: () => void
}

export function TaskDetailModal({
  task: initialTask,
  columns,
  onUpdate,
  onDelete,
  onClose,
}: TaskDetailModalProps) {
  const [task, setTask] = useState<TaskWithRelations>(initialTask)
  const [title, setTitle] = useState(initialTask.title)
  const [description, setDescription] = useState(initialTask.description || "")
  const [priority, setPriority] = useState(initialTask.priority)
  const [columnId, setColumnId] = useState(initialTask.columnId)
  const [dueDate, setDueDate] = useState(
    initialTask.dueDate ? new Date(initialTask.dueDate).toISOString().split("T")[0] : ""
  )
  const [estimatedHours, setEstimatedHours] = useState(
    initialTask.estimatedHours?.toString() || ""
  )
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"details" | "activity">("details")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Fetch fresh task data
  const refreshTask = useCallback(async () => {
    try {
      const res = await fetch(`/api/project-tasks/${task.id}`)
      const data = await res.json()
      if (data.task) {
        setTask(data.task)
      }
    } catch (error) {
      console.error("Error refreshing task:", error)
    }
  }, [task.id])

  async function handleSave() {
    setIsSaving(true)
    try {
      const body: any = { title: title.trim() }
      if (description !== (task.description || "")) body.description = description || null
      if (priority !== task.priority) body.priority = priority
      if (columnId !== task.columnId) body.columnId = columnId
      
      const newDueDate = dueDate ? new Date(dueDate).toISOString() : null
      const oldDueDate = task.dueDate ? new Date(task.dueDate).toISOString() : null
      if (newDueDate !== oldDueDate) body.dueDate = newDueDate

      const newHours = estimatedHours ? parseFloat(estimatedHours) : null
      if (newHours !== task.estimatedHours) body.estimatedHours = newHours

      const res = await fetch(`/api/project-tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.task) {
        setTask(data.task)
        onUpdate(data.task)
      }
    } catch (error) {
      console.error("Error saving task:", error)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    try {
      await fetch(`/api/project-tasks/${task.id}`, { method: "DELETE" })
      onDelete(task.id)
      onClose()
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  function handleCommentAdded(comment: CommentData) {
    setTask((prev) => ({
      ...prev,
      comments: [comment, ...prev.comments],
    }))
  }

  function handleAttachmentAdded(attachment: AttachmentData) {
    setTask((prev) => ({
      ...prev,
      attachments: [...prev.attachments, attachment],
    }))
  }

  function handleChecklistChanged(items: ChecklistData[]) {
    setTask((prev) => ({ ...prev, checklists: items }))
  }

  function handleAssigneesChanged(assignees: AssigneeData[]) {
    setTask((prev) => ({ ...prev, assignees }))
  }

  const completedChecklists = task.checklists.filter((c) => c.completed).length
  const totalChecklists = task.checklists.length
  const checklistProgress = totalChecklists > 0 ? Math.round((completedChecklists / totalChecklists) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="relative w-full max-w-4xl mx-4 my-8 bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${getPriorityColor(task.priority)}`}
              >
                {task.priority}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                #{task.id.slice(0, 7)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <Save className="w-4 h-4 mr-1" />
              )}
              Save
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-slate-400 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col lg:flex-row">
          {/* Left — Main Content */}
          <div className="flex-1 p-6 space-y-6">
            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl font-bold text-slate-900 outline-none border-none focus:ring-0 placeholder-slate-300"
              placeholder="Task title"
            />

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                rows={4}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-y text-slate-900"
              />
            </div>

            {/* Checklist */}
            <ChecklistWidget
              taskId={task.id}
              items={task.checklists}
              onItemsChanged={handleChecklistChanged}
            />

            {/* Attachments */}
            <FileUpload
              taskId={task.id}
              attachments={task.attachments}
              onAttachmentAdded={handleAttachmentAdded}
            />

            {/* Comments */}
            <CommentSection
              taskId={task.id}
              comments={task.comments}
              onCommentAdded={handleCommentAdded}
            />
          </div>

          {/* Right — Sidebar */}
          <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50/50">
            <div className="p-4 space-y-5">
              {/* Status */}
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Status
                </label>
                <select
                  value={columnId}
                  onChange={(e) => setColumnId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-purple-400 outline-none text-slate-900"
                >
                  {columns.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-purple-400 outline-none text-slate-900"
                >
                  {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignee */}
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Assignee
                </label>
                <AssigneeSelect
                  taskId={task.id}
                  assignees={task.assignees}
                  onAssigneesChanged={handleAssigneesChanged}
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-purple-400 outline-none text-slate-900"
                />
              </div>

              {/* Estimated Hours */}
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Est. Hours
                </label>
                <input
                  type="number"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.5"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-purple-400 outline-none text-slate-900"
                />
              </div>

              {/* Created */}
              <div className="pt-3 border-t border-slate-200">
                <p className="text-[10px] text-slate-400">
                  Created {new Date(task.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </p>
                {task.updatedAt !== task.createdAt && (
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Updated {new Date(task.updatedAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric",
                    })}
                  </p>
                )}
              </div>

              {/* Activity Feed */}
              <div className="pt-3 border-t border-slate-200">
                <ActivityFeed activities={task.activity} />
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-20"
          >
            <div className="text-center p-8 max-w-sm">
              <div className="p-3 rounded-full bg-red-100 w-fit mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Task?</h3>
              <p className="text-sm text-slate-500 mb-6">
                This action cannot be undone. All comments, attachments, and checklist items will be permanently deleted.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="border-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete Task
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
