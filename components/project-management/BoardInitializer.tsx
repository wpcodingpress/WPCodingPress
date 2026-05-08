"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, CheckCircle, Sparkles, Zap, User, LayoutDashboard, Rocket } from "lucide-react"
import { BOARD_INIT_STEPS, MOSAIC_NAME } from "@/lib/project-management"

interface BoardInitializerProps {
  projectManagerName: string | null
  onComplete: () => void
}

const STEP_ICONS = [
  Sparkles,
  LayoutDashboard,
  User,
  Zap,
  Rocket,
]

export function BoardInitializer({ projectManagerName, onComplete }: BoardInitializerProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const totalSteps = projectManagerName ? BOARD_INIT_STEPS.length : BOARD_INIT_STEPS.length - 1

  useEffect(() => {
    if (currentStep >= totalSteps) {
      const timer = setTimeout(onComplete, 800)
      return () => clearTimeout(timer)
    }
  }, [currentStep, totalSteps, onComplete])

  useEffect(() => {
    const interval = setInterval(() => {
      setCompletedSteps((prev) => {
        const next = currentStep
        if (!prev.includes(next)) {
          setTimeout(() => setCurrentStep((s) => s + 1), 400)
          return [...prev, next]
        }
        return prev
      })
    }, 1800)

    return () => clearInterval(interval)
  }, [currentStep])

  const visibleSteps = projectManagerName
    ? BOARD_INIT_STEPS
    : BOARD_INIT_STEPS.filter((s) => s.key !== "assigning")

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-purple-500/30">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">{MOSAIC_NAME}</h1>
          <p className="text-purple-300/70 text-sm mt-1">Agency Project Management Platform</p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-4">
          {visibleSteps.map((step, index) => {
            const isCompleted = completedSteps.includes(index)
            const isCurrent = currentStep === index && !isCompleted
            const Icon = STEP_ICONS[index]

            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, duration: 0.4 }}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                  isCurrent
                    ? "bg-white/10 border border-purple-500/30 shadow-lg shadow-purple-500/10"
                    : isCompleted
                      ? "bg-white/5"
                      : "bg-white/5 opacity-40"
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                    isCompleted
                      ? "bg-gradient-to-br from-green-400 to-emerald-500"
                      : isCurrent
                        ? "bg-gradient-to-br from-purple-500 to-violet-500"
                        : "bg-slate-700"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      isCompleted
                        ? "text-green-400"
                        : isCurrent
                          ? "text-white"
                          : "text-slate-500"
                    }`}
                  >
                    {step.key === "assigning" && projectManagerName
                      ? `Assigning Your Project Manager: ${projectManagerName}...`
                      : step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-purple-300/60 mt-0.5">
                      {step.key === "initializing" && "Preparing your workspace environment..."}
                      {step.key === "creating" && "Setting up your board with default columns..."}
                      {step.key === "assigning" && "Selecting the best project manager for your project..."}
                      {step.key === "setting_up" && "Configuring dashboard, tasks, and team settings..."}
                      {step.key === "live" && "Your Mosaic workspace is almost ready!"}
                    </p>
                  )}
                </div>

                {/* Progress dot */}
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    isCompleted
                      ? "bg-green-400"
                      : isCurrent
                        ? "bg-purple-400 animate-pulse"
                        : "bg-slate-600"
                  }`}
                />
              </motion.div>
            )
          })}
        </div>

        {/* Bottom message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="text-center text-xs text-purple-300/40 mt-8"
        >
          Powered by {MOSAIC_NAME} — Built for Digital Agencies
        </motion.p>
      </div>
    </div>
  )
}
