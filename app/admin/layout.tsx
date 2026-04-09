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
  Building2,
  DollarSign,
  Users as SubscribersIcon,
  BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/contacts", icon: MessageSquare, label: "Contacts" },
  { href: "/admin/services", icon: Settings, label: "Services" },
  { href: "/admin/products", icon: Image, label: "Products" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/subscribers", icon: SubscribersIcon, label: "Subscribers" },
  { href: "/admin/revenue", icon: DollarSign, label: "Revenue" },
  { href: "/admin/portfolio", icon: BarChart3, label: "Portfolio" },
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
      router.push("/admin/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-pulse text-indigo-400">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-800 border-r border-slate-700 z-40">
        <div className="p-6 border-b border-slate-700">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              WPCodingPress
            </span>
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === "/admin" && pathname === "/admin")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20" 
                    : "text-slate-400 hover:text-white hover:bg-slate-700"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <Link href="/" className="block mb-4">
            <span className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              ← Back to Website
            </span>
          </Link>
          <div className="mb-4 px-4">
            <p className="text-sm font-medium text-white">{session.user?.name || "Admin"}</p>
            <p className="text-xs text-slate-400">{session.user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
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
