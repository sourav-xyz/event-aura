"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { api } from "@/lib/api/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronRight,
  ShoppingBag,
  ArrowLeft
} from "lucide-react"

interface Order {
  _id: string
  orderNumber: string
  event: { name: string; slug: string; images: string[] }
  selectedPackage: { name: string; price: number }
  eventDate: string
  eventTime: string
  venue: { city: string }
  totalAmount: number
  status: string
  createdAt: string
}

export default function OrdersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders/my-orders")
      setOrders(response.data.data)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoadingOrders(false)
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link 
              href="/profile" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Link>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">My Orders</h1>
            <p className="text-muted-foreground mt-2">Track and manage your event bookings</p>
          </div>

          {loadingOrders ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : orders.length > 0 ? (
            <div className="grid gap-4">
              {orders.map((order) => (
                <Card key={order._id} className="border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {order.event?.images?.[0] && (
                        <div className="md:w-48 h-32 md:h-auto">
                          <img 
                            src={order.event.images[0]} 
                            alt={order.event.name}
                            className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-sm font-medium text-primary">{order.orderNumber}</span>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">{order.event?.name}</h3>
                            <p className="text-muted-foreground text-sm mb-3">{order.selectedPackage?.name} Package</p>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(order.eventDate)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {order.eventTime}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {order.venue?.city}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4">
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Total Amount</p>
                              <p className="text-xl font-bold text-primary">{formatCurrency(order.totalAmount)}</p>
                            </div>
                            <Link href={`/orders/${order._id}`}>
                              <Button variant="outline" size="sm" className="gap-1">
                                View Details
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-none shadow-md">
              <CardContent className="py-16 text-center">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Orders Yet</h3>
                <p className="text-muted-foreground mb-6">You haven&apos;t made any bookings yet. Explore our events and book your first one!</p>
                <Link href="/events">
                  <Button className="gradient-primary text-primary-foreground">
                    Explore Events
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
