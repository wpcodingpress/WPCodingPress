"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, ShoppingCart, MessageSquare, Image, Settings, LogOut, Users, 
  TrendingUp, Clock, CheckCircle, XCircle, Loader2, Menu, X, Bell, Search,
  DollarSign, Eye, Edit, Trash2, Plus, ChevronDown, Filter, Download, Upload,
  BarChart3, PieChart as PieChartIcon, Activity, Server, Globe, Zap, ArrowUpRight,
  Mail, Phone, User, Calendar, FileText, Star, AlertCircle, CheckCheck
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

const sidebarLinks = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, active: true },
  { title: "Orders", href: "/admin/orders", icon: ShoppingCart, badge: "pendingOrders" },
  { title: "Contacts", href: "/admin/contacts", icon: MessageSquare, badge: "unreadContacts" },
  { title: "Services", href: "/admin/services", icon: Settings },
  { title: "Portfolio", href: "/admin/portfolio", icon: Image },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Bank Details", href: "/admin/bank", icon: DollarSign },
]

const recentOrders = [
  { id: "ORD-001", customer: "Sarah Johnson", service: "WordPress to Next.js", amount: "$199", status: "completed", date: "2024-01-15" },
  { id: "ORD-002", customer: "Michael Chen", service: "WooCommerce Setup", amount: "$149", status: "pending", date: "2024-01-14" },
  { id: "ORD-003", customer: "Emma Williams", service: "SEO Optimization", amount: "$99", status: "completed", date: "2024-01-13" },
  { id: "ORD-004", customer: "David Lee", service: "Custom Development", amount: "$299", status: "pending", date: "2024-01-12" },
]

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
          router.push("/login")
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
    router.push("/login")
  }

  const unreadCount = notifications.filter(n => n.unread).length

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-12 w-12 text-emerald-500" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="fixed left-0 top-0 h-full w-72 bg-white border-r border-slate-200 z-50 flex flex-col shadow-xl"
          >
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <LogoIcon size={44} />
                <div>
                  <h1 className="text-lg font-bold text-slate-900">WPCodingPress</h1>
                  <p className="text-xs text-slate-500">Admin Dashboard</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {sidebarLinks.map((link) => {
                const badgeValue = link.badge ? stats[link.badge as keyof DashboardStats] : 0
                return (
                  <Link key={link.href} href={link.href}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        link.active
                          ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      <span className="flex-1 font-medium">{link.title}</span>
                      {badgeValue > 0 && (
                        <Badge className={`${link.active ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"} text-xs`}>
                          {badgeValue}
                        </Badge>
                      )}
                    </motion.div>
                  </Link>
                )
              })}
            </nav>

            <div className="p-4 border-t border-slate-100">
              <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || "Admin"}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email || "admin@wpcodingpress.com"}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className={`flex-1 ${sidebarOpen ? "ml-72" : ""} transition-all duration-300`}>
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 pl-10 bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Upload className="w-5 h-5" />
              </Button>
              
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
                
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                        <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
                          Mark all read
                        </Button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer ${
                              notif.unread ? "bg-emerald-50/50" : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                notif.unread ? "bg-emerald-100" : "bg-slate-100"
                              }`}>
                                {notif.title.includes("order") ? (
                                  <ShoppingCart className="w-4 h-4 text-emerald-600" />
                                ) : notif.title.includes("Payment") ? (
                                  <DollarSign className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Mail className="w-4 h-4 text-blue-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900">{notif.title}</p>
                                <p className="text-xs text-slate-500">{notif.message}</p>
                                <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                              </div>
                              {notif.unread && (
                                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-slate-100">
                        <Button variant="ghost" className="w-full text-emerald-600 hover:text-emerald-700">
                          View all notifications
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-1">Welcome back! Here's what's happening with your business.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="btn-secondary">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Link href="/admin/orders/new">
                  <Button className="btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    New Order
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { title: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "from-emerald-400 to-teal-500", change: "+12%" },
              { title: "Completed", value: stats.completedOrders, icon: CheckCircle, color: "from-blue-400 to-cyan-500", change: "+8%" },
              { title: "Pending", value: stats.pendingOrders, icon: Clock, color: "from-amber-400 to-orange-500", change: "-3%" },
              { title: "Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "from-violet-400 to-purple-500", change: "+18%" },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="bg-white border-slate-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm text-emerald-600 font-medium">{stat.change}</span>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2 bg-white border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100">
                <CardTitle className="text-lg font-semibold text-slate-900">Recent Orders</CardTitle>
                <Link href="/admin/orders">
                  <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
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
                      {recentOrders.map((order, i) => (
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
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-100 to-cyan-100 flex items-center justify-center">
                                <span className="text-xs font-semibold text-emerald-600">
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
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-amber-100 text-amber-700'
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
              <CardHeader className="border-b border-slate-100">
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
                        className="h-full bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

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
        </main>
      </div>
    </div>
  )
}
