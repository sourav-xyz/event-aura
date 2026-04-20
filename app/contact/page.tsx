"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useToast } from "@/context/toast-context";
import { ButtonLoader } from "@/components/loading";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);
    setSubmitted(true);
    showToast("Message sent successfully! We'll get back to you soon.", "success");

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      value: "+91 98765 43210",
      link: "tel:+919876543210",
      description: "Mon-Sat: 9AM - 8PM",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "+91 98765 43210",
      link: "https://wa.me/919876543210",
      description: "Quick responses",
    },
    {
      icon: Mail,
      title: "Email",
      value: "hello@eventaura.com",
      link: "mailto:hello@eventaura.com",
      description: "We reply within 24 hours",
    },
    {
      icon: MapPin,
      title: "Address",
      value: "Bhubaneswar, Odisha",
      link: "https://maps.google.com/?q=Bhubaneswar",
      description: "Also serving Berhampur",
    },
  ];

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge className="mb-4 gradient-primary text-white border-0">
                <MessageCircle className="h-3 w-3 mr-1" /> Get in Touch
              </Badge>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance">
                We&apos;d Love to <span className="text-gradient">Hear From You</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Have questions about our services? Want to discuss your event? Reach out and
                we&apos;ll respond within 24 hours.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={info.title}
                  href={info.link}
                  target={info.title === "Address" ? "_blank" : undefined}
                  rel={info.title === "Address" ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="block"
                >
                  <Card className="border-border/50 h-full hover:border-primary/50 hover:shadow-lg transition-all group">
                    <CardContent className="p-5 text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <info.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                      <p className="text-sm text-primary font-medium mb-1">{info.value}</p>
                      <p className="text-xs text-muted-foreground">{info.description}</p>
                    </CardContent>
                  </Card>
                </motion.a>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-xl font-serif">Send us a Message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {submitted ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12"
                      >
                        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                        <p className="text-muted-foreground">
                          We&apos;ll get back to you within 24 hours.
                        </p>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Name *</label>
                            <Input
                              placeholder="Your name"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Phone *</label>
                            <Input
                              placeholder="+91 98765 43210"
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData({ ...formData, phone: e.target.value })
                              }
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Email *</label>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Subject</label>
                          <Input
                            placeholder="How can we help?"
                            value={formData.subject}
                            onChange={(e) =>
                              setFormData({ ...formData, subject: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Message *</label>
                          <textarea
                            placeholder="Tell us about your event..."
                            value={formData.message}
                            onChange={(e) =>
                              setFormData({ ...formData, message: e.target.value })
                            }
                            required
                            rows={5}
                            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full gradient-primary text-primary-foreground"
                          disabled={loading}
                        >
                          {loading ? (
                            <ButtonLoader />
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Map and Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                {/* Map */}
                <Card className="border-border/50 overflow-hidden">
                  <div className="aspect-video bg-muted">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119743.53610606964!2d85.75041859360098!3d20.300828330498905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909d2d5170aa5%3A0xfc580e2b68b33fa8!2sBhubaneswar%2C%20Odisha!5e0!3m2!1sen!2sin!4v1703123456789!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="EventAura Location"
                    />
                  </div>
                </Card>

                {/* Business Hours */}
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">Business Hours</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monday - Saturday</span>
                        <span className="font-medium text-foreground">9:00 AM - 8:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sunday</span>
                        <span className="font-medium text-foreground">10:00 AM - 6:00 PM</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Links */}
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
                    <div className="flex items-center gap-3">
                      {socialLinks.map((social) => (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                          aria-label={social.label}
                        >
                          <social.icon className="h-5 w-5" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <Card className="border-border/50 gradient-primary text-primary-foreground">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Quick Links</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" size="sm" asChild>
                        <Link href="/events">Browse Events</Link>
                      </Button>
                      <Button variant="secondary" size="sm" asChild>
                        <Link href="/faq">FAQs</Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                        asChild
                      >
                        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                          WhatsApp Us
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
