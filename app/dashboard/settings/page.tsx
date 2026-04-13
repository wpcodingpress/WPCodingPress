"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  CreditCard,
  Save,
  Loader2,
  Eye,
  EyeOff,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  notifyOrderUpdates: boolean;
  notifyProductUpdates: boolean;
  notifyPromotional: boolean;
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    company: ""
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [notifications, setNotifications] = useState({
    notifyOrderUpdates: true,
    notifyProductUpdates: true,
    notifyPromotional: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setProfileData({
          name: data.name || "",
          phone: data.phone || "",
          company: data.company || ""
        });
        setNotifications({
          notifyOrderUpdates: data.notifyOrderUpdates ?? true,
          notifyProductUpdates: data.notifyProductUpdates ?? true,
          notifyPromotional: data.notifyPromotional ?? false
        });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        setSuccessMessage("Profile updated successfully!");
        setUser(prev => prev ? { ...prev, ...profileData } : null);
      } else {
        const data = await response.json();
        setErrorMessage(data.error || "Failed to update profile");
      }
    } catch (error) {
      setErrorMessage("Failed to update profile");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("New passwords do not match");
      setIsSaving(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        setSuccessMessage("Password changed successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        const data = await response.json();
        setErrorMessage(data.error || "Failed to change password");
      }
    } catch (error) {
      setErrorMessage("Failed to change password");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleNotificationChange = async (key: keyof typeof notifications) => {
    const newValue = !notifications[key];
    setNotifications(prev => ({ ...prev, [key]: newValue }));

    try {
      await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: newValue })
      });
    } catch (error) {
      console.error("Failed to update notification:", error);
      setNotifications(prev => ({ ...prev, [key]: !newValue }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-slate-500">Manage your account preferences</p>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <Check className="h-4 w-4" />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <X className="h-4 w-4" />
          {errorMessage}
        </div>
      )}

      <div className="flex gap-6 flex-col lg:flex-row">
        <div className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1">
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Profile Information</h2>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                    <Input
                      value={user?.email || ""}
                      disabled
                      className="bg-slate-50"
                    />
                    <p className="text-xs text-slate-500">Email cannot be changed</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Phone Number</label>
                    <Input
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Company</label>
                    <Input
                      value={profileData.company}
                      onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={isSaving} className="gap-2">
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-green-100">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Change Password</h2>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Current Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">New Password</label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={isSaving} className="gap-2">
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-md font-semibold text-slate-900">Two-Factor Authentication</h3>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">2FA Status</p>
                    <p className="text-sm text-slate-500">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "billing" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-purple-100">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Billing & Payment</h2>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-medium text-slate-900 mb-4">Saved Payment Methods</h3>
                  <div className="text-center py-8 text-slate-500">
                    <CreditCard className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No payment methods saved yet</p>
                    <p className="text-sm text-slate-400 mt-1">Add a payment method to speed up checkout</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-medium text-slate-900 mb-4">Billing Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                      <Input placeholder="John Doe" className="bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                      <Input placeholder="Acme Inc." className="bg-white" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Street Address</label>
                      <Input placeholder="123 Main St, Apt 4" className="bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                      <Input placeholder="New York" className="bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">State/Province</label>
                      <Input placeholder="NY" className="bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Postal Code</label>
                      <Input placeholder="10001" className="bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                      <Input placeholder="United States" className="bg-white" />
                    </div>
                  </div>
                  <Button className="mt-4 bg-primary hover:bg-primary/90">
                    <Save className="w-4 h-4 mr-2" />
                    Save Billing Details
                  </Button>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-medium text-slate-900 mb-4">Invoice Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Email Invoices</p>
                        <p className="text-sm text-slate-500">Receive invoices via email</p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Auto-download PDFs</p>
                        <p className="text-sm text-slate-500">Automatically save invoice PDFs</p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-300 transition-colors">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <Bell className="h-5 w-5 text-yellow-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Notification Preferences</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Order Updates</p>
                    <p className="text-sm text-slate-500">Get notified about order status changes</p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange("notifyOrderUpdates")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.notifyOrderUpdates ? "bg-primary" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.notifyOrderUpdates ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Product Updates</p>
                    <p className="text-sm text-slate-500">Know about new features and updates</p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange("notifyProductUpdates")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.notifyProductUpdates ? "bg-primary" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.notifyProductUpdates ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Promotional Emails</p>
                    <p className="text-sm text-slate-500">Receive special offers and discounts</p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange("notifyPromotional")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.notifyPromotional ? "bg-primary" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.notifyPromotional ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
