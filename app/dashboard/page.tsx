"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  ShoppingBag,
  Heart,
  Bell,
  User,
  Settings,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  TrendingUp,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { userAPI, orderAPI } from "@/lib/api/config";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DashboardStatSkeleton, OrderCardSkeleton } from "@/components/skeletons";
import { useToast } from "@/context/toast-context";

interface DashboardData {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSpent: number;
  recentOrders: Order[];
  upcomingEvents: Order[];
}

interface Order {
  _id: string;
  orderNumber: string;
  event: {
    name: string;
    images: string[];
  };
  eventDate: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function UserDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/dashboard");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const data = await userAPI.getDashboard() as { data: DashboardData };
        setDashboardData(data.data);
      } catch (error) {
        showToast("Failed to load dashboard data", "error");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchDashboard();
    }
  }, [user, showToast]);

  if (authLoading || !user) {
    return null;
  }

  const stats = [
    {
      label: "Total Bookings",
      value: dashboardData?.totalOrders || 0,
      icon: ShoppingBag,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Pending",
      value: dashboardData?.pendingOrders || 0,
      icon: Clock,
      color: "bg-yellow-500/10 text-yellow-600",
    },
    {
      label: "Completed",
      value: dashboardData?.completedOrders || 0,
      icon: CheckCircle,
      color: "bg-green-500/10 text-green-600",
    },
    {
      label: "Total Spent",
      value: `₹${(dashboardData?.totalSpent || 0).toLocaleString()}`,
      icon: CreditCard,
      color: "bg-accent/20 text-accent-foreground",
    },
  ];

  const quickActions = [
    { label: "Browse Events", href: "/events", icon: Calendar },
    { label: "My Orders", href: "/orders", icon: ShoppingBag },
    { label: "My Profile", href: "/profile", icon: User },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome back, <span className="text-gradient">{user.name?.split(" ")[0]}</span>
            </h1>
            <p className="text-muted-foreground">
              Manage your bookings and explore new events
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <DashboardStatSkeleton key={i} />)
              : stats.map((stat, index) => (
                  <Card key={index} className="border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-full ${stat.color}`}>
                          <stat.icon className="h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Card className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer group">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="p-3 rounded-full bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <action.icon className="h-6 w-6" />
                      </div>
                      <p className="font-medium text-foreground">{action.label}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Recent Bookings</CardTitle>
                  <Link href="/orders">
                    <Button variant="ghost" size="sm" className="text-primary">
                      View All <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <OrderCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : dashboardData?.recentOrders?.length ? (
                    <div className="space-y-4">
                      {dashboardData.recentOrders.slice(0, 5).map((order) => (
                        <Link key={order._id} href={`/orders/${order._id}`}>
                          <div className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                            <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden">
                              {order.event?.images?.[0] ? (
                                <img
                                  src={order.event.images[0]}
                                  alt={order.event.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Calendar className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">
                                {order.event?.name || "Event"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.eventDate).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                              <p className="text-xs text-muted-foreground">#{order.orderNumber}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-foreground">
                                ₹{order.totalAmount.toLocaleString()}
                              </p>
                              <span
                                className={`inline-block px-2 py-1 text-xs rounded-full border ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No bookings yet</p>
                      <Button asChild className="gradient-primary text-primary-foreground">
                        <Link href="/events">Browse Events</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Upcoming Events & Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Upcoming Events */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardData?.upcomingEvents?.length ? (
                    <div className="space-y-3">
                      {dashboardData.upcomingEvents.slice(0, 3).map((event) => (
                        <div
                          key={event._id}
                          className="p-3 rounded-lg bg-muted/50 border border-border"
                        >
                          <p className="font-medium text-foreground text-sm">
                            {event.event?.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(event.eventDate).toLocaleDateString("en-IN", {
                              weekday: "long",
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No upcoming events
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Welcome to EventAura!</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Start exploring amazing events
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Special Offers</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Get 20% off on your first booking
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Need Help */}
              <Card className="border-border/50 gradient-primary text-primary-foreground">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Need Help?</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Our support team is here to assist you 24/7
                  </p>
                  <Button variant="secondary" size="sm" asChild>
                    <Link href="#contact">Contact Support</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
