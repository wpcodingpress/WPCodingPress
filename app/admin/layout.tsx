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
  FileText,
  Camera,
  Edit3,
  Trash2,
  Play,
  Pause,
  MoreVertical
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NavItem {
  href: string
  icon: React.ElementType
  label: string
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
  { href: "/admin/invoices", icon: FileText, label: "Invoices" },
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
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login")
    }
    // Allow admin, editor, manager to access admin panel
    if (session?.user?.role && !['admin', 'editor', 'manager'].includes(session.user.role)) {
      router.push("/dashboard")
    }
  }, [status, router, session])

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

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length > 1) {
      setShowSearchResults(true)
      try {
        const results: any[] = []
        try {
          const ordersRes = await fetch(`/api/orders?search=${query}`)
          if (ordersRes.ok) {
            const orders = await ordersRes.json()
            orders.slice(0, 3).forEach((o: any) => results.push({ type: 'order', title: o.clientName, sub: o.status, link: '/admin/orders' }))
          }
        } catch { }
        try {
          const usersRes = await fetch(`/api/admin/users?search=${query}`)
          if (usersRes.ok) {
            const users = await usersRes.json()
            users.slice(0, 3).forEach((u: any) => results.push({ type: 'user', title: u.name, sub: u.email, link: '/admin/users' }))
          }
        } catch { }
        setSearchResults(results)
      } catch { setSearchResults([]) }
    } else {
      setSearchResults([])
    }
  }

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "mark_all_read" }) })
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (e) { console.error(e) }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

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
    if (href === "/admin") return pathname === "/admin" || pathname === "/admin/dashboard"
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

  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 bottom-0 z-50 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 border-r border-slate-700/50 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col w-64",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-700/50">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20 flex-shrink-0">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div className="overflow-hidden">
              <span className="text-lg font-bold text-white">WPCodingPress</span>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Close Button (Mobile) */}
        <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1 lg:hidden text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        {/* Navigation */}
        <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = isNavActive(item.href)
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 md:py-3 rounded-xl text-sm font-medium transition-all group",
                  isActive ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/20" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                )}
              >
                <item.icon className={cn("h-4 w-4 md:h-5 md:w-5 flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                <span className="truncate hidden sm:block">{item.label}</span>
                <span className="truncate sm:hidden text-xs">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
          <Link href="/admin/profile" className="flex items-center gap-2 mb-3 text-slate-400 hover:text-violet-400 transition-colors group">
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Profile Settings</span>
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-medium flex-shrink-0">
              {session.user?.name?.charAt(0) || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{session.user?.name || "Admin"}</p>
              <p className="text-xs text-slate-400 truncate">{session.user?.email}</p>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/admin-login" })}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 gap-2 md:gap-0">
            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:gap-3 flex-1">
              <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-600 lg:hidden flex-shrink-0">
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Search - Full width on mobile */}
              <div className="relative flex-1 max-w-md min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery.length > 1 && setShowSearchResults(true)}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                  className="w-full pl-10 bg-slate-50 border-slate-200 h-9 md:h-10 text-sm"
                />
                {/* Search Results */}
                <AnimatePresence>
                  {showSearchResults && searchResults.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-1 w-[calc(100vw-2rem)] sm:w-full max-w-md bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50 left-2 sm:left-0 right-2 sm:right-auto">
                      {searchResults.map((r, i) => (
                        <Link key={i} href={r.link || '/admin'} className="flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0">
                          {r.type === 'order' ? <ShoppingBag className="w-4 h-4 text-blue-500" /> : <User className="w-4 h-4 text-green-500" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{r.title}</p>
                            <p className="text-xs text-slate-500 capitalize">{r.sub}</p>
                          </div>
                        </Link>
                      ))}
                      <Link href="/admin" className="block px-3 md:px-4 py-2 text-center text-sm text-violet-600 hover:bg-slate-50">
                        View all results
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative">
                <Button variant="ghost" size="icon" onClick={() => setNotificationsOpen(!notificationsOpen)} className="text-slate-600 hover:text-violet-600 hover:bg-violet-50 relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9" : unreadCount}
                    </span>
                  )}
                </Button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                      <div className="sticky top-0 bg-white p-3 border-b border-slate-100 flex items-center justify-between">
                        <span className="font-semibold text-slate-900">Notifications</span>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-xs text-violet-600 hover:text-violet-700 font-medium">Mark all read</button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-slate-500 text-sm">No notifications</div>
                        ) : (
                          <div className="divide-y divide-slate-100">
                            {notifications.slice(0, 10).map((notif) => (
                              <Link key={notif.id} href={notif.link || '#'} onClick={() => setNotificationsOpen(false)}
                                className={`flex gap-3 p-3 hover:bg-slate-50 ${!notif.isRead ? "bg-violet-50/50" : ""}`}>
                                <div className={`p-1.5 rounded-lg ${getNotificationColor(notif.type)}`}>
                                  {getNotificationIcon(notif.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-slate-900 truncate">{notif.title}</p>
                                  <p className="text-xs text-slate-500 truncate">{notif.message}</p>
                                  <p className="text-xs text-slate-400 mt-1">{formatTime(notif.createdAt)}</p>
                                </div>
                                {!notif.isRead && <div className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0 mt-2" />}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile */}
              <Link href="/admin/profile" className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-medium hover:opacity-90 transition-opacity">
                {session.user?.name?.charAt(0) || "A"}
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-3 md:p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}