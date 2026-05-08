import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mosaic — Project Management | WPCodingPress",
  description: "Full-featured agency project management board with Kanban, task tracking, file sharing, and team collaboration.",
}

export default function ProjectBoardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
