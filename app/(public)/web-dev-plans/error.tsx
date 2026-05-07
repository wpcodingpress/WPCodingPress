"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function WebDevPlansError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Web dev plans error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md text-center p-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">!</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h1>
        <p className="text-slate-500 mb-6">Failed to load our pricing plans. Please refresh the page.</p>
        <Button onClick={reset} className="bg-gradient-to-r from-purple-600 to-violet-600 text-white">
          Try Again
        </Button>
      </div>
    </div>
  )
}
