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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

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

interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
  link?: string
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])

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

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-purple-600 text-lg">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">WPCodingPress</span>
          </Link>
        </div>

        {/* Notifications Button */}
        <div className="p-4 border-b border-gray-100">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors relative"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-purple-600" />
              <span className="text-gray-700 font-medium">Notifications</span>
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-4 right-4 mt-2 w-[calc(100%-2rem)] bg-white border border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-y-auto z-50"
              >
                <div className="sticky top-0 bg-white p-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-gray-700 font-medium text-sm">Recent Activity</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Mark all read
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 text-sm">
                    No new notifications
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.slice(0, 10).map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 hover:bg-gray-50 transition-colors ${!notif.isRead ? "bg-purple-50/50" : ""}`}
                      >
                        <div className="flex gap-3">
                          <div className={`p-1.5 rounded-lg ${getNotificationColor(notif.type)}`}>
                            {getNotificationIcon(notif.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 font-medium truncate">{notif.title}</p>
                            <p className="text-xs text-gray-500 truncate">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{formatTime(notif.createdAt)}</p>
                          </div>
                          {!notif.isRead && (
                            <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0 mt-2" />
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

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === "/admin" && pathname === "/admin")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isActive 
                    ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-500/20" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <Link href="/" className="block mb-4">
            <span className="text-xs text-purple-600 hover:text-purple-700 transition-colors">
              ← Back to Website
            </span>
          </Link>
          <div className="mb-4 px-4">
            <p className="text-sm font-medium text-gray-900">{session.user?.name || "Admin"}</p>
            <p className="text-xs text-gray-500">{session.user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
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
