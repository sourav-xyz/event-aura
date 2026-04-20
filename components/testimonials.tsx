"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Wedding Client",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    rating: 5,
    text: "EventAura made our wedding absolutely magical! Every detail was perfect, from the mandap decoration to the reception setup. The team understood our vision and executed it flawlessly.",
  },
  {
    name: "Rajesh Patel",
    role: "Corporate Event",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    rating: 5,
    text: "We hired EventAura for our company's annual conference and they exceeded all expectations. Professional, punctual, and incredibly creative. Highly recommended for corporate events!",
  },
  {
    name: "Sneha Das",
    role: "Birthday Party",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    rating: 5,
    text: "The surprise birthday party they organized for my husband was beyond amazing! The theme, decorations, and coordination were all top-notch. Thank you for making it so special!",
  },
  {
    name: "Amit Mohapatra",
    role: "Baby Shower",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    rating: 5,
    text: "The baby shower decoration was so beautiful and cute! Everyone loved the pastel theme and attention to detail. EventAura truly knows how to make events memorable.",
  },
  {
    name: "Ananya Mishra",
    role: "Anniversary",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
    rating: 5,
    text: "Celebrated our 25th anniversary with EventAura and it was like reliving our wedding day! The romantic setup with flowers and fairy lights was breathtaking.",
  },
  {
    name: "Vikram Reddy",
    role: "Housewarming",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    rating: 5,
    text: "Our housewarming ceremony was beautifully decorated with traditional touches. The marigold arrangements and entrance decor received so many compliments from guests!",
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 text-balance">
            What Our <span className="text-gradient">Clients Say</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Don&apos;t just take our word for it — hear from our happy customers who trusted us with their special moments.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-border/50 bg-card hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-primary/30 mb-4" />
                  <p className="text-muted-foreground mb-6 leading-relaxed">{testimonial.text}</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
