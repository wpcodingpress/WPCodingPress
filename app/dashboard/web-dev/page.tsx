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
  ChevronDown,
  Mail,
  Shield,
  Crown,
  Zap,
  X,
  ExternalLink,
  HelpCircle,
  FileText,
  Calendar,
  CreditCard,
  Check,
  Settings,
  Columns3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { MOSAIC_NAME, PM_WHATSAPP_NUMBER, getFirstname } from "@/lib/project-management"
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_ORDER,
  type ProjectStatus,
} from "@/lib/web-dev-service"

const WHATSAPP_NUMBER = PM_WHATSAPP_NUMBER

interface SubscriptionData {
  id: string
  plan: string
  status: string
  billingCycle: string
  currentPeriodEnd: string
  currentPeriodStart: string
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
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [upgradeError, setUpgradeError] = useState<string | null>(null)
  const [showSupport, setShowSupport] = useState(false)
  const [supportMessage, setSupportMessage] = useState("")
  const [supportSent, setSupportSent] = useState(false)
  const [isBoardOpen, setIsBoardOpen] = useState(false)
  const [pmName, setPmName] = useState<string | null>(null)

  const fetchPmName = useCallback(async (subId: string) => {
    try {
      const res = await fetch(`/api/project-boards?subscriptionId=${subId}`)
      const data = await res.json()
      if (data.board?.projectManagerName) {
        setPmName(data.board.projectManagerName)
      }
    } catch { /* ignore */ }
  }, [])

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/web-dev-subscriptions")
      const data = await res.json()
      if (data.subscription) {
        setSubscription(data.subscription)
        fetchPmName(data.subscription.id)
      } else {
        router.push("/web-dev-plans")
      }
    } catch {
      router.push("/web-dev-plans")
    } finally {
      setIsLoading(false)
    }
  }, [router, fetchPmName])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const currentStatusIndex = subscription?.onboardingForm
    ? PROJECT_STATUS_ORDER.indexOf(subscription.onboardingForm.projectStatus as ProjectStatus)
    : -1

  const planName = subscription?.plan === "STARTER" ? "Starter" : "Complete"

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
    setIsUpgrading(true)
    setUpgradeError(null)
    try {
      const res = await fetch("/api/web-dev-subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "COMPLETE", billingCycle: subscription?.billingCycle || "monthly" }),
      })
      const data = await res.json()

      if (!res.ok) {
        setUpgradeError(data.error || "Upgrade failed. Please try again.")
        return
      }

      if (data.redirectTo) {
        setShowUpgradeModal(false)
        router.push(data.redirectTo)
        return
      }

      if (data.url) {
        window.location.href = data.url
        return
      }

      setUpgradeError("Unexpected response. Please try again.")
    } catch {
      setUpgradeError("Network error. Please check your connection.")
    } finally {
      setIsUpgrading(false)
    }
  }

  const handleSupportSubmit = () => {
    const text = encodeURIComponent(
      `Support Request — ${planName} Plan\n\n${supportMessage}\n\nSent from WPCodingPress Dashboard`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank")
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
                className="border-white/40 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 font-medium"
                onClick={() => setShowSupport(true)}
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Support
              </Button>
              {subscription.plan === "STARTER" ? (
                <Button
                  className="bg-white text-purple-700 hover:bg-purple-50 font-semibold shadow-lg"
                  onClick={() => setShowUpgradeModal(true)}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="border-white/40 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 font-medium"
                  onClick={() => router.push("/dashboard/subscription")}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Manage
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
            title: pmName ? `Contact ${getFirstname(pmName)}` : "Contact PM",
            desc: pmName ? `Your PM: ${pmName}` : "Message on WhatsApp",
            icon: MessageSquare,
            action: () => window.open(
              `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                pmName
                  ? `Hi ${getFirstname(pmName)}, I have a question about my project.`
                  : "Hi, I have a question about my project."
              )}`,
              "_blank"
            ),
            color: "from-green-500 to-emerald-500",
          },
          {
            title: "Open Mosaic",
            desc: "Full project management board",
            icon: Columns3,
            action: () => window.open("/dashboard/project-board", "_blank"),
            color: "from-purple-500 to-violet-500",
          },
          {
            title: "Invoice History",
            desc: "View & download invoices",
            icon: CreditCard,
            action: () => router.push("/dashboard/invoices"),
            color: "from-violet-500 to-purple-500",
          },
          {
            title: "Need Help?",
            desc: "Chat with support",
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

      {/* Mosaic - Open in New Tab */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => window.open("/dashboard/project-board", "_blank")}
        className="cursor-pointer"
      >
        <Card className="bg-white border-slate-200 hover:shadow-xl hover:border-purple-300 transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <CardContent className="p-5 sm:p-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-500 shadow-lg group-hover:shadow-purple-500/30 transition-all">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {MOSAIC_NAME}
                  </h3>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-semibold uppercase tracking-wider">
                    Open
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">
                  {pmName
                    ? `Your Project Manager: ${pmName} — Full project management board`
                    : "Full agency project management board with Kanban, tasks, files, and team collaboration"}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-200 transition-colors">
                <ExternalLink className="w-5 h-5" />
              </div>
            </div>

            {/* Feature pills */}
            <div className="flex gap-2 mt-4 flex-wrap">
              {["Kanban Board", "Task Tracking", "File Sharing", "Comments", "Team Collaboration"].map((feat) => (
                <span key={feat} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-medium">
                  {feat}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

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
                {upgradeError && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {upgradeError}
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-slate-200"
                  onClick={() => { setShowUpgradeModal(false); setUpgradeError(null); }}
                >
                  Maybe Later
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                >
                  {isUpgrading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Upgrade Now
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </>
                  )}
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
                  <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">WhatsApp Opened!</h3>
                  <p className="text-slate-500 text-sm">Your message has been pre-filled. Just hit send on WhatsApp.</p>
                  <Button variant="outline" className="mt-4" onClick={() => { setShowSupport(false); setSupportSent(false); setSupportMessage(""); }}>
                    Close
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-green-100">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Support via WhatsApp</h3>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">
                    Describe your issue and we'll open WhatsApp with your message pre-filled. We typically respond within minutes.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="supportMessage">Message</Label>
                      <textarea
                        id="supportMessage"
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        className="w-full min-h-[120px] p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        placeholder="Describe what you need help with..."
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 border-slate-200" onClick={() => setShowSupport(false)}>
                        Cancel
                      </Button>
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        onClick={handleSupportSubmit}
                        disabled={!supportMessage.trim()}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send via WhatsApp
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
