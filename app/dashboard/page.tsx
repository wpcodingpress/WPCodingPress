"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  CheckCircle, Clock, ShoppingBag, DollarSign, TrendingUp, HelpCircle, Calendar, 
  Plus, Package, Zap, ChevronRight, Bell
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const plans = [
  { name: "Free", price: "$0/mo", features: ["1 Site", "Basic Template", "Community Support"], current: true },
  { name: "Pro", price: "$19/mo", features: ["5 Sites", "Advanced Templates", "Priority Support", "Custom Domain"], current: false },
  { name: "Enterprise", price: "$99/mo", features: ["Unlimited Sites", "White-label", "24/7 Support"], current: false },
]

export default function DashboardOverview() {
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, totalSpent: 0 })
  const [notifications, setNotifications] = useState<Array<{id: number, title: string, message: string, time: string, unread: boolean}>>([])
  const [user, setUser] = useState({ name: "User", email: "user@example.com" })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const sessionRes = await fetch("/api/auth/session")
      const sessionData = await sessionRes.json()
      if (sessionData?.user) {
        setUser({ name: sessionData.user.name || "User", email: sessionData.user.email || "" })
      }

      const response = await fetch("/api/orders?userId=" + (sessionData?.user?.id || ""))
      const orders = await response.json()
      
      if (Array.isArray(orders)) {
        setStats({
          total: orders.length,
          completed: orders.filter((o: any) => o.status === "completed").length,
          inProgress: orders.filter((o: any) => o.status === "in_progress").length,
          totalSpent: orders.reduce((sum: number, o: any) => sum + (o.amount || 0), 0)
        })
        
        const recentNotifications = orders.slice(0, 3).map((order: any, i: number) => ({
          id: i,
          title: order.status === "completed" ? "Order Completed" : "Order Updated",
          message: `Order #${order.id.slice(-8).toUpperCase()} is now ${order.status.replace("_", " ")}`,
          time: new Date(order.updatedAt).toLocaleDateString(),
          unread: order.status !== "completed"
        }))
        setNotifications(recentNotifications)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Notifications & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="border-b border-slate-700 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-white">Recent Notifications</CardTitle>
                <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {notifications.filter(n => n.unread).length} New
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-700">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-4 hover:bg-slate-700/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl ${notif.unread ? "bg-indigo-500/20 text-indigo-400" : "bg-slate-700 text-slate-400"}`}>
                          <Bell className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-white text-sm">{notif.title}</p>
                            {notif.unread && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                          </div>
                          <p className="text-slate-400 text-sm mt-1">{notif.message}</p>
                          <p className="text-slate-500 text-xs mt-2">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                { title: "New Order", icon: Plus, href: "/order", color: "from-indigo-500 to-purple-500" },
                { title: "Browse Products", icon: Package, href: "/products", color: "from-purple-500 to-pink-500" },
                { title: "Browse Services", icon: Zap, href: "/services", color: "from-pink-500 to-rose-500" },
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

      {/* Plans */}
      <Card className="bg-slate-800 border-slate-700">
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
                    <Button variant="outline" className="w-full border-indigo-500 text-indigo-400 hover:bg-indigo-500/10">
                      Upgrade
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Help Cards */}
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
              <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                Get Help
              </Button>
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
    </div>
  )
}
