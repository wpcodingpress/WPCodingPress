"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  CheckCircle, Clock, ShoppingBag, DollarSign, TrendingUp, HelpCircle, Calendar, 
  Plus, Package, Zap, ChevronRight, Bell, Rocket
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const plans = [
  { name: "Free", planId: "free", price: "Free", period: "forever", features: ["1 WordPress site conversion", "Basic Next.js template", "Community support", "Basic SEO setup"] },
  { name: "Pro", planId: "pro", price: "$19", period: "/month", features: ["5 WordPress to Headless conversions", "Live deployed sites (Vercel/Render)", "Advanced Next.js templates", "Priority email support", "Custom domain support", "Analytics dashboard", "Auto content sync"] },
  { name: "Enterprise", planId: "enterprise", price: "$99", period: "/month", features: ["Unlimited conversions", "White-label deployment", "24/7 Dedicated support", "Custom domain included", "API access", "Advanced analytics", "Team collaboration", "Custom integrations"] },
]

export default function DashboardOverview() {
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, totalSpent: 0 })
  const [notifications, setNotifications] = useState<Array<{id: number, title: string, message: string, time: string, unread: boolean}>>([])
  const [user, setUser] = useState({ name: "User", email: "user@example.com" })
  const [currentPlan, setCurrentPlan] = useState<string | null>(null)
  const [nextBilling, setNextBilling] = useState<string | null>(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null)

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

      // Fetch subscription
      const subRes = await fetch("/api/subscriptions")
      const subData = await subRes.json()
      if (subData.subscription?.plan) {
        setCurrentPlan(subData.subscription.plan)
        setSubscriptionStatus(subData.subscription.status)
        if (subData.subscription.currentPeriodEnd) {
          setNextBilling(new Date(subData.subscription.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }))
        }
      }

      const response = await fetch("/api/orders?userId=" + (sessionData?.user?.id || ""))
      const orders = await response.json()
      
      if (Array.isArray(orders)) {
        setStats({
          total: orders.length,
          completed: orders.filter((o: any) => o.status === "completed").length,
          inProgress: orders.filter((o: any) => o.status === "in_progress").length,
          totalSpent: orders.reduce((sum: number, o: any) => sum + (o.amount || 0), 0) / 100
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
      {/* Upgrade Banner - Show based on current plan */}
      {currentPlan === 'free' && (
        <Link href="/dashboard/subscription">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/20 flex-shrink-0">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm sm:text-lg">Upgrade to Pro - $19/mo</p>
                  <p className="text-white/80 text-xs sm:text-sm truncate">Unlock 5 WordPress sites, custom domain & more</p>
                </div>
              </div>
              <Button className="bg-white text-pink-600 hover:bg-pink-50 font-semibold text-xs sm:text-sm py-1.5 sm:py-2.5 px-3 sm:px-6 w-full sm:w-auto flex-shrink-0">
                Upgrade
              </Button>
            </div>
          </motion.div>
        </Link>
      )}

      {/* Enterprise Upgrade Banner - Show if on Pro */}
      {currentPlan === 'pro' && (
        <Link href="/dashboard/subscription">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/20 flex-shrink-0">
                  <Rocket className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm sm:text-lg">Upgrade to Enterprise - $99/mo</p>
                  <p className="text-white/80 text-xs sm:text-sm truncate">Unlimited conversions, dedicated support</p>
                </div>
              </div>
              <Button className="bg-white text-purple-600 hover:bg-purple-50 font-semibold text-xs sm:text-sm py-1.5 sm:py-2.5 px-3 sm:px-6 w-full sm:w-auto flex-shrink-0">
                Upgrade
              </Button>
            </div>
          </motion.div>
        </Link>
      )}

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-white/10 rounded-full blur-2xl sm:blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-white/10 rounded-full blur-xl sm:blur-2xl translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center md:justify-between gap-4 sm:gap-6">
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">Hello, {user.name}! 👋</h2>
                <p className="text-white/80 text-sm sm:text-lg">Ready to build something amazing today?</p>
              </div>
              <div className="flex flex-row justify-center sm:flex-row gap-2 sm:gap-3">
                <Link href="/order">
                  <Button className="bg-white text-purple-600 hover:bg-purple-50 font-semibold text-xs sm:text-sm px-3 sm:px-6 py-2 sm:py-2.5 w-full sm:w-auto">
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">New Order</span>
                    <span className="sm:hidden">Order</span>
                  </Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline" className="border-white bg-white/10 text-white hover:bg-white/20 font-semibold text-xs sm:text-sm px-3 sm:px-6 py-2 sm:py-2.5 w-full sm:w-auto backdrop-blur-sm">
                    <span className="hidden sm:inline">Browse Services</span>
                    <span className="sm:hidden">Services</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {[
          { title: "Total Orders", value: stats.total, icon: ShoppingBag, color: "from-purple-500 to-violet-500" },
          { title: "Completed", value: stats.completed, icon: CheckCircle, color: "from-green-500 to-emerald-500" },
          { title: "In Progress", value: stats.inProgress, icon: Clock, color: "from-blue-500 to-cyan-500" },
          { title: "Total Spent", value: `$${stats.totalSpent.toLocaleString()}`, icon: DollarSign, color: "from-orange-500 to-pink-500" },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">{stat.title}</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mt-0.5 sm:mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card className="bg-white border-gray-200">
            <CardHeader className="border-b border-gray-100 pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              {[
                { title: "New Order", icon: Plus, href: "/order", color: "from-purple-500 to-violet-500" },
                { title: "Browse Products", icon: Package, href: "/products", color: "from-violet-500 to-pink-500" },
                { title: "Browse Services", icon: Zap, href: "/services", color: "from-pink-500 to-rose-500" },
              ].map((action, i) => (
                <Link key={i} href={action.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gray-50 hover:bg-purple-50 transition-colors group"
                  >
                    <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${action.color} shadow-lg`}>
                      <action.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-purple-600 transition-colors truncate">{action.title}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-purple-600 transition-colors flex-shrink-0" />
                  </motion.div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <div className="lg:col-span-2">
          <Card className="bg-white border-gray-200">
            <CardHeader className="border-b border-gray-100 pb-3 sm:pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Recent Notifications</CardTitle>
                <Badge className="bg-purple-100 text-purple-700 border border-purple-200 text-xs">
                  {notifications.filter(n => n.unread).length} New
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {notifications.length === 0 ? (
                <div className="p-4 sm:p-8 text-center text-gray-500">
                  <Bell className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                  <p className="text-sm sm:text-base">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-48 sm:max-h-64 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${notif.unread ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-500"}`}>
                          <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900 text-sm truncate">{notif.title}</p>
                            {notif.unread && <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />}
                          </div>
                          <p className="text-gray-500 text-xs sm:text-sm mt-0.5 line-clamp-2">{notif.message}</p>
                          <p className="text-gray-400 text-xs mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
</CardContent>
          </Card>
        </div>
      </div>

      {/* Upgrade to Enterprise Card - Show if on Pro */}
      {currentPlan === 'pro' && (
        <Card className="bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 border-0">
          <CardContent className="p-4 sm:p-6 text-white">
            <div className="flex items-start gap-3 mb-3 sm:mb-4">
              <div className="p-2 rounded-xl bg-white/20 flex-shrink-0">
                <Rocket className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-base sm:text-lg">Upgrade to Enterprise</p>
                <p className="text-white/80 text-xs sm:text-sm">Unlock all features</p>
              </div>
            </div>
            <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
              {["Unlimited Sites", "Priority Support", "Advanced Templates", "White-label deployment", "Custom integrations"].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-xs sm:text-sm">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/dashboard/subscription">
              <Button className="w-full bg-white text-purple-600 hover:bg-purple-50 font-semibold text-xs sm:text-sm py-2 sm:py-2.5">
                Upgrade to Enterprise - $99/mo
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Card - Show if on Free plan */}
      {currentPlan !== 'pro' && currentPlan !== 'enterprise' && (
        <Card className="bg-gradient-to-br from-purple-600 to-violet-600 border-0">
          <CardContent className="p-4 sm:p-6 text-white">
            <div className="flex items-start gap-3 mb-3 sm:mb-4">
              <div className="p-2 rounded-xl bg-white/20 flex-shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-base sm:text-lg">Upgrade to Pro</p>
                <p className="text-white/80 text-xs sm:text-sm">Unlock all features</p>
              </div>
            </div>
            <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
              {["Unlimited Sites", "Priority Support", "Advanced Templates"].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-xs sm:text-sm">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/dashboard/subscription">
              <Button className="w-full bg-white text-purple-600 hover:bg-purple-50 font-semibold text-xs sm:text-sm py-2 sm:py-2.5">
                Get Started - $19/mo
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Plans */}
      <Card className="bg-white border-gray-200">
        <CardHeader className="border-b border-gray-100 pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Your Current Plan</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {plans.map((plan) => {
              const isCurrent = currentPlan === plan.planId || (!currentPlan && plan.planId === 'free')
              return (
              <div 
                key={plan.name}
                className={`p-3 sm:p-4 md:p-6 rounded-xl md:rounded-2xl border-2 ${
                  isCurrent 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">{plan.name}</h3>
                  {isCurrent && (
                    <Badge className="bg-purple-600 text-white text-xs">Current</Badge>
                  )}
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{plan.price}<span className="text-xs sm:text-sm font-normal text-gray-500">{plan.period}</span></p>
                <ul className="space-y-1 sm:space-y-2 mb-3 sm:mb-4 md:mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                      <span className="truncate">{feature}</span>
                    </li>
                  ))}
                </ul>
                {!isCurrent && (
                  <Link href="/dashboard/subscription">
                    <Button variant="outline" className="w-full border-purple-500 text-purple-600 hover:bg-purple-50 text-xs sm:text-sm py-1.5 sm:py-2">
                      Upgrade
                    </Button>
                  </Link>
                )}
              </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Help Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-purple-100 flex-shrink-0">
                <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500">Need Help?</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">Contact Support</p>
              </div>
            </div>
            <Link href="/contact">
              <Button variant="outline" className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 text-xs sm:text-sm py-1.5 sm:py-2">
                Get Help
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className={`border-gray-200 ${currentPlan && currentPlan !== 'free' ? 'bg-gradient-to-br from-purple-50 to-violet-50' : 'bg-white'}`}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${currentPlan && currentPlan !== 'free' ? 'bg-purple-100' : 'bg-green-100'} flex-shrink-0`}>
                <Calendar className={`w-5 h-5 sm:w-6 sm:h-6 ${currentPlan && currentPlan !== 'free' ? 'text-purple-600' : 'text-green-600'}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500">
                  {currentPlan && currentPlan !== 'free' ? 'Next Billing' : 'Current Plan'}
                </p>
                <p className="text-base sm:text-lg font-bold text-gray-900">
                  {nextBilling || (currentPlan === 'free' || !currentPlan ? 'Free' : '-')}
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              {currentPlan && currentPlan !== 'free' ? (
                subscriptionStatus === 'active' ? `${currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan - Active` : `${currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan`
              ) : "You're on the Free plan"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
