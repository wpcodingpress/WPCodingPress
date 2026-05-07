"use client"

import { useState, useEffect, useRef } from "react"
import { User, Check, X, Loader2 } from "lucide-react"
import type { AssigneeData } from "@/lib/project-management"

interface AssigneeSelectProps {
  taskId: string
  assignees: AssigneeData[]
  onAssigneesChanged: (assignees: AssigneeData[]) => void
  availableUsers?: { id: string; name: string; email: string }[]
}

export function AssigneeSelect({ taskId, assignees, onAssigneesChanged, availableUsers }: AssigneeSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [users, setUsers] = useState<{ id: string; name: string; email: string }[]>(availableUsers || [])
  const [isLoading, setIsLoading] = useState(!availableUsers)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!availableUsers) {
      const fetchUsers = async () => {
        try {
          const res = await fetch("/api/admin/users")
          if (res.ok) {
            const data = await res.json()
            setUsers(data.users || data || [])
          }
        } catch {
          // fallback: just show current user
        } finally {
          setIsLoading(false)
        }
      }
      fetchUsers()
    }
  }, [availableUsers])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const assigneeUserIds = new Set(assignees.map((a) => a.userId))

  const unassignedUsers = users.filter((u) => !assigneeUserIds.has(u.id))

  // This is a display-only component for now - assignee management via API
  // can be added when the TaskAssignee API route is created
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-purple-600 transition-colors"
      >
        {assignees.length > 0 ? (
          <div className="flex -space-x-1.5">
            {assignees.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-[9px] font-bold text-white ring-1 ring-white"
                title={a.userName}
              >
                {a.userName.charAt(0).toUpperCase()}
              </div>
            ))}
            {assignees.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-500 ring-1 ring-white">
                +{assignees.length - 3}
              </div>
            )}
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-slate-400" />
          </div>
        )}
        <span className="text-xs">{assignees.length > 0 ? assignees.map(a => a.userName.split(" ")[0]).join(", ") : "Assign"}</span>
      </button>
    </div>
  )
}
