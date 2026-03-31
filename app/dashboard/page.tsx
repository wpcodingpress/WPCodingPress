"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  Package, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Download,
  FileText,
  CreditCard,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  status: string;
  paymentStatus: string;
  amount: number;
  packageType: string;
  createdAt: string;
  product?: { name: string; downloadUrl: string | null };
  service?: { name: string };
}

interface User {
  name: string;
  email: string;
}

export default function DashboardOverview() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      
      if (sessionData?.user) {
        setUser(sessionData.user);
        
        const ordersRes = await fetch(`/api/orders?userId=${sessionData.user.id}`);
        const ordersData = await ordersRes.json();
        setOrders(ordersData || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o: Order) => o.status === "pending").length,
    approved: orders.filter((o: Order) => o.status === "approved").length,
    inProgress: orders.filter((o: Order) => o.status === "in_progress").length,
    completed: orders.filter((o: Order) => o.status === "completed").length,
    rejected: orders.filter((o: Order) => o.status === "rejected").length,
    totalSpent: orders.reduce((acc: number, o: Order) => acc + (o.amount || 0), 0)
  };

  const quickActions = [
    {
      title: "Browse Products",
      description: "Explore our premium plugins and tools",
      icon: Package,
      href: "/products",
      color: "blue"
    },
    {
      title: "Browse Services",
      description: "Get professional web development services",
      icon: Zap,
      href: "/services",
      color: "purple"
    },
    {
      title: "Start a Project",
      description: "Get a custom web development quote",
      icon: ShoppingBag,
      href: "/order",
      color: "green"
    },
    {
      title: "My Orders",
      description: "View and manage your orders",
      icon: ShoppingBag,
      href: "/dashboard/orders",
      color: "orange"
    }
  ];

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
      case "paid": return "text-green-400";
      case "refunded": return "text-purple-400";
      case "failed": return "text-red-400";
      default: return "text-yellow-400";
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
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-8 text-white"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.name || "Client"}! 👋
            </h1>
            <p className="mt-2 text-white/80">
              Here&apos;s what&apos;s happening with your account
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/products">
              <Button variant="secondary" size="sm">
                Browse Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/10">
                Browse Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { title: "Total Orders", value: stats.total, color: "bg-blue-500" },
          { title: "Pending", value: stats.pending, color: "bg-yellow-500" },
          { title: "Approved", value: stats.approved, color: "bg-blue-500" },
          { title: "In Progress", value: stats.inProgress, color: "bg-purple-500" },
          { title: "Completed", value: stats.completed, color: "bg-green-500" },
          { title: "Rejected", value: stats.rejected, color: "bg-red-500" }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-shadow"
          >
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              <span className="text-white font-bold">{stat.value}</span>
            </div>
            <p className="text-sm text-slate-500">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <Link href={action.href}>
                <div className={`bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all group`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${action.color}-100`}>
                      <action.icon className={`h-5 w-5 text-${action.color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-xs text-slate-500">{action.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl border border-slate-200 overflow-hidden"
      >
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-sm text-primary hover:underline">
            View All →
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 mb-4">No orders yet</p>
            <Link href="/products">
              <Button variant="outline">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <ShoppingBag className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {order.product?.name || order.service?.name || "Order"}
                    </p>
                    <p className="text-sm text-slate-500">
                      #{order.id.slice(-8).toUpperCase()} • {order.packageType} • ${order.amount || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {order.status.replace("_", " ")}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPaymentColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
