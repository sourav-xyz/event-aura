"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cake, Camera, Music2, UtensilsCrossed, Mic2 } from "lucide-react"
import Link from "next/link"

const addons = [
  {
    icon: Cake,
    name: "Designer Cake",
    description: "Custom theme cakes from top bakeries",
    price: "Starting ₹2,500",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Camera,
    name: "Photography",
    description: "Professional photo & video coverage",
    price: "Starting ₹8,000",
    gradient: "from-purple-500 to-violet-500",
  },
  {
    icon: Music2,
    name: "DJ & Sound",
    description: "Premium DJ with lighting effects",
    price: "Starting ₹12,000",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: UtensilsCrossed,
    name: "Catering",
    description: "Multi-cuisine buffet & live counters",
    price: "Starting ₹400/plate",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: Mic2,
    name: "Anchor / Emcee",
    description: "Professional hosts for your event",
    price: "Starting ₹5,000",
    gradient: "from-green-500 to-emerald-500",
  },
]

export function Addons() {
  return (
    <section id="addons" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Add-ons</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 text-balance">
            Enhance Your <span className="text-gradient">Experience</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Add these premium services to make your event even more special and memorable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {addons.map((addon, index) => (
            <motion.div
              key={addon.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group h-full border-border/50 bg-card hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 text-center">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${addon.gradient} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <addon.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">{addon.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{addon.description}</p>
                  <p className="text-primary font-semibold text-sm">{addon.price}</p>
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
          <Button asChild size="lg" className="gradient-primary text-primary-foreground hover:opacity-90 shadow-lg">
            <Link href="#booking">Add to Your Package</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
