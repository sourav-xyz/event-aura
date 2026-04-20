"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Send, Sparkles } from "lucide-react"
import { useState } from "react"

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

const budgetRanges = [
  "Under ₹15,000",
  "₹15,000 - ₹35,000",
  "₹35,000 - ₹75,000",
  "₹75,000 - ₹1,50,000",
  "Above ₹1,50,000",
]

export function Booking() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    eventType: "",
    eventDate: "",
    budget: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would send to a backend
    console.log(formData)
    setSubmitted(true)
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
                    <Sparkles className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h4 className="text-2xl font-bold text-foreground mb-2">Thank You!</h4>
                  <p className="text-muted-foreground">
                    We&apos;ve received your booking request. Our team will contact you soon!
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
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
                      <Label htmlFor="phone">Phone Number</Label>
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="eventType">Event Type</Label>
                      <Select
                        value={formData.eventType}
                        onValueChange={(value) => setFormData({ ...formData, eventType: value })}
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
                      <Label htmlFor="eventDate">Event Date</Label>
                      <div className="relative">
                        <Input
                          id="eventDate"
                          type="date"
                          value={formData.eventDate}
                          onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                          required
                          className="bg-background"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select
                      value={formData.budget}
                      onValueChange={(value) => setFormData({ ...formData, budget: value })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select your budget" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetRanges.map((range) => (
                          <SelectItem key={range} value={range}>
                            {range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Details</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your event, venue, theme preferences, or any special requirements..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-background resize-none"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full gradient-primary text-primary-foreground hover:opacity-90 shadow-lg">
                    <Send className="mr-2 h-4 w-4" />
                    Submit Booking Request
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
