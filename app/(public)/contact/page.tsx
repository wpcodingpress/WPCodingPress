"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare, Headphones, Zap, FileText, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Service {
  id: string
  name: string
  slug: string
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [formType, setFormType] = useState<"query" | "order">("query")
  const [queryForm, setQueryForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })
  const [orderForm, setOrderForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    projectName: "",
    projectDescription: "",
    budget: ""
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/public/services")
      if (res.ok) {
        const data = await res.json()
        setServices(data)
      }
    } catch (error) {
      console.error("Error fetching services:", error)
    }
  }

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(queryForm)
      })
      
      if (response.ok) {
        setIsSubmitted(true)
        setQueryForm({ name: "", email: "", phone: "", subject: "", message: "" })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...orderForm,
          service: orderForm.service,
          message: `Project: ${orderForm.projectName}\n\n${orderForm.projectDescription}\n\nBudget: ${orderForm.budget}`
        })
      })
      
      if (response.ok) {
        setIsSubmitted(true)
        setOrderForm({ name: "", email: "", phone: "", service: "", projectName: "", projectDescription: "", budget: "" })
      }
    } catch (error) {
      console.error("Error submitting order:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      value: "support@wpcodingpress.com",
      href: "mailto:support@wpcodingpress.com",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Clock,
      title: "Support Hours",
      value: "24/7 Available",
      href: "mailto:support@wpcodingpress.com",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Headphones,
      title: "Priority Support",
      value: "Instant Response",
      href: "#",
      color: "from-green-500 to-emerald-500"
    }
  ]

  return (
    <div className="relative">
      <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-violet-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              Get In <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600">
              Have a project in mind? We'd love to hear about it. Let's discuss how we can help bring your vision to life.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white border-slate-200 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl" />
                
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">How can we help?</h2>
                      <p className="text-slate-500 text-sm">Choose an option below</p>
                    </div>
                  </div>

                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {formType === "order" ? "Order Submitted!" : "Message Sent!"}
                      </h3>
                      <p className="text-slate-400">
                        Thank you! We'll get back to you within 24 hours.
                      </p>
                      <Button 
                        onClick={() => setIsSubmitted(false)}
                        className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600"
                      >
                        Send Another
                      </Button>
                    </div>
                  ) : (
                    <Tabs value={formType} onValueChange={(v) => setFormType(v as "query" | "order")}>
                      <TabsList className="grid grid-cols-2 bg-slate-800 mb-6">
                        <TabsTrigger value="query" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Send Query
                        </TabsTrigger>
                        <TabsTrigger value="order" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                          <FileText className="w-4 h-4 mr-2" />
                          Start Project
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="query">
                        <form onSubmit={handleQuerySubmit} className="space-y-5">
                          <div className="grid md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">Your Name *</label>
                              <Input
                                name="name"
                                value={queryForm.name}
                                onChange={(e) => setQueryForm({ ...queryForm, name: e.target.value })}
                                placeholder="John Smith"
                                required
                                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address *</label>
                              <Input
                                name="email"
                                type="email"
                                value={queryForm.email}
                                onChange={(e) => setQueryForm({ ...queryForm, email: e.target.value })}
                                placeholder="john@example.com"
                                required
                                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                              <Input
                                name="phone"
                                type="tel"
                                value={queryForm.phone}
                                onChange={(e) => setQueryForm({ ...queryForm, phone: e.target.value })}
                                placeholder="+880 1XXX XXXXXX"
                                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">Subject *</label>
                              <Select value={queryForm.subject} onValueChange={(v) => setQueryForm({ ...queryForm, subject: v })}>
                                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                                  <SelectValue placeholder="Select subject" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="general">General Inquiry</SelectItem>
                                  <SelectItem value="quote">Get a Quote</SelectItem>
                                  <SelectItem value="support">Technical Support</SelectItem>
                                  <SelectItem value="partnership">Partnership</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Your Message *</label>
                            <Textarea
                              name="message"
                              value={queryForm.message}
                              onChange={(e) => setQueryForm({ ...queryForm, message: e.target.value })}
                              placeholder="Tell us about your project or question..."
                              required
                              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 min-h-[150px] focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/25"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              "Sending..."
                            ) : (
                              <>
                                Send Message
                                <Send className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </form>
                      </TabsContent>

                      <TabsContent value="order">
                        <form onSubmit={handleOrderSubmit} className="space-y-5">
                          <div className="grid md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">Your Name *</label>
                              <Input
                                name="name"
                                value={orderForm.name}
                                onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                                placeholder="John Smith"
                                required
                                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address *</label>
                              <Input
                                name="email"
                                type="email"
                                value={orderForm.email}
                                onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                                placeholder="john@example.com"
                                required
                                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                              <Input
                                name="phone"
                                type="tel"
                                value={orderForm.phone}
                                onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                                placeholder="+880 1XXX XXXXXX"
                                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">Service Type *</label>
                              <Select value={orderForm.service} onValueChange={(v) => setOrderForm({ ...orderForm, service: v })}>
                                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                                  <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                                <SelectContent>
                                  {services.map((service) => (
                                    <SelectItem key={service.id} value={service.slug}>
                                      {service.name}
                                    </SelectItem>
                                  ))}
                                  <SelectItem value="custom">Custom Project</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Project Name *</label>
                            <Input
                              name="projectName"
                              value={orderForm.projectName}
                              onChange={(e) => setOrderForm({ ...orderForm, projectName: e.target.value })}
                              placeholder="My Awesome Project"
                              required
                              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Project Description *</label>
                            <Textarea
                              name="projectDescription"
                              value={orderForm.projectDescription}
                              onChange={(e) => setOrderForm({ ...orderForm, projectDescription: e.target.value })}
                              placeholder="Describe your project requirements in detail..."
                              required
                              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 min-h-[120px] focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Estimated Budget</label>
                            <Select value={orderForm.budget} onValueChange={(v) => setOrderForm({ ...orderForm, budget: v })}>
                              <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                                <SelectValue placeholder="Select budget range" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="under_500">Under $500</SelectItem>
                                <SelectItem value="500_1000">$500 - $1,000</SelectItem>
                                <SelectItem value="1000_2500">$1,000 - $2,500</SelectItem>
                                <SelectItem value="2500_5000">$2,500 - $5,000</SelectItem>
                                <SelectItem value="5000_plus">$5,000+</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-500/25"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              "Submitting..."
                            ) : (
                              <>
                                Submit Project Request
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </form>
                      </TabsContent>
                    </Tabs>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-5"
            >
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-slate-900/50 border-slate-700/50 hover:border-slate-500 transition-colors">
                    <CardContent className="p-5">
                      <a href={info.href} className="flex items-start gap-4 group">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                          <info.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">{info.title}</h3>
                          <p className="text-slate-400 group-hover:text-slate-300 transition-colors">{info.value}</p>
                        </div>
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <Headphones className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">24/7 Priority Support</h3>
                        <p className="text-sm text-slate-400">Get instant support for urgent issues</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                        <Zap className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">Quick Response Time</h3>
                        <p className="text-sm text-slate-400">Average response within 2 hours</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}