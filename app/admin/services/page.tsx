"use client"

import { useEffect, useState } from "react"
import { Plus, Edit, Trash2, GripVertical } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Service {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  basicPrice: number
  standardPrice: number
  premiumPrice: number
  basicFeatures: string[]
  standardFeatures: string[]
  premiumFeatures: string[]
  order: number
  isActive: boolean
}

const iconOptions = [
  { value: "code", label: "Code" },
  { value: "palette", label: "Design" },
  { value: "shopping-cart", label: "E-commerce" },
  { value: "zap", label: "Fast" },
  { value: "globe", label: "Web" },
  { value: "settings", label: "Settings" },
]

const emptyService = {
  name: "",
  slug: "",
  description: "",
  icon: "code",
  basicPrice: 100,
  standardPrice: 200,
  premiumPrice: 500,
  basicFeatures: ["", "", "", "", ""],
  standardFeatures: ["", "", "", "", ""],
  premiumFeatures: ["", "", "", "", ""],
  order: 0,
  isActive: true,
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<typeof emptyService | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services")
      if (res.ok) {
        const data = await res.json()
        setServices(data)
      }
    } catch (error) {
      console.error("Error fetching services:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const openCreateDialog = () => {
    setEditingService(emptyService)
    setIsDialogOpen(true)
  }

  const openEditDialog = (service: Service) => {
    setEditingService({
      name: service.name,
      slug: service.slug,
      description: service.description,
      icon: service.icon,
      basicPrice: service.basicPrice,
      standardPrice: service.standardPrice,
      premiumPrice: service.premiumPrice,
      basicFeatures: service.basicFeatures as string[] || ["", "", "", "", ""],
      standardFeatures: service.standardFeatures as string[] || ["", "", "", "", ""],
      premiumFeatures: service.premiumFeatures as string[] || ["", "", "", "", ""],
      order: service.order,
      isActive: service.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!editingService) return
    setIsSaving(true)

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingService)
      })
      
      if (res.ok) {
        setIsDialogOpen(false)
        fetchServices()
      }
    } catch (error) {
      console.error("Error saving service:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const deleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return
    
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchServices()
      }
    } catch (error) {
      console.error("Error deleting service:", error)
    }
  }

  const updateFeature = (tier: "basic" | "standard" | "premium", index: number, value: string) => {
    if (!editingService) return
    const key = `${tier}Features` as keyof typeof editingService
    const features = [...(editingService[key] as string[])]
    features[index] = value
    setEditingService({ ...editingService, [key]: features })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Services</h1>
          <p className="text-slate-500">Manage your service offerings</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid gap-6">
        {services.length === 0 ? (
          <Card className="bg-white border-slate-200">
            <CardContent className="p-8 text-center text-slate-500">
              No services found. Create your first service to get started.
            </CardContent>
          </Card>
        ) : (
          services.map((service) => (
            <Card key={service.id} className="bg-white border-slate-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{service.name}</h3>
                      <Badge variant={service.isActive ? "default" : "outline"} className={service.isActive ? "bg-emerald-100 text-emerald-700 border-emerald-200" : ""}>
                        {service.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-slate-500 text-sm mb-4 max-w-2xl">
                      {service.description}
                    </p>
                    <div className="flex gap-6">
                      <div>
                        <span className="text-xs text-slate-500">Basic</span>
                        <p className="text-lg font-bold text-slate-900">${service.basicPrice}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Standard</span>
                        <p className="text-lg font-bold text-violet-600">${service.standardPrice}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Premium</span>
                        <p className="text-lg font-bold text-slate-900">${service.premiumPrice}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(service)} className="text-slate-500 hover:text-violet-600 hover:bg-violet-50">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteService(service.id)} className="text-slate-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Add New Service</DialogTitle>
          </DialogHeader>
          
          {editingService && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Service Name</label>
                  <Input 
                    value={editingService.name}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                    placeholder="WordPress Development"
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Slug</label>
                  <Input 
                    value={editingService.slug}
                    onChange={(e) => setEditingService({ ...editingService, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="wordpress-development"
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Description</label>
                <Textarea 
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  placeholder="Describe your service..."
                  className="bg-slate-50 border-slate-200 min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Basic Price ($)</label>
                  <Input 
                    type="number"
                    value={editingService.basicPrice}
                    onChange={(e) => setEditingService({ ...editingService, basicPrice: parseInt(e.target.value) || 0 })}
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Standard Price ($)</label>
                  <Input 
                    type="number"
                    value={editingService.standardPrice}
                    onChange={(e) => setEditingService({ ...editingService, standardPrice: parseInt(e.target.value) || 0 })}
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Premium Price ($)</label>
                  <Input 
                    type="number"
                    value={editingService.premiumPrice}
                    onChange={(e) => setEditingService({ ...editingService, premiumPrice: parseInt(e.target.value) || 0 })}
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Icon</label>
                <Select value={editingService.icon} onValueChange={(v) => setEditingService({ ...editingService, icon: v })}>
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon.value} value={icon.value}>
                        {icon.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {(["basic", "standard", "premium"] as const).map((tier) => (
                  <div key={tier}>
                    <label className="text-sm font-medium text-slate-700 mb-2 block capitalize">{tier} Features</label>
                    <div className="space-y-2">
                      {(editingService[`${tier}Features`] as string[]).map((feature, index) => (
                        <Input
                          key={index}
                          value={feature}
                          onChange={(e) => updateFeature(tier, index, e.target.value)}
                          placeholder={`Feature ${index + 1}`}
                          className="bg-slate-50 border-slate-200 h-9"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-200">
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-violet-500 to-purple-500">
                  {isSaving ? "Saving..." : "Save Service"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
