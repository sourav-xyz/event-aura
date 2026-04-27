"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Star, Crown, Sparkles, X, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const packages = [

  {
    name: "Silver",
    subtitle: "Basic Decoration",
    price: "15,000",
    icon: Star,
    features: [
      "Basic Stage Decoration",
      "Balloon Arrangements",
      "Entry Gate Decor",
      "Table Centerpieces",
      "Basic Lighting Setup",
      "Event Coordination",
    ],
    popular: false,
    gradient: "from-slate-400 to-slate-500",
    hoverGradient: "hover:shadow-slate-400/20",
  },
  {
    name: "Gold",
    subtitle: "Decoration + Cake + Photography",
    price: "35,000",
    icon: Crown,
    features: [
      "Premium Stage Decoration",
      "Designer Cake (2 Tier)",
      "Professional Photography",
      "Flower Arrangements",
      "LED Lighting Effects",
      "Welcome Board Design",
      "Event Coordination",
      "Photo Booth Setup",
    ],
    popular: true,
    gradient: "from-amber-400 to-yellow-500",
    hoverGradient: "hover:shadow-amber-400/20",
  },
  {
    name: "Premium",
    subtitle: "All-in-one + DJ + Catering",
    price: "75,000",
    icon: Sparkles,
    features: [
      "Luxury Stage Decoration",
      "Premium 3-Tier Cake",
      "Pro Photography + Videography",
      "DJ & Sound System",
      "Catering for 100 Guests",
      "Flower & LED Decor",
      "Photo & Video Booth",
      "Anchor / Emcee",
      "Complete Event Management",
    ],
    popular: false,
    gradient: "from-purple-500 to-pink-500",
    hoverGradient: "hover:shadow-purple-500/20",
  },
]

const customServices = [
  { id: "stage-basic", name: "Basic Stage Decoration", price: 5000 },
  { id: "stage-premium", name: "Premium Stage Decoration", price: 12000 },
  { id: "stage-luxury", name: "Luxury Stage Decoration", price: 25000 },
  { id: "balloons", name: "Balloon Arrangements", price: 3000 },
  { id: "entry-gate", name: "Entry Gate Decor", price: 4000 },
  { id: "table-decor", name: "Table Centerpieces", price: 2500 },
  { id: "flowers", name: "Flower Arrangements", price: 8000 },
  { id: "led-lights", name: "LED Lighting Effects", price: 6000 },
  { id: "welcome-board", name: "Welcome Board Design", price: 2000 },
  { id: "cake-2tier", name: "Designer Cake (2 Tier)", price: 3500 },
  { id: "cake-3tier", name: "Premium Cake (3 Tier)", price: 6000 },
  { id: "photography", name: "Professional Photography", price: 15000 },
  { id: "videography", name: "Professional Videography", price: 20000 },
  { id: "photo-video", name: "Photography + Videography Combo", price: 30000 },
  { id: "photo-booth", name: "Photo Booth Setup", price: 8000 },
  { id: "video-booth", name: "Video Booth Setup", price: 10000 },
  { id: "dj", name: "DJ & Sound System", price: 15000 },
  { id: "anchor", name: "Anchor / Emcee", price: 10000 },
  { id: "catering-50", name: "Catering for 50 Guests", price: 25000 },
  { id: "catering-100", name: "Catering for 100 Guests", price: 45000 },
  { id: "catering-200", name: "Catering for 200 Guests", price: 85000 },
  { id: "coordination", name: "Event Coordination", price: 5000 },
]

export function Packages() {
  const [customModalOpen, setCustomModalOpen] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const calculateTotal = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = customServices.find(s => s.id === serviceId)
      return total + (service?.price || 0)
    }, 0)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN').format(price)
  }

  const getSelectedServiceNames = () => {
    return selectedServices
      .map(id => customServices.find(s => s.id === id)?.name)
      .filter(Boolean)
  }

  return (
    <section id="packages" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Pricing</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 text-balance">
            Choose Your <span className="text-gradient">Package</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Transparent pricing with no hidden costs. Select a package that fits your needs or customize your own.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={pkg.popular ? "md:-mt-4 md:mb-4" : ""}
            >
              <Card className={`h-full relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${pkg.hoverGradient} group ${
                pkg.popular 
                  ? "border-primary shadow-2xl shadow-primary/20" 
                  : "border-border/50 hover:-translate-y-1"
              }`}>
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pkg.gradient} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                    <pkg.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{pkg.name}</h3>
                  <p className="text-muted-foreground text-sm">{pkg.subtitle}</p>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-sm text-muted-foreground">₹</span>
                    <span className="text-4xl font-bold text-foreground">{pkg.price}</span>
                    <span className="text-muted-foreground">onwards</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 group/item">
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 transition-colors duration-200 group-hover/item:bg-primary/20">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-muted-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    asChild 
                    className={`w-full transition-all duration-300 ${pkg.popular ? "gradient-primary text-primary-foreground hover:opacity-90" : "hover:bg-primary hover:text-primary-foreground"}`}
                    variant={pkg.popular ? "default" : "outline"}
                  >
                    <Link 
                      href={`?package=${pkg.name}#booking`} 
                      className="flex items-center justify-center gap-2"
                    >
                      Choose {pkg.name}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">Need something unique? We can create a custom package for you.</p>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            onClick={() => setCustomModalOpen(true)}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Customize Your Package
          </Button>
        </motion.div>
      </div>

      {/* Custom Package Modal */}
      <Dialog open={customModalOpen} onOpenChange={setCustomModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Build Your Custom Package
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <p className="text-muted-foreground">
              Select the services you need and we&apos;ll create a custom package just for you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Decoration Section */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground border-b border-border pb-2">Decoration</h4>
                {customServices.filter(s => 
                  s.id.includes('stage') || s.id.includes('balloon') || 
                  s.id.includes('entry') || s.id.includes('table') ||
                  s.id.includes('flower') || s.id.includes('led') || s.id.includes('welcome')
                ).map(service => (
                  <div key={service.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id={service.id}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={() => toggleService(service.id)}
                      />
                      <Label htmlFor={service.id} className="text-sm cursor-pointer">
                        {service.name}
                      </Label>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ₹{formatPrice(service.price)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Food & Cake Section */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground border-b border-border pb-2">Food & Cake</h4>
                {customServices.filter(s => 
                  s.id.includes('cake') || s.id.includes('catering')
                ).map(service => (
                  <div key={service.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id={service.id}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={() => toggleService(service.id)}
                      />
                      <Label htmlFor={service.id} className="text-sm cursor-pointer">
                        {service.name}
                      </Label>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ₹{formatPrice(service.price)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Photo & Video Section */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground border-b border-border pb-2">Photo & Video</h4>
                {customServices.filter(s => 
                  s.id.includes('photo') || s.id.includes('video')
                ).map(service => (
                  <div key={service.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id={service.id}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={() => toggleService(service.id)}
                      />
                      <Label htmlFor={service.id} className="text-sm cursor-pointer">
                        {service.name}
                      </Label>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ₹{formatPrice(service.price)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Entertainment & Others Section */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground border-b border-border pb-2">Entertainment & Others</h4>
                {customServices.filter(s => 
                  s.id.includes('dj') || s.id.includes('anchor') || s.id.includes('coordination')
                ).map(service => (
                  <div key={service.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id={service.id}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={() => toggleService(service.id)}
                      />
                      <Label htmlFor={service.id} className="text-sm cursor-pointer">
                        {service.name}
                      </Label>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ₹{formatPrice(service.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Services Summary */}
            {selectedServices.length > 0 && (
              <div className="bg-muted/50 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">Selected Services</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedServices([])}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getSelectedServiceNames().map((name, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      {name}
                    </span>
                  ))}
                </div>
                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <span className="text-foreground font-medium">Estimated Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{formatPrice(calculateTotal())}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setCustomModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                asChild
                className="flex-1 gradient-primary text-primary-foreground"
                disabled={selectedServices.length === 0}
              >
                <Link 
                  href={`?package=Custom&services=${getSelectedServiceNames().join(',')}#booking`}
                  onClick={() => setCustomModalOpen(false)}
                >
                  Continue to Booking
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
