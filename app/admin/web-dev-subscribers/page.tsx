Delete button inserted successfully
"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Users,
  Search,
  Download,
  Loader2,
  Crown,
  Zap,
  X,
  Mail,
  FileText,
  DollarSign,
  TrendingUp,
  Check,
  LayoutDashboard,
  Trash2,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_ORDER, type ProjectStatus } from "@/lib/web-dev-service"

interface WebDevSubscriber {
  id: string
  plan: string
  status: string
  billingCycle: string
  currentPeriodEnd: string
  currentPeriodStart: string
  cancelAtPeriodEnd: boolean
  createdAt: string
  user: {
    id: string
    name: string
    email: string
    phone: string | null
    createdAt: string
  }
  onboardingForm: {
    id: string
    fullName: string
    email: string
    phone: string
    businessName: string
    projectStatus: string
    websiteTypes: string[]
    websiteGoal: string
    createdAt: string
  } | null
}

export default function AdminWebDevSubscribersPage() {
  const [subscribers, setSubscribers] = useState<WebDevSubscriber[]>([])
  const [stats, setStats] = useState({ total: 0, active: 0, starter: 0, complete: 0, mrr: 0, arr: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [planFilter, setPlanFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewingForm, setViewingForm] = useState<WebDevSubscriber["onboardingForm"] | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/web-dev-subscribers")
      if (res.ok) {
        const data = await res.json()
        setSubscribers(data.subscribers)
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching web dev subscribers:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const deleteSubscription = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/web-dev-subscribers/${id}`, { method: "DELETE" })
      if (res.ok) {
        setDeletingId(null)
        fetchData()
      }
    } catch (error) {
      console.error("Error deleting subscriber:", error)
    }
  }

  const filtered = subscribers.filter((sub) => {
    const matchesSearch =
      sub.user.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.user.email.toLowerCase().includes(search.toLowerCase()) ||
      (sub.onboardingForm?.businessName || "").toLowerCase().includes(search.toLowerCase())
    const matchesPlan = planFilter === "all" || sub.plan === planFilter
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter
    return matchesSearch && matchesPlan && matchesStatus
  })

  const updateProjectStatus = async (subId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/web-dev-subscribers/${subId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectStatus: newStatus }),
      })
      if (res.ok) fetchData()
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const exportCsv = () => {
    const headers = ["Name", "Email", "Phone", "Business", "Plan", "Billing", "Status", "Project Status", "Signed Up"]
    const rows = subscribers.map((sub) => [
      sub.user.name,
      sub.user.email,
      sub.user.phone || "",
      sub.onboardingForm?.businessName || "",
      sub.plan,
      sub.billingCycle,
      sub.status,
      sub.onboardingForm ? PROJECT_STATUS_LABELS[sub.onboardingForm.projectStatus as ProjectStatus] || sub.onboardingForm.projectStatus : "No Form",
      new Date(sub.createdAt).toLocaleDateString(),
    ])

    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "web-dev-subscribers.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
      </div>
    )
  }

  const getPlanBadge = (plan: string) => {
    if (plan === "STARTER") return { label: "Starter", icon: Zap, color: "bg-blue-100 text-blue-700 border-blue-200" }
    if (plan === "COMPLETE") return { label: "Complete", icon: Crown, color: "bg-purple-100 text-purple-700 border-purple-200" }
    return { label: plan, icon: Zap, color: "bg-slate-100 text-slate-700 border-slate-200" }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700 border-green-200"
      case "cancelled": return "bg-red-100 text-red-700 border-red-200"
      case "expired": return "bg-amber-100 text-amber-700 border-amber-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Web Dev Subscribers</h1>
          <p className="text-slate-500 mt-1">Manage web development subscription clients</p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto border-slate-200" onClick={exportCsv}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Subscribers", value: stats.total, icon: Users, color: "from-purple-500 to-violet-500" },
          { title: "Active", value: stats.active, icon: Check, color: "from-green-500 to-emerald-500" },
          { title: "MRR", value: `$${stats.mrr.toLocaleString()}`, icon: DollarSign, color: "from-blue-500 to-cyan-500" },
          { title: "ARR", value: `$${stats.arr.toLocaleString()}`, icon: TrendingUp, color: "from-emerald-500 to-teal-500" },
        ].map((stat, i) => (
          <Card key={stat.title} className="bg-white border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Plan Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { plan: "STARTER", count: stats.starter, price: 29, color: "blue" },
          { plan: "COMPLETE", count: stats.complete, price: 59, color: "purple" },
        ].map((p) => (
          <Card key={p.plan} className="bg-white border-slate-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-${p.color}-100`}>
                  {p.plan === "STARTER" ? (
                    <Zap className={`w-5 h-5 text-${p.color}-600`} />
                  ) : (
                    <Crown className={`w-5 h-5 text-${p.color}-600`} />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {p.plan === "STARTER" ? "Starter" : "Complete"} (${p.price}/mo)
                  </p>
                  <p className="text-sm text-slate-500">{p.count} subscribers</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-slate-900">${(p.count * p.price).toLocaleString()}</p>
                <p className="text-xs text-slate-400">/month</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-white border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search by name, email, or business..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 bg-slate-50 border-slate-200"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="h-11 px-3 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
              >
                <option value="all">All Plans</option>
                <option value="STARTER">Starter</option>
                <option value="COMPLETE">Complete</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 px-3 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-white border-slate-200 overflow-hidden">
        <CardHeader className="border-b border-slate-200 pb-4">
          <CardTitle className="text-lg text-slate-900">
            All Web Dev Subscribers ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase hidden md:table-cell">Plan</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase hidden md:table-cell">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase hidden lg:table-cell">Project Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase hidden lg:table-cell">Signed Up</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500">No subscribers found</td>
                  </tr>
                ) : (
                  filtered.map((sub) => {
                    const planBadge = getPlanBadge(sub.plan)
                    const PlanIcon = planBadge.icon
                    return (
                      <motion.tr key={sub.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white font-medium flex-shrink-0">
                              {sub.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 text-sm truncate">{sub.user.name}</p>
                              <p className="text-xs text-slate-500 truncate">{sub.user.email}</p>
                              {sub.onboardingForm?.businessName && (
                                <p className="text-xs text-purple-600 truncate">{sub.onboardingForm.businessName}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <Badge className={planBadge.color}>
                            <PlanIcon className="w-3 h-3 mr-1" />
                            {planBadge.label}
                          </Badge>
                          <div className="text-xs text-slate-400 mt-1">
                            {sub.billingCycle === "annual" ? "Annual" : "Monthly"}
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <Badge className={getStatusBadge(sub.status)}>
                            {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 hidden lg:table-cell">
                          {sub.onboardingForm ? (
                            <select
                              value={sub.onboardingForm.projectStatus}
                              onChange={(e) => updateProjectStatus(sub.id, e.target.value)}
                              className="text-xs px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700"
                            >
                              {PROJECT_STATUS_ORDER.map((s) => (
                                <option key={s} value={s}>
                                  {PROJECT_STATUS_LABELS[s as ProjectStatus]}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-xs text-slate-400">Pending</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-500 hidden lg:table-cell">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/admin/projects/${sub.id}`}
                              className="p-1.5 text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Project Board"
                            >
                              <LayoutDashboard className="w-3.5 h-3.5" />
                            </Link>
                            {sub.onboardingForm && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewingForm(sub.onboardingForm)}
                                className="text-slate-600 hover:text-purple-600 hover:bg-purple-50 h-8"
                                title="View Onboarding Form"
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </Button>
                            )}
                            <a
                              href={`mailto:${sub.user.email}`}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Send Email"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => setDeletingId(sub.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Subscriber"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Onboarding Form Modal */}
      <AnimatePresence>
        {viewingForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setViewingForm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Onboarding Form</h3>
                  <p className="text-sm text-slate-500">{viewingForm.fullName} — {viewingForm.businessName}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setViewingForm(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-xs text-slate-500">Full Name</p>
                    <p className="font-medium text-slate-900">{viewingForm.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="font-medium text-slate-900">{viewingForm.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="font-medium text-slate-900">{viewingForm.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Business</p>
                    <p className="font-medium text-slate-900">{viewingForm.businessName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Platform</p>
                    <p className="font-medium text-slate-900">{viewingForm.websiteTypes?.join(", ") || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Project Status</p>
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                      {PROJECT_STATUS_LABELS[viewingForm.projectStatus as ProjectStatus] || viewingForm.projectStatus}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Website Goal</p>
                  <p className="text-sm text-slate-900">{viewingForm.websiteGoal}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500">Submitted</p>
                  <p className="text-sm text-slate-900">{new Date(viewingForm.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setDeletingId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="p-3 rounded-full bg-red-100 w-fit mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Delete Subscriber?</h3>
                <p className="text-sm text-slate-500 mt-2">
                  This will permanently remove their project board, tasks, comments, and all associated data. This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setDeletingId(null)}>
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => deleteSubscription(deletingId)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
