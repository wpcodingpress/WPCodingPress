"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { 
  LayoutDashboard, 
  ShoppingCart, 
  MessageSquare, 
  Settings, 
  Image,
  LogOut,
  Zap,
  Users,
  Building2
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/contacts", icon: MessageSquare, label: "Contacts" },
  { href: "/admin/services", icon: Settings, label: "Services" },
  { href: "/admin/products", icon: Image, label: "Products" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/portfolio", icon: Image, label: "Portfolio" },
  { href: "/admin/bank", icon: Building2, label: "Bank Settings" },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin-login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border z-40">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-7 w-7 text-primary fill-primary" />
            <span className="text-lg font-bold">
              <span className="text-white">WP</span>
              <span className="gradient-text">CodingPress</span>
            </span>
          </Link>
        </div>

        <nav className="px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                pathname === item.href || (item.href === "/admin" && pathname === "/admin")
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="mb-4 px-4">
            <p className="text-sm font-medium text-white">{session.user?.name}</p>
            <p className="text-xs text-muted-foreground">{session.user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
