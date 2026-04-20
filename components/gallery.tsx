"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"
import { X, ZoomIn } from "lucide-react"

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    alt: "Wedding Decoration",
    category: "Wedding",
  },
  {
    src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
    alt: "Birthday Party",
    category: "Birthday",
  },
  {
    src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
    alt: "Party Decoration",
    category: "Party",
  },
  {
    src: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80",
    alt: "Corporate Event",
    category: "Corporate",
  },
  {
    src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
    alt: "Wedding Venue",
    category: "Wedding",
  },
  {
    src: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80",
    alt: "Event Setup",
    category: "Event",
  },
  {
    src: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800&q=80",
    alt: "Party Lights",
    category: "Party",
  },
  {
    src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=80",
    alt: "Wedding Ceremony",
    category: "Wedding",
  },
]

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <section id="gallery" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Portfolio</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 text-balance">
            Our <span className="text-gradient">Gallery</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            A glimpse of our beautiful event decorations and setups that made moments magical.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={`relative group cursor-pointer overflow-hidden rounded-2xl shadow-md hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 ${
                index === 0 || index === 5 ? "md:col-span-2 md:row-span-2" : ""
              }`}
              onClick={() => setSelectedImage(image.src)}
            >
              <div className={`relative ${
                index === 0 || index === 5 ? "aspect-square" : "aspect-[4/3]"
              }`}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-75">
                  <div className="w-14 h-14 rounded-full bg-card/95 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <ZoomIn className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full shadow-md">
                    {image.category}
                  </span>
                  <p className="text-white text-sm mt-2 font-medium">{image.alt}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-background hover:text-background/80 transition-colors"
              onClick={() => setSelectedImage(null)}
              aria-label="Close"
            >
              <X className="h-8 w-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative max-w-5xl max-h-[90vh] w-full h-full"
            >
              <Image
                src={selectedImage}
                alt="Gallery image"
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
