"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Search, 
  Package,
  ShoppingBag,
  Calendar,
  CreditCard,
  Eye,
  Download,
  Filter,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Order {
  id: string;
  status: string;
  paymentStatus: string;
  amount: number;
  packageType: string;
  createdAt: string;
  updatedAt: string;
  orderType?: string;
  product?: { name: string; slug: string; downloadUrl: string | null };
  service?: { name: string };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      
      if (!sessionData?.user?.id) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`/api/orders?userId=${sessionData.user.id}&t=${Date.now()}`);
      const data = await response.json();
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.service?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border";
      case "approved": return "bg-blue-500/20 text-blue-400 border-blue-500/30 border";
      case "in_progress": return "bg-purple-500/20 text-purple-400 border-purple-500/30 border";
      case "completed": return "bg-green-500/20 text-green-400 border-green-500/30 border";
      case "rejected": return "bg-red-500/20 text-red-400 border-red-500/30 border";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30 border";
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-500/20 text-green-400 border-green-500/30 border";
      case "refunded": return "bg-purple-500/20 text-purple-400 border-purple-500/30 border";
      case "failed": return "bg-red-500/20 text-red-400 border-red-500/30 border";
      default: return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
          <p className="text-slate-500 mt-1">View and manage your orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchOrders} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link href="/products">
            <Button variant="outline">
              <Package className="mr-2 h-4 w-4" />
              Products
            </Button>
          </Link>
          <Link href="/services">
            <Button>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Services
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Package className="h-16 w-16 mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No orders found</h3>
          <p className="text-slate-500 mb-6">
            {searchTerm || statusFilter !== "all" 
              ? "Try adjusting your search or filters" 
              : "You haven't placed any orders yet"}
          </p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${order.product ? 'bg-blue-100' : 'bg-purple-100'}`}>
                    {order.product ? (
                      <Package className="h-5 w-5 text-blue-600" />
                    ) : (
                      <ShoppingBag className="h-5 w-5 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">
                        {order.product?.name || order.service?.name || "Order"}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${order.product ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {order.product ? 'Product' : 'Service'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">
                      Order #{order.id.slice(-8).toUpperCase()} • {order.packageType || 'Standard'}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        ${order.amount || 0}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                    {order.status.replace("_", " ")}
                  </span>
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getPaymentColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrder(order);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Order Details</h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-slate-100">
                <span className="text-slate-500">Order ID</span>
                <span className="text-slate-900 font-medium">#{selectedOrder.id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-100">
                <span className="text-slate-500">Type</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedOrder.product ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                  {selectedOrder.product ? 'Product' : 'Service'}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-100">
                <span className="text-slate-500">Product/Service</span>
                <span className="text-slate-900">{selectedOrder.product?.name || selectedOrder.service?.name || '-'}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-100">
                <span className="text-slate-500">Package</span>
                <span className="text-slate-900 capitalize">{selectedOrder.packageType || 'Standard'}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-100">
                <span className="text-slate-500">Amount</span>
                <span className="text-slate-900 font-bold">${selectedOrder.amount || 0}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-100">
                <span className="text-slate-500">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-100">
                <span className="text-slate-500">Payment</span>
                <span className={`font-medium ${getPaymentColor(selectedOrder.paymentStatus)}`}>
                  {selectedOrder.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-slate-500">Date</span>
                <span className="text-slate-900">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {selectedOrder.product?.downloadUrl && selectedOrder.paymentStatus === "paid" && (
                <a href={selectedOrder.product.downloadUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </a>
              )}
              <Button variant="outline" onClick={() => setSelectedOrder(null)} className="flex-1">
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
