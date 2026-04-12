"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Users, 
  Loader2, 
  Trash2, 
  Eye, 
  EyeOff,
  UserPlus,
  CreditCard,
  X,
  Crown,
  Rocket,
  Shield,
  User,
  Search,
  Filter,
  MoreHorizontal,
  Pencil,
  Mail,
  Phone,
  Building,
  Calendar,
  Check,
  XCircle,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"


interface User {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  role: string
  isActive: boolean
  createdAt: string
  subscriptions?: Array<{
    id: string
    plan: string
    status: string
    currentPeriodEnd: string | null
  }>
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showSubModal, setShowSubModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" })
  const [editUser, setEditUser] = useState({ name: "", email: "", role: "" })
  const [subPlan, setSubPlan] = useState("pro")
  const [subStatus, setSubStatus] = useState("active")
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/users")
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      const data = await response.json()
      setUsers(data)
      setError("")
    } catch (err) {
      console.error("Error fetching users:", err)
      setError("Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleActive = async (user: User) => {
    try {
      await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive })
      })
      fetchUsers()
    } catch (error) {
      console.error("Error toggling user:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return
    
    try {
      await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, action: "delete_user" })
      })
      fetchUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const updateUserRole = async (userId: string, role: string) => {
    try {
      await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action: "update_role", role })
      })
      fetchUsers()
    } catch (error) {
      console.error("Error updating role:", error)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to create user")
      }
      setShowCreateModal(false)
      setNewUser({ name: "", email: "", password: "", role: "user" })
      fetchUsers()
      setSuccessMessage("User created successfully!")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return
    setIsSubmitting(true)
    try {
      await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          action: "update_profile",
          name: editUser.name,
          email: editUser.email,
          role: editUser.role
        })
      })
      setShowEditModal(false)
      fetchUsers()
      setSuccessMessage("User updated successfully!")
    } catch (error) {
      console.error("Error updating user:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateSubscription = async () => {
    if (!selectedUser) return
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          action: "update_subscription",
          plan: subPlan,
          status: subStatus,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setShowSubModal(false)
        fetchUsers()
        setSuccessMessage("Subscription updated successfully!")
      }
    } catch (error) {
      console.error("Error updating subscription:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelSubscription = async (user: User) => {
    if (!confirm(`Cancel subscription for ${user.name}?`)) return
    try {
      await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          action: "cancel_subscription",
        }),
      })
      fetchUsers()
    } catch (error) {
      console.error("Error cancelling subscription:", error)
    }
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setEditUser({ name: user.name, email: user.email, role: user.role })
    setShowEditModal(true)
  }

  const openSubModal = (user: User) => {
    setSelectedUser(user)
    const activeSub = user.subscriptions?.[0]
    if (activeSub) {
      setSubPlan(activeSub.plan)
      setSubStatus(activeSub.status)
    } else {
      setSubPlan("pro")
      setSubStatus("active")
    }
    setShowSubModal(true)
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      (user.company || "").toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive)
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: "bg-red-100 text-red-700 border-red-200",
      manager: "bg-orange-100 text-orange-700 border-orange-200",
      editor: "bg-blue-100 text-blue-700 border-blue-200",
      user: "bg-slate-100 text-slate-700 border-slate-200"
    }
    const icons: Record<string, any> = {
      admin: Shield,
      manager: Crown,
      editor: Pencil,
      user: User
    }
    const Icon = icons[role] || User
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[role] || styles.user}`}>
        <Icon className="w-3 h-3" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    )
  }

  const getPlanBadge = (plan: string) => {
    const styles: Record<string, string> = {
      enterprise: "bg-violet-100 text-violet-700 border-violet-200",
      pro: "bg-pink-100 text-pink-700 border-pink-200",
      free: "bg-slate-100 text-slate-700 border-slate-200"
    }
    const icons: Record<string, any> = {
      enterprise: Rocket,
      pro: Crown
    }
    const Icon = icons[plan]
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[plan] || styles.free}`}>
        {Icon && <Icon className="w-3 h-3" />}
        {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </span>
    )
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
        <Check className="w-3 h-3" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
        <XCircle className="w-3 h-3" />
        Inactive
      </span>
    )
  }

  const totalUsers = users.length
  const activeUsers = users.filter(u => u.isActive).length
  const proUsers = users.filter(u => u.subscriptions?.[0]?.plan === "pro").length
  const enterpriseUsers = users.filter(u => u.subscriptions?.[0]?.plan === "enterprise").length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-violet-600 mx-auto mb-4" />
          <p className="text-slate-500">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-500 mt-1">Manage registered users and their subscriptions</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-violet-600 hover:bg-violet-700 w-full sm:w-auto">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
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
                <p className="text-2xl font-bold text-slate-900">{totalUsers}</p>
                <p className="text-sm text-slate-500">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-100">
                <Check className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{activeUsers}</p>
                <p className="text-sm text-slate-500">Active Users</p>
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
                <p className="text-2xl font-bold text-slate-900">{proUsers}</p>
                <p className="text-sm text-slate-500">Pro Plans</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-100">
                <Rocket className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{enterpriseUsers}</p>
                <p className="text-sm text-slate-500">Enterprise</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Filters */}
      <Card className="bg-white border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by name, email or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-slate-50 border-slate-200 w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[150px] bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px] bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-white border-slate-200 overflow-hidden">
        <CardHeader className="border-b border-slate-200 pb-4">
          <CardTitle className="text-lg text-slate-900">All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden md:table-cell">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden lg:table-cell">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden lg:table-cell">Subscription</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden md:table-cell">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden sm:table-cell">Joined</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-medium flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 truncate">{user.name}</p>
                            <p className="text-sm text-slate-500 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-4 py-4 text-slate-600 hidden lg:table-cell">
                        {user.company || <span className="text-slate-400">-</span>}
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        {user.subscriptions && user.subscriptions[0] ? (
                          getPlanBadge(user.subscriptions[0].plan)
                        ) : (
                          getPlanBadge("free")
                        )}
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        {getStatusBadge(user.isActive)}
                      </td>
                      <td className="px-4 py-4 text-slate-500 text-sm hidden sm:table-cell">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEditModal(user)} className="text-slate-500 hover:text-violet-600 hover:bg-violet-50 h-8 w-8" title="Edit User">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openSubModal(user)} className="text-slate-500 hover:text-violet-600 hover:bg-violet-50 h-8 w-8" title="Manage Subscription">
                            <CreditCard className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleToggleActive(user)} className={`text-slate-500 hover:text-violet-600 hover:bg-violet-50 h-8 w-8 ${user.isActive ? '' : 'text-emerald-500'}`} title={user.isActive ? "Deactivate" : "Activate"}>
                            {user.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)} className="text-slate-500 hover:text-red-600 hover:bg-red-50 h-8 w-8" title="Delete User">
                            <Trash2 className="h-4 w-4" />
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

      {/* Create User Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>Add a new user to the system</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Name</label>
              <Input
                placeholder="Enter full name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
                className="bg-slate-50 border-slate-200"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Email</label>
              <Input
                type="email"
                placeholder="Enter email address"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
                className="bg-slate-50 border-slate-200"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Password</label>
              <Input
                type="password"
                placeholder="Create password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
                className="bg-slate-50 border-slate-200"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Role</label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger className="bg-slate-50 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1 bg-violet-600 hover:bg-violet-700" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Create User
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Name</label>
              <Input
                placeholder="Enter full name"
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                className="bg-slate-50 border-slate-200"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Email</label>
              <Input
                type="email"
                placeholder="Enter email address"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                className="bg-slate-50 border-slate-200"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Role</label>
              <Select value={editUser.role} onValueChange={(value) => setEditUser({ ...editUser, role: value })}>
                <SelectTrigger className="bg-slate-50 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleUpdateUser} className="flex-1 bg-violet-600 hover:bg-violet-700" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setShowEditModal(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Subscription Modal */}
      <Dialog open={showSubModal} onOpenChange={setShowSubModal}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Manage Subscription</DialogTitle>
            <DialogDescription>Update subscription for {selectedUser?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-medium">
                  {selectedUser?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{selectedUser?.name}</p>
                  <p className="text-sm text-slate-500">{selectedUser?.email}</p>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Plan</label>
              <Select value={subPlan} onValueChange={setSubPlan}>
                <SelectTrigger className="bg-slate-50 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Status</label>
              <Select value={subStatus} onValueChange={setSubStatus}>
                <SelectTrigger className="bg-slate-50 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="past_due">Past Due</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              {selectedUser?.subscriptions && selectedUser.subscriptions[0] && (
                <Button
                  variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => {
                    handleCancelSubscription(selectedUser)
                    setShowSubModal(false)
                  }}
                >
                  Cancel Subscription
                </Button>
              )}
              <Button onClick={handleUpdateSubscription} className="flex-1 bg-violet-600 hover:bg-violet-700" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}