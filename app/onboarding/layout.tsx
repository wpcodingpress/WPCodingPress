import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Project Onboarding — Tell Us About Your Website",
  description:
    "Complete your project onboarding form. Tell us about your website requirements, preferences, and goals so our team can get started on building your professional website.",
  robots: "noindex, nofollow",
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children
}
