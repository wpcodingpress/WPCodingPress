"use client"

import { useEffect, useState } from "react"
import { Eye, Send, Download, DollarSign, CheckCircle, Clock, FileText, Edit2, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Invoice {
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

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/custom-orders")
      if (res.ok) {
        const data = await res.json()
        setInvoices(data)
      }
    } catch (error) {
      console.error("Error fetching invoices:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendReceipt = async (id: string) => {
    try {
      const res = await fetch(`/api/custom-orders/${id}/send-receipt`, {
        method: "POST"
      })
      if (res.ok) {
        alert("Receipt sent successfully!")
        fetchInvoices()
      } else {
        alert("Failed to send receipt")
      }
    } catch (error) {
      console.error("Error sending receipt:", error)
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
        fetchInvoices()
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
        fetchInvoices()
      }
    } catch (error) {
      console.error("Error reverting payment:", error)
    }
  }

  const deleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return
    try {
      const res = await fetch(`/api/custom-orders/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchInvoices()
        setSelectedInvoice(null)
      }
    } catch (error) {
      console.error("Error deleting invoice:", error)
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
        fetchInvoices()
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const handleDownloadPDF = async (invoice: Invoice) => {
    if (isDownloading) return
    setIsDownloading(true)
    await downloadPDF(invoice)
    setIsDownloading(false)
  }

  const downloadPDF = async (invoice: Invoice) => {
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
      background: ${isPaid ? '#10b981' : isPartial ? '#f59e0b' : '#ef4444'};
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
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #ede9fe;
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
                $${(invoice.advanceAmount / 100).toLocaleString()} ${invoice.advancePaid ? '✓' : ''}
              </span>
            </div>
            <div class="amount-item">
              <span class="amount-item-label">Remaining (${remainingPercent}%)</span>
              <span class="amount-item-value ${invoice.remainingPaid ? 'paid' : 'pending'}">
                $${(invoice.remainingAmount / 100).toLocaleString()} ${invoice.remainingPaid ? '✓' : '(Due)'}
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

  const getPaymentStatus = (invoice: Invoice) => {
    const hasAdvance = invoice.advanceAmount > 0
    if (!hasAdvance) {
      if (!invoice.advancePaid && !invoice.remainingPaid) return { status: "unpaid", label: "Unpaid", color: "bg-red-500" }
      if (invoice.remainingPaid) return { status: "paid", label: "Paid", color: "bg-green-500" }
      return { status: "unpaid", label: "Unpaid", color: "bg-red-500" }
    }
    if (invoice.advancePaid && invoice.remainingPaid) return { status: "paid", label: "Paid", color: "bg-green-500" }
    if (invoice.advancePaid && !invoice.remainingPaid) return { status: "partial", label: "Partial", color: "bg-yellow-500" }
    return { status: "unpaid", label: "Unpaid", color: "bg-red-500" }
  }

  const filteredInvoices = filter === "all" 
    ? invoices 
    : invoices.filter(i => {
        const paymentStatus = getPaymentStatus(i)
        return paymentStatus.status === filter
      })

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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Invoices & Receipts</h1>
          <p className="text-slate-500">Manage all invoices and send receipts to clients</p>
        </div>
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
                  {invoices.filter(i => getPaymentStatus(i).status === "unpaid").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Partial</p>
                <p className="text-2xl font-bold text-slate-900">
                  {invoices.filter(i => getPaymentStatus(i).status === "partial").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Paid</p>
                <p className="text-2xl font-bold text-slate-900">
                  {invoices.filter(i => getPaymentStatus(i).status === "paid").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-900">
                  ${(invoices.reduce((acc, i) => acc + (i.advancePaid ? i.advanceAmount : 0) + (i.remainingPaid ? i.remainingAmount : 0), 0) / 100).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="w-[180px] bg-white border-slate-200">
          <SelectValue placeholder="Filter by payment" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Invoices</SelectItem>
          <SelectItem value="unpaid">Unpaid</SelectItem>
          <SelectItem value="partial">Partial</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
        </SelectContent>
      </Select>

      <Card className="bg-white border-slate-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-slate-600">Invoice</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-600">Client</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-600">Project</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-600">Amount</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-600">Advance</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-600">Remaining</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-600">Payment</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-600">Receipt</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-600">Date</th>
                  <th className="text-right p-4 text-sm font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-slate-500">
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => {
                    const paymentStatus = getPaymentStatus(invoice)
                    return (
                      <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-purple-500" />
                            <span className="font-medium text-slate-900">{invoice.id.slice(0, 8).toUpperCase()}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-slate-900">{invoice.clientName}</p>
                            <p className="text-sm text-slate-500">{invoice.clientEmail}</p>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600">
                          {invoice.projectName}
                        </td>
                        <td className="p-4 text-slate-900 font-bold">
                          ${(invoice.totalAmount / 100).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${invoice.advancePaid ? "text-green-600" : "text-yellow-600"}`}>
                              ${(invoice.advanceAmount / 100).toLocaleString()}
                            </span>
                            {invoice.advancePaid ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : invoice.advanceAmount > 0 ? (
                              <Button size="sm" variant="outline" onClick={() => markPayment(invoice.id, "advance")} className="text-xs h-6">
                                Mark
                              </Button>
                            ) : null}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${invoice.remainingPaid ? "text-green-600" : "text-slate-500"}`}>
                              ${(invoice.remainingAmount / 100).toLocaleString()}
                            </span>
                            {invoice.remainingPaid ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : invoice.remainingAmount > 0 ? (
                              <Button size="sm" variant="outline" onClick={() => markPayment(invoice.id, "remaining")} className="text-xs h-6">
                                Mark
                              </Button>
                            ) : null}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={`${paymentStatus.color} text-white`}>
                            {paymentStatus.label}
                          </Badge>
                        </td>
                        <td className="p-4">
                          {invoice.receiptSent ? (
                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                              Sent
                            </Badge>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => sendReceipt(invoice.id)} className="text-xs h-6">
                              <Send className="h-3 w-3 mr-1" />
                              Send
                            </Button>
                          )}
                        </td>
                        <td className="p-4 text-slate-500 text-sm">
                          {new Date(invoice.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedInvoice(invoice)}
                              className="text-slate-500 hover:text-violet-600 hover:bg-violet-50"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownloadPDF(invoice)}
                              className="text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => sendReceipt(invoice.id)}
                              className="text-slate-500 hover:text-green-600 hover:bg-green-50"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteOrder(invoice.id)}
                              className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Detail Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900 text-xl font-bold">
              Invoice - {selectedInvoice?.id.slice(0, 8).toUpperCase()}
            </DialogTitle>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-6">
              <div className={`p-5 rounded-lg border-2 ${
                selectedInvoice.advancePaid && selectedInvoice.remainingPaid 
                  ? "bg-green-100 border-green-400" 
                  : selectedInvoice.advancePaid && selectedInvoice.advanceAmount > 0
                    ? "bg-yellow-100 border-yellow-400"
                    : "bg-red-100 border-red-400"
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-bold text-2xl ${
                      selectedInvoice.advancePaid && selectedInvoice.remainingPaid 
                        ? "text-green-800" 
                        : selectedInvoice.advancePaid && selectedInvoice.advanceAmount > 0
                          ? "text-yellow-800"
                          : "text-red-800"
                    }`}>
                      {selectedInvoice.advancePaid && selectedInvoice.remainingPaid 
                        ? "✓ PAYMENT COMPLETE"
                        : selectedInvoice.advancePaid && selectedInvoice.advanceAmount > 0
                          ? "⚠ PARTIAL PAYMENT"
                          : "✕ UNPAID"
                      }
                    </p>
                    <p className="text-base font-semibold text-slate-800 mt-2">
                      Total Project Cost: <span className="font-bold text-xl">${(selectedInvoice.totalAmount / 100).toLocaleString()}</span>
                    </p>
                    {selectedInvoice.advanceAmount > 0 && (
                      <p className="text-sm text-slate-700 mt-1">
                        Advance: ${(selectedInvoice.advanceAmount / 100).toLocaleString()} | Remaining: ${(selectedInvoice.remainingAmount / 100).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Button 
                    onClick={() => handleDownloadPDF(selectedInvoice)} 
                    disabled={isDownloading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    {isDownloading ? "Generating..." : "Download Invoice"}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-500">Client Name</label>
                  <p className="text-slate-900 font-medium">{selectedInvoice.clientName}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Email</label>
                  <p className="text-slate-900">{selectedInvoice.clientEmail}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Phone</label>
                  <p className="text-slate-900">{selectedInvoice.clientPhone || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Project Name</label>
                  <p className="text-slate-900">{selectedInvoice.projectName}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Service Type</label>
                  <p className="text-slate-900">{selectedInvoice.serviceType || "Custom Project"}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Created Date</label>
                  <p className="text-slate-900">{new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-500">Project Description</label>
                <p className="text-slate-900 mt-1 p-3 rounded-lg bg-slate-50">
                  {selectedInvoice.projectDescription || "No description"}
                </p>
              </div>

              <div className="border-2 border-slate-300 rounded-lg p-5 bg-slate-50">
                <h3 className="font-bold text-slate-900 text-lg mb-4">💰 Payment Management</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-slate-800">Advance Payment</span>
                      <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                        selectedInvoice.advancePaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        ${(selectedInvoice.advanceAmount / 100).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${selectedInvoice.advancePaid ? "text-green-600" : "text-yellow-600"}`}>
                        {selectedInvoice.advancePaid ? "✓ PAID" : "⏳ PENDING"}
                      </span>
                      {selectedInvoice.advanceAmount > 0 && (
                        <Button 
                          size="sm" 
                          variant={selectedInvoice.advancePaid ? "outline" : "default"}
                          className={selectedInvoice.advancePaid 
                            ? "text-red-600 border-red-300 hover:bg-red-50 font-semibold" 
                            : "bg-green-600 hover:bg-green-700 text-white font-semibold"
                          }
                          onClick={() => {
                            if (selectedInvoice.advancePaid) {
                              revertPayment(selectedInvoice.id, "advance")
                            } else {
                              markPayment(selectedInvoice.id, "advance")
                            }
                          }}
                        >
                          {selectedInvoice.advancePaid ? "↩ Undo" : "✓ Mark Paid"}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-slate-800">Remaining Payment</span>
                      <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                        selectedInvoice.remainingPaid ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}>
                        ${(selectedInvoice.remainingAmount / 100).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${selectedInvoice.remainingPaid ? "text-green-600" : "text-slate-500"}`}>
                        {selectedInvoice.remainingPaid ? "✓ PAID" : "⏳ DUE"}
                      </span>
                      {selectedInvoice.remainingAmount > 0 && selectedInvoice.advancePaid && (
                        <Button 
                          size="sm" 
                          variant={selectedInvoice.remainingPaid ? "outline" : "default"}
                          className={selectedInvoice.remainingPaid 
                            ? "text-red-600 border-red-300 hover:bg-red-50 font-semibold" 
                            : "bg-green-600 hover:bg-green-700 text-white font-semibold"
                          }
                          onClick={() => {
                            if (selectedInvoice.remainingPaid) {
                              revertPayment(selectedInvoice.id, "remaining")
                            } else {
                              markPayment(selectedInvoice.id, "remaining")
                            }
                          }}
                        >
                          {selectedInvoice.remainingPaid ? "↩ Undo" : "✓ Mark Paid"}
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
                      variant={selectedInvoice.status === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateStatus(selectedInvoice.id, status)}
                      className="capitalize font-semibold"
                    >
                      {status.replace("_", " ")}
                    </Button>
                  ))}
                </div>
              </div>

              {selectedInvoice.notes && (
                <div>
                  <label className="text-sm text-slate-500">Notes</label>
                  <p className="text-slate-900 mt-1 p-3 rounded-lg bg-slate-50">
                    {selectedInvoice.notes}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-300">
                <Button onClick={() => handleDownloadPDF(selectedInvoice)} variant="outline" className="border-slate-300 font-semibold">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button onClick={() => sendReceipt(selectedInvoice.id)} className="bg-green-600 hover:bg-green-700">
                  <Send className="h-4 w-4 mr-2" />
                  {selectedInvoice.receiptSent ? "Resend Receipt" : "Send Receipt"}
                </Button>
                <Button variant="destructive" onClick={() => deleteOrder(selectedInvoice.id)}>
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