"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, CreditCard, Calendar, Search, Filter, Download, Mail, MoreVertical } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Subscriber {
  id: string
  plan: string
  status: string
  currentPeriodEnd: string
  user: {
    id: string
    name: string
    email: string
    createdAt: string
  }
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [planFilter, setPlanFilter] = useState("all")

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await fetch("/api/admin/subscribers")
        if (res.ok) {
          const data = await res.json()
          setSubscribers(data)
        }
      } catch (error) {
        console.error("Error fetching subscribers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscribers()
  }, [])

  const filteredSubscribers = subscribers.filter(sub => {
    const matchesSearch = 
      sub.user.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.user.email.toLowerCase().includes(search.toLowerCase())
    const matchesPlan = planFilter === "all" || sub.plan === planFilter
    return matchesSearch && matchesPlan
  })

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "pro": return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
      case "enterprise": return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400"
      case "canceled": return "bg-red-500/20 text-red-400"
      case "past_due": return "bg-amber-500/20 text-amber-400"
      default: return "bg-slate-500/20 text-slate-400"
    }
  }

  const proCount = subscribers.filter(s => s.plan === "pro").length
  const enterpriseCount = subscribers.filter(s => s.plan === "enterprise").length
  const mrr = (proCount * 19) + (enterpriseCount * 99)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading subscribers...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Subscribers</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage your subscription customers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/20">
                <Users className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{subscribers.length}</p>
                <p className="text-sm text-slate-500">Total Subscribers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/20">
                <CreditCard className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{proCount}</p>
                <p className="text-sm text-slate-500">Pro Plans</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Calendar className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{enterpriseCount}</p>
                <p className="text-sm text-slate-500">Enterprise Plans</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <CreditCard className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">${mrr}</p>
                <p className="text-sm text-slate-500">MRR</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="dark:bg-slate-800 dark:border-slate-700 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 dark:bg-slate-700 dark:border-slate-600"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              >
                <option value="all">All Plans</option>
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscribers Table */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="border-b dark:border-slate-700">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-slate-900 dark:text-white">All Subscribers ({filteredSubscribers.length})</CardTitle>
            <Button variant="outline" size="sm" className="dark:border-slate-600 dark:text-slate-300">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Next Billing</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-700">
                {filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No subscribers found
                    </td>
                  </tr>
                ) : (
                  filteredSubscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium">
                            {sub.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{sub.user.name}</p>
                            <p className="text-sm text-slate-500">{sub.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getPlanColor(sub.plan)}>
                          {sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getStatusColor(sub.status)}>
                          {sub.status.charAt(0).toUpperCase() + sub.status.slice(1).replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="dark:text-slate-400">
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="dark:text-slate-400">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
