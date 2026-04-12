"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingCart, MessageSquare, TrendingUp, Clock, ArrowRight, Users, DollarSign, Package, BarChart3, Settings, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  totalContacts: number
  unreadContacts: number
}

interface RecentOrder {
  id: string
  clientName: string
  clientEmail: string
  packageType: string
  status: string
  createdAt: string
  service: { name: string }
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    totalContacts: 0,
    unreadContacts: 0
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await fetch("/api/orders")
        const contactsRes = await fetch("/api/contacts/admin")
        
        if (ordersRes.ok) {
          const orders = await ordersRes.json()
          setRecentOrders(orders.slice(0, 5))
          setStats(prev => ({
            ...prev,
            totalOrders: orders.length,
            pendingOrders: orders.filter((o: { status: string }) => o.status === "pending").length
          }))
        }
        
        if (contactsRes.ok) {
          const contacts = await contactsRes.json()
          setStats(prev => ({
            ...prev,
            totalContacts: contacts.length,
            unreadContacts: contacts.filter((c: { isRead: boolean }) => !c.isRead).length
          }))
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const statCards = [
    { title: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "from-violet-500 to-purple-500", href: "/admin/orders" },
    { title: "Pending Orders", value: stats.pendingOrders, icon: Clock, color: "from-amber-400 to-orange-500", href: "/admin/orders" },
    { title: "Total Contacts", value: stats.totalContacts, icon: MessageSquare, color: "from-blue-400 to-cyan-500", href: "/admin/contacts" },
    { title: "Unread Messages", value: stats.unreadContacts, icon: Mail, color: "from-emerald-400 to-teal-500", href: "/admin/contacts" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-500/20 text-amber-600 border-amber-200"
      case "approved": return "bg-blue-500/20 text-blue-600 border-blue-200"
      case "in_progress": return "bg-violet-500/20 text-violet-600 border-violet-200"
      case "completed": return "bg-emerald-500/20 text-emerald-600 border-emerald-200"
      case "rejected": return "bg-red-500/20 text-red-600 border-red-200"
      default: return "bg-slate-500/20 text-slate-600 border-slate-200"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm md:text-base text-slate-500 mt-0.5 md:mt-1">Welcome back! Here's an overview of your business.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={stat.href}>
              <Card className="bg-white border-slate-200 hover:shadow-lg hover:shadow-violet-500/10 transition-all cursor-pointer group">
                <CardContent className="p-3 md:p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] md:text-sm text-slate-500 mb-0.5 md:mb-1 truncate">{stat.title}</p>
                      <p className="text-xl md:text-3xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                    <div className={`p-2 md:p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                      <stat.icon className="h-4 w-4 md:h-6 md:w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-3 md:pb-4 gap-2">
            <CardTitle className="text-lg md:text-xl font-semibold text-slate-900">Recent Orders</CardTitle>
            <Link href="/admin/orders" className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No orders yet
              </div>
            ) : (
<div className="space-y-2 md:space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900 truncate">{order.clientName}</p>
                        <p className="text-xs md:text-sm text-slate-500 truncate">{order.service?.name} - {order.packageType}</p>
                      </div>
                      <div className="text-left sm:text-right flex items-center justify-between sm:block">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.replace("_", " ")}
                        </Badge>
                        <p className="text-xs text-slate-400 mt-0.5 md:mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {[
          { title: "Manage Orders", description: "View and update order status", icon: ShoppingCart, href: "/admin/orders", color: "from-violet-500 to-purple-500" },
          { title: "Contact Messages", description: `${stats.unreadContacts} unread messages`, icon: MessageSquare, href: "/admin/contacts", color: "from-blue-400 to-cyan-500" },
          { title: "Services", description: "Manage service offerings", icon: Settings, href: "/admin/services", color: "from-emerald-400 to-teal-500" },
          { title: "Revenue", description: "Track your earnings", icon: DollarSign, href: "/admin/revenue", color: "from-amber-400 to-orange-500" },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <Link href={item.href}>
              <Card className="bg-white border-slate-200 hover:shadow-lg hover:shadow-violet-500/10 transition-all cursor-pointer group h-full">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-4">
                    <div className={`p-2 md:p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                      <item.icon className="h-4 w-4 md:h-6 md:w-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 text-sm md:text-base truncate">{item.title}</h3>
                      <p className="text-xs md:text-sm text-slate-500 truncate">{item.description}</p>
                    </div>
                  </div>
                  <span className="text-xs md:text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1">
                    Go to {item.title} →
                  </span>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}