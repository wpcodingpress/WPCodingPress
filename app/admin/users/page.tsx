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

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
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
  const [subPlan, setSubPlan] = useState("pro");
  const [subStatus, setSubStatus] = useState("active");
  const [isUpdatingSub, setIsUpdatingSub] = useState(false);

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
        setUsers(data);
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
      await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="text-muted-foreground">Manage registered users</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No users registered yet</p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Company</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Phone</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Subscription</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Joined</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">
                    {user.company || "-"}
                  </td>
                  <td className="p-4 text-slate-300">
                    {user.phone || "-"}
                  </td>
                  <td className="p-4">
                    {user.subscriptions && user.subscriptions[0] ? (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          user.subscriptions[0].plan === 'enterprise'
                            ? "bg-purple-500/20 text-purple-400"
                            : user.subscriptions[0].plan === 'pro'
                            ? "bg-pink-500/20 text-pink-400"
                            : "bg-slate-500/20 text-slate-400"
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
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-slate-500/20 text-slate-400">
                        Free
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        user.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openSubModal(user)}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <CreditCard className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleActive(user)}
                        className="text-muted-foreground hover:text-white"
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
                        className="text-muted-foreground hover:text-red-400"
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
      )}

      {showSubModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Manage Subscription</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowSubModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">User</p>
                <p className="text-white font-medium">{selectedUser.name}</p>
                <p className="text-sm text-slate-400">{selectedUser.email}</p>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Plan</label>
                <select
                  value={subPlan}
                  onChange={(e) => setSubPlan(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Status</label>
                <select
                  value={subStatus}
                  onChange={(e) => setSubStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
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
                    className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                    onClick={() => {
                      handleCancelUserSubscription(selectedUser);
                      setShowSubModal(false);
                    }}
                  >
                    Cancel Sub
                  </Button>
                )}
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
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
