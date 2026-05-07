"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  CheckCircle,
  Clock,
  Sparkles,
  MessageSquare,
  Palette,
  Code,
  ShieldCheck,
  Rocket,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const websiteTypeOptions = [
  { value: "wordpress", label: "WordPress" },
  { value: "elementor", label: "Elementor" },
  { value: "woocommerce", label: "WooCommerce" },
  { value: "nextjs", label: "Next.js" },
  { value: "react", label: "React" },
  { value: "custom", label: "Custom" },
]

const pageOptions = [
  { value: "home", label: "Home" },
  { value: "about", label: "About" },
  { value: "services", label: "Services" },
  { value: "blog", label: "Blog" },
  { value: "contact", label: "Contact" },
  { value: "portfolio", label: "Portfolio" },
  { value: "shop", label: "Shop" },
  { value: "other", label: "Other" },
]

const domainExtensions = [".com", ".net", ".org", ".io", ".co", ".dev", ".app", ".ai", ".store", ".online"]

const steps = [
  { id: 1, title: "Personal Info", icon: MessageSquare },
  { id: 2, title: "Project Details", icon: Palette },
  { id: 3, title: "Domain & Hosting", icon: Code },
  { id: 4, title: "Review & Submit", icon: ShieldCheck },
]

export default function OnboardingPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    }>
      <OnboardingPage />
    </Suspense>
  )
}

function OnboardingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [plan, setPlan] = useState<"STARTER" | "COMPLETE" | null>(null)
  const [billingCycle, setBillingCycle] = useState<string>("monthly")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    currentWebsiteUrl: "",
    websiteTypes: [] as string[],
    domainName: "",
    hostingProvider: "",
    hostingLoginUsername: "",
    hostingLoginPassword: "",
    preferredDomain: "",
    domainExtension: ".com",
    hostingPreferences: "",
    websiteGoal: "",
    designPreferences: "",
    requiredPages: [] as string[],
    targetAudience: "",
    referenceWebsites: "",
    complexity: "NORMAL",
    additionalNotes: "",
  })

  useEffect(() => {
    const planParam = searchParams.get("plan")
    const billingParam = searchParams.get("billing")
    if (planParam && (planParam === "STARTER" || planParam === "COMPLETE")) {
      setPlan(planParam)
    }
    if (billingParam) setBillingCycle(billingParam)
    checkAuth()
  }, [searchParams])

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/web-dev-subscriptions")
      const data = await res.json()
      if (data.subscription) {
        setPlan(data.subscription.plan)
        setBillingCycle(data.subscription.billingCycle || "monthly")
        if (data.subscription.onboardingForm) {
          setSubmitted(true)
        }
      } else {
        router.push("/web-dev-plans")
      }
    } catch {
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
      if (!formData.email.trim()) newErrors.email = "Email is required"
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format"
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
      if (!formData.businessName.trim()) newErrors.businessName = "Business name is required"
    }

    if (step === 2) {
      if (!formData.websiteGoal.trim()) newErrors.websiteGoal = "Website goal is required"
      if (formData.websiteTypes.length === 0) newErrors.websiteTypes = "Select at least one platform"
    }

    if (step === 3) {
      if (plan === "STARTER") {
        if (!formData.domainName.trim()) newErrors.domainName = "Domain name is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        const data = await res.json()
        setErrors({ submit: data.error || "Failed to submit" })
      }
    } catch {
      setErrors({ submit: "Network error. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const toggleArrayField = (field: "websiteTypes" | "requiredPages", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            You're All Set! 🎉
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
            Your project details have been received. Here's what happens next:
          </p>

          <div className="space-y-4 text-left max-w-lg mx-auto mb-8">
            {[
              { icon: MessageSquare, title: "Project Review", desc: "We review your requirements within 24 hours", color: "purple" },
              { icon: Clock, title: "Discussion Call", desc: "Your PM contacts you to finalize project details", color: "blue" },
              { icon: Palette, title: "Design Phase", desc: "We create designs for your approval", color: "pink" },
              { icon: Code, title: "Development", desc: "Our team builds your website", color: "violet" },
              { icon: Rocket, title: "Launch! 🎉", desc: "Your site goes live within 3 business days", color: "green" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                <div className={`p-2 rounded-lg bg-${item.color}-100 flex-shrink-0`}>
                  <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Button
            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-8 h-12 text-base"
            onClick={() => router.push("/dashboard/web-dev")}
          >
            Track Your Progress
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Minimal Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard/web-dev" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900">WPCodingPress</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="hidden sm:inline">{plan === "STARTER" ? "Starter Plan" : "Complete Plan"}</span>
            <span className="hidden sm:inline">•</span>
            <span>{billingCycle === "annual" ? "Annual" : "Monthly"}</span>
          </div>
        </div>
      </div>

      <div className="py-8 sm:py-12 max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <Badge className="mb-3 bg-purple-100 text-purple-700 border-purple-200">
            {plan === "STARTER" ? "Starter Plan" : "Complete Plan"} • {billingCycle === "annual" ? "Annual" : "Monthly"}
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Tell Us About Your Project
          </h1>
          <p className="text-slate-500">
            Step {currentStep} of 4 — {steps[currentStep - 1].title}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8 sm:mb-12">
          <div className="flex justify-between items-center">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      currentStep > step.id
                        ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white"
                        : currentStep === step.id
                          ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white ring-4 ring-purple-200"
                          : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs mt-2 text-slate-500 hidden sm:block">{step.title}</span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      currentStep > step.id ? "bg-purple-500" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-xl shadow-purple-200/20 border border-slate-200 p-6 sm:p-8"
          >
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Your Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" value={formData.fullName} onChange={(e) => updateField("fullName", e.target.value)} placeholder="John Doe" className={errors.fullName ? "border-red-300" : ""} />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="john@example.com" className={errors.email ? "border-red-300" : ""} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">WhatsApp / Phone *</Label>
                    <Input id="phone" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+1 234 567 890" className={errors.phone ? "border-red-300" : ""} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <Label htmlFor="businessName">Business / Website Name *</Label>
                    <Input id="businessName" value={formData.businessName} onChange={(e) => updateField("businessName", e.target.value)} placeholder="My Business" className={errors.businessName ? "border-red-300" : ""} />
                    {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="currentWebsiteUrl">Current Website URL (if redesign)</Label>
                  <Input id="currentWebsiteUrl" value={formData.currentWebsiteUrl} onChange={(e) => updateField("currentWebsiteUrl", e.target.value)} placeholder="https://mycurrentsite.com" />
                </div>
              </div>
            )}

            {/* Step 2: Project Details */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Project Details</h2>

                <div>
                  <Label>Type of Website Needed *</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {websiteTypeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => toggleArrayField("websiteTypes", opt.value)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                          formData.websiteTypes.includes(opt.value)
                            ? "bg-purple-100 border-purple-300 text-purple-700"
                            : "bg-white border-slate-200 text-slate-600 hover:border-purple-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {errors.websiteTypes && <p className="text-red-500 text-xs mt-1">{errors.websiteTypes}</p>}
                </div>

                <div>
                  <Label htmlFor="websiteGoal">Website Goal / Description *</Label>
                  <Textarea
                    id="websiteGoal"
                    value={formData.websiteGoal}
                    onChange={(e) => updateField("websiteGoal", e.target.value)}
                    placeholder="Describe what you want your website to achieve, the overall look and feel, and any specific functionality you need..."
                    rows={4}
                    className={errors.websiteGoal ? "border-red-300" : ""}
                  />
                  {errors.websiteGoal && <p className="text-red-500 text-xs mt-1">{errors.websiteGoal}</p>}
                </div>

                <div>
                  <Label>Specific Pages Needed</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {pageOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => toggleArrayField("requiredPages", opt.value)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                          formData.requiredPages.includes(opt.value)
                            ? "bg-purple-100 border-purple-300 text-purple-700"
                            : "bg-white border-slate-200 text-slate-600 hover:border-purple-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="designPreferences">Design Preferences</Label>
                  <Textarea
                    id="designPreferences"
                    value={formData.designPreferences}
                    onChange={(e) => updateField("designPreferences", e.target.value)}
                    placeholder="Any specific colors, styles, or reference websites you like..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Input
                    id="targetAudience"
                    value={formData.targetAudience}
                    onChange={(e) => updateField("targetAudience", e.target.value)}
                    placeholder="Who is your website for? (e.g., small business owners, tech professionals)"
                  />
                </div>

                <div>
                  <Label htmlFor="referenceWebsites">Competitors / Reference Websites</Label>
                  <Textarea
                    id="referenceWebsites"
                    value={formData.referenceWebsites}
                    onChange={(e) => updateField("referenceWebsites", e.target.value)}
                    placeholder="List any websites you like or competitors in your industry..."
                    rows={2}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Domain & Hosting */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  {plan === "STARTER" ? "Your Domain & Hosting" : "Domain Preferences"}
                </h2>

                {plan === "STARTER" ? (
                  <>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                      <p className="text-sm text-amber-800 font-medium flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        You'll provide your existing domain and hosting details. We'll take it from there!
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="domainName">Your Domain Name *</Label>
                        <Input id="domainName" value={formData.domainName} onChange={(e) => updateField("domainName", e.target.value)} placeholder="mywebsite.com" className={errors.domainName ? "border-red-300" : ""} />
                        {errors.domainName && <p className="text-red-500 text-xs mt-1">{errors.domainName}</p>}
                      </div>
                      <div>
                        <Label htmlFor="hostingProvider">Hosting Provider</Label>
                        <Input id="hostingProvider" value={formData.hostingProvider} onChange={(e) => updateField("hostingProvider", e.target.value)} placeholder="e.g., Bluehost, SiteGround, Hostinger" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="hostingLoginUsername">cPanel / Hosting Username</Label>
                        <Input id="hostingLoginUsername" value={formData.hostingLoginUsername} onChange={(e) => updateField("hostingLoginUsername", e.target.value)} placeholder="Your hosting login username" />
                      </div>
                      <div>
                        <Label htmlFor="hostingLoginPassword">Hosting Password</Label>
                        <Input id="hostingLoginPassword" type="password" value={formData.hostingLoginPassword} onChange={(e) => updateField("hostingLoginPassword", e.target.value)} placeholder="Your hosting login password" />
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Your credentials are encrypted and stored securely
                    </p>
                  </>
                ) : (
                  <>
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
                      <p className="text-sm text-purple-800 font-medium flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        We'll handle everything! Just tell us your preferred domain name.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="preferredDomain">Preferred Domain Name</Label>
                        <Input id="preferredDomain" value={formData.preferredDomain} onChange={(e) => updateField("preferredDomain", e.target.value)} placeholder="mynewwebsite" />
                      </div>
                      <div>
                        <Label htmlFor="domainExtension">Domain Extension</Label>
                        <select
                          id="domainExtension"
                          value={formData.domainExtension}
                          onChange={(e) => updateField("domainExtension", e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm mt-1"
                        >
                          {domainExtensions.map((ext) => (
                            <option key={ext} value={ext}>{ext}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="hostingPreferences">Hosting Preferences (optional)</Label>
                      <Textarea
                        id="hostingPreferences"
                        value={formData.hostingPreferences}
                        onChange={(e) => updateField("hostingPreferences", e.target.value)}
                        placeholder="Any preferred hosting provider or specific requirements? Leave blank and we'll choose the best option."
                        rows={2}
                      />
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="complexity">Expected Launch Priority</Label>
                  <select
                    id="complexity"
                    value={formData.complexity}
                    onChange={(e) => updateField("complexity", e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm mt-1"
                  >
                    <option value="NORMAL">Normal — 3-Day Delivery</option>
                    <option value="COMPLEX">Complex Project — Let us review first</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={(e) => updateField("additionalNotes", e.target.value)}
                    placeholder="Anything else we should know about your project..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Review Your Information</h2>

                <div className="bg-slate-50 rounded-xl p-5 space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide mb-3">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-slate-500">Name:</span> <span className="font-medium text-slate-900">{formData.fullName}</span></div>
                      <div><span className="text-slate-500">Email:</span> <span className="font-medium text-slate-900">{formData.email}</span></div>
                      <div><span className="text-slate-500">Phone:</span> <span className="font-medium text-slate-900">{formData.phone}</span></div>
                      <div><span className="text-slate-500">Business:</span> <span className="font-medium text-slate-900">{formData.businessName}</span></div>
                    </div>
                  </div>
                  <div className="border-t border-slate-200 pt-4">
                    <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide mb-3">Project Details</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-slate-500">Platform:</span> <span className="font-medium text-slate-900">{formData.websiteTypes.join(", ")}</span></div>
                      <div><span className="text-slate-500">Pages:</span> <span className="font-medium text-slate-900">{formData.requiredPages.join(", ") || "None selected"}</span></div>
                      <div><span className="text-slate-500">Goal:</span> <span className="font-medium text-slate-900">{formData.websiteGoal}</span></div>
                      <div><span className="text-slate-500">Complexity:</span> <span className="font-medium text-slate-900">{formData.complexity === "NORMAL" ? "Standard (3-day)" : "Complex (review needed)"}</span></div>
                    </div>
                  </div>
                  <div className="border-t border-slate-200 pt-4">
                    <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide mb-3">Domain & Hosting</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {plan === "STARTER" ? (
                        <>
                          <div><span className="text-slate-500">Domain:</span> <span className="font-medium text-slate-900">{formData.domainName || "—"}</span></div>
                          <div><span className="text-slate-500">Hosting:</span> <span className="font-medium text-slate-900">{formData.hostingProvider || "—"}</span></div>
                        </>
                      ) : (
                        <>
                          <div><span className="text-slate-500">Preferred Domain:</span> <span className="font-medium text-slate-900">{formData.preferredDomain}{formData.domainExtension}</span></div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {errors.submit && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <p className="text-sm text-purple-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    By submitting, you agree to our Terms of Service. Your project manager will contact you within 24 hours.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={currentStep === 1 ? () => router.push("/web-dev-plans") : handlePrev}
                disabled={isSubmitting}
                className="border-slate-200"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                {currentStep === 1 ? "Back to Plans" : "Previous"}
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Project Details
                    </>
                  )}
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${className}`}>
      {children}
    </span>
  )
}
