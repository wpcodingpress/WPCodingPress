"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckSquare, Plus, Loader2, Trash2, Check } from "lucide-react"
import type { ChecklistData } from "@/lib/project-management"

interface ChecklistWidgetProps {
  taskId: string
  items: ChecklistData[]
  onItemsChanged: (items: ChecklistData[]) => void
}

export function ChecklistWidget({ taskId, items, onItemsChanged }: ChecklistWidgetProps) {
  const [newTitle, setNewTitle] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const completedCount = items.filter((i) => i.completed).length
  const progress = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0

  async function addItem() {
    if (!newTitle.trim() || isAdding) return
    setIsAdding(true)
    try {
      const res = await fetch("/api/project-checklists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, title: newTitle.trim() }),
      })
      const data = await res.json()
      if (data.item) {
        onItemsChanged([...items, data.item])
        setNewTitle("")
      }
    } catch (error) {
      console.error("Error adding checklist item:", error)
    } finally {
      setIsAdding(false)
    }
  }

  async function toggleItem(item: ChecklistData) {
    try {
      const res = await fetch("/api/project-checklists", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, completed: !item.completed }),
      })
      const data = await res.json()
      if (data.item) {
        onItemsChanged(items.map((i) => (i.id === item.id ? data.item : i)))
      }
    } catch (error) {
      console.error("Error toggling checklist item:", error)
    }
  }

  async function deleteItem(itemId: string) {
    try {
      await fetch(`/api/project-checklists?id=${itemId}`, { method: "DELETE" })
      onItemsChanged(items.filter((i) => i.id !== itemId))
    } catch (error) {
      console.error("Error deleting checklist item:", error)
    }
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
        <CheckSquare className="w-4 h-4 text-purple-500" />
        Checklist {items.length > 0 && `(${completedCount}/${items.length})`}
      </h4>

      {/* Progress Bar */}
      {items.length > 0 && (
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Items */}
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 group"
          >
            <button
              onClick={() => toggleItem(item)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                item.completed
                  ? "bg-gradient-to-r from-green-400 to-emerald-500 border-green-400"
                  : "border-slate-300 hover:border-purple-400"
              }`}
            >
              {item.completed && <Check className="w-3 h-3 text-white" />}
            </button>
            <span
              className={`text-sm flex-1 ${
                item.completed ? "text-slate-400 line-through" : "text-slate-700"
              }`}
            >
              {item.title}
            </span>
            <button
              onClick={() => deleteItem(item.id)}
              className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Add Item */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addItem()
            }
          }}
          placeholder="Add checklist item..."
          className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-slate-900"
        />
        <button
          onClick={addItem}
          disabled={!newTitle.trim() || isAdding}
          className="p-1.5 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 disabled:opacity-40 transition-all"
        >
          {isAdding ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  )
}
