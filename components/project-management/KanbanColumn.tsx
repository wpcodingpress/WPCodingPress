"use client"

import { useDroppable } from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { motion } from "framer-motion"
import { KanbanCard } from "./KanbanCard"
import type { ColumnData, TaskWithRelations } from "@/lib/project-management"

interface KanbanColumnProps {
  column: ColumnData
  tasks: TaskWithRelations[]
  isOver: boolean
  onTaskClick?: (task: TaskWithRelations) => void
}

export function KanbanColumn({ column, tasks, isOver, onTaskClick }: KanbanColumnProps) {
  const { setNodeRef, isOver: isDroppableOver } = useDroppable({
    id: column.id,
  })

  const showHighlight = isOver || isDroppableOver

  return (
    <div
      className="flex-shrink-0 w-72 sm:w-80 flex flex-col"
    >
      {/* Column Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 mb-2">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: column.color }}
        />
        <h3 className="font-semibold text-sm text-slate-800 uppercase tracking-wide">
          {column.title}
        </h3>
        <span className="ml-auto text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-xl p-2 min-h-[200px] transition-all duration-200 ${
          showHighlight
            ? "bg-purple-50/80 border-2 border-dashed border-purple-300"
            : "bg-slate-50/50 border-2 border-transparent"
        }`}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <div className="flex items-center justify-center h-20 text-xs text-slate-400">
                Drop tasks here
              </div>
            ) : (
              tasks.map((task) => (
                <KanbanCard key={task.id} task={task} onClick={onTaskClick} />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}
