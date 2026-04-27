"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Cake,
  Camera,
  Music2,
  UtensilsCrossed,
  Mic2,
  SquarePlay,
  Flower,
  Aperture,
} from "lucide-react";

import Link from "next/link";

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

  // NEW ADDONS 👇
  {
    icon: SquarePlay,
    name: "Videography",
    description: "Cinematic 4K video with drone shots",
    price: "Starting ₹9,000",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: Flower,
    name: "Flower Wall",
    description: "Custom floral backdrop for photos",
    price: "Starting ₹4,500",
    gradient: "from-pink-400 to-fuchsia-500",
  },
  {
    icon: Aperture,
    name: "Photo Booth",
    description: "Instant print booth with props",
    price: "Starting ₹3,500",
    gradient: "from-yellow-400 to-orange-500",
  },
];



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
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Add-ons
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 text-balance">
            Enhance Your <span className="text-gradient">Experience</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Add these premium services to make your event even more special and
            memorable.
          </p>
        </motion.div>

<div className="flex flex-nowrap overflow-x-auto gap-6 w-full pb-8 
                [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] 
                snap-x snap-mandatory">  {addons.map((addon, index) => (
    <motion.div
      key={addon.name}
      // flex-shrink-0 zaroori hai taaki cards chote na ho jayein
      // w-[280px] ya responsive width set karein (e.g., lg:w-[calc(20%-1.25rem)])
      className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[calc(19%-1.25rem)] snap-start"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group relative h-full overflow-hidden border-border/40 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 flex flex-col">
        {/* Hover Glow Effect */}
        <div className="absolute -inset-px bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <CardContent className="relative p-6 flex flex-col flex-1 items-start">
          {/* Icon Section */}
          <div className={`p-3 rounded-xl bg-gradient-to-br ${addon.gradient} mb-4 shadow-lg shadow-primary/10`}>
            <addon.icon className="h-6 w-6 text-white" />
          </div>

          {/* Text Content Section */}
          <div className="flex-1 w-full">
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              {addon.name}
            </h3>
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed text-left line-clamp-3">
              {addon.description}
            </p>
          </div>

          {/* Bottom Price Section */}
          <div className="mt-6 flex items-center justify-between w-full pt-4 border-t border-border/50">
            <span className="text-primary font-bold">
              {addon.price}
            </span>
          </div>
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
          <Button
            asChild
            size="lg"
            className="gradient-primary text-primary-foreground hover:opacity-90 shadow-lg"
          >
            <Link href="#booking">Add to Your Package</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
