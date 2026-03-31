"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Download, 
  Package, 
  FileText,
  ExternalLink,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  status: string;
  paymentStatus: string;
  amount: number;
  packageType: string;
  planType: string | null;
  createdAt: string;
  product?: { name: string; freeDownloadUrl: string | null; proDownloadUrl: string | null };
}

export default function DownloadsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const downloadableOrders = orders.filter(
    (order: Order) => {
      const hasDownloadUrl = order.planType === 'free' 
        ? order.product?.freeDownloadUrl 
        : (order.planType === 'pro' && order.paymentStatus === 'paid' ? order.product?.proDownloadUrl : false);
      return hasDownloadUrl && (order.status === 'completed' || order.status === 'pending');
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
          {downloadableOrders.map((order: Order, index: number) => (
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
                <div className="flex gap-2">
                  {order.planType === 'free' && order.product?.freeDownloadUrl ? (
                    <a 
                      href={order.product.freeDownloadUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button className="gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </a>
                  ) : order.planType === 'pro' && order.product?.proDownloadUrl && order.paymentStatus === 'paid' ? (
                    <a 
                      href={order.product.proDownloadUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button className="gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </a>
                  ) : (
                    <Button disabled className="gap-2">
                      <Clock className="h-4 w-4" />
                      {order.paymentStatus !== 'paid' ? 'Awaiting Payment' : 'Preparing'}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
