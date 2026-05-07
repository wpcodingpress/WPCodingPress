"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { AnimatePresence } from "framer-motion"
import { Loader2, Columns3 } from "lucide-react"
import { KanbanColumn } from "./KanbanColumn"
import { KanbanCard } from "./KanbanCard"
import { ProjectBoardHeader } from "./ProjectBoardHeader"
import { CreateTaskForm } from "./CreateTaskForm"
import { TaskDetailModal } from "./TaskDetailModal"
import type { BoardWithAll, ColumnData, TaskWithRelations } from "@/lib/project-management"

interface KanbanBoardProps {
  subscriptionId: string
  onBoardReady?: (board: BoardWithAll) => void
}

export function KanbanBoard({ subscriptionId, onBoardReady }: KanbanBoardProps) {
  const [board, setBoard] = useState<BoardWithAll | null>(null)
  const [columns, setColumns] = useState<ColumnData[]>([])
  const [tasks, setTasks] = useState<TaskWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTask, setActiveTask] = useState<TaskWithRelations | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [overColumnId, setOverColumnId] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<TaskWithRelations | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  const fetchBoard = useCallback(async () => {
    try {
      const res = await fetch(`/api/project-boards?subscriptionId=${subscriptionId}`)
      const data = await res.json()
      if (data.board) {
        setBoard(data.board)
        setColumns(data.board.columns || [])
        setTasks(data.board.tasks || [])
        onBoardReady?.(data.board)
      } else if (data.needsSetup) {
        const createRes = await fetch("/api/project-boards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscriptionId }),
        })
        const createData = await createRes.json()
        if (createData.board) {
          setBoard(createData.board)
          setColumns(createData.board.columns || [])
          setTasks([])
          onBoardReady?.(createData.board)
        }
      }
    } catch (error) {
      console.error("Error fetching board:", error)
    } finally {
      setIsLoading(false)
    }
  }, [subscriptionId, onBoardReady])

  useEffect(() => {
    fetchBoard()
  }, [fetchBoard])

  const tasksByColumn = useMemo(() => {
    const map: Record<string, TaskWithRelations[]> = {}
    columns.forEach((col) => {
      map[col.id] = tasks
        .filter((t) => t.columnId === col.id)
        .sort((a, b) => a.order - b.order)
    })
    return map
  }, [columns, tasks])

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id)
    if (task) setActiveTask(task)
  }

  function handleDragOver(event: DragOverEvent) {
    const overId = event.over?.id as string | undefined
    if (!overId) {
      setOverColumnId(null)
      return
    }
    const overColumn = columns.find((c) => c.id === overId)
    if (overColumn) {
      setOverColumnId(overColumn.id)
      return
    }
    const overTask = tasks.find((t) => t.id === overId)
    if (overTask) {
      setOverColumnId(overTask.columnId)
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null)
    setOverColumnId(null)

    const { active, over } = event
    if (!over) return

    const activeTaskId = active.id as string
    const task = tasks.find((t) => t.id === activeTaskId)
    if (!task) return

    let targetColumnId: string
    let targetOrder: number

    const overColumn = columns.find((c) => c.id === over.id)
    if (overColumn) {
      targetColumnId = overColumn.id
      const columnTasks = tasksByColumn[targetColumnId] || []
      targetOrder = columnTasks.length > 0
        ? Math.max(...columnTasks.map((t) => t.order)) + 1
        : 0
    } else {
      const overTask = tasks.find((t) => t.id === over.id)
      if (!overTask) return
      targetColumnId = overTask.columnId
      const columnTasks = tasksByColumn[targetColumnId] || []
      const overIndex = columnTasks.findIndex((t) => t.id === over.id)
      targetOrder = overIndex >= 0 ? overIndex : columnTasks.length
    }

    const sameColumn = task.columnId === targetColumnId
    if (sameColumn && task.order === targetOrder) return

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === activeTaskId
          ? { ...t, columnId: targetColumnId, order: targetOrder }
          : t
      )
    )

    // Persist
    try {
      await fetch("/api/project-tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: [{ id: activeTaskId, columnId: targetColumnId, order: targetOrder }],
        }),
      })
      // Re-fetch to get canonical order
      fetchBoard()
    } catch (error) {
      console.error("Error updating task position:", error)
      fetchBoard()
    }
  }

  function handleTaskCreated(task: TaskWithRelations) {
    setTasks((prev) => [...prev, task])
    setShowCreateForm(false)
  }

  function handleTaskUpdated(task: TaskWithRelations) {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
  }

  function handleTaskDeleted(taskId: string) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!board || columns.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        <Columns3 className="w-12 h-12 mr-3 opacity-30" />
        No board found
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <ProjectBoardHeader
        title={board.title}
        description={board.description}
        taskCount={tasks.length}
        onAddTask={() => setShowCreateForm(true)}
      />

      {showCreateForm && board && columns.length > 0 && (
        <CreateTaskForm
          boardId={board.id}
          columns={columns}
          onTaskCreated={handleTaskCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1 min-h-0">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasksByColumn[column.id] || []}
              isOver={overColumnId === column.id}
              onTaskClick={setSelectedTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="rotate-3 opacity-90">
              <KanbanCard task={activeTask} isDragOverlay />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            columns={columns}
            onUpdate={handleTaskUpdated}
            onDelete={handleTaskDeleted}
            onClose={() => setSelectedTask(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
