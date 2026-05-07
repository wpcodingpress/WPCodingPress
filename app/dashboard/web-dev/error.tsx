"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function WebDevDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Web dev dashboard error:", error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md text-center p-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">!</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Dashboard Error</h1>
        <p className="text-slate-500 mb-6">Failed to load your project data. Please try again.</p>
        <Button onClick={reset} className="bg-gradient-to-r from-purple-600 to-violet-600 text-white">
          Try Again
        </Button>
      </div>
    </div>
  )
}
