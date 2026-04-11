"use client"

import { useEffect, useState } from "react"
import { FileText, Download, Eye, DollarSign, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
  notes: string | null
  bankAccountId: string | null
}

interface UserType {
  id: string;
  name: string;
  email: string;
}

export default function ClientInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<UserType | null>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    fetchUserAndInvoices()
  }, [])

  const fetchUserAndInvoices = async () => {
    try {
      const sessionRes = await fetch("/api/auth/session")
      const sessionData = await sessionRes.json()
      
      if (!sessionData?.user) {
        window.location.href = "/login"
        return
      }
      
      setUser(sessionData.user)

      const res = await fetch("/api/custom-orders")
      if (res.ok) {
        const allOrders = await res.json()
        const clientOrders = allOrders.filter((o: Invoice) => o.clientEmail === sessionData.user.email)
        setInvoices(clientOrders)
      }
    } catch (error) {
      console.error("Error fetching invoices:", error)
    } finally {
      setIsLoading(false)
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
      background: linear(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%); 
      padding: 40px 50px; 
      color: white; 
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 400px;
      height: 400px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
    }
    .header::after {
      content: '';
      position: absolute;
      bottom: -30%;
      left: -10%;
      width: 300px;
      height: 300px;
      background: rgba(255,255,255,0.05);
      border-radius: 50%;
    }
    .header-content { position: relative; z-index: 1; }
    .header h1 { 
      font-size: 32px; 
      font-weight: 800; 
      letter-spacing: -0.5px; 
      margin-bottom: 8px; 
      color: #ffffff;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .header .subtitle { 
      font-size: 14px; 
      opacity: 0.95; 
      font-weight: 500;
      color: #ffffff;
      text-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .invoice-info { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start;
      margin-top: 30px;
    }
    .invoice-badge {
      background: ${isPaid ? '#10b981' : isPartial ? '#f59e0b' : '#ef4444'};
      padding: 8px 20px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .invoice-number {
      background: rgba(255,255,255,0.2);
      padding: 10px 20px;
      border-radius: 8px;
    }
    .invoice-number span { font-size: 12px; opacity: 0.8; display: block; }
    .invoice-number strong { font-size: 18px; display: block; margin-top: 2px; }
    
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
        <h1>⚡ WPCodingPress</h1>
        <p class="subtitle">Professional Web Development & Digital Solutions</p>
        
        <div class="invoice-info">
          <div class="invoice-number">
            <span>Invoice Number</span>
            <strong>#${invoice.id.slice(0, 8).toUpperCase()}</strong>
          </div>
          <div class="invoice-badge">
            ${isPaid ? '✓ PAID' : isPartial ? '⚠ PARTIAL' : '✕ UNPAID'}
          </div>
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
            <span class="amount-main-value">$${invoice.totalAmount.toLocaleString()}</span>
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
          <p className="text-gray-500">View and download your invoices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Unpaid</p>
                <p className="text-2xl font-bold text-gray-900">
                  {invoices.filter(i => getPaymentStatus(i).status === "unpaid").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Partial</p>
                <p className="text-2xl font-bold text-gray-900">
                  {invoices.filter(i => getPaymentStatus(i).status === "partial").length}
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {invoices.filter(i => getPaymentStatus(i).status === "paid").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {invoices.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => {
                    const paymentStatus = getPaymentStatus(invoice)
                    return (
                      <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-purple-500" />
                            <span className="font-medium text-gray-900">{invoice.id.slice(0, 8).toUpperCase()}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">
                          {invoice.projectName}
                        </td>
                        <td className="p-4 text-gray-900 font-bold">
                          ${invoice.totalAmount.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <Badge className={`${paymentStatus.color} text-white`}>
                            {paymentStatus.label}
                          </Badge>
                        </td>
                        <td className="p-4 text-gray-500 text-sm">
                          {new Date(invoice.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedInvoice(invoice)}
                              className="text-gray-500 hover:text-purple-600 hover:bg-purple-50"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownloadPDF(invoice)}
                              className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                            >
                              <Download className="h-4 w-4" />
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
    </div>
  )
}