"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle2, ArrowRight, ArrowLeft, Loader2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const services = [
  { value: "wordpress-development", label: "WordPress Development", minPrice: 150 },
  { value: "elementor-pro", label: "Elementor Pro Design", minPrice: 100 },
  { value: "woocommerce", label: "WooCommerce Store", minPrice: 250 },
  { value: "website-redesign", label: "Website Redesign", minPrice: 200 },
]

const packages = [
  { value: "basic", label: "Basic", priceNote: "Starting from" },
  { value: "standard", label: "Standard", priceNote: "Most Popular" },
  { value: "premium", label: "Premium", priceNote: "Full Solution" },
]

function OrderForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [formData, setFormData] = useState({
    service: searchParams.get("service") || "",
    packageType: searchParams.get("package") || "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    message: ""
  })

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/session")
        const data = await res.json()
        if (data?.user?.id) {
          setUserId(data.user.id)
          setIsLoggedIn(true)
          if (data.user.name && !formData.clientName) {
            setFormData(prev => ({ ...prev, clientName: data.user.name }))
          }
          if (data.user.email && !formData.clientEmail) {
            setFormData(prev => ({ ...prev, clientEmail: data.user.email }))
          }
        }
      } catch (err) {
        console.error("Error checking session:", err)
      }
    }
    checkSession()
  }, [])

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      const payload = {
        ...formData,
        userId: userId
      }
      
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setIsComplete(true)
      } else {
        setError(data.error || "Failed to submit order. Please try again.")
      }
    } catch (err) {
      console.error("Error submitting order:", err)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
            s < step ? "bg-primary text-white" : s === step ? "bg-primary text-white" : "bg-white/10 text-muted-foreground"
          }`}>
            {s < step ? <CheckCircle2 className="h-5 w-5" /> : s}
          </div>
          {s < 3 && (
            <div className={`w-16 md:w-32 h-1 mx-2 ${s < step ? "bg-primary" : "bg-white/10"}`} />
          )}
        </div>
      ))}
    </div>
  )

  if (isComplete) {
    return (
      <div className="relative min-h-[80vh] flex items-center">
        <div className="fixed inset-0 grid-pattern pointer-events-none" />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto text-center"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Order Submitted!</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your order! We've received your request and will review it shortly. 
              You'll receive a confirmation email with next steps within 24 hours.
            </p>
            <Button onClick={() => router.push("/")}>
              Back to Home
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] opacity-20 pointer-events-none" />
      
      <section className="relative py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Start Your <span className="gradient-text">Project</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Fill out the form below and we'll get back to you within 24 hours with a custom quote.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8">
                {renderStepIndicator()}
                
                {isLoggedIn && (
                  <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2 mb-6">
                    <User className="h-4 w-4" />
                    Logged in as {formData.clientEmail}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <CardHeader className="p-0 mb-6">
                        <CardTitle className="text-xl text-white">Select a Service</CardTitle>
                      </CardHeader>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Service Type</label>
                        <Select value={formData.service} onValueChange={(v) => handleSelectChange("service", v)}>
                          <SelectTrigger className="bg-white/5 border-white/10">
                            <SelectValue placeholder="Choose a service" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem key={service.value} value={service.value}>
                                {service.label} (From ${service.minPrice})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Package Type</label>
                        <Select value={formData.packageType} onValueChange={(v) => handleSelectChange("packageType", v)}>
                          <SelectTrigger className="bg-white/5 border-white/10">
                            <SelectValue placeholder="Choose a package" />
                          </SelectTrigger>
                          <SelectContent>
                            {packages.map((pkg) => (
                              <SelectItem key={pkg.value} value={pkg.value}>
                                {pkg.label} - {pkg.priceNote}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex justify-end">
                        <Button type="button" onClick={() => setStep(2)} disabled={!formData.service || !formData.packageType}>
                          Next Step
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <CardHeader className="p-0 mb-6">
                        <CardTitle className="text-xl text-white">Your Information</CardTitle>
                      </CardHeader>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                        <Input
                          name="clientName"
                          value={formData.clientName}
                          onChange={handleInputChange}
                          placeholder="John Smith"
                          required
                          className="bg-white/5 border-white/10"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Email Address</label>
                        <Input
                          name="clientEmail"
                          type="email"
                          value={formData.clientEmail}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                          required
                          className="bg-white/5 border-white/10"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Phone Number</label>
                        <Input
                          name="clientPhone"
                          type="tel"
                          value={formData.clientPhone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 123-4567"
                          required
                          className="bg-white/5 border-white/10"
                        />
                      </div>

                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => setStep(1)}>
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                        <Button type="button" onClick={() => setStep(3)} disabled={!formData.clientName || !formData.clientEmail || !formData.clientPhone}>
                          Next Step
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <CardHeader className="p-0 mb-6">
                        <CardTitle className="text-xl text-white">Project Details</CardTitle>
                      </CardHeader>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Project Description</label>
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us about your project, requirements, and any specific features you need..."
                          required
                          className="bg-white/5 border-white/10 min-h-[150px]"
                        />
                      </div>

                      <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-white mb-3">Order Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Service:</span>
                              <span className="text-white">{services.find(s => s.value === formData.service)?.label}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Package:</span>
                              <span className="text-white capitalize">{formData.packageType}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => setStep(2)}>
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              Submit Order
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                      
                      {error && (
                        <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                          {error}
                        </div>
                      )}
                    </motion.div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

function OrderLoading() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center">
      <div className="text-primary">Loading...</div>
    </div>
  )
}

export default function OrderPage() {
  return (
    <Suspense fallback={<OrderLoading />}>
      <OrderForm />
    </Suspense>
  )
}
