"use client"

import { useEffect, useState, useRef } from "react"
import { Eye, Send, Download, DollarSign, CheckCircle, Clock, FileText, Printer, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
}

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const receiptRef = useRef<HTMLDivElement>(null)

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
        if (selectedInvoice?.id === id) {
          const updated = invoices.find(inv => inv.id === id)
          if (updated) setSelectedInvoice(updated)
        }
      }
    } catch (error) {
      console.error("Error marking payment:", error)
    }
  }

  const downloadPDF = async (invoice: Invoice) => {
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
    .bank-section { background: #ecfdf5; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin-top: 20px; }
    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; border-top: 1px solid #e2e8f0; }
    .status-paid { color: #059669; }
    .status-pending { color: #f59e0b; }
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
          <span class="advance">$${invoice.advanceAmount} ${invoice.advancePaid ? '✓ PAID' : ''}</span>
        </div>
        <div class="amount-row">
          <span class="remaining">Remaining Payment (${remainingPercent}%):</span>
          <span class="remaining">$${invoice.remainingAmount} ${invoice.remainingPaid ? '✓ PAID' : '(Due)'}</span>
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

  const getPaymentStatus = (invoice: Invoice) => {
    if (!invoice.advancePaid && !invoice.remainingPaid) return { status: "unpaid", label: "Unpaid", color: "bg-red-500" }
    if (invoice.advancePaid && !invoice.remainingPaid && invoice.remainingAmount > 0) return { status: "partial", label: "Partial", color: "bg-yellow-500" }
    if (invoice.advancePaid && invoice.remainingPaid) return { status: "paid", label: "Paid", color: "bg-green-500" }
    if (!invoice.advancePaid && invoice.remainingPaid && invoice.advanceAmount === 0) return { status: "paid", label: "Paid", color: "bg-green-500" }
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
                  ${invoices.reduce((acc, i) => acc + (i.advancePaid ? i.advanceAmount : 0) + (i.remainingPaid ? i.remainingAmount : 0), 0)}
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
                          ${invoice.totalAmount}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${invoice.advancePaid ? "text-green-600" : "text-yellow-600"}`}>
                              ${invoice.advanceAmount}
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
                              ${invoice.remainingAmount}
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
                              onClick={() => downloadPDF(invoice)}
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
            <div ref={receiptRef} className="space-y-6">
              <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-white p-6 rounded-lg text-center">
                <h2 className="text-2xl font-bold">WPCodingPress</h2>
                <p className="opacity-90">Professional Web Development Services</p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-500">Invoice ID</p>
                  <p className="font-medium text-slate-900">{selectedInvoice.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Date</p>
                  <p className="font-medium text-slate-900">{new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Project</p>
                  <p className="font-medium text-slate-900">{selectedInvoice.projectName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Service</p>
                  <p className="font-medium text-slate-900">{selectedInvoice.serviceType || "Custom Project"}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500 mb-2">Client Information</p>
                <p className="font-medium text-slate-900">{selectedInvoice.clientName}</p>
                <p className="text-slate-600">{selectedInvoice.clientEmail}</p>
                {selectedInvoice.clientPhone && <p className="text-slate-600">{selectedInvoice.clientPhone}</p>}
              </div>

              <div className="border-2 border-amber-400 bg-amber-50 p-6 rounded-lg">
                <h3 className="font-bold text-slate-900 mb-4">Payment Summary</h3>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-semibold">Total Project Cost</span>
                  <span className="text-2xl font-bold text-slate-900">${selectedInvoice.totalAmount}</span>
                </div>
                {selectedInvoice.advanceAmount > 0 ? (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-green-700">Advance ({Math.round((selectedInvoice.advanceAmount / selectedInvoice.totalAmount) * 100)}%)</span>
                      <span className={`font-semibold ${selectedInvoice.advancePaid ? "text-green-600" : "text-yellow-600"}`}>
                        ${selectedInvoice.advanceAmount} {selectedInvoice.advancePaid ? "✓ Paid" : ""}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={selectedInvoice.remainingPaid ? "text-green-700" : "text-slate-600"}>
                        Remaining ({Math.round((selectedInvoice.remainingAmount / selectedInvoice.totalAmount) * 100)}%)
                      </span>
                      <span className={`font-semibold ${selectedInvoice.remainingPaid ? "text-green-600" : "text-slate-900"}`}>
                        ${selectedInvoice.remainingAmount} {selectedInvoice.remainingPaid ? "✓ Paid" : "(Due)"}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Payment Terms</span>
                    <span className="font-medium text-slate-900">Full payment after completion</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button onClick={() => downloadPDF(selectedInvoice)} className="bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button onClick={() => sendReceipt(selectedInvoice.id)} className="bg-green-600 hover:bg-green-700">
                  <Send className="h-4 w-4 mr-2" />
                  Send to Client
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}