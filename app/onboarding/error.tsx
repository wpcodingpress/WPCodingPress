"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function OnboardingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Onboarding error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="max-w-md text-center p-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">!</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h1>
        <p className="text-slate-500 mb-6">We encountered an error loading your onboarding form. Please try again.</p>
        <Button onClick={reset} className="bg-gradient-to-r from-purple-600 to-violet-600 text-white">
          Try Again
        </Button>
      </div>
    </div>
  )
}
