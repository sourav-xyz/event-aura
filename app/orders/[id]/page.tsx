"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth-context';
import { orderAPI } from '@/lib/api/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, Clock, MapPin, Users, User, Mail, Phone,
  Package, CheckCircle, XCircle, AlertCircle, ArrowLeft,
  Star, Sparkles, Download, MessageCircle
} from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

interface Order {
  _id: string;
  orderNumber: string;
  event: { _id: string; name: string; slug: string; coverImage: string };
  category: { name: string };
  packageSelected: { name: string; price: number; features: string[] };
  themeSelected: { name: string; additionalPrice: number } | null;
  addonsSelected: Array<{ name: string; price: number }>;
  eventDetails: {
    eventDate: string;
    eventTime: string;
    venue: string;
    guestCount: number;
    specialRequests: string;
  };
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    alternatePhone: string;
  };
  pricing: {
    packagePrice: number;
    themePrice: number;
    addonsPrice: number;
    subtotal: number;
    discount: number;
    total: number;
  };
  status: string;
  statusHistory: Array<{ status: string; note: string; updatedAt: string }>;
  rating: { score: number; review: string; ratedAt: string } | null;
  createdAt: string;
}

const statusConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  confirmed: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
  'in-progress': { icon: AlertCircle, color: 'text-purple-600', bg: 'bg-purple-100' },
  completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' }
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState({ score: 5, review: '' });
  const [submittingRating, setSubmittingRating] = useState(false);

  const isSuccess = searchParams.get('success') === 'true';

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      fetchOrder();
    }
  }, [params.id, user, authLoading]);

  const fetchOrder = async () => {
    try {
      const data = await orderAPI.getById(params.id as string) as { success: boolean; order: Order };
      if (data.success) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
      router.push('/profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await orderAPI.cancel(params.id as string, 'Cancelled by user');
      fetchOrder();
    } catch (error) {
      console.error('Failed to cancel order:', error);
      alert('Failed to cancel order');
    }
  };

  const handleSubmitRating = async () => {
    setSubmittingRating(true);
    try {
      await orderAPI.addRating(params.id as string, rating.score, rating.review);
      setShowRating(false);
      fetchOrder();
    } catch (error) {
      console.error('Failed to submit rating:', error);
      alert('Failed to submit rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <Link href="/profile">
            <Button className="gradient-primary">Go to Profile</Button>
          </Link>
        </div>
      </div>
    );
  }

  const StatusIcon = statusConfig[order.status]?.icon || Clock;
  const statusColor = statusConfig[order.status]?.color || 'text-gray-600';
  const statusBg = statusConfig[order.status]?.bg || 'bg-gray-100';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/profile" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to orders
          </Link>

          {/* Success Banner */}
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Booking Confirmed!</h3>
                <p className="text-sm text-green-700">
                  Your order #{order.orderNumber} has been placed successfully. Our team will contact you shortly.
                </p>
              </div>
            </motion.div>
          )}

          {/* Order Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-serif font-bold mb-2">Order #{order.orderNumber}</h1>
                <p className="text-muted-foreground">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                  })}
                </p>
              </div>
              <Badge className={`${statusBg} ${statusColor} border-0 px-4 py-2 text-sm`}>
                <StatusIcon className="h-4 w-4 mr-2" />
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Event Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="w-16 h-16 rounded-lg gradient-primary flex items-center justify-center">
                      <Package className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{order.event.name}</h3>
                      <p className="text-sm text-muted-foreground">{order.category?.name}</p>
                      <Badge variant="outline" className="mt-1">{order.packageSelected.name} Package</Badge>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Event Date</p>
                        <p className="font-medium">
                          {new Date(order.eventDetails.eventDate).toLocaleDateString('en-IN', {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium">{order.eventDetails.eventTime}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Venue</p>
                        <p className="font-medium">{order.eventDetails.venue || 'To be confirmed'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Guest Count</p>
                        <p className="font-medium">{order.eventDetails.guestCount} guests</p>
                      </div>
                    </div>
                  </div>

                  {order.eventDetails.specialRequests && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-1">Special Requests</p>
                      <p>{order.eventDetails.specialRequests}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{order.contactInfo.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{order.contactInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{order.contactInfo.phone}</span>
                    </div>
                    {order.contactInfo.alternatePhone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{order.contactInfo.alternatePhone} (Alt)</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Status Timeline */}
              {order.statusHistory && order.statusHistory.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Status Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.statusHistory.map((history, idx) => {
                        const HistoryIcon = statusConfig[history.status]?.icon || Clock;
                        const historyColor = statusConfig[history.status]?.color || 'text-gray-600';
                        return (
                          <div key={idx} className="flex items-start gap-4">
                            <div className={`w-8 h-8 rounded-full ${statusConfig[history.status]?.bg || 'bg-gray-100'} flex items-center justify-center`}>
                              <HistoryIcon className={`h-4 w-4 ${historyColor}`} />
                            </div>
                            <div>
                              <p className="font-medium capitalize">{history.status}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(history.updatedAt).toLocaleString('en-IN')}
                              </p>
                              {history.note && <p className="text-sm mt-1">{history.note}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Rating Section */}
              {order.status === 'completed' && !order.rating && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      Rate Your Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!showRating ? (
                      <Button onClick={() => setShowRating(true)} className="gradient-primary">
                        Write a Review
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setRating({ ...rating, score: star })}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`h-8 w-8 transition-colors ${
                                  star <= rating.score
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        <Textarea
                          placeholder="Share your experience..."
                          value={rating.review}
                          onChange={(e) => setRating({ ...rating, review: e.target.value })}
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setShowRating(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSubmitRating} disabled={submittingRating} className="gradient-primary">
                            {submittingRating ? <Spinner className="h-4 w-4" /> : 'Submit Review'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Existing Rating */}
              {order.rating && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Review</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= order.rating!.score
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <p>{order.rating.review}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Reviewed on {new Date(order.rating.ratedAt).toLocaleDateString('en-IN')}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar - Pricing */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{order.packageSelected.name} Package</span>
                      <span>Rs.{order.pricing.packagePrice.toLocaleString()}</span>
                    </div>
                    
                    {order.themeSelected && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{order.themeSelected.name} Theme</span>
                        <span>Rs.{order.pricing.themePrice.toLocaleString()}</span>
                      </div>
                    )}

                    {order.addonsSelected?.length > 0 && order.addonsSelected.map((addon) => (
                      <div key={addon.name} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">• {addon.name}</span>
                        <span>Rs.{addon.price.toLocaleString()}</span>
                      </div>
                    ))}

                    {order.pricing.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-Rs.{order.pricing.discount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">Rs.{order.pricing.total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4">
                    {['pending', 'confirmed'].includes(order.status) && (
                      <Button 
                        variant="destructive" 
                        className="w-full" 
                        onClick={handleCancelOrder}
                      >
                        Cancel Order
                      </Button>
                    )}
                    
                    <Button variant="outline" className="w-full gap-2" asChild>
                      <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-4 w-4" />
                        Contact Support
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
