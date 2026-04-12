"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Loader2, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  UserPlus,
  CreditCard,
  X,
  Crown,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  subscriptions?: Array<{
    id: string;
    plan: string;
    status: string;
    currentPeriodEnd: string | null;
  }>;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showSubModal, setShowSubModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [subPlan, setSubPlan] = useState("pro");
  const [subStatus, setSubStatus] = useState("active");
  const [isUpdatingSub, setIsUpdatingSub] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        if (response.status === 401) {
          setError("Unauthorized - Please login as admin");
        } else {
          const data = await response.json();
          setError(data.error || "Failed to fetch users");
        }
      } else {
        const data = await response.json();
        setUsers(data.users || data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive })
      });
      fetchUsers();
    } catch (error) {
      console.error("Error toggling user:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, action: "delete_user" })
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    try {
      await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action: "update_role", role })
      });
      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to create user");
      } else {
        setShowCreateModal(false);
        setNewUser({ name: "", email: "", password: "", role: "user" });
        fetchUsers();
      }
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSubscription = async () => {
    if (!selectedUser) return;

    setIsUpdatingSub(true);
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
      });

      const data = await response.json();
      if (data.success) {
        setShowSubModal(false);
        fetchUsers();
      } else {
        alert(data.error || "Failed to update subscription");
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
    } finally {
      setIsUpdatingSub(false);
    }
  };

  const handleCancelUserSubscription = async (user: User) => {
    if (!confirm(`Cancel subscription for ${user.name}?`)) return;

    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          action: "cancel_subscription",
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchUsers();
      } else {
        alert(data.error || "Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
    }
  };

  const openSubModal = (user: User) => {
    setSelectedUser(user);
    const activeSub = user.subscriptions?.[0];
    if (activeSub) {
      setSubPlan(activeSub.plan);
      setSubStatus(activeSub.status);
    } else {
      setSubPlan("pro");
      setSubStatus("active");
    }
    setShowSubModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-500 mt-1">Manage registered users</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-violet-600 hover:bg-violet-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <Input
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="user">User</option>
                  <option value="editor">Editor</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3">
                <Button type="submit" className="flex-1">Create User</Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        </div>
      ) : users.length === 0 ? (
        <Card className="bg-white border-slate-200">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto text-slate-400 mb-4" />
            <p className="text-slate-500">No users registered yet</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white border-slate-200 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600">User</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600">Role</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600">Company</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600">Phone</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600">Subscription</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600">Status</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600">Joined</th>
                    <th className="text-right p-4 text-sm font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-slate-900">{user.name}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <select
                          value={user.role || 'user'}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                          className={`text-xs font-medium px-2 py-1 rounded-full border ${
                            user.role === 'admin' ? 'bg-red-100 text-red-700 border-red-200' :
                            user.role === 'manager' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                            user.role === 'editor' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                            'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <option value="user">User</option>
                          <option value="editor">Editor</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-4 text-slate-600">
                        {user.company || "-"}
                      </td>
                      <td className="p-4 text-slate-600">
                        {user.phone || "-"}
                      </td>
                      <td className="p-4">
                        {user.subscriptions && user.subscriptions[0] ? (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              user.subscriptions[0].plan === 'enterprise'
                                ? "bg-violet-100 text-violet-700 border border-violet-200"
                                : user.subscriptions[0].plan === 'pro'
                                ? "bg-pink-100 text-pink-700 border border-pink-200"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
                            {user.subscriptions[0].plan === 'enterprise' ? (
                              <Rocket className="w-3 h-3" />
                            ) : user.subscriptions[0].plan === 'pro' ? (
                              <Crown className="w-3 h-3" />
                            ) : null}
                            {user.subscriptions[0].plan.charAt(0).toUpperCase() + user.subscriptions[0].plan.slice(1)}
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            Free
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            user.isActive
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : "bg-red-100 text-red-700 border border-red-200"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openSubModal(user)}
                            className="text-slate-500 hover:text-violet-600 hover:bg-violet-50"
                          >
                            <CreditCard className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleActive(user)}
                            className="text-slate-500 hover:text-violet-600 hover:bg-violet-50"
                          >
                            {user.isActive ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(user.id)}
                            className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {showSubModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Manage Subscription</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowSubModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">User</p>
                <p className="text-slate-900 font-medium">{selectedUser.name}</p>
                <p className="text-sm text-slate-500">{selectedUser.email}</p>
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-2 block">Plan</label>
                <select
                  value={subPlan}
                  onChange={(e) => setSubPlan(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                >
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-2 block">Status</label>
                <select
                  value={subStatus}
                  onChange={(e) => setSubStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                >
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="past_due">Past Due</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                {selectedUser.subscriptions && selectedUser.subscriptions[0] && (
                  <Button
                    variant="outline"
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      handleCancelUserSubscription(selectedUser);
                      setShowSubModal(false);
                    }}
                  >
                    Cancel Sub
                  </Button>
                )}
                <Button
                  className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
                  onClick={handleUpdateSubscription}
                  disabled={isUpdatingSub}
                >
                  {isUpdatingSub ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
