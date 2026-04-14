"use client"

import { Navbar } from "@/components/layout"
import { Footer } from "@/components/layout/footer"
import { FloatingButtons } from "@/components/floating-buttons"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-14 sm:pt-16 lg:pt-20 overflow-x-hidden">
        {children}
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  )
}
