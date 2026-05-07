"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building2,
  Globe,
  Zap,
  Crown,
  Calendar,
  LayoutDashboard,
  Loader2,
  ExternalLink,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"
import { KanbanBoard } from "@/components/project-management/KanbanBoard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_ORDER,
  type ProjectStatus,
} from "@/lib/web-dev-service"

interface ClientData {
  id: string
  plan: string
  status: string
  billingCycle: string
  currentPeriodEnd: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
    phone: string | null
    company: string | null
  }
  onboardingForm: {
    id: string
    fullName: string
    email: string
    phone: string
    businessName: string
    currentWebsiteUrl: string | null
    websiteTypes: string[]
    websiteGoal: string
    designPreferences: string | null
    requiredPages: string[]
    targetAudience: string | null
    referenceWebsites: string | null
    projectStatus: string
    createdAt: string
  } | null
}

export default function AdminProjectPage({
  params,
}: {
  params: Promise<{ clientId: string }>
}) {
  const router = useRouter()
  const [clientId, setClientId] = useState<string | null>(null)
  const [client, setClient] = useState<ClientData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"board" | "info" | "activity">("board")

  useEffect(() => {
    params.then((p) => setClientId(p.clientId))
  }, [params])

  useEffect(() => {
    if (!clientId) return
    const fetchClient = async () => {
      try {
        const res = await fetch(`/api/admin/web-dev-subscribers/${clientId}`)
        if (res.ok) {
          const data = await res.json()
          setClient(data)
        }
      } catch (error) {
        console.error("Error fetching client:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchClient()
  }, [clientId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-500">
        <AlertCircle className="w-12 h-12 mr-3 opacity-30" />
        Client not found
      </div>
    )
  }

  const planIcon = client.plan === "STARTER" ? Zap : Crown
  const planColor = client.plan === "STARTER" ? "blue" : "purple"
  const currentStatusIndex = client.onboardingForm
    ? PROJECT_STATUS_ORDER.indexOf(client.onboardingForm.projectStatus as ProjectStatus)
    : -1

  const tabs = [
    { id: "board", label: "Project Board", icon: LayoutDashboard },
    { id: "info", label: "Client Info", icon: User },
  ] as const

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin/web-dev-subscribers")}
          className="text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg">
            {(client.user.name || client.onboardingForm?.fullName || "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {client.user.name || client.onboardingForm?.fullName || "Client"}
            </h1>
            <p className="text-sm text-slate-500">{client.user.email}</p>
          </div>
          <Badge className={`bg-${planColor}-100 text-${planColor}-700 border-${planColor}-200 ml-auto`}>
            {client.plan === "STARTER" ? "Starter" : "Complete"}
          </Badge>
        </div>
      </div>

      {/* Project Progress Bar */}
      {client.onboardingForm && (
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2 sm:gap-4 overflow-x-auto">
              {PROJECT_STATUS_ORDER.map((status, i) => {
                const isCompleted = i < currentStatusIndex
                const isCurrent = i === currentStatusIndex
                const Icon = i === 0 ? CheckCircle : i === 1 ? MessageSquare : i === 2 ? LayoutDashboard : i === 3 ? Zap : i === 4 ? Clock : Globe
                return (
                  <div key={status} className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white"
                            : isCurrent
                              ? "bg-gradient-to-br from-purple-500 to-violet-500 text-white ring-4 ring-purple-200"
                              : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className={`text-[10px] sm:text-xs font-medium mt-1 whitespace-nowrap ${isCurrent ? "text-purple-700" : isCompleted ? "text-green-600" : "text-slate-400"}`}>
                        {PROJECT_STATUS_LABELS[status as ProjectStatus].replace(" 🎉", "")}
                      </span>
                    </div>
                    {i < PROJECT_STATUS_ORDER.length - 1 && (
                      <div className={`hidden sm:block w-8 lg:w-12 h-0.5 ${isCompleted ? "bg-green-400" : "bg-slate-200"}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white text-purple-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "board" && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 min-h-[500px]">
          <KanbanBoard subscriptionId={client.id} />
        </div>
      )}

      {activeTab === "info" && client.onboardingForm && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Info */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-purple-500" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <User className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Full Name</p>
                  <p className="text-sm font-medium text-slate-900">{client.onboardingForm.fullName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Mail className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-medium text-slate-900">{client.onboardingForm.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Phone className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="text-sm font-medium text-slate-900">{client.onboardingForm.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Building2 className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Business</p>
                  <p className="text-sm font-medium text-slate-900">{client.onboardingForm.businessName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-500" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Platform</p>
                <div className="flex gap-1 flex-wrap">
                  {(client.onboardingForm.websiteTypes || []).map((type: string) => (
                    <span key={type} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              {client.onboardingForm.currentWebsiteUrl && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Current Website</p>
                  <a href={client.onboardingForm.currentWebsiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:underline flex items-center gap-1">
                    {client.onboardingForm.currentWebsiteUrl}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Pages Needed</p>
                <div className="flex gap-1 flex-wrap">
                  {(client.onboardingForm.requiredPages || []).map((page: string) => (
                    <span key={page} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {page}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goal */}
          <Card className="bg-white border-slate-200 lg:col-span-2">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-base font-semibold text-slate-900">Website Goal</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-slate-700">{client.onboardingForm.websiteGoal}</p>
              {client.onboardingForm.designPreferences && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Design Preferences</p>
                  <p className="text-sm text-slate-700">{client.onboardingForm.designPreferences}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
