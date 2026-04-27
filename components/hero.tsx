"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Star } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export function Hero() {
  const images = [
    "https://images.unsplash.com/photo-1564485377539-4af72d1f6a2f?q=80&w=687&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?q=80&w=673&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1622519407650-3df9883f76a5?q=80&w=764&auto=format&fit=crop",
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 py-10">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=80"
          alt="Event decoration"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="flex items-center gap-1 bg-accent/20 px-4 py-2 rounded-full border border-accent/30">
              <Star className="h-4 w-4 text-accent fill-accent" />
              <span className="text-sm font-medium text-accent-foreground">
                Trusted by 500+ Happy Customers
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-balance"
          >
            Plan Your <span className="text-gradient">Perfect Event</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl text-pretty"
          >
            Weddings, Birthdays, Corporate Events & More. Transform your special
            moments into unforgettable memories with EventAura.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <Button
              asChild
              size="lg"
              className="gradient-primary text-primary-foreground hover:opacity-90 shadow-xl text-lg px-8 py-6"
            >
              <Link href="#booking">
                Book Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-primary/30 hover:bg-primary/10 text-lg px-8 py-6"
            >
              <Link href="#gallery">
                <Play className="mr-2 h-5 w-5" />
                View Our Work
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {images.map((src, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-card overflow-hidden"
                  >
                    <Image
                      src={src}
                      alt="Customer"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div>
                <p className="font-semibold text-foreground">10+ Events</p>
                <p className="text-sm text-muted-foreground">
                  Successfully Delivered
                </p>
              </div>
            </div>
            <div className="h-12 w-px bg-border hidden sm:block" />
            <div>
              <p className="font-semibold text-foreground">
                Bhubaneswar & Berhampur
              </p>
              <p className="text-sm text-muted-foreground">
                Serving Odisha with Excellence
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
