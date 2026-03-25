"use client"

import { useEffect, useState } from "react"
import { Eye, Trash2, CheckCircle2, XCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Order {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  packageType: string
  message: string
  status: string
  createdAt: string
  service: { name: string }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders")
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      })
      
      if (res.ok) {
        fetchOrders()
        if (selectedOrder) {
          setSelectedOrder({ ...selectedOrder, status })
        }
      }
    } catch (error) {
      console.error("Error updating order:", error)
    }
  }

  const deleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return
    
    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchOrders()
        setSelectedOrder(null)
      }
    } catch (error) {
      console.error("Error deleting order:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "warning"
      case "approved": return "default"
      case "in_progress": return "secondary"
      case "completed": return "success"
      case "rejected": return "destructive"
      default: return "outline"
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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Orders</h1>
          <p className="text-muted-foreground">Manage and track all your orders</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Client</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Service</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Package</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-white/5">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-white">{order.clientName}</p>
                          <p className="text-sm text-muted-foreground">{order.clientEmail}</p>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {order.service?.name || "N/A"}
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="capitalize">
                          {order.packageType}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={getStatusColor(order.status)} className="capitalize">
                          {order.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteOrder(order.id)}
                            className="hover:text-destructive"
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

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              View and update order status
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Client Name</label>
                  <p className="text-white font-medium">{selectedOrder.clientName}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p className="text-white">{selectedOrder.clientEmail}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Phone</label>
                  <p className="text-white">{selectedOrder.clientPhone}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Service</label>
                  <p className="text-white">{selectedOrder.service?.name || "N/A"}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Message</label>
                <p className="text-white mt-1 p-3 rounded-lg bg-white/5">
                  {selectedOrder.message || "No message provided"}
                </p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Update Status</label>
                <div className="flex flex-wrap gap-2">
                  {["pending", "approved", "in_progress", "completed", "rejected"].map((status) => (
                    <Button
                      key={status}
                      variant={selectedOrder.status === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateOrderStatus(selectedOrder.id, status)}
                      className="capitalize"
                    >
                      {status === "pending" && <Clock className="h-4 w-4 mr-1" />}
                      {status === "completed" && <CheckCircle2 className="h-4 w-4 mr-1" />}
                      {status === "rejected" && <XCircle className="h-4 w-4 mr-1" />}
                      {status.replace("_", " ")}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button
                  variant="destructive"
                  onClick={() => deleteOrder(selectedOrder.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Order
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
