"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Download, 
  Package, 
  Clock,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  status: string;
  paymentStatus: string;
  amount: number;
  packageType: string;
  planType: string | null;
  downloadCount: number;
  downloadLimit: number;
  createdAt: string;
  product?: { name: string; freeDownloadUrl: string | null; proDownloadUrl: string | null };
}

export default function DownloadsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      
      if (!sessionData?.user?.id) {
        setIsLoading(false);
        return;
      }
      
      const response = await fetch(`/api/orders?userId=${sessionData.user.id}`);
      const data = await response.json();
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (orderId: string) => {
    setDownloadingId(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}/download`, {
        method: "POST"
      });

      const data = await response.json();

      if (response.ok && data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
        fetchOrders();
      } else {
        alert(data.error || "Download failed");
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download");
    } finally {
      setDownloadingId(null);
    }
  };

  const downloadableOrders = orders.filter(
    (order: Order) => {
      // Free products: always downloadable (status must be completed)
      if (order.planType === 'free' && order.status === 'completed') {
        return !!order.product?.freeDownloadUrl;
      }
      // Pro products: only downloadable when status is completed
      if (order.planType === 'pro' && order.status === 'completed') {
        return !!order.product?.proDownloadUrl;
      }
      return false;
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Downloads</h1>
        <p className="text-slate-500">Access your purchased products and files</p>
      </div>

      {downloadableOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Download className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No Downloads Available</h3>
          <p className="text-slate-500 mb-6">Complete a purchase to access your downloads</p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {downloadableOrders.map((order: Order, index: number) => {
            const canDownload = order.downloadCount < order.downloadLimit;
            const downloadUrl = order.planType === 'free' 
              ? order.product?.freeDownloadUrl 
              : order.product?.proDownloadUrl;
            
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${order.planType === 'free' ? 'bg-green-100' : 'bg-purple-100'}`}>
                      {order.planType === 'free' ? (
                        <Package className="h-6 w-6 text-green-600" />
                      ) : (
                        <Package className="h-6 w-6 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">
                          {order.product?.name || "Product"}
                        </h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${order.planType === 'free' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                          {order.planType === 'free' ? 'Free' : 'Premium'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                        <span>Order #{order.id.slice(-8).toUpperCase()}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-sm font-medium ${canDownload ? 'text-green-600' : 'text-red-600'}`}>
                        {order.downloadCount} / {order.downloadLimit} downloads
                      </div>
                      <div className="text-xs text-slate-500">
                        {canDownload ? 'Available' : 'Limit reached'}
                      </div>
                    </div>
                    {canDownload ? (
                      <Button 
                        onClick={() => handleDownload(order.id)} 
                        disabled={downloadingId === order.id}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        {downloadingId === order.id ? 'Downloading...' : 'Download'}
                      </Button>
                    ) : (
                      <Button disabled variant="outline" className="gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Limit Reached
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}