"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle,
  Clock,
  MessageSquare,
  Palette,
  Code,
  Rocket,
  Loader2,
  AlertTriangle,
  ChevronRight,
  Mail,
  Phone,
  Shield,
  Crown,
  Zap,
  X,
  ExternalLink,
  HelpCircle,
  FileText,
  Calendar,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_ORDER,
  type ProjectStatus,
} from "@/lib/web-dev-service"

interface SubscriptionData {
  id: string
  plan: string
  status: string
  billingCycle: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  onboardingForm: {
    projectStatus: string
    fullName: string
    email: string
  } | null
}

const STATUS_STEPS = PROJECT_STATUS_ORDER.map((status) => ({
  key: status,
  label: PROJECT_STATUS_LABELS[status],
  icon:
    status === "RECEIVED"
      ? FileText
      : status === "DISCUSSION"
        ? MessageSquare
        : status === "DESIGN"
          ? Palette
          : status === "DEVELOPMENT"
            ? Code
            : status === "TESTING"
              ? Shield
              : Rocket,
}))

export default function WebDevDashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelSuccess, setCancelSuccess] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showSupport, setShowSupport] = useState(false)
  const [supportMessage, setSupportMessage] = useState("")
  const [supportSent, setSupportSent] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/web-dev-subscriptions")
      const data = await res.json()
      if (data.subscription) {
        setSubscription(data.subscription)
      } else {
        router.push("/web-dev-plans")
      }
    } catch {
      router.push("/web-dev-plans")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const currentStatusIndex = subscription?.onboardingForm
    ? PROJECT_STATUS_ORDER.indexOf(subscription.onboardingForm.projectStatus as ProjectStatus)
    : -1

  const planName = subscription?.plan === "STARTER" ? "Starter" : "Complete"
  const planColor = subscription?.plan === "STARTER" ? "from-blue-500 to-violet-500" : "from-purple-500 to-pink-500"

  const handleCancel = async () => {
    setIsCancelling(true)
    try {
      const res = await fetch("/api/web-dev-subscriptions", { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        setCancelSuccess(true)
        setShowCancelModal(false)
        fetchData()
      }
    } catch {
      //
    } finally {
      setIsCancelling(false)
    }
  }

  const handleUpgrade = async () => {
    try {
      const res = await fetch("/api/web-dev-subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "COMPLETE", billingCycle: subscription?.billingCycle || "monthly" }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      //
    }
  }

  const handleSupportSubmit = () => {
    const subject = encodeURIComponent(`Support Request — ${planName} Plan`)
    const body = encodeURIComponent(supportMessage)
    window.open(`mailto:support@wpcodingpress.com?subject=${subject}&body=${body}`)
    setSupportSent(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!subscription) return null

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {cancelSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-amber-800">Subscription Cancelled</p>
            <p className="text-sm text-amber-600">You'll have access until the end of your billing period.</p>
          </div>
        </motion.div>
      )}

      {/* Plan Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/20">
                {subscription.plan === "STARTER" ? (
                  <Zap className="w-6 h-6" />
                ) : (
                  <Crown className="w-6 h-6" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl sm:text-2xl font-bold">{planName} Plan</h2>
                  <Badge className="bg-green-400 text-green-900 border-0 text-xs font-semibold">
                    {subscription.status === "active" ? "Active" : subscription.status}
                  </Badge>
                </div>
                <p className="text-purple-200 text-sm">
                  {subscription.billingCycle === "annual" ? "Annual Billing" : "Monthly Billing"}
                  {subscription.currentPeriodEnd && (
                    <> — Next billing: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</>
                  )}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/20"
                onClick={() => setShowSupport(true)}
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Support
              </Button>
              {subscription.plan === "STARTER" && (
                <Button
                  className="bg-white text-purple-700 hover:bg-purple-50 font-semibold"
                  onClick={() => setShowUpgradeModal(true)}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Project Status Tracker */}
      {subscription.onboardingForm ? (
        <Card className="bg-white border-slate-200">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900">Project Progress</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative">
              <div className="hidden sm:block absolute top-8 left-0 right-0 h-0.5 bg-slate-200">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-violet-500"
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${currentStatusIndex >= 0 ? ((currentStatusIndex) / (STATUS_STEPS.length - 1)) * 100 : 0}%`,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {STATUS_STEPS.map((step, i) => {
                  const isCompleted = i < currentStatusIndex
                  const isCurrent = i === currentStatusIndex
                  const isPending = i > currentStatusIndex
                  const Icon = step.icon

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                          isCompleted
                            ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-200"
                            : isCurrent
                              ? "bg-gradient-to-br from-purple-500 to-violet-500 text-white ring-4 ring-purple-200 shadow-lg shadow-purple-200"
                              : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          isCurrent ? "text-purple-700" : isCompleted ? "text-green-600" : "text-slate-400"
                        }`}
                      >
                        {step.label.replace(" 🎉", "")}
                      </span>
                      {isCurrent && (
                        <Badge className="mt-1 bg-purple-100 text-purple-700 border-purple-200 text-[10px] px-2 py-0">
                          In Progress
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white border-slate-200">
          <CardContent className="p-6 text-center">
            <div className="p-4 rounded-full bg-purple-100 w-fit mx-auto mb-4">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Complete Your Onboarding</h3>
            <p className="text-slate-500 mb-4 max-w-md mx-auto">
              Tell us about your project so we can get started. This should only take a few minutes.
            </p>
            <Button
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
              onClick={() => router.push("/onboarding")}
            >
              Start Onboarding
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Contact PM",
            desc: "Message your project manager on WhatsApp",
            icon: MessageSquare,
            action: () => window.open("https://wa.me/1234567890", "_blank"),
            color: "from-green-500 to-emerald-500",
          },
          {
            title: "Send Email",
            desc: "Email support@wpcodingpress.com",
            icon: Mail,
            action: () => window.open("mailto:support@wpcodingpress.com"),
            color: "from-blue-500 to-cyan-500",
          },
          {
            title: "Invoice History",
            desc: "View your payment history",
            icon: CreditCard,
            action: () => router.push("/dashboard/invoices"),
            color: "from-violet-500 to-purple-500",
          },
          {
            title: "Need Help?",
            desc: "Submit a support request",
            icon: HelpCircle,
            action: () => setShowSupport(true),
            color: "from-amber-500 to-orange-500",
          },
        ].map((item, i) => (
          <motion.button
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={item.action}
            className="text-left"
          >
            <Card className="bg-white border-slate-200 hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer h-full">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-lg`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">{item.title}</p>
                    <p className="text-xs text-slate-500 truncate">{item.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.button>
        ))}
      </div>

      {/* Subscription Details */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-lg font-semibold text-slate-900">Subscription Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-500 mb-1">Plan</p>
              <p className="font-semibold text-slate-900 flex items-center gap-2">
                {subscription.plan === "STARTER" ? (
                  <Zap className="w-4 h-4 text-blue-500" />
                ) : (
                  <Crown className="w-4 h-4 text-purple-500" />
                )}
                {planName}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-500 mb-1">Billing Cycle</p>
              <p className="font-semibold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-violet-500" />
                {subscription.billingCycle === "annual" ? "Annual" : "Monthly"}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-500 mb-1">Next Billing</p>
              <p className="font-semibold text-slate-900">
                {subscription.currentPeriodEnd
                  ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            {!cancelSuccess && !subscription.cancelAtPeriodEnd && (
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => setShowCancelModal(true)}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel Subscription
              </Button>
            )}
            <Button
              variant="outline"
              className="border-slate-200 text-slate-600"
              onClick={() => router.push("/contact")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Full Site
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="p-3 rounded-full bg-red-100 w-fit mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Cancel Subscription?</h3>
                <p className="text-slate-500 mt-2">
                  We're sorry to see you go! Are you sure you want to cancel your {planName} Plan?
                </p>
                <p className="text-sm text-purple-600 font-medium mt-2 bg-purple-50 p-2 rounded-lg">
                  Your website will remain live until the end of your billing period.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-slate-200"
                  onClick={() => setShowCancelModal(false)}
                >
                  Keep Subscription
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={handleCancel}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    "Cancel Anyway"
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowUpgradeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="p-3 rounded-full bg-purple-100 w-fit mx-auto mb-4">
                  <Crown className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Upgrade to Complete</h3>
                <p className="text-slate-500 mt-2">
                  Get everything in Starter plus domain registration, premium hosting, SSL, and professional email — all handled by us.
                </p>
                <div className="bg-purple-50 rounded-xl p-4 mt-4 text-left space-y-2">
                  {["Domain Registration Included", "Premium Hosting Included", "SSL Certificate Included", "Professional Email Setup", "We Handle Everything"].map(
                    (feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-slate-200"
                  onClick={() => setShowUpgradeModal(false)}
                >
                  Maybe Later
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
                  onClick={handleUpgrade}
                >
                  Upgrade Now
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Support Modal */}
      <AnimatePresence>
        {showSupport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSupport(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {supportSent ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Message Sent!</h3>
                  <p className="text-slate-500 text-sm">We'll get back to you within 24 hours.</p>
                  <Button variant="outline" className="mt-4" onClick={() => { setShowSupport(false); setSupportSent(false); }}>
                    Close
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Support Request</h3>
                  <p className="text-sm text-slate-500 mb-4">Describe your issue and we'll get back to you within 24 hours.</p>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="supportMessage">Message</Label>
                      <textarea
                        id="supportMessage"
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        className="w-full min-h-[120px] p-3 border border-slate-200 rounded-lg text-sm"
                        placeholder="Describe what you need help with..."
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => setShowSupport(false)}>
                        Cancel
                      </Button>
                      <Button
                        className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
                        onClick={handleSupportSubmit}
                        disabled={!supportMessage.trim()}
                      >
                        Send Message
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
