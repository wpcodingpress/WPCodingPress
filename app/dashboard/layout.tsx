"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, 
  ShoppingCart, 
  DownloadCloud,
  Settings, 
  LogOut,
  Loader2,
  User,
  CreditCard,
  Globe,
  Menu,
  X,
  Bell,
  Zap,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { FloatingButtons } from "@/components/floating-buttons"

const sidebarLinks = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { title: "Downloads", href: "/dashboard/downloads", icon: DownloadCloud },
  { title: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
  { title: "My Sites", href: "/dashboard/sites", icon: Globe },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
]

interface UserType {
  id: string;
  name: string;
  email: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/session")
      const session = await response.json()
      
      if (!session?.user || session.user.role !== "client") {
        router.push("/login")
        return
      }
      
      setUser(session.user)
    } catch (error) {
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    window.location.href = "/"
  }

  const getPageTitle = () => {
    const path = pathname.replace("/dashboard", "") || "/"
    if (path === "/") return "Dashboard"
    return path.replace("/", "").replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <FloatingButtons />
      
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              className="fixed left-0 top-0 h-full w-72 bg-slate-800 z-50 lg:hidden border-r border-slate-700"
            >
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-white">WPCodingPress</span>
                  </Link>
                  <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-slate-700 rounded-lg">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>
              <nav className="p-4 space-y-1">
                {sidebarLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)}>
                    <div className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                      ${pathname === link.href 
                        ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" 
                        : "text-slate-400 hover:text-white hover:bg-slate-700"
                      }
                    `}>
                      <link.icon className="w-5 h-5" />
                      <span className="font-medium">{link.title}</span>
                    </div>
                  </Link>
                ))}
              </nav>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-72 bg-slate-800 border-r border-slate-700 z-40">
        <div className="p-6 border-b border-slate-700">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">WPCodingPress</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <div className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${pathname === link.href 
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" 
                  : "text-slate-400 hover:text-white hover:bg-slate-700"
                }
              `}>
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.title}</span>
              </div>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-800 rounded-lg">
                <Menu className="w-5 h-5 text-slate-400" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">{getPageTitle()}</h1>
                <p className="text-sm text-slate-400">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
