"use client"

import { useEffect, useState, useRef } from "react"
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
  ChevronRight,
  Check,
  Package,
  ShoppingBag,
  MessageSquare,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { FloatingButtons } from "@/components/floating-buttons"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
  link?: string
}

const sidebarLinks = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, allowed: ['user', 'viewer'] },
  { title: "My Orders", href: "/dashboard/orders", icon: ShoppingCart, allowed: ['user'] },
  { title: "Downloads", href: "/dashboard/downloads", icon: DownloadCloud, allowed: ['user'] },
  { title: "Subscription", href: "/dashboard/subscription", icon: CreditCard, allowed: ['user'] },
  { title: "My Sites", href: "/dashboard/sites", icon: Globe, allowed: ['user'] },
  { title: "Settings", href: "/dashboard/settings", icon: Settings, allowed: ['user'] },
]

interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
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

  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [liveNotifications, setLiveNotifications] = useState<Notification[]>([])
  const headerNotifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsOpen && headerNotifRef.current && !headerNotifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [notificationsOpen])

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const res = await fetch("/api/notifications?type=user")
          if (res.ok) {
            const data = await res.json()
            setNotifications(data)
          }
        } catch (error) {
          console.error("Error fetching notifications:", error)
        }
      }
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 10000)
      return () => clearInterval(interval)
    }
  }, [user])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order": return <ShoppingBag className="w-4 h-4" />
      case "subscriber": return <Package className="w-4 h-4" />
      case "download": return <DownloadCloud className="w-4 h-4" />
      case "payment": return <CreditCard className="w-4 h-4" />
      case "contact": return <MessageSquare className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "order": return "bg-blue-100 text-blue-600"
      case "subscriber": return "bg-green-100 text-green-600"
      case "download": return "bg-purple-100 text-purple-600"
      case "payment": return "bg-green-100 text-green-600"
      case "contact": return "bg-orange-100 text-orange-600"
      default: return "bg-slate-100 text-slate-600"
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

  const checkAuth = async () => {
    try {
      // Call /api/auth/me which validates session version against DB
      const response = await fetch("/api/auth/me")
      const data = await response.json()
      
      if (!data.user) {
        router.push("/login")
        return
      }
      
      // If role is invalidated, logout and redirect
      if (data.user.role === 'invalidated') {
        await signOut({ redirect: false })
        router.push("/login?reason=session_expired")
        return
      }
      
      setUser(data.user)
      
      // Redirect editor/manager to admin panel
      if (data.user.role === 'editor' || data.user.role === 'manager') {
        router.push("/admin")
      }
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              className="fixed left-0 top-0 h-full w-72 bg-white z-50 lg:hidden border-r border-gray-200 shadow-xl"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">WPCodingPress</span>
                  </Link>
                  <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              <nav className="p-4 space-y-1">
                {sidebarLinks.filter(link => !link.allowed || (user?.role && link.allowed.includes(user.role))).map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)}>
                    <div className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                      ${pathname === link.href 
                        ? "bg-purple-100 text-purple-700 border border-purple-200" 
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }
                    `}>
                      <link.icon className="w-5 h-5" />
                      <span className="font-medium">{link.title}</span>
                    </div>
                  </Link>
                ))}
              </nav>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all w-full"
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
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-200 z-40 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">WPCodingPress</span>
          </Link>
        </div>
        
        <nav className="p-4 space-y-1">
          {sidebarLinks.filter(link => !link.allowed || (user?.role && link.allowed.includes(user.role))).map((link) => (
            <Link key={link.href} href={link.href}>
              <div className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${pathname === link.href 
                  ? "bg-purple-100 text-purple-700 border border-purple-200" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }
              `}>
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.title}</span>
              </div>
            </Link>
          ))}
          {/* No admin links for viewer */}
          {user?.role === 'viewer' && (
            <div className="p-4 text-sm text-gray-500">
              You have view-only access to the dashboard.
            </div>
          )}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                <Menu className="w-5 h-5 text-gray-500" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{getPageTitle()}</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Header Notification Bell */}
              <div className="relative" ref={headerNotifRef}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>
                
                {/* Header Notifications Dropdown */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50"
                    >
                      <div className="sticky top-0 bg-white p-3 border-b border-gray-100 flex items-center justify-between">
                        <span className="text-gray-700 font-semibold text-sm">Notifications</span>
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
                          {notifications.slice(0, 8).map((notif) => (
                            <Link
                              key={notif.id}
                              href={notif.link || '/dashboard'}
                              onClick={() => {
                                if (!notif.isRead) {
                                  setNotifications(prev => prev.map(n => 
                                    n.id === notif.id ? { ...n, isRead: true } : n
                                  ))
                                }
                              }}
                              className={`block p-3 hover:bg-gray-50 transition-colors ${!notif.isRead ? "bg-purple-50/50" : ""}`}
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
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link href="/dashboard/settings" className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center hover:shadow-lg transition-shadow">
                <User className="w-5 h-5 text-white" />
              </Link>
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
