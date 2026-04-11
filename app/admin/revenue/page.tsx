"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { DollarSign, TrendingUp, Users, CreditCard, Calendar, ArrowUp, ArrowDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RevenueData {
  mrr: number
  arr: number
  totalUsers: number
  proSubscribers: number
  enterpriseSubscribers: number
  recentRevenue: { date: string; amount: number }[]
}

export default function AdminRevenuePage() {
  const [data, setData] = useState<RevenueData>({
    mrr: 0,
    arr: 0,
    totalUsers: 0,
    proSubscribers: 0,
    enterpriseSubscribers: 0,
    recentRevenue: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await fetch("/api/admin/revenue")
        if (res.ok) {
          const result = await res.json()
          setData(result)
        }
      } catch (error) {
        console.error("Error fetching revenue:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRevenue()
  }, [])

  const stats = [
    { title: "Monthly Revenue (MRR)", value: `$${data.mrr.toLocaleString()}`, icon: DollarSign, color: "from-indigo-500 to-purple-500" },
    { title: "Annual Revenue (ARR)", value: `$${data.arr.toLocaleString()}`, icon: TrendingUp, color: "from-green-500 to-emerald-500" },
    { title: "Total Users", value: data.totalUsers.toString(), icon: Users, color: "from-blue-500 to-cyan-500" },
    { title: "Pro Subscribers", value: data.proSubscribers.toString(), icon: CreditCard, color: "from-pink-500 to-rose-500" },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading revenue data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Revenue Dashboard</h1>
        <p className="text-slate-500">Track your subscription revenue and growth</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Subscription Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Subscription Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Pro Plan ($19/mo)</p>
                    <p className="text-sm text-slate-500">{data.proSubscribers} subscribers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">${(data.proSubscribers * 19).toLocaleString()}</p>
                  <p className="text-sm text-slate-500">/month</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Enterprise Plan ($99/mo)</p>
                    <p className="text-sm text-slate-500">{data.enterpriseSubscribers} subscribers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">${(data.enterpriseSubscribers * 99).toLocaleString()}</p>
                  <p className="text-sm text-slate-500">/month</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-slate-500">MRR Growth</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-emerald-600">+12%</span>
                  <ArrowUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-emerald-600">↑</span>
                <span className="text-slate-500">vs last month</span>
              </div>
            </div>
            <div className="h-32 flex items-end gap-2">
              {[40, 55, 45, 70, 65, 80, 85, 90, 95, 100].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-violet-500 to-purple-500 rounded-t"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Formula */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900">MRR Calculation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-50 rounded-xl p-6">
            <p className="text-lg text-slate-700 font-mono">
              MRR = (Pro Subscribers × $19) + (Enterprise Subscribers × $99)
            </p>
            <p className="text-lg text-slate-700 font-mono mt-2">
              MRR = ({data.proSubscribers} × $19) + ({data.enterpriseSubscribers} × $99)
            </p>
            <p className="text-lg text-slate-700 font-mono mt-2">
              MRR = ${(data.proSubscribers * 19).toLocaleString()} + ${(data.enterpriseSubscribers * 99).toLocaleString()}
            </p>
            <p className="text-2xl font-bold text-violet-600 mt-4">
              MRR = ${data.mrr.toLocaleString()}
            </p>
            <p className="text-lg text-slate-600 mt-2">
              ARR = MRR × 12 = ${data.arr.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
