import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/providers"

export const metadata: Metadata = {
  title: {
    default: "WPCodingPress - AI-Powered Web Development Agency",
    template: "%s | WPCodingPress",
  },
  description: "Professional WordPress development, Elementor design, and modern web applications. Transform your online presence with our AI-powered solutions.",
  keywords: ["WordPress development", "Elementor", "Web design", "WooCommerce", "Custom web development"],
  authors: [{ name: "WPCodingPress" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wpcodingpress.com",
    siteName: "WPCodingPress",
    title: "WPCodingPress - AI-Powered Web Development Agency",
    description: "Professional WordPress development, Elementor design, and modern web applications.",
  },
  twitter: {
    card: "summary_large_image",
    title: "WPCodingPress - AI-Powered Web Development Agency",
    description: "Professional WordPress development, Elementor design, and modern web applications.",
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
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
