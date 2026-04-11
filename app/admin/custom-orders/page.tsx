"use client"

import { useEffect, useState, useRef } from "react"
import { Plus, Eye, Trash2, Send, FileText, DollarSign, CheckCircle, Clock, XCircle, Copy, Mail, Printer, Edit2, Download } from "lucide-react"
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
  serviceType: string
  totalAmount: number
  advanceAmount: number
  remainingAmount: number
  advancePaid: boolean
  remainingPaid: boolean
  status: string
  createdAt: string
  receiptSent: boolean
  receiptSentAt: string | null
  notes: string | null
  bankAccountId: string | null
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
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<CustomOrder | null>(null)
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false)
  const [filter, setFilter] = useState("all")
  const [bankAccounts, setBankAccounts] = useState<{id: string, bankName: string, accountName: string, isActive: boolean}[]>([])
  const [selectedBankId, setSelectedBankId] = useState<string>("")
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

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchCustomOrders()
    fetchBankAccounts()
  }, [])

  const fetchBankAccounts = async () => {
    try {
      const res = await fetch("/api/bank-settings")
      if (res.ok) {
        const data = await res.json()
        const activeBanks = data.filter((b: any) => b.isActive)
        setBankAccounts(activeBanks)
        if (activeBanks.length > 0) {
          setSelectedBankId(activeBanks[0].id)
        }
      }
    } catch (error) {
      console.error("Error fetching bank accounts:", error)
    }
  }

  const fetchCustomOrders = async () => {
    try {
      const res = await fetch("/api/custom-orders")
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      } else {
        console.error("Failed to fetch orders, status:", res.status)
      }
    } catch (error) {
      console.error("Error fetching custom orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.clientName || !formData.clientEmail || !formData.totalAmount) {
      alert("Please fill in client name, email and total amount")
      return
    }

    if (formData.advanceAmount && formData.advanceAmount > formData.totalAmount) {
      alert("Advance amount cannot be greater than total amount")
      return
    }

    setIsSubmitting(true)
    const advanceAmount = formData.advanceAmount || 0
    const remainingAmount = formData.totalAmount - advanceAmount

    try {
      console.log("Submitting custom order...", { ...formData, advanceAmount, remainingAmount, bankAccountId: selectedBankId })
      
      const res = await fetch("/api/custom-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          clientPhone: formData.clientPhone,
          projectName: formData.projectName,
          projectDescription: formData.projectDescription,
          serviceType: formData.serviceType,
          totalAmount: formData.totalAmount,
          advanceAmount: advanceAmount,
          remainingAmount: remainingAmount,
          notes: formData.notes,
          bankAccountId: selectedBankId || null,
        })
      })

      console.log("Response status:", res.status)
      
      if (res.ok) {
        const data = await res.json()
        console.log("Order created successfully:", data)
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
      } else {
        const errorData = await res.json()
        console.error("Error response:", errorData)
        alert("Error: " + (errorData.error || "Failed to create order"))
      }
    } catch (error: any) {
      console.error("Error creating custom order:", error)
      alert("Failed to create order: " + error.message)
      } finally {
        setIsSubmitting(false)
      }
  }

  const handleEdit = (order: CustomOrder) => {
    setIsEditMode(true)
    setEditingOrderId(order.id)
    setFormData({
      clientName: order.clientName,
      clientEmail: order.clientEmail,
      clientPhone: order.clientPhone,
      projectName: order.projectName,
      projectDescription: order.projectDescription,
      serviceType: order.serviceType,
      totalAmount: order.totalAmount,
      advanceAmount: order.advanceAmount,
      notes: order.notes || "",
    })
    setIsDialogOpen(true)
  }

  const handleUpdateOrder = async () => {
    if (!formData.clientName || !formData.clientEmail || !formData.totalAmount) {
      alert("Please fill in client name, email and total amount")
      return
    }

    if (formData.advanceAmount && formData.advanceAmount > formData.totalAmount) {
      alert("Advance amount cannot be greater than total amount")
      return
    }

    setIsSubmitting(true)
    const advanceAmount = formData.advanceAmount || 0
    const remainingAmount = formData.totalAmount - advanceAmount

    try {
      const res = await fetch(`/api/custom-orders/${editingOrderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          clientPhone: formData.clientPhone,
          projectName: formData.projectName,
          projectDescription: formData.projectDescription,
          serviceType: formData.serviceType,
          totalAmount: formData.totalAmount,
          advanceAmount: advanceAmount,
          remainingAmount: remainingAmount,
          notes: formData.notes,
          bankAccountId: selectedBankId || null,
        })
      })

      if (res.ok) {
        setIsDialogOpen(false)
        setIsEditMode(false)
        setEditingOrderId(null)
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
      } else {
        const errorData = await res.json()
        alert("Error: " + (errorData.error || "Failed to update order"))
      }
    } catch (error: any) {
      console.error("Error updating order:", error)
      alert("Failed to update order: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const downloadPDF = async (invoice: CustomOrder) => {
    try {
      const bankRes = await fetch("/api/public/bank-settings")
      const bankSettings = await bankRes.json()

      const advancePercent = invoice.advanceAmount > 0 ? Math.round((invoice.advanceAmount / invoice.totalAmount) * 100) : 0
      const remainingPercent = invoice.remainingAmount > 0 ? Math.round((invoice.remainingAmount / invoice.totalAmount) * 100) : 0

      const receiptContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice - ${invoice.projectName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; background: #f8fafc; }
    .invoice { max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear(135deg, #7c3aed, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; color: white; text-align: center; }
    .header h1 { font-size: 28px; margin-bottom: 5px; }
    .header p { opacity: 0.9; }
    .content { padding: 30px; }
    h2 { color: #1e293b; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
    .label { color: #64748b; width: 40%; }
    .value { color: #1e293b; font-weight: 500; }
    .amount-section { background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .amount-row { display: flex; justify-content: space-between; padding: 10px 0; }
    .total { font-size: 24px; font-weight: bold; color: #1e293b; }
    .advance { color: #059669; }
    .remaining { color: ${invoice.remainingPaid ? '#059669' : '#1e293b'}; }
    .paid { color: #059669; font-weight: bold; }
    .due { color: #f59e0b; font-weight: bold; }
    .bank-section { background: #ecfdf5; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin-top: 20px; }
    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; border-top: 1px solid #e2e8f0; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
    .status-paid { background: #d1fae5; color: #059669; }
    .status-partial { background: #fef3c7; color: #d97706; }
    .status-unpaid { background: #fee2e2; color: #dc2626; }
    @media print { body { padding: 0; } .invoice { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <h1>WPCodingPress</h1>
      <p>Professional Web Development Services</p>
    </div>
    <div class="content">
      <h2>Invoice Details</h2>
      <table>
        <tr><td class="label">Invoice ID:</td><td class="value">${invoice.id.slice(0, 8).toUpperCase()}</td></tr>
        <tr><td class="label">Date:</td><td class="value">${new Date(invoice.createdAt).toLocaleDateString()}</td></tr>
        <tr><td class="label">Project:</td><td class="value">${invoice.projectName}</td></tr>
        <tr><td class="label">Service:</td><td class="value">${invoice.serviceType || 'Custom Project'}</td></tr>
        <tr><td class="label">Status:</td><td class="value">
          <span class="status-badge ${invoice.advancePaid && invoice.remainingPaid ? 'status-paid' : invoice.advancePaid ? 'status-partial' : 'status-unpaid'}">
            ${invoice.advancePaid && invoice.remainingPaid ? 'PAID' : invoice.advancePaid ? 'PARTIAL' : 'UNPAID'}
          </span>
        </td></tr>
      </table>

      <h2>Client Information</h2>
      <table>
        <tr><td class="label">Name:</td><td class="value">${invoice.clientName}</td></tr>
        <tr><td class="label">Email:</td><td class="value">${invoice.clientEmail}</td></tr>
        ${invoice.clientPhone ? `<tr><td class="label">Phone:</td><td class="value">${invoice.clientPhone}</td></tr>` : ''}
      </table>

      <div class="amount-section">
        <div class="amount-row">
          <span><strong>Total Project Cost:</strong></span>
          <span class="total">$${invoice.totalAmount}</span>
        </div>
        ${invoice.advanceAmount > 0 ? `
        <div class="amount-row">
          <span class="advance">Advance Payment (${advancePercent}%):</span>
          <span class="${invoice.advancePaid ? 'paid' : 'due'}">$${invoice.advanceAmount} ${invoice.advancePaid ? 'PAID' : 'PENDING'}</span>
        </div>
        <div class="amount-row">
          <span class="remaining">Remaining Payment (${remainingPercent}%):</span>
          <span class="${invoice.remainingPaid ? 'paid' : 'due'}">$${invoice.remainingAmount} ${invoice.remainingPaid ? 'PAID' : 'DUE'}</span>
        </div>
        ` : `
        <div class="amount-row">
          <span>Payment Terms:</span>
          <span>Full payment after completion</span>
        </div>
        `}
      </div>

      ${bankSettings ? `
      <div class="bank-section">
        <h2>Payment Details</h2>
        <p style="color: #64748b; margin-bottom: 15px;">Please make payment to:</p>
        <table>
          <tr><td class="label">Bank Name:</td><td class="value">${bankSettings.bankName}</td></tr>
          <tr><td class="label">Account Name:</td><td class="value">${bankSettings.accountName}</td></tr>
          <tr><td class="label">Account Number:</td><td class="value">${bankSettings.accountNumber}</td></tr>
          ${bankSettings.swift ? `<tr><td class="label">SWIFT:</td><td class="value">${bankSettings.swift}</td></tr>` : ''}
        </table>
        ${bankSettings.instructions ? `<p style="margin-top: 10px; font-style: italic;">${bankSettings.instructions}</p>` : ''}
      </div>
      ` : ''}

      <div class="footer">
        <p>Thank you for choosing WPCodingPress!</p>
        <p>Email: contact@wpcodingpress.com</p>
      </div>
    </div>
  </div>
  <script>window.print()</script>
</body>
</html>
      `

      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(receiptContent)
        printWindow.document.close()
        printWindow.focus()
        setTimeout(() => {
          printWindow.print()
        }, 500)
      }
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF")
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
        // Refresh selected order data
        if (selectedOrder && selectedOrder.id === id) {
          const updated = orders.find(o => o.id === id)
          if (updated) setSelectedOrder({...updated})
        }
      }
    } catch (error) {
      console.error("Error marking payment:", error)
    }
  }

  const revertPayment = async (id: string, type: "advance" | "remaining") => {
    try {
      const res = await fetch(`/api/custom-orders/${id}/revert-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type })
      })
      if (res.ok) {
        fetchCustomOrders()
        // Refresh selected order data
        if (selectedOrder && selectedOrder.id === id) {
          const updated = orders.find(o => o.id === id)
          if (updated) setSelectedOrder({...updated})
        }
      }
    } catch (error) {
      console.error("Error reverting payment:", error)
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
        <Button 
          onClick={() => {
            setIsEditMode(false)
            setEditingOrderId(null)
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
            setIsDialogOpen(true)
          }} 
          className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
        >
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
                  <th className="text-left p-4 text-sm font-semibold text-slate-600">Payment Status</th>
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
                        {(() => {
                          const hasAdvance = order.advanceAmount > 0
                          const isPaid = order.advancePaid && order.remainingPaid
                          const isPartial = hasAdvance && order.advancePaid && !order.remainingPaid && order.remainingAmount > 0
                          const isUnpaid = !order.advancePaid && !order.remainingPaid
                          
                          if (isPaid) {
                            return <Badge className="bg-green-500 text-white">Paid</Badge>
                          } else if (isPartial) {
                            return <Badge className="bg-yellow-500 text-white">Partial</Badge>
                          } else {
                            return <Badge className="bg-red-500 text-white">Unpaid</Badge>
                          }
                        })()}
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
                            onClick={() => downloadPDF(order)}
                            className="text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(order)}
                            className="text-slate-500 hover:text-violet-600 hover:bg-violet-50"
                            title="Edit Order"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedOrder(order)}
                            className="text-slate-500 hover:text-violet-600 hover:bg-violet-50"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => sendReceipt(order.id)}
                            className="text-slate-500 hover:text-green-600 hover:bg-green-50"
                            title="Send Receipt"
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

      {/* Create/Edit Order Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900 text-xl font-bold">
              {isEditMode ? "Edit Custom Order" : "Create Custom Order"}
            </DialogTitle>
            <DialogDescription className="text-slate-700 font-medium">
              {isEditMode ? "Update the order details and payment information" : "Create a custom project order with flexible advance payment"}
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
                <label className="text-sm font-bold text-green-700 mb-2 block">Advance Amount ($)</label>
                <Input 
                  type="number"
                  value={formData.advanceAmount || ""}
                  onChange={(e) => setFormData({ ...formData, advanceAmount: parseInt(e.target.value) || 0 })}
                  placeholder="Optional"
                  className="bg-green-50 border-2 border-green-300 text-green-900 font-bold text-lg placeholder:text-green-400 focus:border-green-500 focus:ring-green-200"
                />
                <p className="text-xs text-green-600 mt-1">Leave empty if no advance required</p>
              </div>
            </div>

            {formData.totalAmount > 0 && (
              <div className="bg-slate-100 border-2 border-slate-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-600">Remaining Amount</p>
                    <p className="text-2xl font-bold text-slate-900">
                      ${formData.totalAmount - (formData.advanceAmount || 0)}
                    </p>
                  </div>
                  {formData.advanceAmount > 0 ? (
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Advance Paid</p>
                      <p className="text-lg font-semibold text-green-600">
                        {Math.round((formData.advanceAmount / formData.totalAmount) * 100)}%
                      </p>
                    </div>
                  ) : (
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Advance</p>
                      <p className="text-lg font-semibold text-slate-400">No advance</p>
                    </div>
                  )}
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

            {bankAccounts.length > 0 && (
              <div>
                <label className="text-sm font-bold text-slate-900 mb-2 block">Bank Account for Invoice</label>
                <Select value={selectedBankId} onValueChange={setSelectedBankId}>
                  <SelectTrigger className="bg-white border-2 border-slate-300 text-slate-900 font-medium">
                    <SelectValue placeholder="Select bank account" />
                  </SelectTrigger>
                  <SelectContent>
                    {bankAccounts.map((bank) => (
                      <SelectItem key={bank.id} value={bank.id} className="text-slate-900">
                        {bank.bankName} - {bank.accountName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 mt-1">This bank account will be shown in the invoice sent to client</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => { 
                  setIsDialogOpen(false)
                  setIsEditMode(false)
                  setEditingOrderId(null)
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
                }} 
                className="border-2 border-slate-300 text-slate-700 font-medium hover:bg-slate-100"
              >
                Cancel
              </Button>
              <Button 
                onClick={isEditMode ? handleUpdateOrder : handleSubmit} 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 font-semibold px-6"
              >
                {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Order" : "Create Order")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900 text-xl font-bold">Order Details</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Payment Status Banner */}
              <div className={`p-4 rounded-lg border-2 ${
                selectedOrder.advancePaid && selectedOrder.remainingPaid 
                  ? "bg-green-50 border-green-300" 
                  : selectedOrder.advancePaid 
                    ? "bg-yellow-50 border-yellow-300"
                    : "bg-red-50 border-red-300"
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg">
                      Payment Status: {
                        selectedOrder.advancePaid && selectedOrder.remainingPaid 
                          ? "PAID"
                          : selectedOrder.advancePaid 
                            ? "PARTIAL"
                            : "UNPAID"
                      }
                    </p>
                    <p className="text-sm text-slate-600">
                      Total: ${selectedOrder.totalAmount} | Advance: ${selectedOrder.advanceAmount} | Remaining: ${selectedOrder.remainingAmount}
                    </p>
                  </div>
                  <Button onClick={() => downloadPDF(selectedOrder)} className="bg-blue-600 hover:bg-blue-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>

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
                <div>
                  <label className="text-sm text-slate-500">Service Type</label>
                  <p className="text-slate-900">{selectedOrder.serviceType || "Custom Project"}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Created Date</label>
                  <p className="text-slate-900">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-500">Project Description</label>
                <p className="text-slate-900 mt-1 p-3 rounded-lg bg-slate-50">
                  {selectedOrder.projectDescription || "No description"}
                </p>
              </div>

              {/* Payment Management */}
              <div className="border-2 border-slate-200 rounded-lg p-4">
                <h3 className="font-bold text-slate-900 mb-4">Payment Management</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Advance Payment (${selectedOrder.advanceAmount})</span>
                      {selectedOrder.advancePaid ? (
                        <span className="text-green-600 font-bold">PAID ✓</span>
                      ) : (
                        <span className="text-yellow-600 font-bold">PENDING</span>
                      )}
                    </div>
                    {selectedOrder.advanceAmount > 0 && (
                      <Button 
                        size="sm" 
                        variant={selectedOrder.advancePaid ? "outline" : "default"}
                        className={selectedOrder.advancePaid ? "text-red-600 border-red-300 hover:bg-red-50" : "bg-green-600 hover:bg-green-700"}
                        onClick={() => {
                          if (selectedOrder.advancePaid) {
                            revertPayment(selectedOrder.id, "advance")
                          } else {
                            markPayment(selectedOrder.id, "advance")
                          }
                        }}
                      >
                        {selectedOrder.advancePaid ? "Mark Unpaid" : "Mark Paid"}
                      </Button>
                    )}
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Remaining Payment (${selectedOrder.remainingAmount})</span>
                      {selectedOrder.remainingPaid ? (
                        <span className="text-green-600 font-bold">PAID ✓</span>
                      ) : (
                        <span className="text-yellow-600 font-bold">DUE</span>
                      )}
                    </div>
                    {selectedOrder.remainingAmount > 0 && (
                      <Button 
                        size="sm" 
                        variant={selectedOrder.remainingPaid ? "outline" : "default"}
                        className={selectedOrder.remainingPaid ? "text-red-600 border-red-300 hover:bg-red-50" : "bg-green-600 hover:bg-green-700"}
                        onClick={() => {
                          if (selectedOrder.remainingPaid) {
                            revertPayment(selectedOrder.id, "remaining")
                          } else {
                            markPayment(selectedOrder.id, "remaining")
                          }
                        }}
                      >
                        {selectedOrder.remainingPaid ? "Mark Unpaid" : "Mark Paid"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600 mb-2 block">Project Status</label>
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

              {selectedOrder.notes && (
                <div>
                  <label className="text-sm text-slate-500">Notes</label>
                  <p className="text-slate-900 mt-1 p-3 rounded-lg bg-slate-50">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <Button onClick={() => downloadPDF(selectedOrder)} variant="outline" className="border-slate-300">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button onClick={() => sendReceipt(selectedOrder.id)} className="bg-green-600 hover:bg-green-700">
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