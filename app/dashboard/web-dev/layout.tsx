import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Web Development Dashboard",
  description: "Track your website project progress, manage your subscription, and communicate with your project manager.",
  robots: "noindex, nofollow",
}

export default function WebDevDashboardLayout({ children }: { children: React.ReactNode }) {
  return children
}
