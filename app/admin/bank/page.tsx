"use client"

import { useEffect, useState } from "react"
import { Plus, Edit, Trash2, Save, X, Building2, Globe, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface BankSettings {
  id: string
  bankName: string
  accountName: string
  accountNumber: string
  sortCode: string
  iban: string
  swift: string
  bankAddress: string
  country: string
  currency: string
  instructions: string
  isActive: boolean
  createdAt: string
}

const countries = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "BD", name: "Bangladesh" },
  { code: "EU", name: "Europe" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "IN", name: "India" },
  { code: "OTHER", name: "Other" }
]

const currencies = ["USD", "GBP", "EUR", "BDT", "AUD", "CAD", "INR"]

export default function BankSettingsPage() {
  const [settings, setSettings] = useState<BankSettings[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    sortCode: "",
    iban: "",
    swift: "",
    bankAddress: "",
    country: "",
    currency: "USD",
    instructions: "",
    isActive: true
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/bank-settings")
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
      }
    } catch (error) {
      console.error("Error fetching bank settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingId ? `/api/bank-settings/${editingId}` : "/api/bank-settings"
      const method = editingId ? "PATCH" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        fetchSettings()
        closeModal()
      }
    } catch (error) {
      console.error("Error saving bank settings:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bank account?")) return
    
    try {
      const res = await fetch(`/api/bank-settings/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchSettings()
      }
    } catch (error) {
      console.error("Error deleting bank settings:", error)
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await fetch(`/api/bank-settings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive })
      })
      fetchSettings()
    } catch (error) {
      console.error("Error toggling bank settings:", error)
    }
  }

  const openEditModal = (item: BankSettings) => {
    setFormData({
      bankName: item.bankName,
      accountName: item.accountName,
      accountNumber: item.accountNumber,
      sortCode: item.sortCode,
      iban: item.iban,
      swift: item.swift,
      bankAddress: item.bankAddress,
      country: item.country,
      currency: item.currency,
      instructions: item.instructions,
      isActive: item.isActive
    })
    setEditingId(item.id)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setFormData({
      bankName: "",
      accountName: "",
      accountNumber: "",
      sortCode: "",
      iban: "",
      swift: "",
      bankAddress: "",
      country: "",
      currency: "USD",
      instructions: "",
      isActive: true
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Bank Settings</h1>
          <p className="text-muted-foreground">Manage bank accounts for payment transfers</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Bank Account
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : settings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Bank Accounts</h3>
            <p className="text-muted-foreground mb-4">Add bank accounts to receive payments</p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Bank Account
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {settings.map((item) => (
            <Card key={item.id} className={item.isActive ? "" : "opacity-60"}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">{item.bankName}</h3>
                      <Badge variant={item.isActive ? "default" : "secondary"}>
                        {item.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Account Name</p>
                        <p className="text-white">{item.accountName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Account Number</p>
                        <p className="text-white font-mono">{item.accountNumber}</p>
                      </div>
                      {item.sortCode && (
                        <div>
                          <p className="text-muted-foreground">Sort Code</p>
                          <p className="text-white font-mono">{item.sortCode}</p>
                        </div>
                      )}
                      {item.country && (
                        <div>
                          <p className="text-muted-foreground">Country</p>
                          <p className="text-white">{item.country}</p>
                        </div>
                      )}
                    </div>
                    {item.instructions && (
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">{item.instructions}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleToggleActive(item.id, item.isActive)}
                    >
                      {item.isActive ? "Disable" : "Enable"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openEditModal(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Bank Account" : "Add Bank Account"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Bank Name</label>
                <Input
                  value={formData.bankName}
                  onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                  placeholder="e.g., Chase Bank"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Account Name</label>
                <Input
                  value={formData.accountName}
                  onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                  placeholder="e.g., WPCodingPress LLC"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Account Number</label>
                <Input
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                  placeholder="e.g., 12345678"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Sort Code (UK)</label>
                <Input
                  value={formData.sortCode}
                  onChange={(e) => setFormData({...formData, sortCode: e.target.value})}
                  placeholder="e.g., 123456"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">IBAN</label>
                <Input
                  value={formData.iban}
                  onChange={(e) => setFormData({...formData, iban: e.target.value})}
                  placeholder="e.g., GB82WEST12345698765432"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">SWIFT/BIC</label>
                <Input
                  value={formData.swift}
                  onChange={(e) => setFormData({...formData, swift: e.target.value})}
                  placeholder="e.g., CHASEGB2L"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({...formData, currency: e.target.value})}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                >
                  {currencies.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Bank Address</label>
              <Input
                value={formData.bankAddress}
                onChange={(e) => setFormData({...formData, bankAddress: e.target.value})}
                placeholder="e.g., 123 Main Street, City, State, ZIP"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Payment Instructions</label>
              <Textarea
                value={formData.instructions}
                onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                placeholder="e.g., Please include your order number in the payment reference"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {editingId ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}