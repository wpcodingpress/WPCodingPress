"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  MessageSquare, 
  Image, 
  Settings,
  LogOut,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authApi, ordersApi, contactsApi, servicesApi } from "@/lib/api";

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  unreadContacts: number;
  totalServices: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    unreadContacts: 0,
    totalServices: 0,
  });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if authenticated
        if (!authApi.isAuthenticated()) {
          router.push("/login");
          return;
        }

        // Get current user
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);

        // Fetch all data in parallel
        const [ordersData, contactsData, servicesData] = await Promise.all([
          ordersApi.getAll({ per_page: 100 }),
          contactsApi.getAll({ per_page: 100 }),
          servicesApi.getAll({ per_page: 100 }),
        ]);

        const orders = ordersData.orders || [];
        const pendingOrders = orders.filter((o: any) => o.status === "pending").length;
        const completedOrders = orders.filter((o: any) => o.status === "completed").length;
        const unreadContacts = (contactsData.pagination?.total || 0) - 
          (contactsData.contacts?.filter((c: any) => c.is_read).length || 0);

        setStats({
          totalOrders: ordersData.pagination?.total || 0,
          pendingOrders,
          completedOrders,
          unreadContacts,
          totalServices: servicesData.pagination?.total || 0,
        });
      } catch (error) {
        console.error("Dashboard error:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    await authApi.logout();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-blue-500",
      bgColor: "bg-blue-500/20",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/20",
    },
    {
      title: "Completed",
      value: stats.completedOrders,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Unread Messages",
      value: stats.unreadContacts,
      icon: MessageSquare,
      color: "text-purple-500",
      bgColor: "bg-purple-500/20",
    },
  ];

  const menuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: true,
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
      badge: stats.pendingOrders > 0 ? stats.pendingOrders : null,
    },
    {
      title: "Contacts",
      href: "/admin/contacts",
      icon: MessageSquare,
      badge: stats.unreadContacts > 0 ? stats.unreadContacts : null,
    },
    {
      title: "Services",
      href: "/admin/services",
      icon: Settings,
    },
    {
      title: "Portfolio",
      href: "/admin/portfolio",
      icon: Image,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-white/10 z-50">
        <div className="p-6">
          <h1 className="text-xl font-bold gradient-text">WPCodingPress</h1>
          <p className="text-xs text-muted-foreground mt-1">Admin Dashboard</p>
        </div>

        <nav className="px-4 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active
                    ? "bg-primary/20 text-primary"
                    : "hover:bg-white/5 text-slate-300 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1">{item.title}</span>
                {item.badge && (
                  <Badge variant="destructive" className="h-5 w-5 p-0 justify-center text-xs">
                    {item.badge}
                  </Badge>
                )}
              </div>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 px-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || "Admin"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name || "Admin"}!
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/admin/orders">
                  <Button variant="outline" className="w-full justify-start">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    View All Orders
                  </Button>
                </Link>
                <Link href="/admin/contacts">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View Messages
                  </Button>
                </Link>
                <Link href="/admin/services">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Services
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pending</span>
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500">
                      {stats.pendingOrders}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completed</span>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-500">
                      {stats.completedOrders}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Services</span>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-500">
                      {stats.totalServices}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">API Status</span>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-500">
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Database</span>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-500">
                      Connected
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Version</span>
                    <span className="text-sm">1.0.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
