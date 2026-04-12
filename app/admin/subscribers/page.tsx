"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, CreditCard, Calendar, Search, Download, Mail, Trash2, Edit3, X, Check, AlertCircle, Loader2, Crown, Rocket, Pause, Play } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Subscriber {
  id: string
  plan: string
  status: string
  currentPeriodEnd: string
  currentPeriodStart: string
  cancelAtPeriodEnd: boolean
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
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingSub, setEditingSub] = useState<Subscriber | null>(null)
  const [editPlan, setEditPlan] = useState("pro")
  const [editStatus, setEditStatus] = useState("active")
  const [saving, setSaving] = useState(false)

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

  useEffect(() => { fetchSubscribers() }, [])

  const filteredSubscribers = subscribers.filter(sub => {
    const matchesSearch = 
      sub.user.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.user.email.toLowerCase().includes(search.toLowerCase())
    const matchesPlan = planFilter === "all" || sub.plan === planFilter
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter
    return matchesSearch && matchesPlan && matchesStatus
  })

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "pro": return "bg-pink-100 text-pink-700 border-pink-200"
      case "enterprise": return "bg-violet-100 text-violet-700 border-violet-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700 border-green-200"
      case "canceled": return "bg-red-100 text-red-700 border-red-200"
      case "past_due": return "bg-amber-100 text-amber-700 border-amber-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const deleteSubscription = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscription?")) return
    try {
      const res = await fetch(`/api/admin/subscribers/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchSubscribers()
      }
    } catch (error) {
      console.error("Error deleting:", error)
    }
  }

  const cancelSubscription = async (sub: Subscriber) => {
    if (!confirm(`Cancel subscription for ${sub.user.name}?`)) return
    try {
      await fetch(`/api/admin/subscribers/${sub.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "canceled" })
      })
      fetchSubscribers()
    } catch (error) {
      console.error("Error canceling:", error)
    }
  }

  const reactivateSubscription = async (sub: Subscriber) => {
    try {
      await fetch(`/api/admin/subscribers/${sub.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" })
      })
      fetchSubscribers()
    } catch (error) {
      console.error("Error reactivating:", error)
    }
  }

  const openEditModal = (sub: Subscriber) => {
    setEditingSub(sub)
    setEditPlan(sub.plan)
    setEditStatus(sub.status)
  }

  const saveSubscription = async () => {
    if (!editingSub) return
    setSaving(true)
    try {
      await fetch(`/api/admin/subscribers/${editingSub.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: editPlan, status: editStatus })
      })
      setEditingSub(null)
      fetchSubscribers()
    } catch (error) {
      console.error("Error saving:", error)
    } finally {
      setSaving(false)
    }
  }

  const proCount = subscribers.filter(s => s.plan === "pro").length
  const enterpriseCount = subscribers.filter(s => s.plan === "enterprise").length
  const activeCount = subscribers.filter(s => s.status === "active").length
  const mrr = (proCount * 19) + (enterpriseCount * 99)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-violet-600" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Subscribers</h1>
          <p className="text-slate-500 mt-1">Manage subscription customers</p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-violet-100">
                <Users className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{subscribers.length}</p>
                <p className="text-sm text-slate-500">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-green-100">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{activeCount}</p>
                <p className="text-sm text-slate-500">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-pink-100">
                <Crown className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{proCount + enterpriseCount}</p>
                <p className="text-sm text-slate-500">Paid Plans</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-100">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">${mrr}</p>
                <p className="text-sm text-slate-500">MRR</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search subscribers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 bg-slate-50 border-slate-200"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="h-11 px-3 rounded-lg border border-slate-300 bg-white text-slate-900 font-medium text-sm"
              >
                <option value="all">All Plans</option>
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 px-3 rounded-lg border border-slate-300 bg-white text-slate-900 font-medium text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="canceled">Canceled</option>
                <option value="past_due">Past Due</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-white border-slate-200 overflow-hidden">
        <CardHeader className="border-b border-slate-200 pb-4">
          <CardTitle className="text-lg text-slate-900">All Subscribers ({filteredSubscribers.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase hidden md:table-cell">Plan</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase hidden md:table-cell">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase hidden lg:table-cell">Next Billing</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-slate-500">No subscribers found</td>
                  </tr>
                ) : (
                  filteredSubscribers.map((sub) => (
                    <motion.tr key={sub.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-medium flex-shrink-0">
                            {sub.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{sub.user.name}</p>
                            <p className="text-sm text-slate-500">{sub.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <Badge className={getPlanColor(sub.plan)}>
                          {sub.plan === 'pro' ? <Crown className="w-3 h-3 mr-1" /> : sub.plan === 'enterprise' ? <Rocket className="w-3 h-3 mr-1" /> : null}
                          {sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <Badge className={getStatusColor(sub.status)}>
                          {sub.status.charAt(0).toUpperCase() + sub.status.slice(1).replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-slate-500 text-sm hidden lg:table-cell">
                        {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(sub)} className="text-slate-600 hover:text-violet-600 hover:bg-violet-50 font-medium h-8">
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          {sub.status === 'active' ? (
                            <Button variant="ghost" size="sm" onClick={() => cancelSubscription(sub)} className="text-slate-600 hover:text-amber-600 hover:bg-amber-50 font-medium h-8" title="Cancel Subscription">
                              <Pause className="w-3 h-3" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={() => reactivateSubscription(sub)} className="text-slate-600 hover:text-green-600 hover:bg-green-50 font-medium h-8" title="Reactivate">
                              <Play className="w-3 h-3" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => deleteSubscription(sub.id)} className="text-slate-600 hover:text-red-600 hover:bg-red-50 font-medium h-8" title="Delete">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {editingSub && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Edit Subscription</h3>
              <Button variant="ghost" size="icon" onClick={() => setEditingSub(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <p className="font-semibold text-slate-900">{editingSub.user.name}</p>
              <p className="text-sm text-slate-500">{editingSub.user.email}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Plan</label>
                <select value={editPlan} onChange={(e) => setEditPlan(e.target.value)} className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-slate-900 font-medium">
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Status</label>
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-slate-900 font-medium">
                  <option value="active">Active</option>
                  <option value="canceled">Canceled</option>
                  <option value="past_due">Past Due</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={saveSubscription} disabled={saving} className="flex-1 bg-violet-600 hover:bg-violet-700">
                  {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditingSub(null)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}