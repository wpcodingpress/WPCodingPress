"use client"

import { useEffect, useState } from "react"
import { Eye, Trash2, CheckCircle2, XCircle, Clock, Hash, CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Package } from "lucide-react"
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
  packageType: string | null
  message: string
  status: string
  amount: number
  paymentStatus: string
  paymentMethod: string | null
  downloadCount: number
  downloadLimit: number
  createdAt: string
  service: { name: string } | null
  product: { name: string } | null
  user: { name: string; email: string } | null
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
      const updateData: any = { status }
      if (status === "completed") {
        updateData.paymentStatus = "paid"
      }
      
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      })
      
      if (res.ok) {
        fetchOrders()
        if (selectedOrder) {
          setSelectedOrder({ 
            ...selectedOrder, 
            status,
            paymentStatus: status === "completed" ? "paid" : selectedOrder.paymentStatus
          })
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
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "approved": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "in_progress": return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "completed": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "rejected": return "bg-red-500/20 text-red-400 border-red-500/30"
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getPaymentColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "refunded": return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "failed": return "bg-red-500/20 text-red-400 border-red-500/30"
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(o => o.status === filter)

  const stats = {
    totalRevenue: orders.filter(o => o.paymentStatus === "paid").reduce((sum, o) => sum + (o.amount || 0), 0) / 100,
    pendingPayments: orders.filter(o => o.paymentStatus !== "paid" && o.status !== "rejected").reduce((sum, o) => sum + (o.amount || 0), 0) / 100,
    completedOrders: orders.filter(o => o.status === "completed").length,
    totalOrders: orders.length
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1 md:mb-2">Orders</h1>
          <p className="text-sm text-slate-500">Manage and track all your orders</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white border-slate-200">
            <SelectValue placeholder="Filter" />
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Revenue</p>
                <p className="text-xl font-bold text-slate-900">${stats.totalRevenue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Pending Payments</p>
                <p className="text-xl font-bold text-slate-900">${stats.pendingPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Completed</p>
                <p className="text-xl font-bold text-slate-900">{stats.completedOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Orders</p>
                <p className="text-xl font-bold text-slate-900">{stats.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-slate-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-3 md:p-4 text-xs md:text-sm font-semibold text-slate-600">Client</th>
                  <th className="text-left p-3 md:p-4 text-xs md:text-sm font-semibold text-slate-600">Type</th>
                  <th className="text-left p-3 md:p-4 text-xs md:text-sm font-semibold text-slate-600">Product/Service</th>
                  <th className="text-left p-3 md:p-4 text-xs md:text-sm font-semibold text-slate-600">Package</th>
                  <th className="text-left p-3 md:p-4 text-xs md:text-sm font-semibold text-slate-600">Amount</th>
                  <th className="text-left p-3 md:p-4 text-xs md:text-sm font-semibold text-slate-600 hidden lg:table-cell">Payment</th>
                  <th className="text-left p-3 md:p-4 text-xs md:text-sm font-semibold text-slate-600 hidden md:table-cell">Downloads</th>
                  <th className="text-left p-3 md:p-4 text-xs md:text-sm font-semibold text-slate-600">Status</th>
                  <th className="text-left p-3 md:p-4 text-xs md:text-sm font-semibold text-slate-600 hidden sm:table-cell">Date</th>
                  <th className="text-right p-3 md:p-4 text-xs md:text-sm font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-slate-500">
                      No orders found
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
                        <Badge variant={order.service ? "secondary" : "outline"} className="capitalize">
                          {order.service ? "Service" : "Product"}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-600">
                        {order.product?.name || order.service?.name || "N/A"}
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="capitalize">
                          {order.packageType || "standard"}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-900 font-medium">
                        ${(order.amount || 0) / 100}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPaymentColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        {order.product ? (
                          <span className={`text-sm font-medium ${order.downloadCount >= order.downloadLimit ? 'text-red-600' : 'text-emerald-600'}`}>
                            {order.downloadCount}/{order.downloadLimit}
                          </span>
                        ) : (
                          <span className="text-slate-500">-</span>
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
                            onClick={() => setSelectedOrder(order)}
                            className="text-slate-500 hover:text-violet-600 hover:bg-violet-50"
                          >
                            <Eye className="h-4 w-4" />
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

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Order Details</DialogTitle>
            <DialogDescription className="text-slate-500">
              View and update order status
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
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
                  <p className="text-slate-900">{selectedOrder.clientPhone}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Service</label>
                  <p className="text-slate-900">{selectedOrder.service?.name || selectedOrder.product?.name || "N/A"}</p>
                </div>
                
                {selectedOrder.paymentMethod && (
                  <div>
                    <label className="text-sm text-slate-500">Payment Method</label>
                    <p className="text-slate-900 font-medium capitalize">{selectedOrder.paymentMethod.replace("_", " ")}</p>
                  </div>
                )}
                
                {selectedOrder.product && (
                  <div>
                    <label className="text-sm text-slate-500">Downloads</label>
                    <p className={`text-slate-900 font-medium ${selectedOrder.downloadCount >= selectedOrder.downloadLimit ? 'text-red-600' : 'text-emerald-600'}`}>
                      {selectedOrder.downloadCount} / {selectedOrder.downloadLimit} downloads used
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm text-slate-500">Message</label>
                <p className="text-slate-900 mt-1 p-3 rounded-lg bg-slate-50">
                  {selectedOrder.message || "No message provided"}
                </p>
              </div>

              <div>
                <label className="text-sm text-slate-600 mb-2 block">Update Status</label>
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

              <div className="pt-4 border-t border-slate-200">
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
