"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Star, Crown, Sparkles } from "lucide-react"
import Link from "next/link"

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
  },
]

export function Packages() {
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
              <Card className={`h-full relative overflow-hidden ${
                pkg.popular 
                  ? "border-primary shadow-2xl shadow-primary/20" 
                  : "border-border/50"
              }`}>
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pkg.gradient} flex items-center justify-center mb-4`}>
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
                      <li key={feature} className="flex items-start gap-3">
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-muted-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    asChild 
                    className={`w-full ${pkg.popular ? "gradient-primary text-primary-foreground" : ""}`}
                    variant={pkg.popular ? "default" : "outline"}
                  >
                    <Link href="#booking">Choose {pkg.name}</Link>
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
          <Button asChild variant="outline" size="lg" className="border-2 border-primary/30 hover:bg-primary/10">
            <Link href="#booking">Customize Your Package</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
