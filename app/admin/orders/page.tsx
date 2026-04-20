"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api/config"
import { 
  Search, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Filter
} from "lucide-react"
import Link from "next/link"

interface Order {
  _id: string
  orderNumber: string
  user: { _id: string; name: string; email: string; phone: string }
  event: { _id: string; name: string; slug: string }
  selectedPackage: { name: string; price: number }
  selectedTheme: { name: string; price: number }
  selectedAddons: Array<{ name: string; price: number }>
  eventDate: string
  eventTime: string
  venue: { address: string; city: string }
  totalAmount: number
  paymentStatus: string
  status: string
  createdAt: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [page, statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page: page.toString(), limit: "10" })
      if (statusFilter) params.append("status", statusFilter)
      
      const response = await api.get(`/orders/admin/all?${params}`)
      setOrders(response.data.data.orders)
      setTotalPages(response.data.data.totalPages)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      setUpdating(true)
      await api.patch(`/orders/admin/${orderId}/status`, { status })
      fetchOrders()
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status })
      }
    } catch (error) {
      console.error("Failed to update order:", error)
    } finally {
      setUpdating(false)
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

  const filteredOrders = orders.filter(order => 
    order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    order.user?.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage customer orders and bookings</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order number, customer name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <Card className="lg:col-span-2 border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-serif">All Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredOrders.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Order</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Customer</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden md:table-cell">Amount</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr 
                          key={order._id} 
                          className={`border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer ${selectedOrder?._id === order._id ? 'bg-muted/50' : ''}`}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <td className="py-3 px-2">
                            <p className="font-medium text-primary text-sm">{order.orderNumber}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                          </td>
                          <td className="py-3 px-2">
                            <p className="font-medium text-foreground text-sm">{order.user?.name}</p>
                            <p className="text-xs text-muted-foreground">{order.user?.phone}</p>
                          </td>
                          <td className="py-3 px-2 hidden md:table-cell font-medium text-foreground">
                            {formatCurrency(order.totalAmount)}
                          </td>
                          <td className="py-3 px-2">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No orders found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedOrder ? (
              <div className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="font-semibold text-primary">{selectedOrder.orderNumber}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Event Date</p>
                    <p className="font-medium text-sm">{formatDate(selectedOrder.eventDate)}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Event Time</p>
                    <p className="font-medium text-sm">{selectedOrder.eventTime}</p>
                  </div>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="font-medium text-sm">{selectedOrder.user?.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedOrder.user?.email}</p>
                  <p className="text-xs text-muted-foreground">{selectedOrder.user?.phone}</p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Event</p>
                  <p className="font-medium text-sm">{selectedOrder.event?.name}</p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Package</p>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{selectedOrder.selectedPackage?.name}</p>
                    <p className="text-sm">{formatCurrency(selectedOrder.selectedPackage?.price || 0)}</p>
                  </div>
                </div>

                {selectedOrder.selectedTheme && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Theme</p>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{selectedOrder.selectedTheme?.name}</p>
                      <p className="text-sm">{formatCurrency(selectedOrder.selectedTheme?.price || 0)}</p>
                    </div>
                  </div>
                )}

                {selectedOrder.selectedAddons && selectedOrder.selectedAddons.length > 0 && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Add-ons</p>
                    {selectedOrder.selectedAddons.map((addon, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <p>{addon.name}</p>
                        <p>{formatCurrency(addon.price)}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-3 bg-primary/10 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Total Amount</p>
                    <p className="font-bold text-primary text-lg">{formatCurrency(selectedOrder.totalAmount)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Update Status</p>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                    disabled={updating}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <Link href={`/orders/${selectedOrder._id}`}>
                  <Button className="w-full gradient-primary text-primary-foreground">
                    View Full Details
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Eye className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Select an order to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
