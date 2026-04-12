"use client"

const formatPrice = (cents: number | undefined) => {
  if (!cents) return "$0"
  return cents > 10000 ? `$${(cents / 100).toLocaleString()}` : `$${cents}`
}

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
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadPDF = async (invoice: CustomOrder) => {
    if (isDownloading) return
    setIsDownloading(true)
    await downloadPDF(invoice)
    setIsDownloading(false)
  }

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
          totalAmount: formData.totalAmount * 100,
          advanceAmount: advanceAmount * 100,
          remainingAmount: remainingAmount * 100,
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
          totalAmount: formData.totalAmount * 100,
          advanceAmount: advanceAmount * 100,
          remainingAmount: remainingAmount * 100,
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
      let bankSettings = null
      if (invoice.bankAccountId) {
        const bankRes = await fetch(`/api/bank-settings/${invoice.bankAccountId}`)
        if (bankRes.ok) {
          bankSettings = await bankRes.json()
        }
      }
      if (!bankSettings) {
        const bankRes = await fetch("/api/public/bank-settings")
        bankSettings = await bankRes.json()
      }

      const advancePercent = invoice.advanceAmount > 0 ? Math.round((invoice.advanceAmount / invoice.totalAmount) * 100) : 0
      const remainingPercent = invoice.remainingAmount > 0 ? Math.round((invoice.remainingAmount / invoice.totalAmount) * 100) : 0
      
      const isPaid = invoice.advancePaid && invoice.remainingPaid
      const isPartial = invoice.advanceAmount > 0 && invoice.advancePaid && !invoice.remainingPaid

      const receiptContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice #${invoice.id.slice(0, 8).toUpperCase()} - WPCodingPress</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 0; background: #f8fafc; }
    .invoice { max-width: 800px; margin: 0 auto; background: white; }
    .header { 
      background: #ffffff; 
      padding: 30px 40px; 
      border-bottom: 4px solid #7c3aed;
      position: relative;
    }
    .header-content { display: flex; justify-content: space-between; align-items: flex-start; }
    .logo-section { display: flex; align-items: center; gap: 15px; }
    .logo-icon { 
      width: 60px; 
      height: 60px; 
      background: linear-gradient(135deg, #7c3aed 0%, #581c87 100%); 
      border-radius: 12px; 
      display: flex; 
      align-items: center; 
      justify-content: center;
      font-size: 28px;
      color: white;
      font-weight: bold;
    }
    .header-text h1 { 
      font-size: 26px; 
      font-weight: 800; 
      letter-spacing: -0.5px; 
      color: #1e293b;
      margin: 0;
      line-height: 1.1;
    }
    .header-text .subtitle { 
      font-size: 13px; 
      font-weight: 500;
      color: #64748b;
      margin-top: 4px;
    }
    .header-right { text-align: right; }
    .invoice-badge {
      background: #7c3aed;
      padding: 6px 16px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: white;
    }
    .invoice-info-row { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start;
      margin-top: 25px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }
    .invoice-number {
      text-align: left;
    }
    .invoice-number span { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; display: block; }
    .invoice-number strong { font-size: 18px; color: #1e293b; display: block; margin-top: 2px; font-weight: 700; }
    
    .content { padding: 40px 50px; }
    
    .section { margin-bottom: 30px; }
    .section-title {
      color: #7c3aed;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #7c3aed;
    }
    
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .info-item { }
    .info-label { color: #64748b; font-size: 12px; font-weight: 500; margin-bottom: 4px; }
    .info-value { color: #1e293b; font-size: 14px; font-weight: 600; }
    
    .client-box {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
    }
    .client-name { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
    .client-details { color: #64748b; font-size: 13px; }
    .client-details div { margin-bottom: 4px; }
    
    .amount-section { 
      background: ${isPaid ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' : isPartial ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)'};
      border: 2px solid ${isPaid ? '#10b981' : isPartial ? '#f59e0b' : '#ef4444'};
      border-radius: 16px; 
      padding: 30px; 
      margin: 25px 0;
    }
    .amount-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px dashed ${isPaid ? '#6ee7b7' : isPartial ? '#fcd34d' : '#fca5a5'};
    }
    .amount-main-label { font-size: 16px; font-weight: 600; color: #1e293b; }
    .amount-main-value { font-size: 36px; font-weight: 800; color: #1e293b; }
    
    .amount-breakdown { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .amount-item {
      background: rgba(255,255,255,0.7);
      border-radius: 10px;
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .amount-item-label { font-size: 13px; color: #64748b; }
    .amount-item-value { 
      font-size: 16px; 
      font-weight: 700; 
      color: ${isPaid ? '#059669' : '#1e293b'};
    }
    .amount-item-value.pending { color: #d97706; }
    .amount-item-value.paid { color: #059669; }
    
    .payment-terms {
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 10px;
      padding: 15px;
      text-align: center;
      color: #64748b;
      font-size: 13px;
    }
    
    .bank-section { 
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      border: 2px solid #10b981;
      border-radius: 16px; 
      padding: 25px;
      margin-top: 25px;
    }
    .bank-title { 
      color: #059669; 
      font-size: 14px; 
      font-weight: 700; 
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .bank-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .bank-item { background: rgba(255,255,255,0.8); border-radius: 8px; padding: 12px; }
    .bank-label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    .bank-value { font-size: 14px; font-weight: 600; color: #1e293b; margin-top: 2px; }
    
    .footer { 
      background: #1e293b; 
      color: white; 
      padding: 30px 50px;
      text-align: center;
    }
    .footer-title { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
    .footer-subtitle { font-size: 13px; opacity: 0.7; margin-bottom: 20px; }
    .footer-contact { font-size: 12px; opacity: 0.6; }
    
    .watermark {
      position: fixed;
      bottom: 20px;
      right: 20px;
      opacity: 0.1;
      font-size: 10px;
      color: #7c3aed;
    }
    
    @media print { 
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .invoice { box-shadow: none; }
      .watermark { display: none; }
    }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-icon">W</div>
          <div class="header-text">
            <h1>WPCodingPress</h1>
            <p class="subtitle">Professional Web Development & Digital Solutions</p>
          </div>
        </div>
        <div class="header-right">
          <div class="invoice-badge">
            ${isPaid ? 'PAID' : isPartial ? 'PARTIAL' : 'UNPAID'}
          </div>
        </div>
      </div>
      <div class="invoice-info-row">
        <div class="invoice-number">
          <span>Invoice Number</span>
          <strong>#${invoice.id.slice(0, 8).toUpperCase()}</strong>
        </div>
      </div>
    </div>
    
    <div class="content">
      <div class="section">
        <div class="section-title">Project Details</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Project Name</div>
            <div class="info-value">${invoice.projectName}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Service Type</div>
            <div class="info-value">${invoice.serviceType || 'Custom Project'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Invoice Date</div>
            <div class="info-value">${new Date(invoice.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Project Status</div>
            <div class="info-value" style="text-transform: capitalize;">${invoice.status.replace('_', ' ')}</div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Client Information</div>
        <div class="client-box">
          <div class="client-name">${invoice.clientName}</div>
          <div class="client-details">
            <div>📧 ${invoice.clientEmail}</div>
            ${invoice.clientPhone ? `<div>📞 ${invoice.clientPhone}</div>` : ''}
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Payment Summary</div>
        <div class="amount-section">
          <div class="amount-main">
            <span class="amount-main-label">Total Project Cost</span>
            <span class="amount-main-value">$${(invoice.totalAmount / 100).toLocaleString()}</span>
          </div>
          
          ${invoice.advanceAmount > 0 ? `
          <div class="amount-breakdown">
            <div class="amount-item">
              <span class="amount-item-label">Advance (${advancePercent}%)</span>
              <span class="amount-item-value ${invoice.advancePaid ? 'paid' : 'pending'}">
                $${invoice.advanceAmount.toLocaleString()} ${invoice.advancePaid ? '✓' : ''}
              </span>
            </div>
            <div class="amount-item">
              <span class="amount-item-label">Remaining (${remainingPercent}%)</span>
              <span class="amount-item-value ${invoice.remainingPaid ? 'paid' : 'pending'}">
                $${invoice.remainingAmount.toLocaleString()} ${invoice.remainingPaid ? '✓' : '(Due)'}
              </span>
            </div>
          </div>
          ` : `
          <div class="payment-terms">
            💰 Payment terms: Full payment after project completion
          </div>
          `}
        </div>
      </div>
      
      ${bankSettings ? `
      <div class="section">
        <div class="section-title">Payment Details</div>
        <div class="bank-section">
          <div class="bank-title">🏦 Bank Account Information</div>
          <div class="bank-grid">
            <div class="bank-item">
              <div class="bank-label">Bank Name</div>
              <div class="bank-value">${bankSettings.bankName}</div>
            </div>
            <div class="bank-item">
              <div class="bank-label">Account Name</div>
              <div class="bank-value">${bankSettings.accountName}</div>
            </div>
            <div class="bank-item">
              <div class="bank-label">Account Number</div>
              <div class="bank-value">${bankSettings.accountNumber}</div>
            </div>
            ${bankSettings.swift ? `
            <div class="bank-item">
              <div class="bank-label">SWIFT Code</div>
              <div class="bank-value">${bankSettings.swift}</div>
            </div>
            ` : ''}
          </div>
          ${bankSettings.instructions ? `<p style="margin-top: 15px; font-size: 12px; color: #059669; font-style: italic;">${bankSettings.instructions}</p>` : ''}
        </div>
      </div>
      ` : ''}
    </div>
    
    <div class="footer">
      <div class="footer-title">Thank You for Your Business! 🚀</div>
      <div class="footer-subtitle">We appreciate your trust in WPCodingPress</div>
      <div class="footer-contact">
        📧 contact@wpcodingpress.com | 🌐 wpcodingpress.com
      </div>
    </div>
  </div>
  <div class="watermark">Generated by WPCodingPress</div>
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
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Unpaid</p>
                <p className="text-2xl font-bold text-slate-900">
                  {orders.filter(o => {
                    const hasAdvance = o.advanceAmount > 0
                    return !o.advancePaid && !o.remainingPaid
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Partial</p>
                <p className="text-2xl font-bold text-slate-900">
                  {orders.filter(o => {
                    const hasAdvance = o.advanceAmount > 0
                    return hasAdvance && o.advancePaid && !o.remainingPaid
                  }).length}
                </p>
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
                <p className="text-sm text-slate-500">Paid</p>
                <p className="text-2xl font-bold text-slate-900">
                  {orders.filter(o => {
                    return o.advancePaid && o.remainingPaid
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-900">
                  ${orders.reduce((acc, o) => {
                    const advancePaid = o.advancePaid === true
                    const remainingPaid = o.remainingPaid === true
                    return acc + (advancePaid ? Number(o.advanceAmount) : 0) + (remainingPaid ? Number(o.remainingAmount) : 0)
                  }, 0).toLocaleString()}
                </p>
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
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${order.advancePaid ? "text-green-600" : "text-yellow-600"}`}>
                            {formatPrice(order.advanceAmount)}
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
                      ${(formData.totalAmount - (formData.advanceAmount || 0))}
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
              <div className={`p-5 rounded-lg border-2 ${
                selectedOrder.advancePaid && selectedOrder.remainingPaid 
                  ? "bg-green-100 border-green-400" 
                  : selectedOrder.advancePaid && selectedOrder.advanceAmount > 0
                    ? "bg-yellow-100 border-yellow-400"
                    : "bg-red-100 border-red-400"
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-bold text-2xl ${
                      selectedOrder.advancePaid && selectedOrder.remainingPaid 
                        ? "text-green-800" 
                        : selectedOrder.advancePaid && selectedOrder.advanceAmount > 0
                          ? "text-yellow-800"
                          : "text-red-800"
                    }`}>
                      {selectedOrder.advancePaid && selectedOrder.remainingPaid 
                        ? "✓ PAYMENT COMPLETE"
                        : selectedOrder.advancePaid && selectedOrder.advanceAmount > 0
                          ? "⚠ PARTIAL PAYMENT"
                          : "✕ UNPAID"
                      }
                    </p>
                    <p className="text-base font-semibold text-slate-800 mt-2">
                      Total Project Cost: <span className="font-bold text-xl">{formatPrice(selectedOrder.totalAmount)}</span>
                    </p>
                    {selectedOrder.advanceAmount > 0 && (
                      <p className="text-sm text-slate-700 mt-1">
                        Advance: ${selectedOrder.advanceAmount} | Remaining: ${selectedOrder.remainingAmount}
                      </p>
                    )}
                  </div>
                  <Button 
                    onClick={() => handleDownloadPDF(selectedOrder)} 
                    disabled={isDownloading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 disabled:opacity-50"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    {isDownloading ? "Generating..." : "Download Invoice"}
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
              <div className="border-2 border-slate-300 rounded-lg p-5 bg-slate-50">
                <h3 className="font-bold text-slate-900 text-lg mb-4">💰 Payment Management</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-slate-800">Advance Payment</span>
                      <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                        selectedOrder.advancePaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        ${selectedOrder.advanceAmount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${selectedOrder.advancePaid ? "text-green-600" : "text-yellow-600"}`}>
                        {selectedOrder.advancePaid ? "✓ PAID" : "⏳ PENDING"}
                      </span>
                      {selectedOrder.advanceAmount > 0 && (
                        <Button 
                          size="sm" 
                          variant={selectedOrder.advancePaid ? "outline" : "default"}
                          className={selectedOrder.advancePaid 
                            ? "text-red-600 border-red-300 hover:bg-red-50 font-semibold" 
                            : "bg-green-600 hover:bg-green-700 text-white font-semibold"
                          }
                          onClick={() => {
                            if (selectedOrder.advancePaid) {
                              revertPayment(selectedOrder.id, "advance")
                            } else {
                              markPayment(selectedOrder.id, "advance")
                            }
                          }}
                        >
                          {selectedOrder.advancePaid ? "↩ Undo" : "✓ Mark Paid"}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-slate-800">Remaining Payment</span>
                      <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                        selectedOrder.remainingPaid ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}>
                        ${selectedOrder.remainingAmount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${selectedOrder.remainingPaid ? "text-green-600" : "text-slate-500"}`}>
                        {selectedOrder.remainingPaid ? "✓ PAID" : "⏳ DUE"}
                      </span>
                      {selectedOrder.remainingAmount > 0 && selectedOrder.advancePaid && (
                        <Button 
                          size="sm" 
                          variant={selectedOrder.remainingPaid ? "outline" : "default"}
                          className={selectedOrder.remainingPaid 
                            ? "text-red-600 border-red-300 hover:bg-red-50 font-semibold" 
                            : "bg-green-600 hover:bg-green-700 text-white font-semibold"
                          }
                          onClick={() => {
                            if (selectedOrder.remainingPaid) {
                              revertPayment(selectedOrder.id, "remaining")
                            } else {
                              markPayment(selectedOrder.id, "remaining")
                            }
                          }}
                        >
                          {selectedOrder.remainingPaid ? "↩ Undo" : "✓ Mark Paid"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-base font-bold text-slate-800 mb-3 block">📋 Project Status</label>
                <div className="flex flex-wrap gap-2">
                  {["pending", "in_progress", "completed", "cancelled"].map((status) => (
                    <Button
                      key={status}
                      variant={selectedOrder.status === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateStatus(selectedOrder.id, status)}
                      className="capitalize font-semibold"
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

              <div className="flex gap-3 pt-4 border-t border-slate-300">
                <Button onClick={() => handleDownloadPDF(selectedOrder)} variant="outline" className="border-slate-300 font-semibold">
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