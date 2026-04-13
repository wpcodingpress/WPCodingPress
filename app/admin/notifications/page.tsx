"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Bell, 
  Search, 
  Filter, 
  Check, 
  CheckCheck, 
  Trash2,
  ShoppingCart,
  MessageSquare,
  Users,
  DollarSign,
  CreditCard,
  Globe,
  Settings,
  Package,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
  link?: string
}

const typeColors: Record<string, string> = {
  order: "bg-blue-100 text-blue-600",
  custom_order: "bg-purple-100 text-purple-600",
  payment: "bg-green-100 text-green-600",
  contact: "bg-orange-100 text-orange-600",
  subscription: "bg-violet-100 text-violet-600",
  subscription_cancelled: "bg-red-100 text-red-600",
  subscription_expiring: "bg-yellow-100 text-yellow-600",
  user_registration: "bg-emerald-100 text-emerald-600",
  site: "bg-cyan-100 text-cyan-600",
  job: "bg-indigo-100 text-indigo-600",
  product_download: "bg-pink-100 text-pink-600",
  revenue: "bg-amber-100 text-amber-600",
}

const typeIcons: Record<string, React.ElementType> = {
  order: ShoppingCart,
  custom_order: Package,
  payment: DollarSign,
  contact: MessageSquare,
  subscription: CreditCard,
  subscription_cancelled: AlertCircle,
  subscription_expiring: AlertCircle,
  user_registration: Users,
  site: Globe,
  job: Settings,
  product_download: Package,
  revenue: DollarSign,
}

export default function NotificationCenter() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login")
    }
    if (status === "authenticated") {
      fetchNotifications()
    }
  }, [status, router])

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications?type=admin")
      if (res.ok) {
        const data = await res.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id })
      })
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true })
      })
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (error) {
      console.error("Error marking all as read:", error)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getTypeIcon = (type: string) => {
    const Icon = typeIcons[type] || Bell
    return Icon
  }

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         n.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || n.type === filterType
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "unread" && !n.isRead) ||
                         (filterStatus === "read" && n.isRead)
    return matchesSearch && matchesType && matchesStatus
  })

  const unreadCount = notifications.filter(n => !n.isRead).length
  const uniqueTypes = [...new Set(notifications.map(n => n.type))]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-violet-600">Loading notifications...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Notification Center</h1>
          <p className="text-slate-500 mt-1">
            {unreadCount > 0 ? (
              <span className="text-violet-600 font-medium">{unreadCount} unread notifications</span>
            ) : (
              "You're all caught up!"
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button 
            onClick={markAllAsRead}
            variant="outline" 
            className="border-violet-300 text-violet-700 hover:bg-violet-50"
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-slate-200"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>
                {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { type: 'order', label: 'Orders', icon: ShoppingCart },
          { type: 'custom_order', label: 'Custom Orders', icon: Package },
          { type: 'payment', label: 'Payments', icon: DollarSign },
          { type: 'contact', label: 'Contacts', icon: MessageSquare },
          { type: 'subscription', label: 'Subscriptions', icon: CreditCard },
          { type: 'user_registration', label: 'New Users', icon: Users },
        ].map(stat => {
          const count = notifications.filter(n => n.type === stat.type).length
          return (
            <button
              key={stat.type}
              onClick={() => setFilterType(stat.type)}
              className={`p-3 rounded-xl border transition-all ${filterType === stat.type ? 'border-violet-500 bg-violet-50' : 'border-slate-200 bg-white hover:border-violet-300'}`}
            >
              <stat.icon className="w-5 h-5 mx-auto mb-1 text-slate-600" />
              <p className="text-lg font-bold text-slate-900">{count}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </button>
          )
        })}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="bg-white border-slate-200">
            <CardContent className="p-12 text-center">
              <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No notifications found</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification, index) => {
            const Icon = getTypeIcon(notification.type)
            const colorClass = typeColors[notification.type] || "bg-slate-100 text-slate-600"
            
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                <Card className={`bg-white border transition-all ${notification.isRead ? 'border-slate-200' : 'border-violet-300 shadow-md'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2.5 rounded-xl ${colorClass} flex-shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className={`font-semibold text-slate-900 ${!notification.isRead ? 'text-base' : 'text-sm'}`}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{notification.message}</p>
                            <p className="text-xs text-slate-400 mt-2">{formatTime(notification.createdAt)}</p>
                          </div>
                          {!notification.isRead && (
                            <div className="w-2.5 h-2.5 rounded-full bg-violet-500 flex-shrink-0 mt-2" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          {notification.link && (
                            <Link href={notification.link}>
                              <Button size="sm" variant="outline" className="text-xs h-7 border-violet-200 text-violet-700 hover:bg-violet-50">
                                View <ArrowRight className="w-3 h-3 ml-1" />
                              </Button>
                            </Link>
                          )}
                          {!notification.isRead && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs h-7 text-slate-500 hover:text-violet-600"
                            >
                              <Check className="w-3 h-3 mr-1" /> Mark read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })
        )}
      </div>

      {filteredNotifications.length > 0 && (
        <div className="text-center text-sm text-slate-500">
          Showing {filteredNotifications.length} of {notifications.length} notifications
        </div>
      )}
    </div>
  )
}