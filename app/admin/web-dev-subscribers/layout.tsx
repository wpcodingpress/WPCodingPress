import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Web Dev Clients — Admin",
  description: "Manage web development subscription clients, view onboarding forms, and update project statuses.",
  robots: "noindex, nofollow",
}

export default function AdminWebDevLayout({ children }: { children: React.ReactNode }) {
  return children
}
