"use client"

import { useEffect, useState } from "react"
import { Users, Loader2, Trash2, Eye, EyeOff, UserPlus, X, Search, Shield, ShieldCheck, ShieldAlert, UserCog, History, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface UserType {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  role: string
  isActive: boolean
  createdAt: string
  isAdminUser?: boolean
}

interface RoleAuditLog {
  id: string
  userId: string
  userName: string
  oldRole: string
  newRole: string
  changedBy: string
  changedAt: string
}

const ROLES = [
  { value: "viewer", label: "Viewer", description: "View-only access", icon: Eye, color: "bg-slate-100 text-slate-700" },
  { value: "user", label: "User", description: "Basic dashboard access", icon: UserCog, color: "bg-blue-100 text-blue-700" },
  { value: "editor", label: "Editor", description: "Can manage content", icon: ShieldAlert, color: "bg-amber-100 text-amber-700" },
  { value: "manager", label: "Manager", description: "Full content control", icon: Shield, color: "bg-violet-100 text-violet-700" },
  { value: "admin", label: "Admin", description: "Full system access", icon: ShieldCheck, color: "bg-red-100 text-red-700" },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [showAuditLog, setShowAuditLog] = useState(false)
  const [auditLogs, setAuditLogs] = useState<RoleAuditLog[]>([])
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" })
  const [submitting, setSubmitting] = useState(false)
  const [roleChangeUser, setRoleChangeUser] = useState<UserType | null>(null)
  const [newRole, setNewRole] = useState("")
  const [changingRole, setChangingRole] = useState(false)

  useEffect(() => { loadUsers() }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/users")
      const data = await res.json()
      if (res.ok) setUsers(data)
      else setError(data.error || "Failed")
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      })
      if (res.ok) {
        setShowForm(false)
        setNewUser({ name: "", email: "", password: "", role: "user" })
        loadUsers()
      }
    } catch (e: any) { setError(e.message) }
    finally { setSubmitting(false) }
  }

  const toggleUser = async (id: string, currentActive: boolean) => {
    await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !currentActive })
    })
    loadUsers()
  }

  const deleteUser = async (id: string) => {
    if (!confirm("Delete this user?")) return
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
    loadUsers()
  }

  const updateRole = async () => {
    if (!roleChangeUser || !newRole) return
    if (roleChangeUser.role === newRole) {
      setRoleChangeUser(null)
      return
    }
    setChangingRole(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: roleChangeUser.id, action: "update_role", role: newRole })
      })
      const data = await res.json()
      if (res.ok) {
        // Show appropriate success message
        if (data.sessionsInvalidated) {
          setSuccess(`Role changed from ${roleChangeUser.role} to ${newRole}. User logged out from all devices.`)
        } else {
          setSuccess(`Role changed from ${roleChangeUser.role} to ${newRole}`)
        }
        setTimeout(() => setSuccess(""), 5000)
        loadUsers()
      } else {
        setError(data.error || "Failed to update role")
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setChangingRole(false)
      setRoleChangeUser(null)
    }
  }

  const getRoleBadge = (role: string) => {
    const r = ROLES.find(r => r.value === role) || ROLES[0]
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${r.color}`}>
        <r.icon className="w-3 h-3" />
        {r.label}
      </span>
    )
  }

  const loadAuditLog = async () => {
    try {
      const res = await fetch("/api/admin/users?audit=true")
      if (res.ok) {
        const data = await res.json()
        setAuditLogs(data.auditLogs || [])
      }
    } catch (e) { console.error(e) }
  }

  const openRoleChange = (user: UserType) => {
    setRoleChangeUser(user)
    setNewRole(user.role)
  }

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="w-10 h-10 animate-spin text-violet-600" />
    </div>
  )

  return (
    <div className="p-3 md:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Users & Roles</h1>
          <p className="text-slate-500 mt-1">{users.length} registered users</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { loadAuditLog(); setShowAuditLog(true); }} className="text-xs md:text-sm">
            <History className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> Audit Log
          </Button>
          <Button onClick={() => setShowForm(true)} className="bg-violet-600 text-white font-medium text-xs md:text-sm">
            <UserPlus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> Add User
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-800 p-3 rounded-lg mb-4 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-300 text-green-800 p-3 rounded-lg mb-4 text-sm font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {success}
        </div>
      )}

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-300 text-gray-900 h-11"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 hidden md:table-cell">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 hidden lg:table-cell">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 hidden sm:table-cell">Joined</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No users found</td></tr>
              ) : filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 md:px-4 py-3 md:py-4">
                      <button
                        onClick={() => openRoleChange(user)}
                        className="text-sm border border-slate-300 rounded px-2 py-1 bg-white text-slate-700 hover:border-violet-500 hover:text-violet-600 transition-colors flex items-center gap-1"
                      >
                        {getRoleBadge(user.role)}
                      </button>
                    </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    {user.isActive ? (
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                    ) : (
                      <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 hidden sm:table-cell">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => toggleUser(user.id, user.isActive)} className="text-xs h-8">
                        {user.isActive ? <><EyeOff className="w-3 h-3 mr-1" /> Disable</> : <><Eye className="w-3 h-3 mr-1" /> Enable</>}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteUser(user.id)} className="text-xs h-8 text-red-600 border-red-300 hover:bg-red-50">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add New User</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}><X className="w-5 h-5" /></Button>
            </div>
            <form onSubmit={addUser} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Name</label>
                <Input placeholder="Full name" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} required className="h-11" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                <Input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} required className="h-11" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
                <Input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} required className="h-11" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Role</label>
                <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 h-11 text-gray-900">
                  <option value="user">User</option>
                  <option value="editor">Editor</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1 bg-violet-600 text-white h-11" disabled={submitting}>
                  {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Create
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1 h-11">Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Change Dialog */}
      <Dialog open={!!roleChangeUser} onOpenChange={() => setRoleChangeUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-violet-600" /> Change User Role
            </DialogTitle>
            <DialogDescription>
              Select a new role for this user. Their dashboard access will change accordingly.
            </DialogDescription>
          </DialogHeader>
          {roleChangeUser && (
            <div className="space-y-3 py-2">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-medium">
                  {roleChangeUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{roleChangeUser.name}</p>
                  <p className="text-sm text-slate-500">{roleChangeUser.email}</p>
                </div>
              </div>
              <div className="text-sm text-slate-600">
                Current role: <span className="font-medium">{getRoleBadge(roleChangeUser.role)}</span>
              </div>
              <div className="space-y-2">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setNewRole(r.value)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                      newRole === r.value
                        ? "border-violet-500 bg-violet-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <r.icon className={`w-5 h-5 ${r.color.replace("bg-", "text-").split(" ")[1]}`} />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{r.label}</p>
                      <p className="text-xs text-slate-500">{r.description}</p>
                    </div>
                    {newRole === r.value && (
                      <CheckCircle className="w-5 h-5 text-violet-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRoleChangeUser(null)} className="flex-1">Cancel</Button>
            <Button onClick={updateRole} disabled={changingRole || newRole === roleChangeUser?.role} className="flex-1">
              {changingRole && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Audit Log Dialog */}
      <Dialog open={showAuditLog} onOpenChange={setShowAuditLog}>
        <DialogContent className="sm:max-w-lg max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-violet-600" /> Role Change History
            </DialogTitle>
            <DialogDescription>
              Track all role changes made to users.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-96">
            {auditLogs.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No role changes recorded yet</div>
            ) : (
              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-sm font-medium">
                      {log.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm">{log.userName}</p>
                      <p className="text-xs text-slate-500">{log.oldRole} → {log.newRole} • by {log.changedBy}</p>
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(log.changedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAuditLog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}