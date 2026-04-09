"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ShoppingBag, Package, Clock, CheckCircle, ArrowRight, Download, FileText, 
  CreditCard, Zap, LayoutDashboard, Settings, ShoppingCart, DownloadCloud,
  User, Bell, Menu, X, Plus, TrendingUp, Calendar,
  ChevronRight, HelpCircle, LogOut, ExternalLink, Globe, Play, DollarSign,
  ArrowUpRight, CreditCard as CardIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FloatingButtons } from "@/components/floating-buttons"

interface Order {
  id: string
  status: string
  paymentStatus: string
  amount: number
  packageType: string
  createdAt: string
  service?: { name: string }
}

const sidebarLinks = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { title: "Downloads", href: "/dashboard/downloads", icon: DownloadCloud },
  { title: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
  { title: "My Sites", href: "/dashboard/sites", icon: Globe },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
]

const userOrders = [
  { id: "ORD-001", service: "WordPress to Next.js", amount: 0, status: "active", date: "Apr 9, 2026" },
]

const plans = [
  { name: "Free", price: "$0/mo", features: ["1 Site", "Basic Template", "Community Support"], current: true },
  { name: "Pro", price: "$19/mo", features: ["5 Sites", "Advanced Templates", "Priority Support", "Custom Domain"], current: false },
  { name: "Enterprise", price: "$99/mo", features: ["Unlimited Sites", "White-label", "24/7 Support"], current: false },
]

export default function DashboardOverview() {
  const [orders, setOrders] = useState<Order[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user] = useState({ name: "User", email: "user@example.com" })

  const stats = {
    total: 1,
    completed: 1,
    inProgress: 0,
    totalSpent: 0,
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return { bg: "bg-green-500/20", text: "text-green-400", label: "Active" }
      case "completed":
        return { bg: "bg-emerald-500/20", text: "text-emerald-400", label: "Completed" }
      case "in_progress":
        return { bg: "bg-blue-500/20", text: "text-blue-400", label: "In Progress" }
      case "pending":
        return { bg: "bg-amber-500/20", text: "text-amber-400", label: "Pending" }
      default:
        return { bg: "bg-slate-500/20", text: "text-slate-400", label: status }
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <FloatingButtons />
      
      {/* Mobile Sidebar Overlay */}
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
              className="fixed left-0 top-0 h-full w-72 bg-slate-800 z-50 lg:hidden border-r border-slate-700"
            >
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-white">WPCodingPress</span>
                  </Link>
                  <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-slate-700 rounded-lg">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>
              <nav className="p-4 space-y-1">
                {sidebarLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)}>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
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

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-72 bg-slate-800 border-r border-slate-700 z-40">
        <div className="p-6 border-b border-slate-700">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">WPCodingPress</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.title}</span>
              </div>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700">
              <LogOut className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-800 rounded-lg">
                <Menu className="w-5 h-5 text-slate-400" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Dashboard</h1>
                <p className="text-sm text-slate-400">Welcome back, {user.name}!</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-slate-400" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 text-white text-xs rounded-full flex items-center justify-center">2</span>
              </Button>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
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
                      <Button className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-6">
                        <Plus className="w-4 h-4 mr-2" />
                        New Order
                      </Button>
                    </Link>
                    <Link href="/services">
                      <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold px-6">
                        Browse Services
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { title: "Total Orders", value: stats.total, icon: ShoppingBag, color: "from-indigo-500 to-indigo-600" },
              { title: "Completed", value: stats.completed, icon: CheckCircle, color: "from-green-500 to-emerald-500" },
              { title: "In Progress", value: stats.inProgress, icon: Clock, color: "from-blue-500 to-cyan-500" },
              { title: "Total Spent", value: `$${stats.totalSpent}`, icon: DollarSign, color: "from-purple-500 to-pink-500" },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400 font-medium">{stat.title}</p>
                        <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
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

          {/* Orders & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-700 pb-4">
                  <CardTitle className="text-lg font-semibold text-white">Recent Orders</CardTitle>
                  <Link href="/dashboard/orders">
                    <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300">
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-700">
                    {userOrders.map((order, i) => {
                      const status = getStatusConfig(order.status)
                      return (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-6 hover:bg-slate-700/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-indigo-400" />
                              </div>
                              <div>
                                <p className="font-semibold text-white">{order.service}</p>
                                <p className="text-sm text-slate-400">{order.id} • {order.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-bold text-white">${order.amount}</p>
                                <Badge className={`${status.bg} ${status.text}`}>{status.label}</Badge>
                              </div>
                              {order.status === "active" && (
                                <Button variant="ghost" size="icon" className="hover:bg-indigo-500/20">
                                  <ArrowUpRight className="w-5 h-5 text-indigo-400" />
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

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="border-b border-slate-700 pb-4">
                  <CardTitle className="text-lg font-semibold text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: "New Order", description: "Place a custom order", icon: Plus, href: "/order", color: "from-indigo-500 to-purple-500" },
                    { title: "Browse Products", description: "Premium tools", icon: Package, href: "/products", color: "from-purple-500 to-pink-500" },
                    { title: "Browse Services", description: "Professional services", icon: Zap, href: "/services", color: "from-pink-500 to-rose-500" },
                  ].map((action, i) => (
                    <Link key={i} href={action.href}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-slate-700/50 hover:bg-slate-700 transition-colors group"
                      >
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} shadow-lg`}>
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-white group-hover:text-indigo-400 transition-colors">{action.title}</p>
                          <p className="text-xs text-slate-400">{action.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                      </motion.div>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Upgrade Card */}
              <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 border-0">
                <CardContent className="p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-white/20">
                      <TrendingUp className="w-6 h-6" />
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
                    <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-semibold">
                      Get Started - $19/mo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Current Plan */}
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader className="border-b border-slate-700">
              <CardTitle className="text-lg font-semibold text-white">Your Current Plan</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div 
                    key={plan.name}
                    className={`p-6 rounded-2xl border-2 ${
                      plan.current 
                        ? 'border-indigo-500 bg-indigo-500/10' 
                        : 'border-slate-700 bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                      {plan.current && (
                        <Badge className="bg-indigo-500 text-white">Current</Badge>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-white mb-4">{plan.price}</p>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {!plan.current && (
                      <Link href="/pricing">
                        <Button 
                          variant="outline" 
                          className="w-full border-indigo-500 text-indigo-400 hover:bg-indigo-500/10"
                        >
                          Upgrade
                        </Button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Help Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-purple-500/20">
                    <HelpCircle className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Need Help?</p>
                    <p className="text-lg font-bold text-white">Contact Support</p>
                  </div>
                </div>
                <Link href="/contact">
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">Get Help</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-green-500/20">
                    <Calendar className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Next Billing</p>
                    <p className="text-lg font-bold text-white">-</p>
                  </div>
                </div>
                <p className="text-sm text-slate-400">You're on the Free plan</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
