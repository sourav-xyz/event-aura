"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Send, Sparkles, Copy, CheckCircle2 } from "lucide-react"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"

const eventTypes = [
  "Wedding",
  "Birthday Party",
  "Thread Ceremony (Upanayan)",
  "Surprise Party",
  "Corporate Event",
  "College Event",
  "Baby Shower",
  "Anniversary",
  "Housewarming",
  "Other",
]

const packageOptions = [
  { value: "Silver", label: "Silver - Basic Decoration (From Rs. 15,000)", price: 15000 },
  { value: "Gold", label: "Gold - Decoration + Cake + Photography (From Rs. 35,000)", price: 35000 },
  { value: "Premium", label: "Premium - All-in-one Package (From Rs. 75,000)", price: 75000 },
  { value: "Custom", label: "Custom Package - Build Your Own", price: 0 },
]

interface BookingFormData {
  name: string
  email: string
  phone: string
  eventType: string
  eventDate: string
  guestCount: string
  venue: string
  packageType: string
  customServices: string[]
  additionalNotes: string
}

export function Booking() {
  return (
    <Suspense fallback={<BookingLoadingFallback />}>
      <BookingForm />
    </Suspense>
  )
}

function BookingLoadingFallback() {
  return (
    <section id="booking" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-border/50 shadow-xl">
            <CardContent className="p-6 h-96 flex items-center justify-center">
              <p className="text-muted-foreground">Loading form...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

function BookingForm() {
  const searchParams = useSearchParams() ?? new URLSearchParams()
  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    guestCount: "",
    venue: "",
    packageType: "",
    customServices: [],
    additionalNotes: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [trackingId, setTrackingId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!searchParams) return
    
    const packageParam = searchParams.get('package')
    if (packageParam) {
      setFormData(prev => ({ ...prev, packageType: packageParam }))
    }
    const servicesParam = searchParams.get('services')
    if (servicesParam) {
      setFormData(prev => ({ ...prev, customServices: servicesParam.split(',') }))
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    console.log("Submitting booking with data:", formData) // Debug log 
    try {
      let packagePrice = 0
      const selectedPackage = packageOptions.find(pkg => pkg.value === formData.packageType)

      if (selectedPackage) {
        packagePrice = selectedPackage.price
      }

      const transformedData = {
        eventDetails: {
          eventDate: formData.eventDate,
          venue: formData.venue,
          guestCount: Number(formData.guestCount) || 0,
          specialRequests: formData.additionalNotes,
        },
        contactInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        packageSelected: selectedPackage ? {
          name: selectedPackage.label,
          price: packagePrice,
          features: []
        } : null,
        themeSelected: null,
        addonsSelected: [],
        pricing: {
          packagePrice,
          themePrice: 0,
          addonsPrice: 0,
          subtotal: packagePrice,
          discount: 0,
          tax: 0,
          total: packagePrice
        }
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformedData),
      })
      console.log("API response status:", response);
      if (!response.ok) {
        throw new Error('Server error')
      }

      const data = await response.json()

      if (data.success && data.data) {
        setTrackingId(data.data.trackingId || 'N/A')
        setSubmitted(true)
      } else {
        setError(data.message || 'Something went wrong')
      }

    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to submit booking')
    } finally {
      setLoading(false)
    }
  }

  const copyTrackingId = () => {
    navigator.clipboard.writeText(trackingId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="booking" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Book Now</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 text-balance">
            Let&apos;s Create <span className="text-gradient">Magic Together</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Fill out the form below and our team will get back to you within 24 hours.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-border/50 shadow-xl">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="gradient-primary p-2 rounded-xl">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Event Booking Form</h3>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h4 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h4>
                  <p className="text-muted-foreground mb-6">
                    We&apos;ve received your booking request. Our team will contact you soon!
                  </p>
                  
                  <div className="bg-muted p-4 rounded-xl mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Your Tracking ID</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl font-mono font-bold text-primary">{trackingId}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={copyTrackingId}
                        className="h-8 w-8"
                      >
                        {copied ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Save this ID to track your booking status
                    </p>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    A confirmation email has been sent to your email address.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-background"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guestCount">Expected Guests *</Label>
                      <Input
                        id="guestCount"
                        type="number"
                        placeholder="Number of guests"
                        min="1"
                        value={formData.guestCount}
                        onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                        required
                        className="bg-background"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="eventType">Event Type *</Label>
                      <Select
                        value={formData.eventType}
                        onValueChange={(value) => setFormData({ ...formData, eventType: value })}
                        required
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventDate">Event Date *</Label>
                      <div className="relative">
                        <Input
                          id="eventDate"
                          type="date"
                          value={formData.eventDate}
                          onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                          required
                          className="bg-background"
                          min={new Date().toISOString().split('T')[0]}
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="venue">Venue / Location *</Label>
                    <Input
                      id="venue"
                      placeholder="Enter venue address or location"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      required
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="packageType">Select Package *</Label>
                    <Select
                      value={formData.packageType}
                      onValueChange={(value) => setFormData({ ...formData, packageType: value })}
                      required
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Choose a package" />
                      </SelectTrigger>
                      <SelectContent>
                        {packageOptions.map((pkg) => (
                          <SelectItem key={pkg.value} value={pkg.value}>
                            {pkg.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.customServices.length > 0 && (
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium text-foreground mb-2">Selected Services:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.customServices.map((service, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Details</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your event, theme preferences, or any special requirements..."
                      rows={4}
                      value={formData.additionalNotes}
                      onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                      className="bg-background resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full gradient-primary text-primary-foreground hover:opacity-90 shadow-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Booking Request
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
