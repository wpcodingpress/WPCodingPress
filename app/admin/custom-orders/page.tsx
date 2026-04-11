"use client"

import { useEffect, useState } from "react"
import { Plus, Eye, Trash2, Send, FileText, DollarSign, CheckCircle, Clock, XCircle, Copy, Mail, Printer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CustomOrder {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  projectName: string
  projectDescription: string
  totalAmount: number
  advanceAmount: number
  remainingAmount: number
  advancePaid: boolean
  remainingPaid: boolean
  status: string
  createdAt: string
  receiptSent: boolean
  receiptSentAt: string | null
}

const serviceTypes = [
  { value: "web_development", label: "Web Development" },
  { value: "woocommerce", label: "WooCommerce Store" },
  { value: "custom_app", label: "Custom Web Application" },
  { value: "wordpress", label: "WordPress Development" },
  { value: "nextjs", label: "Next.js Development" },
  { value: "api_integration", label: "API Integration" },
  { value: "ecommerce", label: "E-commerce Solution" },
  { value: "maintenance", label: "Website Maintenance" },
  { value: "seo", label: "SEO & Marketing" },
  { value: "ui_ux", label: "UI/UX Design" },
  { value: "other", label: "Other" },
]

export default function AdminCustomOrdersPage() {
  const [orders, setOrders] = useState<CustomOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<CustomOrder | null>(null)
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false)
  const [filter, setFilter] = useState("all")
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    projectName: "",
    projectDescription: "",
    serviceType: "",
    totalAmount: 0,
    advanceAmount: 0,
    notes: "",
  })

  useEffect(() => {
    fetchCustomOrders()
  }, [])

  const fetchCustomOrders = async () => {
    try {
      const res = await fetch("/api/custom-orders")
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Error fetching custom orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.clientName || !formData.clientEmail || !formData.totalAmount || !formData.advanceAmount) {
      alert("Please fill in client name, email, total amount and advance amount")
      return
    }

    if (formData.advanceAmount > formData.totalAmount) {
      alert("Advance amount cannot be greater than total amount")
      return
    }

    try {
      const res = await fetch("/api/custom-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          remainingAmount: formData.totalAmount - formData.advanceAmount,
        })
      })

      if (res.ok) {
        setIsDialogOpen(false)
        setFormData({
          clientName: "",
          clientEmail: "",
          clientPhone: "",
          projectName: "",
          projectDescription: "",
          serviceType: "",
          totalAmount: 0,
          advanceAmount: 0,
          notes: "",
        })
        fetchCustomOrders()
      }
    } catch (error) {
      console.error("Error creating custom order:", error)
    }
  }

  const sendReceipt = async (orderId: string) => {
    try {
      const res = await fetch(`/api/custom-orders/${orderId}/send-receipt`, {
        method: "POST"
      })
      if (res.ok) {
        alert("Receipt sent successfully!")
        fetchCustomOrders()
      } else {
        alert("Failed to send receipt")
      }
    } catch (error) {
      console.error("Error sending receipt:", error)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/custom-orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        fetchCustomOrders()
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const markPayment = async (id: string, type: "advance" | "remaining") => {
    try {
      const res = await fetch(`/api/custom-orders/${id}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type })
      })
      if (res.ok) {
        fetchCustomOrders()
      }
    } catch (error) {
      console.error("Error marking payment:", error)
    }
  }

  const deleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return
    try {
      const res = await fetch(`/api/custom-orders/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchCustomOrders()
        setSelectedOrder(null)
      }
    } catch (error) {
      console.error("Error deleting order:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
      case "in_progress": return "bg-blue-500/20 text-blue-600 border-blue-500/30"
      case "completed": return "bg-green-500/20 text-green-600 border-green-500/30"
      case "cancelled": return "bg-red-500/20 text-red-600 border-red-500/30"
      default: return "bg-slate-500/20 text-slate-600 border-slate-500/30"
    }
  }

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(o => o.status === filter)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Custom Orders</h1>
          <p className="text-slate-500">Manage custom project orders with advance payments</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          Create Custom Order
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Pending</p>
                <p className="text-2xl font-bold text-slate-900">{orders.filter(o => o.status === "pending").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">In Progress</p>
                <p className="text-2xl font-bold text-slate-900">{orders.filter(o => o.status === "in_progress").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Revenue</p>
                <p className="text-2xl font-bold text-slate-900">${orders.reduce((acc, o) => acc + (o.advancePaid ? o.advanceAmount : 0), 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Completed</p>
                <p className="text-2xl font-bold text-slate-900">{orders.filter(o => o.status === "completed").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="w-[180px] bg-white border-slate-200">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Orders</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <Card className="bg-white border-slate-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-slate-600">Client</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-600">Project</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-600">Total</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-600">Advance</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-600">Remaining</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-600">Receipt</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-600">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-600">Date</th>
                  <th className="text-right p-4 text-sm font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-500">
                      No custom orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-slate-900">{order.clientName}</p>
                          <p className="text-sm text-slate-500">{order.clientEmail}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-slate-900">{order.projectName}</p>
                          <p className="text-sm text-slate-500 truncate max-w-[150px]">{order.projectDescription}</p>
                        </div>
                      </td>
                      <td className="p-4 text-slate-900 font-medium">
                        ${order.totalAmount}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${order.advancePaid ? "text-green-600" : "text-yellow-600"}`}>
                            ${order.advanceAmount}
                          </span>
                          {order.advancePaid ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => markPayment(order.id, "advance")} className="text-xs h-6">
                              Mark Paid
                            </Button>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${order.remainingPaid ? "text-green-600" : "text-slate-500"}`}>
                            ${order.remainingAmount}
                          </span>
                          {order.remainingPaid ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : order.advancePaid ? (
                            <Button size="sm" variant="outline" onClick={() => markPayment(order.id, "remaining")} className="text-xs h-6">
                              Mark Paid
                            </Button>
                          ) : null}
                        </div>
                      </td>
                      <td className="p-4">
                        {order.receiptSent ? (
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                            Sent
                          </Badge>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => sendReceipt(order.id)} className="text-xs h-6">
                            <Send className="h-3 w-3 mr-1" />
                            Send
                          </Button>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {order.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedOrder(order)}
                            className="text-slate-500 hover:text-violet-600 hover:bg-violet-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => sendReceipt(order.id)}
                            className="text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteOrder(order.id)}
                            className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Order Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900 text-xl font-bold">Create Custom Order</DialogTitle>
            <DialogDescription className="text-slate-600">
              Create a custom project order with flexible advance payment
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-5 mt-4">
            <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-violet-700 font-medium">
                <span className="font-bold">Note:</span> Enter the total project cost and the advance amount agreed with the client. Remaining will be calculated automatically.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-900 mb-2 block">Client Name *</label>
                <Input 
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Enter client name"
                  className="bg-white border-2 border-slate-300 text-slate-900 font-medium placeholder:text-slate-400 focus:border-violet-500 focus:ring-violet-200"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-900 mb-2 block">Client Email *</label>
                <Input 
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  placeholder="client@example.com"
                  className="bg-white border-2 border-slate-300 text-slate-900 font-medium placeholder:text-slate-400 focus:border-violet-500 focus:ring-violet-200"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-900 mb-2 block">Phone Number</label>
              <Input 
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="bg-white border-2 border-slate-300 text-slate-900 font-medium placeholder:text-slate-400 focus:border-violet-500 focus:ring-violet-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-900 mb-2 block">Project Name *</label>
                <Input 
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="E-commerce Website"
                  className="bg-white border-2 border-slate-300 text-slate-900 font-medium placeholder:text-slate-400 focus:border-violet-500 focus:ring-violet-200"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-900 mb-2 block">Service Type</label>
                <Select value={formData.serviceType} onValueChange={(v) => setFormData({ ...formData, serviceType: v })}>
                  <SelectTrigger className="bg-white border-2 border-slate-300 text-slate-900 font-medium">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="text-slate-900">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-900 mb-2 block">Project Description</label>
              <Textarea 
                value={formData.projectDescription}
                onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                placeholder="Describe the project requirements in detail..."
                className="bg-white border-2 border-slate-300 text-slate-900 font-medium placeholder:text-slate-400 min-h-[100px] focus:border-violet-500 focus:ring-violet-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-900 mb-2 block">Total Project Cost ($) *</label>
                <Input 
                  type="number"
                  value={formData.totalAmount || ""}
                  onChange={(e) => setFormData({ ...formData, totalAmount: parseInt(e.target.value) || 0 })}
                  placeholder="500"
                  className="bg-white border-2 border-slate-300 text-slate-900 font-bold text-lg placeholder:text-slate-400 focus:border-violet-500 focus:ring-violet-200"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-green-700 mb-2 block">Advance Amount ($) *</label>
                <Input 
                  type="number"
                  value={formData.advanceAmount || ""}
                  onChange={(e) => setFormData({ ...formData, advanceAmount: parseInt(e.target.value) || 0 })}
                  placeholder="200"
                  className="bg-green-50 border-2 border-green-300 text-green-900 font-bold text-lg placeholder:text-green-400 focus:border-green-500 focus:ring-green-200"
                />
              </div>
            </div>

            {formData.totalAmount > 0 && formData.advanceAmount > 0 && (
              <div className="bg-slate-100 border-2 border-slate-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-600">Remaining Amount</p>
                    <p className="text-2xl font-bold text-slate-900">
                      ${formData.totalAmount - formData.advanceAmount}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Advance Paid</p>
                    <p className="text-lg font-semibold text-green-600">
                      {Math.round((formData.advanceAmount / formData.totalAmount) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-bold text-slate-900 mb-2 block">Notes</label>
              <Textarea 
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional notes for this project..."
                className="bg-white border-2 border-slate-300 text-slate-900 font-medium placeholder:text-slate-400 focus:border-violet-500 focus:ring-violet-200"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-2 border-slate-300 text-slate-700 font-medium hover:bg-slate-100">
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 font-semibold px-6">
                Create Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Order Details</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-500">Client Name</label>
                  <p className="text-slate-900 font-medium">{selectedOrder.clientName}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Email</label>
                  <p className="text-slate-900">{selectedOrder.clientEmail}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Phone</label>
                  <p className="text-slate-900">{selectedOrder.clientPhone || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Project Name</label>
                  <p className="text-slate-900">{selectedOrder.projectName}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-500">Project Description</label>
                <p className="text-slate-900 mt-1 p-3 rounded-lg bg-slate-50">
                  {selectedOrder.projectDescription || "No description"}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-slate-500">Total</p>
                  <p className="text-2xl font-bold text-slate-900">${selectedOrder.totalAmount}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-500">Advance (50%)</p>
                  <p className={`text-2xl font-bold ${selectedOrder.advancePaid ? "text-green-600" : "text-yellow-600"}`}>
                    ${selectedOrder.advanceAmount}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-500">Remaining</p>
                  <p className={`text-2xl font-bold ${selectedOrder.remainingPaid ? "text-green-600" : "text-slate-400"}`}>
                    ${selectedOrder.remainingAmount}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600 mb-2 block">Update Status</label>
                <div className="flex flex-wrap gap-2">
                  {["pending", "in_progress", "completed", "cancelled"].map((status) => (
                    <Button
                      key={status}
                      variant={selectedOrder.status === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateStatus(selectedOrder.id, status)}
                      className="capitalize"
                    >
                      {status.replace("_", " ")}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <Button onClick={() => sendReceipt(selectedOrder.id)} className="bg-blue-600 hover:bg-blue-700">
                  <Send className="h-4 w-4 mr-2" />
                  {selectedOrder.receiptSent ? "Resend Receipt" : "Send Receipt"}
                </Button>
                <Button variant="destructive" onClick={() => deleteOrder(selectedOrder.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}