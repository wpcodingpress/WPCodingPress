"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
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
  BarChart3,
  Bell,
  X,
  Check,
  ShoppingBag,
  User,
  Download,
  DollarSign as PaymentIcon,
  ChevronDown,
  Menu,
  Search,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NavItem {
  href: string
  icon: React.ElementType
  label: string
  badge?: number
}

interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
  link?: string
}

const navItems: NavItem[] = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/custom-orders", icon: DollarSign, label: "Custom Orders" },
  { href: "/admin/contacts", icon: MessageSquare, label: "Contacts" },
  { href: "/admin/services", icon: Settings, label: "Services" },
  { href: "/admin/products", icon: Image, label: "Products" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/subscribers", icon: SubscribersIcon, label: "Subscribers" },
  { href: "/admin/revenue", icon: BarChart3, label: "Revenue" },
  { href: "/admin/portfolio", icon: BarChart3, label: "Portfolio" },
  { href: "/admin/bank", icon: Building2, label: "Bank Settings" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login")
    }
  }, [status, router])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications?type=admin")
        if (res.ok) {
          const data = await res.json()
          setNotifications(data)
        }
      } catch (error) {
        console.error("Error fetching notifications:", error)
      }
    }
    if (session) {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 15000)
      return () => clearInterval(interval)
    }
  }, [session])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order": return <ShoppingBag className="w-4 h-4" />
      case "subscriber": return <User className="w-4 h-4" />
      case "download": return <Download className="w-4 h-4" />
      case "payment": return <PaymentIcon className="w-4 h-4" />
      case "contact": return <MessageSquare className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "order": return "bg-blue-500/20 text-blue-400"
      case "subscriber": return "bg-green-500/20 text-green-400"
      case "download": return "bg-purple-500/20 text-purple-400"
      case "payment": return "bg-green-500/20 text-green-400"
      case "contact": return "bg-orange-500/20 text-orange-400"
      default: return "bg-slate-500/20 text-slate-400"
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  const isNavActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin" || pathname === "/admin/dashboard"
    }
    return pathname.startsWith(href)
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-lg">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 bottom-0 z-40 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 border-r border-slate-700/50 shadow-2xl transition-all duration-300 flex flex-col",
          sidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-slate-700/50">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20 flex-shrink-0">
              <Zap className="h-5 w-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="overflow-hidden">
                <span className="text-lg font-bold text-white">WPCodingPress</span>
                <p className="text-xs text-slate-400">Admin Panel</p>
              </div>
            )}
          </Link>
        </div>

        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-violet-600 transition-colors z-50"
        >
          <ChevronDown className={cn("w-4 h-4 transition-transform", sidebarCollapsed ? "rotate-180" : "")} />
        </button>

        {/* Notifications Button */}
        <div className="p-4 border-b border-slate-700/50">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all relative group",
              "bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50"
            )}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-violet-400 flex-shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="text-slate-200 font-medium">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </>
              )}
              {sidebarCollapsed && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {unreadCount > 9 ? "9" : unreadCount}
                </span>
              )}
            </div>
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute left-4 right-4 mt-2 w-[calc(100%-2rem)] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-h-80 overflow-y-auto z-50"
              >
                <div className="sticky top-0 bg-slate-800 p-3 border-b border-slate-700 flex items-center justify-between">
                  <span className="text-slate-200 font-medium text-sm">Recent Activity</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Mark all read
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-sm">
                    No new notifications
                  </div>
                ) : (
                  <div className="divide-y divide-slate-700/50">
                    {notifications.slice(0, 10).map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 hover:bg-slate-700/50 transition-colors ${!notif.isRead ? "bg-violet-500/10" : ""}`}
                      >
                        <div className="flex gap-3">
                          <div className={`p-1.5 rounded-lg ${getNotificationColor(notif.type)}`}>
                            {getNotificationIcon(notif.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-200 font-medium truncate">{notif.title}</p>
                            <p className="text-xs text-slate-400 truncate">{notif.message}</p>
                            <p className="text-xs text-slate-500 mt-1">{formatTime(notif.createdAt)}</p>
                          </div>
                          {!notif.isRead && (
                            <div className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0 mt-2" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = isNavActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group",
                  isActive 
                    ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/20" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                {!sidebarCollapsed && (
                  <>
                    {item.label}
                    {item.badge && item.badge > 0 && (
                      <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-white/20 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
          <Link href="/" className="flex items-center gap-2 mb-3 text-slate-400 hover:text-violet-400 transition-colors group">
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            {!sidebarCollapsed && <span className="text-sm">Back to Website</span>}
          </Link>
          <div className={cn("flex items-center gap-3 mb-3", sidebarCollapsed && "justify-center")}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-medium flex-shrink-0">
              {session.user?.name?.charAt(0) || "A"}
            </div>
            {!sidebarCollapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{session.user?.name || "Admin"}</p>
                <p className="text-xs text-slate-400 truncate">{session.user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/admin-login" })}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors",
              sidebarCollapsed && "justify-center"
            )}
          >
            <LogOut className="h-4 w-4" />
            {!sidebarCollapsed && "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn("min-h-screen transition-all duration-300", sidebarCollapsed ? "ml-20" : "ml-64")}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-600"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 pl-10 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-slate-600 hover:text-violet-600 hover:bg-violet-50">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-medium cursor-pointer">
                {session.user?.name?.charAt(0) || "A"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
