"use client"

import { useEffect, useState } from "react"
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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

interface PortfolioItem {
  id: string
  title: string
  category: string
  imageUrl: string
  description: string
  order: number
  isActive: boolean
}

const categories = [
  "Healthcare",
  "E-commerce",
  "Professional Services",
  "Technology",
  "Education",
  "Food & Beverage",
  "Real Estate",
  "Beauty",
  "Other"
]

const emptyItem: Omit<PortfolioItem, "id"> = {
  title: "",
  category: "Other",
  imageUrl: "",
  description: "",
  order: 0,
  isActive: true,
}

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Omit<PortfolioItem, "id"> | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const fetchPortfolio = async () => {
    try {
      const res = await fetch("/api/portfolio")
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const openCreateDialog = () => {
    setEditingItem(emptyItem)
    setIsDialogOpen(true)
  }

  const openEditDialog = (item: PortfolioItem) => {
    setEditingItem({
      title: item.title,
      category: item.category,
      imageUrl: item.imageUrl,
      description: item.description || "",
      order: item.order,
      isActive: item.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!editingItem) return
    setIsSaving(true)

    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem)
      })
      
      if (res.ok) {
        setIsDialogOpen(false)
        fetchPortfolio()
      }
    } catch (error) {
      console.error("Error saving portfolio item:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio item?")) return
    
    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchPortfolio()
      }
    } catch (error) {
      console.error("Error deleting portfolio item:", error)
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await fetch(`/api/portfolio/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive })
      })
      fetchPortfolio()
    } catch (error) {
      console.error("Error updating portfolio item:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center text-muted-foreground">
              No portfolio items found. Add your first project to showcase your work.
            </CardContent>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id} className={!item.isActive ? "opacity-60" : ""}>
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 relative">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-white/20" />
                  </div>
                )}
                <Badge 
                  variant={item.isActive ? "success" : "outline"}
                  className="absolute top-3 right-3"
                >
                  {item.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => toggleActive(item.id, item.isActive)}
                  >
                    {item.isActive ? "Disable" : "Enable"}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)} className="hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem?.title ? "Edit" : "Add"} Portfolio Item</DialogTitle>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Title</label>
                <Input 
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Project Title"
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">Category</label>
                <select 
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full h-11 px-4 py-2 rounded-lg border border-input bg-background text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">Image URL</label>
                <Input 
                  value={editingItem.imageUrl}
                  onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="bg-white/5 border-white/10"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload images to /public/portfolio/ and use format: /portfolio/image.jpg
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">Description</label>
                <Textarea 
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Brief description of the project..."
                  className="bg-white/5 border-white/10 min-h-[100px]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">Display Order</label>
                <Input 
                  type="number"
                  value={editingItem.order}
                  onChange={(e) => setEditingItem({ ...editingItem, order: parseInt(e.target.value) || 0 })}
                  className="bg-white/5 border-white/10 w-32"
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Project"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
