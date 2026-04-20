"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { eventAPI } from '@/lib/api/config';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { 
  Star, MapPin, Clock, Users, Check, X, ChevronRight,
  Heart, Cake, Sparkles, Gift, Building, GraduationCap, 
  Baby, Home, Camera, Music, UtensilsCrossed, Mic, Plus, Minus
} from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

interface Package {
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular: boolean;
}

interface Theme {
  name: string;
  description: string;
  color: string;
  additionalPrice: number;
}

interface Addon {
  name: string;
  description: string;
  price: number;
  icon: string;
}

interface Event {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  gallery: string[];
  packages: Package[];
  themes: Theme[];
  addons: Addon[];
  basePrice: number;
  duration: string;
  capacity: { min: number; max: number };
  locations: string[];
  features: string[];
  inclusions: string[];
  exclusions: string[];
  faqs: Array<{ question: string; answer: string }>;
  rating: { average: number; count: number };
  category: { name: string; slug: string; icon: string; color: string };
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart, Cake, Sparkles, Gift, Building, GraduationCap, Baby, Home,
  Camera, Music, UtensilsCrossed, Mic
};

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (params.slug) {
      fetchEvent();
    }
  }, [params.slug]);

  const fetchEvent = async () => {
    try {
      const data = await eventAPI.getBySlug(params.slug as string) as { success: boolean; event: Event };
      if (data.success) {
        setEvent(data.event);
        // Set default package (Gold/Popular)
        const popularPkg = data.event.packages.find(p => p.isPopular) || data.event.packages[0];
        setSelectedPackage(popularPkg);
      }
    } catch (error) {
      console.error('Failed to fetch event:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    return iconMap[iconName] || Sparkles;
  };

  const calculateTotal = () => {
    let total = selectedPackage?.price || 0;
    if (selectedTheme) total += selectedTheme.additionalPrice;
    selectedAddons.forEach(addon => total += addon.price);
    return total;
  };

  const toggleAddon = (addon: Addon) => {
    if (selectedAddons.find(a => a.name === addon.name)) {
      setSelectedAddons(selectedAddons.filter(a => a.name !== addon.name));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleBookNow = () => {
    if (!user) {
      router.push('/login?redirect=/events/' + params.slug);
      return;
    }
    // Store selections and navigate to booking
    const bookingData = {
      eventId: event?._id,
      eventSlug: event?.slug,
      eventName: event?.name,
      package: selectedPackage,
      theme: selectedTheme,
      addons: selectedAddons,
      total: calculateTotal()
    };
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    router.push('/book/' + event?.slug);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <p className="text-muted-foreground mb-4">The event you are looking for does not exist.</p>
          <Link href="/events">
            <Button className="gradient-primary">Browse Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  const CategoryIcon = getIcon(event.category?.icon || 'Sparkles');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16">
        {/* Breadcrumb */}
        <div className="px-4 py-4 border-b border-border/50 bg-muted/30">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link href="/events" className="text-muted-foreground hover:text-foreground">Events</Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link href={`/categories/${event.category.slug}`} className="text-muted-foreground hover:text-foreground">{event.category.name}</Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">{event.name}</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left - Event Image */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
              >
                <div 
                  className="aspect-video rounded-2xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${event.category.color}30, ${event.category.color}10)` }}
                >
                  <div 
                    className="w-32 h-32 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: event.category.color }}
                  >
                    <CategoryIcon className="h-16 w-16 text-white" />
                  </div>
                </div>
                {event.rating.count > 0 && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-md">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{event.rating.average.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm">({event.rating.count} reviews)</span>
                  </div>
                )}
              </motion.div>

              {/* Right - Event Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <Badge 
                    variant="outline" 
                    className="mb-3"
                    style={{ borderColor: event.category.color, color: event.category.color }}
                  >
                    {event.category.name}
                  </Badge>
                  <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">{event.name}</h1>
                  <p className="text-lg text-muted-foreground">{event.shortDescription}</p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>{event.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>{event.capacity.min}-{event.capacity.max} guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>{event.locations.join(' & ')}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">Rs.{event.basePrice.toLocaleString()}</span>
                    <span className="text-muted-foreground">onwards</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 gradient-primary" size="lg" onClick={handleBookNow}>
                    Book Now
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2">
                    <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      WhatsApp Us
                    </a>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="packages" className="space-y-8">
              <TabsList className="w-full justify-start bg-muted/50 p-1 h-auto flex-wrap">
                <TabsTrigger value="packages" className="flex-1 md:flex-none">Packages</TabsTrigger>
                <TabsTrigger value="themes" className="flex-1 md:flex-none">Themes</TabsTrigger>
                <TabsTrigger value="addons" className="flex-1 md:flex-none">Add-ons</TabsTrigger>
                <TabsTrigger value="details" className="flex-1 md:flex-none">Details</TabsTrigger>
                <TabsTrigger value="faq" className="flex-1 md:flex-none">FAQ</TabsTrigger>
              </TabsList>

              {/* Packages Tab */}
              <TabsContent value="packages">
                <div className="grid md:grid-cols-3 gap-6">
                  {event.packages.map((pkg) => (
                    <Card 
                      key={pkg.name}
                      className={`relative cursor-pointer transition-all ${
                        selectedPackage?.name === pkg.name 
                          ? 'border-primary shadow-lg ring-2 ring-primary/20' 
                          : 'border-border/50 hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedPackage(pkg)}
                    >
                      {pkg.isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="gradient-primary text-white border-0">Most Popular</Badge>
                        </div>
                      )}
                      <CardHeader className="text-center pb-4">
                        <CardTitle className="text-xl">{pkg.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{pkg.description}</p>
                        <div className="pt-4">
                          <span className="text-3xl font-bold">Rs.{pkg.price.toLocaleString()}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {pkg.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button 
                          className={`w-full mt-6 ${selectedPackage?.name === pkg.name ? 'gradient-primary' : ''}`}
                          variant={selectedPackage?.name === pkg.name ? 'default' : 'outline'}
                        >
                          {selectedPackage?.name === pkg.name ? 'Selected' : 'Select Package'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Themes Tab */}
              <TabsContent value="themes">
                <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {event.themes.map((theme) => (
                    <Card 
                      key={theme.name}
                      className={`cursor-pointer transition-all ${
                        selectedTheme?.name === theme.name 
                          ? 'border-primary shadow-lg ring-2 ring-primary/20' 
                          : 'border-border/50 hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedTheme(selectedTheme?.name === theme.name ? null : theme)}
                    >
                      <CardContent className="p-4 text-center">
                        <div 
                          className="w-12 h-12 rounded-full mx-auto mb-3"
                          style={{ backgroundColor: theme.color }}
                        />
                        <h4 className="font-semibold mb-1">{theme.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{theme.description}</p>
                        <p className="text-sm font-medium text-primary">
                          +Rs.{theme.additionalPrice.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Add-ons Tab */}
              <TabsContent value="addons">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {event.addons.map((addon) => {
                    const AddonIcon = getIcon(addon.icon);
                    const isSelected = selectedAddons.some(a => a.name === addon.name);
                    return (
                      <Card 
                        key={addon.name}
                        className={`cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-primary shadow-lg ring-2 ring-primary/20' 
                            : 'border-border/50 hover:border-primary/50'
                        }`}
                        onClick={() => toggleAddon(addon)}
                      >
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <AddonIcon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold">{addon.name}</h4>
                            <p className="text-xs text-muted-foreground truncate">{addon.description}</p>
                            <p className="text-sm font-medium text-primary mt-1">
                              Rs.{addon.price.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            {isSelected ? (
                              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                <Minus className="h-4 w-4 text-white" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                                <Plus className="h-4 w-4 text-primary" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">About This Event</h3>
                    <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                    
                    <h3 className="text-lg font-semibold mt-8 mb-4">Features</h3>
                    <ul className="space-y-2">
                      {event.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">{"What's Included"}</h3>
                    <ul className="space-y-2 mb-8">
                      {event.inclusions.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <h3 className="text-lg font-semibold mb-4">Not Included</h3>
                    <ul className="space-y-2">
                      {event.exclusions.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                          <X className="h-4 w-4 text-red-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              {/* FAQ Tab */}
              <TabsContent value="faq">
                <div className="max-w-3xl">
                  {event.faqs.map((faq, idx) => (
                    <div key={idx} className="border-b border-border/50 last:border-0">
                      <button
                        className="w-full py-4 flex items-center justify-between text-left"
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      >
                        <span className="font-medium">{faq.question}</span>
                        <ChevronRight className={`h-5 w-5 transition-transform ${openFaq === idx ? 'rotate-90' : ''}`} />
                      </button>
                      {openFaq === idx && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="pb-4 text-muted-foreground"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Sticky Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border p-4 z-40">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Estimated Total</p>
              <p className="text-2xl font-bold text-primary">Rs.{calculateTotal().toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                {selectedPackage?.name} Package
                {selectedTheme && ` + ${selectedTheme.name} Theme`}
                {selectedAddons.length > 0 && ` + ${selectedAddons.length} add-ons`}
              </p>
            </div>
            <Button className="gradient-primary px-8" size="lg" onClick={handleBookNow}>
              Proceed to Book
            </Button>
          </div>
        </div>
      </main>

      <div className="h-24" /> {/* Spacer for sticky bar */}
      <Footer />
    </div>
  );
}
