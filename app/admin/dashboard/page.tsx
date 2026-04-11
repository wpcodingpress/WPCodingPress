"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, ShoppingCart, MessageSquare, Image, Settings, LogOut, Users, 
  TrendingUp, Clock, CheckCircle, Loader2, Menu, X, Bell, Search,
  DollarSign, Eye, Edit, Trash2, Plus, ChevronDown, Filter, Download, Upload,
  BarChart3, PieChart as PieChartIcon, Activity, Server, Globe, Zap, ArrowUpRight,
  Mail, Phone, User, Calendar, FileText, Star, AlertCircle, CheckCheck,
  Package, EyeOff, ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { authApi, ordersApi, contactsApi, servicesApi } from "@/lib/api"
import { LogoIcon } from "@/components/logo"

interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  unreadContacts: number
  totalServices: number
  totalRevenue: number
  monthlyGrowth: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 156,
    pendingOrders: 12,
    completedOrders: 144,
    unreadContacts: 8,
    totalServices: 24,
    totalRevenue: 28450,
    monthlyGrowth: 18.5,
  })
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New order received", message: "Sarah Johnson placed an order", time: "2 min ago", unread: true },
    { id: 2, title: "Payment received", message: "$199 received from Michael Chen", time: "1 hour ago", unread: true },
    { id: 3, title: "Contact form submission", message: "New message from Emma", time: "3 hours ago", unread: false },
  ])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!authApi.isAuthenticated()) {
          router.push("/admin-login")
          return
        }

        const currentUser = await authApi.getCurrentUser()
        setUser(currentUser)

        const [ordersData, contactsData, servicesData] = await Promise.all([
          ordersApi.getAll({ per_page: 100 }).catch(() => ({ orders: [], pagination: { total: 0 } })),
          contactsApi.getAll({ per_page: 100 }).catch(() => ({ contacts: [], pagination: { total: 0 } })),
          servicesApi.getAll({ per_page: 100 }).catch(() => ({ services: [], pagination: { total: 0 } })),
        ])

        const orders = ordersData.orders || []
        const pendingOrders = orders.filter((o: any) => o.status === "pending").length
        const completedOrders = orders.filter((o: any) => o.status === "completed").length
        const unreadContacts = (contactsData.pagination?.total || 0) - 
          (contactsData.contacts?.filter((c: any) => c.is_read).length || 0)

        setStats(prev => ({
          ...prev,
          totalOrders: ordersData.pagination?.total || prev.totalOrders,
          pendingOrders,
          completedOrders,
          unreadContacts,
          totalServices: servicesData.pagination?.total || prev.totalServices,
        }))
      } catch (error) {
        console.error("Dashboard error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = async () => {
    await authApi.logout()
    router.push("/admin-login")
  }

  const unreadCount = notifications.filter(n => n.unread).length

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Link href="/admin/orders">
            <Button className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Order
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "from-violet-500 to-purple-500", change: "+12%" },
          { title: "Completed", value: stats.completedOrders, icon: CheckCircle, color: "from-emerald-400 to-teal-500", change: "+8%" },
          { title: "Pending", value: stats.pendingOrders, icon: Clock, color: "from-amber-400 to-orange-500", change: "-3%" },
          { title: "Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "from-blue-400 to-indigo-500", change: "+18%" },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Card className="bg-white border-slate-200 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-slate-400">vs last month</span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Orders & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900">Recent Orders</CardTitle>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="text-violet-600 hover:text-violet-700">
                View All <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Order</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Service</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { id: "ORD-001", customer: "Sarah Johnson", service: "WordPress to Next.js", amount: "$199", status: "completed", date: "2024-01-15" },
                    { id: "ORD-002", customer: "Michael Chen", service: "WooCommerce Setup", amount: "$149", status: "pending", date: "2024-01-14" },
                    { id: "ORD-003", customer: "Emma Williams", service: "SEO Optimization", amount: "$99", status: "completed", date: "2024-01-13" },
                    { id: "ORD-004", customer: "David Lee", service: "Custom Development", amount: "$299", status: "pending", date: "2024-01-12" },
                  ].map((order, i) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-900">{order.id}</span>
                        <p className="text-xs text-slate-400">{order.date}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                            <span className="text-xs font-semibold text-violet-600">
                              {order.customer.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-sm text-slate-700">{order.customer}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{order.service}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">{order.amount}</td>
                      <td className="px-6 py-4">
                        <Badge className={`${
                          order.status === 'completed' 
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                            : 'bg-amber-100 text-amber-700 border-amber-200'
                        }`}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-slate-100">
                            <Eye className="w-4 h-4 text-slate-500" />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-slate-100">
                            <Edit className="w-4 h-4 text-slate-500" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900">Order Status</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Completed</p>
                    <p className="text-xs text-slate-500">{Math.round((stats.completedOrders / stats.totalOrders) * 100)}%</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-slate-900">{stats.completedOrders}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Pending</p>
                    <p className="text-xs text-slate-500">{Math.round((stats.pendingOrders / stats.totalOrders) * 100)}%</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-slate-900">{stats.pendingOrders}</span>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-slate-500">Completion Rate</span>
                  <span className="text-sm font-semibold text-emerald-600">
                    {Math.round((stats.completedOrders / stats.totalOrders) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.completedOrders / stats.totalOrders) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Services", value: stats.totalServices, icon: Settings, color: "from-violet-400 to-purple-500" },
          { title: "Unread Messages", value: stats.unreadContacts, icon: MessageSquare, color: "from-pink-400 to-rose-500" },
          { title: "Monthly Growth", value: `+${stats.monthlyGrowth}%`, icon: TrendingUp, color: "from-emerald-400 to-teal-500" },
          { title: "Active Users", value: "24", icon: Users, color: "from-blue-400 to-indigo-500" },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <Card className="bg-white border-slate-200 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color}`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                    <p className="text-sm text-slate-500">{item.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}