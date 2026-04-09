"use client"

import { Navbar } from "@/components/layout"
import { Footer } from "@/components/layout/footer"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Navbar />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
    </div>
  )
}
