"use client"

import { useEffect, useState } from "react"
import { FileText, Download, Eye, DollarSign, CheckCircle, Clock, X, CreditCard } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SubscriptionInvoice {
  id: string
  invoiceNumber: string
  planName: string
  billingCycle: string
  amount: number
  amountFormatted: string
  status: string
  date: string
  periodStart: string
  periodEnd: string
  gumroadSaleId: string | null
}

interface CustomOrderInvoice {
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
  notes: string | null
  bankAccountId: string | null
}

type InvoiceItem = {
  type: "subscription" | "custom"
  id: string
  number: string
  projectName: string
  amount: number
  amountFormatted: string
  status: string
  statusLabel: string
  date: string
  source: SubscriptionInvoice | CustomOrderInvoice
}

export default function ClientInvoicesPage() {
  const [subscriptionInvoices, setSubscriptionInvoices] = useState<SubscriptionInvoice[]>([])
  const [customInvoices, setCustomInvoices] = useState<CustomOrderInvoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    fetchAllInvoices()
  }, [])

  const fetchAllInvoices = async () => {
    try {
      const sessionRes = await fetch("/api/auth/session")
      const sessionData = await sessionRes.json()
      if (!sessionData?.user) {
        window.location.href = "/login"
        return
      }
      setUser(sessionData.user)

      const [subRes, customRes] = await Promise.all([
        fetch("/api/invoices"),
        fetch("/api/custom-orders"),
      ])

      if (subRes.ok) {
        const subData = await subRes.json()
        setSubscriptionInvoices(subData.invoices || [])
      }

      if (customRes.ok) {
        const allOrders = await customRes.json()
        const clientOrders = allOrders.filter(
          (o: CustomOrderInvoice) => o.clientEmail === sessionData.user.email
        )
        setCustomInvoices(clientOrders)
      }
    } catch (error) {
      console.error("Error fetching invoices:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMergedInvoices = (): InvoiceItem[] => {
    const items: InvoiceItem[] = []

    subscriptionInvoices.forEach((inv) => {
      items.push({
        type: "subscription",
        id: inv.id,
        number: inv.invoiceNumber,
        projectName: inv.planName,
        amount: inv.amount,
        amountFormatted: inv.amountFormatted,
        status: inv.status,
        statusLabel: inv.status === "paid" ? "Paid" : inv.status === "refunded" ? "Refunded" : "Unpaid",
        date: inv.date,
        source: inv,
      })
    })

    customInvoices.forEach((inv) => {
      const hasAdvance = inv.advanceAmount > 0
      let statusLabel: string
      if (!hasAdvance) {
        statusLabel = inv.remainingPaid ? "Paid" : "Unpaid"
      } else {
        statusLabel = inv.advancePaid && inv.remainingPaid ? "Paid" : inv.advancePaid ? "Partial" : "Unpaid"
      }

      items.push({
        type: "custom",
        id: inv.id,
        number: inv.id.slice(0, 8).toUpperCase(),
        projectName: inv.projectName,
        amount: inv.totalAmount / 100,
        amountFormatted: `$${(inv.totalAmount / 100).toLocaleString()}`,
        status: statusLabel.toLowerCase(),
        statusLabel,
        date: inv.createdAt,
        source: inv,
      })
    })

    items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return items
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-700 border-green-200"
      case "partial": return "bg-amber-100 text-amber-700 border-amber-200"
      case "unpaid": return "bg-red-100 text-red-700 border-red-200"
      case "refunded": return "bg-slate-100 text-slate-700 border-slate-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const handleDownloadPDF = async (item: InvoiceItem) => {
    if (isDownloading) return
    setIsDownloading(true)
    try {
      await downloadInvoicePDF(item)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF")
    } finally {
      setIsDownloading(false)
    }
  }

  const downloadInvoicePDF = async (item: InvoiceItem) => {
    if (item.type === "subscription") {
      const inv = item.source as SubscriptionInvoice
      const statusColor = inv.status === "paid" ? "#10b981" : inv.status === "refunded" ? "#64748b" : "#ef4444"
      const planIcon = inv.planName.includes("Starter") ? "⚡" : "👑"

      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${inv.invoiceNumber} - WPCodingPress</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; padding: 40px; }
    .invoice { max-width: 800px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #7c3aed, #6d28d9); padding: 32px 40px; color: white; }
    .header-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .logo-section { display: flex; align-items: center; gap: 12px; }
    .logo-icon { width: 48px; height: 48px; background: rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
    .logo-text h1 { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .logo-text p { font-size: 12px; opacity: 0.8; margin-top: 2px; }
    .status-badge { background: white; color: #7c3aed; padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .invoice-meta { display: flex; justify-content: space-between; margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.15); }
    .meta-item span { font-size: 11px; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.5px; }
    .meta-item strong { font-size: 15px; display: block; margin-top: 2px; }
    .body { padding: 40px; }
    .plan-card { background: linear-gradient(135deg, #f5f3ff, #ede9fe); border: 1px solid #ddd6fe; border-radius: 14px; padding: 24px; margin-bottom: 24px; display: flex; align-items: center; gap: 16px; }
    .plan-icon { font-size: 32px; }
    .plan-info h2 { font-size: 20px; font-weight: 700; color: #1e293b; }
    .plan-info p { font-size: 14px; color: #64748b; margin-top: 2px; }
    .amount-box { background: white; border: 2px solid #10b981; border-radius: 14px; padding: 20px; margin-bottom: 24px; }
    .amount-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; }
    .amount-row + .amount-row { border-top: 1px solid #f1f5f9; }
    .amount-label { color: #64748b; font-size: 14px; }
    .amount-value { font-size: 18px; font-weight: 700; color: #1e293b; }
    .total-row { border-top: 2px solid #e2e8f0 !important; margin-top: 8px; padding-top: 16px; }
    .total-row .amount-label { font-size: 16px; font-weight: 600; color: #1e293b; }
    .total-row .amount-value { font-size: 24px; color: #059669; }
    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 24px; }
    .detail-card { background: #f8fafc; border-radius: 10px; padding: 16px; }
    .detail-label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    .detail-value { font-size: 14px; font-weight: 600; color: #1e293b; margin-top: 4px; }
    .footer { background: #1e293b; color: white; text-align: center; padding: 24px 40px; }
    .footer h3 { font-size: 16px; margin-bottom: 4px; }
    .footer p { font-size: 12px; opacity: 0.7; }
    @media print { body { padding: 0; } .invoice { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div class="header-top">
        <div class="logo-section">
          <div class="logo-icon">W</div>
          <div class="logo-text">
            <h1>WPCodingPress</h1>
            <p>Web Development Subscription</p>
          </div>
        </div>
        <div class="status-badge">${inv.status === "paid" ? "PAID" : inv.status.toUpperCase()}</div>
      </div>
      <div class="invoice-meta">
        <div class="meta-item">
          <span>Invoice Number</span>
          <strong>${inv.invoiceNumber}</strong>
        </div>
        <div class="meta-item">
          <span>Date</span>
          <strong>${new Date(inv.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</strong>
        </div>
        <div class="meta-item">
          <span>Period</span>
          <strong>${new Date(inv.periodStart).toLocaleDateString()} - ${new Date(inv.periodEnd).toLocaleDateString()}</strong>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="plan-card">
        <div class="plan-icon">${planIcon}</div>
        <div class="plan-info">
          <h2>${inv.planName}</h2>
          <p>${inv.billingCycle} subscription</p>
        </div>
      </div>
      <div class="amount-box">
        <div class="amount-row">
          <span class="amount-label">Plan Price (${inv.billingCycle})</span>
          <span class="amount-value">${inv.amountFormatted}</span>
        </div>
        <div class="amount-row total-row">
          <span class="amount-label">Total Paid</span>
          <span class="amount-value">${inv.amountFormatted}</span>
        </div>
      </div>
      <div class="details-grid">
        <div class="detail-card">
          <div class="detail-label">Customer</div>
          <div class="detail-value">${user?.name || "—"}</div>
        </div>
        <div class="detail-card">
          <div class="detail-label">Email</div>
          <div class="detail-value">${user?.email || "—"}</div>
        </div>
        <div class="detail-card">
          <div class="detail-label">Billing Cycle</div>
          <div class="detail-value">${inv.billingCycle}</div>
        </div>
        <div class="detail-card">
          <div class="detail-label">Status</div>
          <div class="detail-value" style="color: ${statusColor}">${inv.status === "paid" ? "Active" : inv.status}</div>
        </div>
      </div>
    </div>
    <div class="footer">
      <h3>Thank You for Your Subscription! 🚀</h3>
      <p>WPCodingPress — support@wpcodingpress.com | wpcodingpress.com</p>
    </div>
  </div>
  <script>window.print()</script>
</body>
</html>`

      const win = window.open("", "_blank")
      if (win) {
        win.document.write(html)
        win.document.close()
        win.focus()
      }
    } else {
      const inv = item.source as CustomOrderInvoice
      let bankSettings = null
      if (inv.bankAccountId) {
        const bankRes = await fetch(`/api/bank-settings/${inv.bankAccountId}`)
        if (bankRes.ok) bankSettings = await bankRes.json()
      }

      const advancePercent = inv.advanceAmount > 0 ? Math.round((inv.advanceAmount / inv.totalAmount) * 100) : 0
      const remainingPercent = inv.remainingAmount > 0 ? Math.round((inv.remainingAmount / inv.totalAmount) * 100) : 0
      const isPaid = inv.advancePaid && inv.remainingPaid
      const isPartial = inv.advanceAmount > 0 && inv.advancePaid && !inv.remainingPaid

      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice #${inv.id.slice(0, 8).toUpperCase()} - WPCodingPress</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; padding: 40px; }
    .invoice { max-width: 800px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1e293b, #334155); padding: 32px 40px; color: white; }
    .header-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .logo-section { display: flex; align-items: center; gap: 12px; }
    .logo-icon { width: 48px; height: 48px; background: rgba(255,255,255,0.15); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
    .logo-text h1 { font-size: 22px; font-weight: 800; }
    .logo-text p { font-size: 12px; opacity: 0.7; }
    .status-badge { background: ${isPaid ? "#10b981" : isPartial ? "#f59e0b" : "#ef4444"}; padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: inline-block; }
    .invoice-meta { display: flex; justify-content: space-between; margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.12); }
    .meta-item span { font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.5px; }
    .meta-item strong { font-size: 15px; display: block; margin-top: 2px; }
    .body { padding: 40px; }
    .section-title { color: #7c3aed; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
    .info-item { }
    .info-label { color: #64748b; font-size: 12px; font-weight: 500; }
    .info-value { color: #1e293b; font-size: 14px; font-weight: 600; margin-top: 2px; }
    .client-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .client-name { font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 6px; }
    .client-detail { font-size: 13px; color: #64748b; margin-bottom: 2px; }
    .amount-section { background: ${isPaid ? "linear-gradient(135deg, #ecfdf5, #d1fae5)" : isPartial ? "linear-gradient(135deg, #fef3c7, #fde68a)" : "linear-gradient(135deg, #fef2f2, #fecaca)"}; border: 2px solid ${isPaid ? "#10b981" : isPartial ? "#f59e0b" : "#ef4444"}; border-radius: 14px; padding: 24px; margin-bottom: 24px; }
    .amount-main { display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 1px dashed ${isPaid ? "#6ee7b7" : isPartial ? "#fcd34d" : "#fca5a5"}; }
    .amount-main-label { font-size: 16px; font-weight: 600; color: #1e293b; }
    .amount-main-value { font-size: 28px; font-weight: 800; color: #1e293b; }
    .amount-breakdown { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
    .amount-item { display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.7); padding: 14px; border-radius: 10px; }
    .amount-item-label { font-size: 13px; color: #64748b; }
    .amount-item-value { font-size: 16px; font-weight: 700; }
    .amount-item-value.paid { color: #10b981; }
    .amount-item-value.pending { color: #ef4444; }
    .bank-section { background: linear-gradient(135deg, #ecfdf5, #d1fae5); border: 2px solid #10b981; border-radius: 14px; padding: 20px; margin-top: 16px; }
    .bank-title { color: #059669; font-size: 13px; font-weight: 700; margin-bottom: 12px; }
    .bank-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .bank-item { background: rgba(255,255,255,0.8); padding: 10px; border-radius: 8px; }
    .bank-label { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    .bank-value { font-size: 13px; font-weight: 600; color: #1e293b; margin-top: 2px; }
    .footer { background: #1e293b; color: white; text-align: center; padding: 24px 40px; }
    .footer h3 { font-size: 16px; margin-bottom: 4px; }
    .footer p { font-size: 12px; opacity: 0.7; }
    @media print { body { padding: 0; } .invoice { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div class="header-top">
        <div class="logo-section">
          <div class="logo-icon">W</div>
          <div class="logo-text">
            <h1>WPCodingPress</h1>
            <p>Custom Project Invoice</p>
          </div>
        </div>
        <div class="status-badge">${isPaid ? "PAID" : isPartial ? "PARTIAL" : "UNPAID"}</div>
      </div>
      <div class="invoice-meta">
        <div class="meta-item"><span>Invoice</span><strong>#${inv.id.slice(0, 8).toUpperCase()}</strong></div>
        <div class="meta-item"><span>Date</span><strong>${new Date(inv.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</strong></div>
        <div class="meta-item"><span>Status</span><strong style="text-transform:capitalize">${inv.status.replace("_", " ")}</strong></div>
      </div>
    </div>
    <div class="body">
      <div><div class="section-title">Project Details</div></div>
      <div class="info-grid">
        <div class="info-item"><div class="info-label">Project Name</div><div class="info-value">${inv.projectName}</div></div>
        <div class="info-item"><div class="info-label">Service Type</div><div class="info-value">${inv.serviceType || "Custom"}</div></div>
        <div class="info-item"><div class="info-label">Description</div><div class="info-value">${inv.projectDescription || "—"}</div></div>
      </div>
      <div><div class="section-title">Client</div></div>
      <div class="client-box">
        <div class="client-name">${inv.clientName}</div>
        <div class="client-detail">${inv.clientEmail}</div>
        ${inv.clientPhone ? `<div class="client-detail">${inv.clientPhone}</div>` : ""}
      </div>
      <div><div class="section-title">Payment Summary</div></div>
      <div class="amount-section">
        <div class="amount-main"><span class="amount-main-label">Total Project Cost</span><span class="amount-main-value">$${(inv.totalAmount / 100).toLocaleString()}</span></div>
        ${inv.advanceAmount > 0 ? `<div class="amount-breakdown">
          <div class="amount-item"><span class="amount-item-label">Advance (${advancePercent}%)</span><span class="amount-item-value ${inv.advancePaid ? "paid" : "pending"}">$${(inv.advanceAmount / 100).toLocaleString()} ${inv.advancePaid ? "✓" : ""}</span></div>
          <div class="amount-item"><span class="amount-item-label">Remaining (${remainingPercent}%)</span><span class="amount-item-value ${inv.remainingPaid ? "paid" : "pending"}">$${(inv.remainingAmount / 100).toLocaleString()} ${inv.remainingPaid ? "✓" : "(Due)"}</span></div>
        </div>` : `<div style="text-align:center;padding:12px;color:#64748b;font-size:13px;">Full payment after project completion</div>`}
      </div>
      ${bankSettings ? `<div class="bank-section">
        <div class="bank-title">🏦 Bank Account Information</div>
        <div class="bank-grid">
          <div class="bank-item"><div class="bank-label">Bank</div><div class="bank-value">${bankSettings.bankName}</div></div>
          <div class="bank-item"><div class="bank-label">Account Name</div><div class="bank-value">${bankSettings.accountName}</div></div>
          <div class="bank-item"><div class="bank-label">Account No.</div><div class="bank-value">${bankSettings.accountNumber}</div></div>
          ${bankSettings.swift ? `<div class="bank-item"><div class="bank-label">SWIFT</div><div class="bank-value">${bankSettings.swift}</div></div>` : ""}
        </div>
      </div>` : ""}
    </div>
    <div class="footer">
      <h3>Thank You for Your Business! 🚀</h3>
      <p>WPCodingPress — support@wpcodingpress.com | wpcodingpress.com</p>
    </div>
  </div>
  <script>window.print()</script>
</body>
</html>`

      const win = window.open("", "_blank")
      if (win) {
        win.document.write(html)
        win.document.close()
        win.focus()
      }
    }
  }

  const mergedInvoices = getMergedInvoices()
  const paid = mergedInvoices.filter((i) => i.status === "paid").length
  const unpaid = mergedInvoices.filter((i) => i.status === "unpaid").length
  const partial = mergedInvoices.filter((i) => i.status === "partial").length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-purple-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoices</h1>
          <p className="text-gray-500">View and download your invoices and receipts</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{mergedInvoices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Paid</p>
                <p className="text-2xl font-bold text-gray-900">{paid}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Partial</p>
                <p className="text-2xl font-bold text-gray-900">{partial}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Unpaid</p>
                <p className="text-2xl font-bold text-gray-900">{unpaid}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice List */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Invoice</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Project</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Amount</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Date</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mergedInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  mergedInvoices.map((item) => (
                    <tr key={`${item.type}-${item.id}`} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {item.type === "subscription" ? (
                            <CreditCard className="h-4 w-4 text-purple-500" />
                          ) : (
                            <FileText className="h-4 w-4 text-slate-500" />
                          )}
                          <span className="font-medium text-gray-900 text-sm">{item.number}</span>
                          {item.type === "subscription" && (
                            <span className="text-xs bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-medium">
                              SUB
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 text-sm">{item.projectName}</td>
                      <td className="p-4 text-gray-900 font-bold">{item.amountFormatted}</td>
                      <td className="p-4">
                        <Badge className={getStatusColor(item.status)}>
                          {item.statusLabel}
                        </Badge>
                      </td>
                      <td className="p-4 text-gray-500 text-sm">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedInvoice(item)}
                            className="text-gray-500 hover:text-purple-600 hover:bg-purple-50"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownloadPDF(item)}
                            disabled={isDownloading}
                            className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4" />
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

      {/* Invoice Detail Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedInvoice?.type === "subscription" ? (
                <CreditCard className="h-5 w-5 text-purple-600" />
              ) : (
                <FileText className="h-5 w-5 text-purple-600" />
              )}
              Invoice Details
            </DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Invoice Number</p>
                  <p className="text-lg font-bold text-gray-900">{selectedInvoice.number}</p>
                </div>
                <Badge className={getStatusColor(selectedInvoice.status)}>
                  {selectedInvoice.statusLabel}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Project</p>
                  <p className="font-medium text-gray-900">{selectedInvoice.projectName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium text-gray-900 capitalize">{selectedInvoice.type === "subscription" ? "Subscription" : "Custom Project"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium text-gray-900">{selectedInvoice.amountFormatted}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedInvoice.date).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {selectedInvoice.type === "subscription" && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <p className="text-sm text-purple-700">
                    This is a subscription invoice for the {selectedInvoice.projectName}. Your subscription is billed{" "}
                    {(selectedInvoice.source as SubscriptionInvoice).billingCycle.toLowerCase()}.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button onClick={() => handleDownloadPDF(selectedInvoice)} className="flex-1" disabled={isDownloading}>
                  <Download className="h-4 w-4 mr-2" />
                  {isDownloading ? "Generating..." : "Download PDF"}
                </Button>
                <Button variant="outline" onClick={() => setSelectedInvoice(null)}>
                  <X className="h-4 w-4 mr-2" />
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
