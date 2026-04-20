"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, MessageCircle, Clock, Instagram, Facebook, Youtube } from "lucide-react"
import Link from "next/link"

const contactInfo = [
  {
    icon: Phone,
    title: "Call Us",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "+91 98765 43210",
    href: "https://wa.me/919876543210",
  },
  {
    icon: Mail,
    title: "Email",
    value: "hello@eventaura.in",
    href: "mailto:hello@eventaura.in",
  },
  {
    icon: Clock,
    title: "Working Hours",
    value: "Mon - Sat: 9AM - 8PM",
    href: "#",
  },
]

export function Contact() {
  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Contact</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 text-balance">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Have questions? We&apos;re here to help. Reach out to us through any of these channels.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {contactInfo.map((info, index) => (
                <Card key={info.title} className="border-border/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                  <CardContent className="p-5">
                    <Link href={info.href} className="flex items-start gap-4">
                      <div className="gradient-primary p-3 rounded-xl shrink-0">
                        <info.icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{info.title}</p>
                        <p className="font-semibold text-foreground">{info.value}</p>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="gradient-primary p-3 rounded-xl shrink-0">
                    <MapPin className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Our Locations</p>
                    <p className="font-semibold text-foreground mb-1">Bhubaneswar & Berhampur, Odisha</p>
                    <p className="text-sm text-muted-foreground">Serving events across Odisha</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Follow Us:</span>
                  <div className="flex gap-2">
                    <Link href="#" className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                      <Instagram className="h-5 w-5" />
                    </Link>
                    <Link href="#" className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                      <Facebook className="h-5 w-5" />
                    </Link>
                    <Link href="#" className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                      <Youtube className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="h-[400px] lg:h-full min-h-[400px] rounded-2xl overflow-hidden border border-border/50"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d239487.1824686893!2d85.67408285!3d20.30074555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909d2d5170aa5%3A0xfc580e2b68b33fa8!2sBhubaneswar%2C%20Odisha!5e0!3m2!1sen!2sin!4v1699999999999!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="EventAura Location"
            />
          </motion.div>
        </div>

        {/* WhatsApp Floating Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <Link
            href="https://wa.me/919876543210?text=Hi! I'm interested in your event services."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <MessageCircle className="h-6 w-6 fill-white" />
            <span className="font-medium hidden sm:inline">Chat on WhatsApp</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
