import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/providers"
import { ToastProvider } from "@/components/toast-notifications"

export const metadata: Metadata = {
  title: {
    default: "WPCodingPress - AI-Powered WordPress to Next.js Migration Service",
    template: "%s | WPCodingPress",
  },
  description: "Transform your WordPress site to lightning-fast Next.js. AI-powered migration with SEO preservation, auto-sync, and 10x performance improvement. Start free today!",
  keywords: [
    "WordPress to Next.js",
    "headless WordPress",
    "website migration",
    "Next.js development",
    "web performance optimization",
    "SEO migration",
    "React development",
    "JAMstack",
    "AI web development",
    "Elementor to Next.js"
  ],
  authors: [{ name: "WPCodingPress" }],
  creator: "WPCodingPress",
  publisher: "WPCodingPress",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wpcodingpress.com",
    siteName: "WPCodingPress",
    title: "WPCodingPress - AI-Powered WordPress to Next.js Migration Service",
    description: "Transform your WordPress site to lightning-fast Next.js. AI-powered migration with SEO preservation.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WPCodingPress - AI-Powered Web Development",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WPCodingPress - AI-Powered WordPress to Next.js Migration",
    description: "Transform your WordPress site to lightning-fast Next.js. Start free!",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col antialiased bg-slate-900 text-white" suppressHydrationWarning>
        <Providers>
          <ToastProvider>
            {children}
          </ToastProvider>
        </Providers>
      </body>
    </html>
  )
}
