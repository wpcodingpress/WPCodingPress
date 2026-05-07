import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Web Development Subscription Plans — Starter & Complete",
  description:
    "Get a professional, SEO-optimized website in 3 days. Choose Starter ($29/mo) if you have domain and hosting, or Complete ($59/mo) for a fully managed solution. Dedicated team, unlimited revisions, and 14-day money-back guarantee.",
  openGraph: {
    title: "Web Development Subscription Plans — WPCodingPress",
    description:
      "Professional website delivered in 3 days. Dedicated project manager, design team, and developers. Your choice of WordPress, Next.js, or React.",
    url: "https://wpcodingpress.com/web-dev-plans",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "WPCodingPress Web Development Plans" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Development Subscription — WPCodingPress",
    description: "Get a professional website in 3 days. Starting at $29/month.",
    images: ["/og-image.png"],
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://wpcodingpress.com/web-dev-plans",
  },
}

export default function WebDevPlansLayout({ children }: { children: React.ReactNode }) {
  return children
}
