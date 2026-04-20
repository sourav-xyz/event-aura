"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, HelpCircle, Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: "Booking",
    question: "How do I book an event with EventAura?",
    answer:
      "Booking an event is simple! Browse our events, select your preferred package, choose add-ons, pick a date, and complete the booking form. Our team will contact you within 24 hours to confirm your booking.",
  },
  {
    category: "Booking",
    question: "What is the booking process?",
    answer:
      "1. Select your event type and package. 2. Customize with themes and add-ons. 3. Choose your event date and venue. 4. Fill in your details and submit. 5. Pay the advance amount. 6. Receive confirmation from our team.",
  },
  {
    category: "Booking",
    question: "How far in advance should I book?",
    answer:
      "We recommend booking at least 2-4 weeks in advance for standard events and 2-3 months for weddings and large corporate events to ensure availability and proper planning time.",
  },
  {
    category: "Pricing",
    question: "What payment methods do you accept?",
    answer:
      "We accept UPI (GPay, PhonePe, Paytm), bank transfers, credit/debit cards, and cash payments. A 30% advance is required to confirm your booking, with the remaining balance due before the event.",
  },
  {
    category: "Pricing",
    question: "Are there any hidden charges?",
    answer:
      "No hidden charges! The price you see includes everything mentioned in the package. Additional services and customizations are clearly priced separately. GST of 18% is applicable on the total amount.",
  },
  {
    category: "Pricing",
    question: "Do you offer customized packages?",
    answer:
      "Absolutely! We understand every event is unique. Contact us with your requirements, and our team will create a customized package tailored to your budget and preferences.",
  },
  {
    category: "Cancellation",
    question: "What is your cancellation policy?",
    answer:
      "Cancellations made 15+ days before: 80% refund. 7-14 days before: 50% refund. Less than 7 days: No refund. However, you can reschedule your event once without any additional charges.",
  },
  {
    category: "Cancellation",
    question: "Can I reschedule my event?",
    answer:
      "Yes, you can reschedule your event once without any charges, subject to availability. Additional rescheduling requests may incur a 10% rescheduling fee.",
  },
  {
    category: "Services",
    question: "What areas do you serve?",
    answer:
      "We currently serve Bhubaneswar, Berhampur, Cuttack, and surrounding areas in Odisha. We're expanding to more cities soon! Contact us for events in other locations.",
  },
  {
    category: "Services",
    question: "Do you provide catering services?",
    answer:
      "Yes! We have partnered with top caterers to provide vegetarian, non-vegetarian, and customized menu options. Catering is available as an add-on service for all events.",
  },
  {
    category: "Services",
    question: "Can you arrange venues?",
    answer:
      "While we primarily focus on decoration and event management, we have partnerships with various venues and can help you find the perfect location for your event.",
  },
  {
    category: "Support",
    question: "How can I contact customer support?",
    answer:
      "You can reach us via WhatsApp at +91 98765 43210, call us at the same number, email us at support@eventaura.com, or use the contact form on our website. We respond within 2-4 hours.",
  },
];

const categories = ["All", "Booking", "Pricing", "Cancellation", "Services", "Support"];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                <HelpCircle className="h-3 w-3 mr-1" /> Help Center
              </Badge>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance">
                Frequently Asked <span className="text-gradient">Questions</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Find answers to common questions about our services, booking process, and more.
              </p>

              {/* Search */}
              <div className="max-w-xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search for answers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 py-6 text-lg rounded-full border-border/50 bg-card shadow-lg"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-6 px-4 border-b border-border/50">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "gradient-primary" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ List */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length > 0 ? (
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`border-border/50 overflow-hidden transition-all ${
                        openIndex === index ? "border-primary/50 shadow-lg" : ""
                      }`}
                    >
                      <button
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="shrink-0 mt-0.5">
                            {faq.category}
                          </Badge>
                          <span className="font-medium text-foreground">{faq.question}</span>
                        </div>
                        <motion.div
                          animate={{ rotate: openIndex === index ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {openIndex === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-5 pb-5 pt-0">
                              <div className="pl-16 text-muted-foreground border-t border-border pt-4">
                                {faq.answer}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No results found</p>
                <p className="text-muted-foreground">Try adjusting your search or filter</p>
              </div>
            )}
          </div>
        </section>

        {/* Still Have Questions */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-border/50 gradient-primary text-primary-foreground overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
                    Still have questions?
                  </h2>
                  <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
                    Our team is here to help. Reach out to us and we&apos;ll get back to you within
                    2-4 hours.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button variant="secondary" size="lg" asChild>
                      <Link href="/contact">
                        <Mail className="h-5 w-5 mr-2" />
                        Contact Us
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                      asChild
                    >
                      <a
                        href="https://wa.me/919876543210"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        WhatsApp
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                      asChild
                    >
                      <a href="tel:+919876543210">
                        <Phone className="h-5 w-5 mr-2" />
                        Call Us
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
