"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { 
  User, 
  Mail, 
  Lock, 
  Save, 
  Loader2, 
  Check, 
  X,
  Eye,
  EyeOff,
  Shield,
  Bell,
  Key
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function AdminProfilePage() {
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  
  const [name, setName] = useState(session?.user?.name || "")
  const [email, setEmail] = useState(session?.user?.email || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)
  
  const [notifOrders, setNotifOrders] = useState(true)
  const [notifSubscribers, setNotifSubscribers] = useState(true)
  const [notifContact, setNotifContact] = useState(true)

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      })
      
      if (res.ok) {
        await update({ name, email })
        setSuccess("Profile updated successfully!")
      } else {
        const data = await res.json()
        setError(data.error || "Failed to update profile")
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      setLoading(false)
      return
    }
    
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }
    
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "password", currentPassword, newPassword })
      })
      
      if (res.ok) {
        setSuccess("Password updated successfully!")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        const data = await res.json()
        setError(data.error || "Failed to update password")
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const saveNotifications = async () => {
    setLoading(true)
    try {
      await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "notifications",
          notifOrders,
          notifSubscribers,
          notifContact
        })
      })
      setSuccess("Notification settings saved!")
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Profile Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2 text-green-700">
          <Check className="w-5 h-5" />
          {success}
        </motion.div>
      )}
      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
          <X className="w-5 h-5" />
          {error}
        </motion.div>
      )}

      {/* Profile Information */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <User className="w-5 h-5 text-violet-600" />
            Profile Information
          </CardTitle>
          <CardDescription className="text-slate-500">Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={updateProfile} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Full Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="h-11"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-11"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading} className="bg-violet-600 hover:bg-violet-700">
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Key className="w-5 h-5 text-violet-600" />
            Change Password
          </CardTitle>
          <CardDescription className="text-slate-500">Update your account password</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={updatePassword} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Current Password</label>
                <div className="relative">
                  <Input
                    type={showPasswords ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="h-11 pr-10"
                  />
                  <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div></div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">New Password</label>
                <Input
                  type={showPasswords ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="h-11"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Confirm New Password</label>
                <Input
                  type={showPasswords ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="h-11"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading} className="bg-violet-600 hover:bg-violet-700">
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                <Lock className="w-4 h-4 mr-2" />
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Bell className="w-5 h-5 text-violet-600" />
            Notification Preferences
          </CardTitle>
          <CardDescription className="text-slate-500">Choose what notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Order Notifications</p>
                <p className="text-sm text-slate-500">Get notified when new orders are placed</p>
              </div>
              <button onClick={() => setNotifOrders(!notifOrders)} 
                className={"w-12 h-6 rounded-full transition-colors relative " + (notifOrders ? "bg-violet-600" : "bg-slate-300")}>
                <div className={"absolute top-1 w-4 h-4 bg-white rounded-full transition-transform " + (notifOrders ? "translate-x-7" : "translate-x-1")} />
              </button>
            </label>
            <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Subscriber Notifications</p>
                <p className="text-sm text-slate-500">Get notified when someone subscribes</p>
              </div>
              <button onClick={() => setNotifSubscribers(!notifSubscribers)} 
                className={"w-12 h-6 rounded-full transition-colors relative " + (notifSubscribers ? "bg-violet-600" : "bg-slate-300")}>
                <div className={"absolute top-1 w-4 h-4 bg-white rounded-full transition-transform " + (notifSubscribers ? "translate-x-7" : "translate-x-1")} />
              </button>
            </label>
            <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Contact Notifications</p>
                <p className="text-sm text-slate-500">Get notified when someone contacts you</p>
              </div>
              <button onClick={() => setNotifContact(!notifContact)} 
                className={"w-12 h-6 rounded-full transition-colors relative " + (notifContact ? "bg-violet-600" : "bg-slate-300")}>
                <div className={"absolute top-1 w-4 h-4 bg-white rounded-full transition-transform " + (notifContact ? "translate-x-7" : "translate-x-1")} />
              </button>
            </label>
            <div className="flex justify-end pt-2">
              <Button onClick={saveNotifications} disabled={loading} className="bg-violet-600 hover:bg-violet-700">
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}