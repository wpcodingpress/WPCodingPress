"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
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
  Pencil,
  Check,
  XCircle,
  AlertCircle,
  Edit3,
  ToggleLeft,
  ToggleRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select"

interface User {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  role: string
  isActive: boolean
  createdAt: string
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

  useEffect(() => {
    fetchUsers()
  }, [])

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
    if (!confirm("Are you sure you want to delete this user?")) return
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
      if (!res.ok) throw new Error("Failed to create user")
      setShowCreateModal(false)
      setNewUser({ name: "", email: "", password: "", role: "user" })
      fetchUsers()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setEditUser({ name: user.name, email: user.email, role: user.role })
    setShowEditModal(true)
  }

  const openSubModal = (user: User) => {
    setSelectedUser(user)
    setSubPlan("pro")
    setSubStatus("active")
    setShowSubModal(true)
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive)
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: "bg-red-100 text-red-800 border-red-300",
      manager: "bg-orange-100 text-orange-800 border-orange-300",
      editor: "bg-blue-100 text-blue-800 border-blue-300",
      user: "bg-gray-100 text-gray-800 border-gray-300"
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[role] || styles.user}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    )
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-300">
        Inactive
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-violet-600 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage registered users</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-4 py-2">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex items-center gap-2 text-red-800 font-medium">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Filters */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-4 md:p-5">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 h-10 md:h-11 text-sm"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[140px] bg-gray-50 border-gray-300 h-10 md:h-11">
                  <SelectValue placeholder="Role" className="text-gray-900" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-gray-900">All Roles</SelectItem>
                  <SelectItem value="admin" className="text-gray-900">Admin</SelectItem>
                  <SelectItem value="manager" className="text-gray-900">Manager</SelectItem>
                  <SelectItem value="editor" className="text-gray-900">Editor</SelectItem>
                  <SelectItem value="user" className="text-gray-900">User</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px] bg-gray-50 border-gray-300 h-10 md:h-11">
                  <SelectValue placeholder="Status" className="text-gray-900" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-gray-900">All Status</SelectItem>
                  <SelectItem value="active" className="text-gray-900">Active</SelectItem>
                  <SelectItem value="inactive" className="text-gray-900">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-white border-gray-200 overflow-hidden">
        <CardHeader className="border-b border-gray-200 pb-3">
          <CardTitle className="text-lg text-gray-900 font-semibold">
            All Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Joined</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500 font-medium">
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
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-medium flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-4 py-4 text-gray-600 text-sm hidden lg:table-cell">
                        {user.company || <span className="text-gray-400">-</span>}
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        {getStatusBadge(user.isActive)}
                      </td>
                      <td className="px-4 py-4 text-gray-500 text-sm hidden sm:table-cell">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openEditModal(user)} 
                            className="text-gray-500 hover:text-violet-600 hover:bg-violet-50 font-medium h-8 px-2"
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleToggleActive(user)} 
                            className={`font-medium h-8 px-2 ${user.isActive ? 'text-gray-500 hover:text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                          >
                            {user.isActive ? 'Disable' : 'Enable'}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(user.id)} 
                            className="text-gray-500 hover:text-red-600 hover:bg-red-50 font-medium h-8 px-2"
                          >
                            Delete
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

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create New User</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowCreateModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Name</label>
                <Input
                  placeholder="Enter full name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 h-11"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 h-11"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
                <Input
                  type="password"
                  placeholder="Create password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 h-11"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Role</label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger className="bg-gray-50 border-gray-300 h-11">
                    <SelectValue className="text-gray-900" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user" className="text-gray-900">User</SelectItem>
                    <SelectItem value="editor" className="text-gray-900">Editor</SelectItem>
                    <SelectItem value="manager" className="text-gray-900">Manager</SelectItem>
                    <SelectItem value="admin" className="text-gray-900">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-medium h-11" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Create User
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1 border-gray-300 text-gray-700 font-medium h-11">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit User</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowEditModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Name</label>
                <Input
                  placeholder="Enter full name"
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 h-11"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 h-11"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Role</label>
                <Select value={editUser.role} onValueChange={(value) => setEditUser({ ...editUser, role: value })}>
                  <SelectTrigger className="bg-gray-50 border-gray-300 h-11">
                    <SelectValue className="text-gray-900" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user" className="text-gray-900">User</SelectItem>
                    <SelectItem value="editor" className="text-gray-900">Editor</SelectItem>
                    <SelectItem value="manager" className="text-gray-900">Manager</SelectItem>
                    <SelectItem value="admin" className="text-gray-900">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={() => updateUserRole(selectedUser.id, editUser.role)} className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-medium h-11" disabled={isSubmitting}>
                  Save Role
                </Button>
                <Button variant="outline" onClick={() => setShowEditModal(false)} className="flex-1 border-gray-300 text-gray-700 font-medium h-11">
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