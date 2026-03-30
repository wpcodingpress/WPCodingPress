"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Package, Clock, CheckCircle } from "lucide-react";

interface Order {
  id: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  product?: { name: string };
  service?: { name: string };
}

export default function DashboardOverview() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    paid: 0
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      setOrders(data);

      setStats({
        total: data.length,
        pending: data.filter((o: Order) => o.status === "pending").length,
        completed: data.filter((o: Order) => o.status === "completed").length,
        paid: data.filter((o: Order) => o.paymentStatus === "paid").length
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const statCards = [
    {
      title: "Total Orders",
      value: stats.total,
      icon: ShoppingBag,
      color: "bg-blue-500/20 text-blue-400"
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "bg-yellow-500/20 text-yellow-400"
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "bg-green-500/20 text-green-400"
    },
    {
      title: "Paid Orders",
      value: stats.paid,
      icon: Package,
      color: "bg-purple-500/20 text-purple-400"
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome back! Here&apos;s your overview.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
          <Link
            href="/dashboard/orders"
            className="text-sm text-primary hover:underline"
          >
            View All →
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No orders yet</p>
            <Link
              href="/products"
              className="text-primary hover:underline text-sm mt-2 inline-block"
            >
              Browse Products →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
              >
                <div>
                  <p className="font-medium text-white">
                    {order.product?.name || order.service?.name || "Order"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "completed"
                        ? "bg-green-500/20 text-green-400"
                        : order.status === "processing"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {order.status}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
