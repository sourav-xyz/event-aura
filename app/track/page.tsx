"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  Search, 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Package, 
  Clock,
  CheckCircle2,
  Circle,
  Loader2,
  AlertCircle
} from "lucide-react"

interface BookingData {
  trackingId: string
  name: string
  eventType: string
  eventDate: string
  venue: string
  guestCount: number
  packageType: string
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  createdAt: string
}

const statusSteps = [
  { key: 'pending', label: 'Booking Received', description: 'We have received your booking request' },
  { key: 'confirmed', label: 'Booking Confirmed', description: 'Your booking has been confirmed by our team' },
  { key: 'in-progress', label: 'Event Preparation', description: 'We are preparing for your event' },
  { key: 'completed', label: 'Event Completed', description: 'Your event has been successfully completed' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'in-progress': return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'completed': return 'bg-green-100 text-green-800 border-green-200'
    case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
    default: return 'bg-muted text-muted-foreground'
  }
}

const getStatusIndex = (status: string) => {
  const index = statusSteps.findIndex(s => s.key === status)
  return index >= 0 ? index : -1
}

export default function TrackBookingPage() {
  const [trackingId, setTrackingId] = useState("")
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!trackingId.trim()) {
      setError("Please enter a tracking ID")
      return
    }

    setLoading(true)
    setError("")
    setSearched(true)

    try {
      const response = await fetch(`/api/bookings/track?trackingId=${encodeURIComponent(trackingId.trim())}`)
      const data = await response.json()

      if (data.success) {
        setBooking(data.data)
      } else {
        setError(data.message || "Booking not found")
        setBooking(null)
      }
    } catch {
      setError("Failed to track booking. Please try again.")
      setBooking(null)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatShortDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const currentStatusIndex = booking ? getStatusIndex(booking.status) : -1

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">EA</span>
              </div>
              <span className="font-serif font-bold text-lg text-foreground hidden sm:inline">Event Aura</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Track Your Event</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-4 text-balance">
            Booking <span className="text-gradient">Status</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto text-pretty">
            Enter your tracking ID to check the status of your event booking.
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-xl mx-auto mb-12"
        >
          <Card className="border-border/50 shadow-xl">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="trackingId" className="text-foreground">Tracking ID</Label>
                  <div className="flex gap-3">
                    <Input
                      id="trackingId"
                      placeholder="e.g., EVT-ABC123-XYZ"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                      className="font-mono text-lg"
                    />
                    <Button 
                      type="submit" 
                      className="gradient-primary text-primary-foreground px-6"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  You can find your tracking ID in the confirmation email sent to you after booking.
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Error Message */}
        {error && searched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto mb-8"
          >
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Booking Not Found</h3>
                  <p className="text-muted-foreground text-sm">{error}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Booking Result */}
        {booking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            {/* Status Overview */}
            <Card className="border-border/50 shadow-xl overflow-hidden">
              <div className="gradient-primary p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-primary-foreground/80 text-sm">Tracking ID</p>
                    <p className="text-2xl font-mono font-bold text-primary-foreground">{booking.trackingId}</p>
                  </div>
                  <Badge className={`${getStatusColor(booking.status)} text-sm px-4 py-1.5 capitalize`}>
                    {booking.status === 'in-progress' ? 'In Progress' : booking.status}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Status Timeline */}
                {booking.status !== 'cancelled' && (
                  <div className="mb-8">
                    <h3 className="font-semibold text-foreground mb-6">Booking Progress</h3>
                    <div className="relative">
                      {/* Progress Line */}
                      <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border" />
                      <div 
                        className="absolute left-4 top-4 w-0.5 bg-primary transition-all duration-500"
                        style={{ 
                          height: `${currentStatusIndex >= 0 ? (currentStatusIndex / (statusSteps.length - 1)) * 100 : 0}%` 
                        }}
                      />

                      {/* Steps */}
                      <div className="space-y-6">
                        {statusSteps.map((step, index) => {
                          const isCompleted = index <= currentStatusIndex
                          const isCurrent = index === currentStatusIndex

                          return (
                            <div key={step.key} className="flex items-start gap-4 relative">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-300 ${
                                isCompleted 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted text-muted-foreground'
                              } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}>
                                {isCompleted ? (
                                  <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                  <Circle className="h-5 w-5" />
                                )}
                              </div>
                              <div className={`pt-1 transition-opacity duration-300 ${isCompleted ? 'opacity-100' : 'opacity-50'}`}>
                                <h4 className={`font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {step.label}
                                </h4>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {booking.status === 'cancelled' && (
                  <div className="mb-8 p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      <div>
                        <h4 className="font-medium text-destructive">Booking Cancelled</h4>
                        <p className="text-sm text-muted-foreground">
                          This booking has been cancelled. Please contact us if you have any questions.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Event Details */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Event Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Event Date</p>
                        <p className="font-medium text-foreground">{formatDate(booking.eventDate)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Event Type</p>
                        <p className="font-medium text-foreground">{booking.eventType}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Venue</p>
                        <p className="font-medium text-foreground">{booking.venue}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Guest Count</p>
                        <p className="font-medium text-foreground">{booking.guestCount} guests</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Package & Dates */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Selected Package</p>
                        <p className="font-semibold text-foreground">{booking.packageType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Booked on {formatShortDate(booking.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact CTA */}
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground">Have Questions?</h3>
                    <p className="text-muted-foreground text-sm">
                      Our team is here to help you with any queries about your booking.
                    </p>
                  </div>
                  <Button asChild variant="outline" className="shrink-0">
                    <Link href="/#contact">Contact Us</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  )
}
