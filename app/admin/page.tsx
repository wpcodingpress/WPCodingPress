"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingCart, MessageSquare, TrendingUp, Clock, ArrowRight, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
    { title: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-primary" },
    { title: "Pending Orders", value: stats.pendingOrders, icon: Clock, color: "text-yellow-400" },
    { title: "Total Contacts", value: stats.totalContacts, icon: MessageSquare, color: "text-blue-400" },
    { title: "Unread Messages", value: stats.unreadContacts, icon: TrendingUp, color: "text-green-400" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-400/20 text-yellow-400"
      case "approved": return "bg-blue-400/20 text-blue-400"
      case "in_progress": return "bg-purple-400/20 text-purple-400"
      case "completed": return "bg-green-400/20 text-green-400"
      case "rejected": return "bg-red-400/20 text-red-400"
      default: return "bg-gray-400/20 text-gray-400"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Recent Orders</CardTitle>
            <Link href="/admin/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No orders yet
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <div>
                      <p className="font-medium text-white">{order.clientName}</p>
                      <p className="text-sm text-muted-foreground">{order.service?.name} - {order.packageType}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.replace("_", " ")}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Manage Orders</h3>
                  <p className="text-sm text-muted-foreground">View and update order status</p>
                </div>
              </div>
              <Link href="/admin/orders">
                <span className="text-sm text-primary hover:underline">Go to Orders →</span>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-green-500/10">
                  <MessageSquare className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Contact Messages</h3>
                  <p className="text-sm text-muted-foreground">
                    {stats.unreadContacts} unread messages
                  </p>
                </div>
              </div>
              <Link href="/admin/contacts">
                <span className="text-sm text-primary hover:underline">View Messages →</span>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
