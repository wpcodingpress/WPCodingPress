"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ShoppingBag, Package, Clock, CheckCircle, ArrowRight, Download, FileText, 
  CreditCard, Zap, LayoutDashboard, Settings, ShoppingCart, DownloadCloud,
  User, Bell, Menu, X, Plus, CreditCard as CardIcon, TrendingUp, Calendar,
  ChevronRight, HelpCircle, LogOut, ExternalLink, Play, Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AnimatedLogo, LogoIcon } from "@/components/logo"
import { FloatingButtons } from "@/components/floating-buttons"

interface Order {
  id: string
  status: string
  paymentStatus: string
  amount: number
  packageType: string
  createdAt: string
  product?: { name: string; downloadUrl: string | null }
  service?: { name: string }
}

const sidebarLinks = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: true },
  { title: "My Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { title: "Downloads", href: "/dashboard/downloads", icon: DownloadCloud },
  { title: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
  { title: "My Sites", href: "/dashboard/sites", icon: Globe },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
]

const userOrders = [
  { id: "ORD-001", service: "WordPress to Next.js", amount: 199, status: "completed", date: "Jan 15, 2024" },
  { id: "ORD-002", service: "WooCommerce Setup", amount: 149, status: "in_progress", date: "Jan 14, 2024" },
  { id: "ORD-003", service: "SEO Optimization", amount: 99, status: "completed", date: "Jan 13, 2024" },
]

const quickActions = [
  { title: "New Order", description: "Place a custom order", icon: Plus, href: "/order", color: "from-emerald-400 to-teal-500" },
  { title: "Browse Products", description: "Premium plugins & tools", icon: Package, href: "/products", color: "from-cyan-400 to-blue-500" },
  { title: "Browse Services", description: "Professional services", icon: Zap, href: "/services", color: "from-violet-400 to-purple-500" },
]

export default function DashboardOverview() {
  const [orders, setOrders] = useState<Order[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user] = useState({ name: "Alex", email: "alex@example.com" })

  const stats = {
    total: userOrders.length,
    completed: userOrders.filter(o => o.status === "completed").length,
    inProgress: userOrders.filter(o => o.status === "in_progress").length,
    totalSpent: userOrders.reduce((acc, o) => acc + o.amount, 0),
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return { bg: "bg-emerald-100", text: "text-emerald-700", label: "Completed" }
      case "in_progress":
        return { bg: "bg-blue-100", text: "text-blue-700", label: "In Progress" }
      case "pending":
        return { bg: "bg-amber-100", text: "text-amber-700", label: "Pending" }
      default:
        return { bg: "bg-slate-100", text: "text-slate-700", label: status }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <FloatingButtons />
      
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-0 h-full w-72 bg-white z-50 lg:hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <AnimatedLogo size="sm" />
                  <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <nav className="p-4 space-y-1">
                {sidebarLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)}>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      link.active ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg" : "text-slate-600 hover:bg-slate-50"
                    }`}>
                      <link.icon className="w-5 h-5" />
                      <span className="font-medium">{link.title}</span>
                    </div>
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside className="hidden lg:block fixed left-0 top-0 h-full w-72 bg-white border-r border-slate-200 z-40">
        <div className="p-6 border-b border-slate-100">
          <AnimatedLogo size="sm" />
        </div>
        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  link.active ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-600 hover:bg-slate-50"
                }`}>
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.title}</span>
              </motion.div>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-slate-600 hover:bg-slate-50">
              <LogOut className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </aside>

      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-500">Welcome back, {user.name}!</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">2</span>
              </Button>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
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
            <div className="bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Hello, {user.name}! 👋</h2>
                    <p className="text-white/80 text-lg">Ready to build something amazing today?</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/order">
                      <Button className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold px-6">
                        <Plus className="w-4 h-4 mr-2" />
                        New Order
                      </Button>
                    </Link>
                    <Link href="/products">
                      <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold px-6">
                        Browse Products
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { title: "Total Orders", value: stats.total, icon: ShoppingBag, color: "from-emerald-400 to-teal-500" },
              { title: "Completed", value: stats.completed, icon: CheckCircle, color: "from-blue-400 to-cyan-500" },
              { title: "In Progress", value: stats.inProgress, icon: Clock, color: "from-violet-400 to-purple-500" },
              { title: "Total Spent", value: `$${stats.totalSpent}`, icon: CreditCard, color: "from-amber-400 to-orange-500" },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white border-slate-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                      </div>
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <Card className="bg-white border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Recent Orders</CardTitle>
                  <Link href="/dashboard/orders">
                    <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {userOrders.map((order, i) => {
                      const status = getStatusConfig(order.status)
                      return (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-6 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-cyan-100 flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-emerald-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">{order.service}</p>
                                <p className="text-sm text-slate-500">{order.id} • {order.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-bold text-slate-900">${order.amount}</p>
                                <Badge className={`${status.bg} ${status.text}`}>{status.label}</Badge>
                              </div>
                              {order.status === "completed" && (
                                <Button variant="ghost" size="icon" className="hover:bg-emerald-50">
                                  <Download className="w-5 h-5 text-emerald-600" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-white border-slate-200">
                <CardHeader className="border-b border-slate-100 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.map((action, i) => (
                    <Link key={i} href={action.href}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                      >
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} shadow-lg`}>
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">{action.title}</p>
                          <p className="text-xs text-slate-500">{action.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                      </motion.div>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500 to-cyan-600 border-0">
                <CardContent className="p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-white/20">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Upgrade to Pro</p>
                      <p className="text-white/80 text-sm">Unlock all features</p>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {["Unlimited Sites", "Priority Support", "Advanced Templates"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/pricing">
                    <Button className="w-full bg-white text-emerald-600 hover:bg-emerald-50 font-semibold">
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-violet-100">
                    <TrendingUp className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">This Month</p>
                    <p className="text-xl font-bold text-slate-900">2 Orders</p>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "66%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">66% of last month</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-amber-100">
                    <Calendar className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Next Renewal</p>
                    <p className="text-xl font-bold text-slate-900">Feb 15, 2024</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400">Your Pro subscription renews in 15 days</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-blue-100">
                    <HelpCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Need Help?</p>
                    <p className="text-xl font-bold text-slate-900">Contact Support</p>
                  </div>
                </div>
                <Link href="/contact">
                  <Button variant="outline" className="w-full btn-secondary">Get Help</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
