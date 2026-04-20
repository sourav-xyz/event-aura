"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api/config"
import { 
  ShoppingCart, 
  Users, 
  Calendar, 
  IndianRupee,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalUsers: number
  totalEvents: number
  pendingOrders: number
  confirmedOrders: number
  completedOrders: number
  cancelledOrders: number
  recentOrders: Array<{
    _id: string
    orderNumber: string
    user: { name: string; email: string }
    event: { name: string }
    totalAmount: number
    status: string
    createdAt: string
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get("/orders/admin/stats")
      setStats(response.data.data)
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "confirmed": return "bg-blue-100 text-blue-800"
      case "in-progress": return "bg-purple-100 text-purple-800"
      case "completed": return "bg-green-100 text-green-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-muted text-muted-foreground"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s an overview of your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {formatCurrency(stats?.totalRevenue || 0)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <IndianRupee className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats?.totalOrders || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
              <span className="text-yellow-600">{stats?.pendingOrders || 0} pending</span>
              <span>|</span>
              <span className="text-green-600">{stats?.completedOrders || 0} completed</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats?.totalUsers || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-secondary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
              <span>Registered customers</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Events</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats?.totalEvents || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-accent-foreground" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
              <span>Available for booking</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-yellow-500 border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">{stats?.pendingOrders || 0}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500 border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">{stats?.confirmedOrders || 0}</p>
              <p className="text-sm text-muted-foreground">Confirmed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">{stats?.completedOrders || 0}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500 border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <XCircle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">{stats?.cancelledOrders || 0}</p>
              <p className="text-sm text-muted-foreground">Cancelled</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="border-none shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-serif">Recent Orders</CardTitle>
          <Link 
            href="/admin/orders" 
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Order</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden md:table-cell">Event</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden lg:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-2">
                        <Link href={`/admin/orders?id=${order._id}`} className="text-primary hover:underline font-medium">
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium text-foreground text-sm">{order.user?.name}</p>
                          <p className="text-xs text-muted-foreground">{order.user?.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-2 hidden md:table-cell text-sm text-foreground">
                        {order.event?.name}
                      </td>
                      <td className="py-3 px-2 font-medium text-foreground">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 hidden lg:table-cell text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No orders yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
