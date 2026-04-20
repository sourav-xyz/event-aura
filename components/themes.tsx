"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

const themes = [
  {
    name: "Romantic Theme",
    description: "Soft florals, fairy lights, and dreamy pastels for intimate celebrations",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
    color: "from-rose-400 to-pink-500",
  },
  {
    name: "Royal Theme",
    description: "Majestic decor with rich velvets, gold accents, and regal elegance",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    color: "from-amber-400 to-yellow-500",
  },
  {
    name: "Kids Theme",
    description: "Colorful, playful setups with cartoon characters and fun elements",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
    color: "from-cyan-400 to-blue-500",
  },
  {
    name: "Traditional Theme",
    description: "Cultural richness with marigolds, diyas, and ethnic decorations",
    image: "https://images.unsplash.com/photo-1604604994333-f1b0e9471186?w=600&q=80",
    color: "from-orange-400 to-red-500",
  },
  {
    name: "Bollywood Theme",
    description: "Glamorous filmi style with vibrant colors and dramatic setups",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
    color: "from-purple-400 to-pink-500",
  },
]

export function Themes() {
  return (
    <section id="themes" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Themes</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 text-balance">
            Choose Your <span className="text-gradient">Style</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            From romantic to royal, traditional to trendy — pick a theme that reflects your personality.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme, index) => (
            <motion.div
              key={theme.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={index === 0 ? "lg:col-span-2" : ""}
            >
              <Card className="group h-full overflow-hidden border-border/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={theme.image}
                    alt={theme.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${theme.color} text-white text-xs font-semibold mb-3`}>
                      {theme.name}
                    </div>
                    <p className="text-white/90 text-sm">{theme.description}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <Button asChild variant="ghost" className="w-full hover:bg-primary/10 hover:text-primary">
                    <Link href="#booking">Select This Theme</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
