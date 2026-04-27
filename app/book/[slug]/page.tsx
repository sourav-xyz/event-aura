"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth-context';
import { orderAPI, eventAPI } from '@/lib/api/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, Clock, MapPin, Users, Check, ArrowLeft, 
  User, Mail, Phone, CreditCard, Sparkles
} from 'lucide-react';
import { Navbar } from '@/components/navbar';

interface BookingData {
  eventId: string;
  eventSlug: string;
  eventName: string;
  package: { name: string; price: number; features: string[] };
  theme: { name: string; additionalPrice: number } | null;
  addons: Array<{ name: string; price: number }>;
  total: number;
}

interface EventData {
  _id: string;
  name: string;
  category: { name: string };
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [event, setEvent] = useState<EventData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    eventDate: '',
    eventTime: '10:00',
    venue: '',
    guestCount: 50,
    specialRequests: '',
    name: '',
    email: '',
    phone: '',
    alternatePhone: ''
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/book/' + params.slug);
      return;
    }

    // Load booking data from session storage
    const storedData = sessionStorage.getItem('bookingData');
    if (storedData) {
      const data = JSON.parse(storedData) as BookingData;
      if (data.eventSlug === params.slug) {
        setBookingData(data);
        fetchEvent(data.eventId);
      } else {
        router.push('/events/' + params.slug);
      }
    } else {
      router.push('/events/' + params.slug);
    }
  }, [params.slug, user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        phone: user.phone
      }));
    }
  }, [user]);

  const fetchEvent = async (eventId: string) => {
    try {
      const data = await eventAPI.getBySlug(params.slug as string) as { success: boolean; event: EventData };
      if (data.success) {
        setEvent(data.event);
      }
    } catch (error) {
      console.error('Failed to fetch event:', error);
    }
  };

  const handleSubmit = async () => {
    if (!bookingData || !event) return;
    
    setIsSubmitting(true);
    try {
      const orderData = {
        event: bookingData.eventId,
        packageSelected: bookingData.package,
        themeSelected: bookingData.theme,
        addonsSelected: bookingData.addons,
        eventDetails: {
          eventDate: formData.eventDate,
          eventTime: formData.eventTime,
          venue: formData.venue,
          guestCount: formData.guestCount,
          specialRequests: formData.specialRequests
        },
        contactInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          alternatePhone: formData.alternatePhone
        },
        pricing: {
          packagePrice: bookingData.package.price,
          themePrice: bookingData.theme?.additionalPrice || 0,
          addonsPrice: bookingData.addons.reduce((sum, a) => sum + a.price, 0),
          subtotal: bookingData.total,
          total: bookingData.total
        }
      };

      const response = await orderAPI.create(orderData) as { success: boolean; order: { _id: string } };
      if (response.success) {
        sessionStorage.removeItem('bookingData');
        router.push('/orders/' + response.order._id + '?success=true');
      }
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || !bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 7);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href={`/events/${params.slug}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to event
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-2xl font-serif font-bold mb-2">Complete Your Booking</h1>
                <p className="text-muted-foreground">{bookingData.eventName}</p>
              </motion.div>

              {/* Progress Steps */}
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'gradient-primary text-white' : 'bg-muted'}`}>
                    {step > 1 ? <Check className="h-4 w-4" /> : '1'}
                  </div>
                  <span className="text-sm font-medium">Event Details</span>
                </div>
                <div className="flex-1 h-0.5 bg-muted" />
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'gradient-primary text-white' : 'bg-muted'}`}>
                    {step > 2 ? <Check className="h-4 w-4" /> : '2'}
                  </div>
                  <span className="text-sm font-medium">Contact Info</span>
                </div>
              </div>

              {/* Step 1: Event Details */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Event Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FieldGroup>
                        <div className="grid md:grid-cols-2 gap-4">
                          <Field>
                            <FieldLabel>Event Date *</FieldLabel>
                            <Input
                              type="date"
                              min={minDateStr}
                              value={formData.eventDate}
                              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                              required
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Book at least 7 days in advance
                            </p>
                          </Field>
                          <Field>
                            <FieldLabel>Preferred Time *</FieldLabel>
                            <Input
                              type="time"
                              value={formData.eventTime}
                              onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                              required
                            />
                          </Field>
                        </div>

                        <Field>
                          <FieldLabel className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> Venue / Location
                          </FieldLabel>
                          <Input
                            placeholder="Enter venue name and address"
                            value={formData.venue}
                            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                          />
                        </Field>

                        <Field>
                          <FieldLabel className="flex items-center gap-2">
                            <Users className="h-4 w-4" /> Expected Guest Count *
                          </FieldLabel>
                          <Input
                            type="number"
                            min={10}
                            max={500}
                            value={formData.guestCount}
                            onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) })}
                            required
                          />
                        </Field>

                        <Field>
                          <FieldLabel>Special Requests / Notes</FieldLabel>
                          <Textarea
                            placeholder="Any specific requirements, preferences, or special instructions..."
                            rows={4}
                            value={formData.specialRequests}
                            onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                          />
                        </Field>
                      </FieldGroup>

                      <div className="flex justify-end mt-6">
                        <Button 
                          className="gradient-primary"
                          onClick={() => setStep(2)}
                          disabled={!formData.eventDate}
                        >
                          Continue to Contact Info
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Contact Info */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FieldGroup>
                        <Field>
                          <FieldLabel className="flex items-center gap-2">
                            <User className="h-4 w-4" /> Full Name *
                          </FieldLabel>
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </Field>

                        <div className="grid md:grid-cols-2 gap-4">
                          <Field>
                            <FieldLabel className="flex items-center gap-2">
                              <Mail className="h-4 w-4" /> Email *
                            </FieldLabel>
                            <Input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              required
                            />
                          </Field>
                          <Field>
                            <FieldLabel className="flex items-center gap-2">
                              <Phone className="h-4 w-4" /> Phone *
                            </FieldLabel>
                            <Input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              required
                            />
                          </Field>
                        </div>

                        <Field>
                          <FieldLabel>Alternate Phone (Optional)</FieldLabel>
                          <Input
                            type="tel"
                            placeholder="Alternative contact number"
                            value={formData.alternatePhone}
                            onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                          />
                        </Field>
                      </FieldGroup>

                      <div className="flex justify-between mt-6">
                        <Button variant="outline" onClick={() => setStep(1)}>
                          Back
                        </Button>
                        <Button 
                          className="gradient-primary gap-2"
                          onClick={handleSubmit}
                          disabled={isSubmitting || !formData.name || !formData.email || !formData.phone}
                        >
                          {isSubmitting ? (
                            <>
                              <Spinner className="h-4 w-4" />
                              Placing Order...
                            </>
                          ) : (
                            <>
                              <CreditCard className="h-4 w-4" />
                              Confirm Booking
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold">{bookingData.eventName}</p>
                    <p className="text-sm text-muted-foreground">{event?.category?.name || 'Event'}</p>
                  </div>

                  <div className="border-t border-border pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{bookingData.package.name} Package</span>
                      <span>Rs.{bookingData.package.price.toLocaleString()}</span>
                    </div>

                    {bookingData.theme && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{bookingData.theme.name} Theme</span>
                        <span>Rs.{bookingData.theme.additionalPrice.toLocaleString()}</span>
                      </div>
                    )}

                    {bookingData.addons.length > 0 && (
                      <>
                        <div className="text-sm font-medium text-muted-foreground">Add-ons:</div>
                        {bookingData.addons.map((addon) => (
                          <div key={addon.name} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">• {addon.name}</span>
                            <span>Rs.{addon.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">Rs.{bookingData.total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Payment Info</p>
                    <p>Our team will contact you to confirm the booking and discuss payment options.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
