"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Loader2,
  ArrowLeft,
  User,
  MessageSquare,
  ExternalLink,
  Zap,
  Crown,
} from "lucide-react"
import { KanbanBoard } from "@/components/project-management/KanbanBoard"
import { BoardInitializer } from "@/components/project-management/BoardInitializer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PM_WHATSAPP_NUMBER, getFirstname, MOSAIC_NAME } from "@/lib/project-management"

export default function ProjectBoardPage() {
  const router = useRouter()
  const [subscription, setSubscription] = useState<{ id: string; plan: string } | null>(null)
  const [boardInfo, setBoardInfo] = useState<{ projectManagerName: string | null } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showInitializer, setShowInitializer] = useState(false)
  const [boardReady, setBoardReady] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/web-dev-subscriptions")
      const data = await res.json()
      if (data.subscription) {
        setSubscription(data.subscription)

        // Check if board exists
        const boardRes = await fetch(`/api/project-boards?subscriptionId=${data.subscription.id}`)
        const boardData = await boardRes.json()

        if (boardData.board) {
          setBoardInfo({ projectManagerName: boardData.board.projectManagerName })
          setBoardReady(true)
        } else if (boardData.needsSetup) {
          setShowInitializer(true)
        }
      } else {
        router.push("/web-dev-plans")
      }
    } catch {
      router.push("/web-dev-plans")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  function handleInitializerComplete() {
    setShowInitializer(false)
    setBoardReady(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!subscription) return null

  const planIcon = subscription.plan === "STARTER" ? Zap : Crown

  return (
    <>
      {/* Initializer Screen */}
      <AnimatePresence>
        {showInitializer && (
          <BoardInitializer
            projectManagerName={null}
            onComplete={handleInitializerComplete}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard/web-dev")}
              className="text-slate-400 hover:text-slate-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <span className="text-sm font-bold text-slate-800">{MOSAIC_NAME}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {boardInfo?.projectManagerName && (
              <motion.a
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                href={`https://wa.me/${PM_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi ${getFirstname(boardInfo.projectManagerName)}, I have a question about my project.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Contact {getFirstname(boardInfo.projectManagerName)}</span>
                <span className="sm:hidden">PM</span>
              </motion.a>
            )}
            <Badge className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border-purple-200">
              {subscription.plan === "STARTER" ? "Starter" : "Complete"}
            </Badge>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-hidden p-4 sm:p-6">
          {boardReady && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full"
            >
              <KanbanBoard
                subscriptionId={subscription.id}
                onBoardReady={(board) => {
                  if (board.projectManagerName) {
                    setBoardInfo({ projectManagerName: board.projectManagerName })
                  }
                }}
              />
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}
