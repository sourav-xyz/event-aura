"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth-context';
import { userAPI } from '@/lib/api/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, Mail, Phone, MapPin, Shield, LogOut, Package, 
  Calendar, CreditCard, Edit2, Save, X, CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import {Navbar} from '@/components/navbar';
import {Footer} from '@/components/footer';

interface DashboardData {
  stats: {
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    totalSpent: number;
  };
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    event: { name: string; slug: string; coverImage: string };
    pricing: { total: number };
    status: string;
    createdAt: string;
    eventDetails: { eventDate: string };
  }>;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: 'Odisha',
    pincode: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || 'Odisha',
        pincode: user.address?.pincode || ''
      });
      fetchDashboard();
    }
  }, [user]);

  const fetchDashboard = async () => {
    try {
      const data = await userAPI.getDashboard() as { success: boolean } & DashboardData;
      if (data.success) {
        setDashboard(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await userAPI.updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        }
      });
      await refreshUser();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'cancelled': return <X className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
      'in-progress': 'bg-purple-100 text-purple-700 border-purple-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200'
    };
    return variants[status] || variants.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-2xl font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                  <p className="text-muted-foreground">{user.email}</p>
                  {user.role === 'admin' && (
                    <Badge variant="outline" className="mt-1 border-primary text-primary">
                      <Shield className="h-3 w-3 mr-1" /> Admin
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {user.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="outline" className="gap-2">
                      <Shield className="h-4 w-4" />
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
                <Button variant="destructive" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            {dashboard && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{dashboard.stats.totalOrders}</p>
                        <p className="text-xs text-muted-foreground">Total Orders</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{dashboard.stats.completedOrders}</p>
                        <p className="text-xs text-muted-foreground">Completed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-yellow-500/10">
                        <Clock className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{dashboard.stats.pendingOrders}</p>
                        <p className="text-xs text-muted-foreground">Pending</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <CreditCard className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">Rs.{dashboard.stats.totalSpent.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Total Spent</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Tabs */}
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="profile" className="gap-2">
                  <User className="h-4 w-4" /> Profile
                </TabsTrigger>
                <TabsTrigger value="orders" className="gap-2">
                  <Package className="h-4 w-4" /> Orders
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your profile details</CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
                        <Edit2 className="h-4 w-4" /> Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving} className="gradient-primary gap-2">
                          {isSaving ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                          Save
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FieldGroup>
                        <Field>
                          <FieldLabel className="flex items-center gap-2">
                            <User className="h-4 w-4" /> Full Name
                          </FieldLabel>
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={!isEditing}
                          />
                        </Field>
                        <Field>
                          <FieldLabel className="flex items-center gap-2">
                            <Mail className="h-4 w-4" /> Email
                          </FieldLabel>
                          <Input value={user.email} disabled className="bg-muted" />
                        </Field>
                        <Field>
                          <FieldLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4" /> Phone
                          </FieldLabel>
                          <Input
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            disabled={!isEditing}
                          />
                        </Field>
                      </FieldGroup>

                      <FieldGroup>
                        <Field>
                          <FieldLabel className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> Street Address
                          </FieldLabel>
                          <Input
                            value={formData.street}
                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                            disabled={!isEditing}
                            placeholder="Street address"
                          />
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                          <Field>
                            <FieldLabel>City</FieldLabel>
                            <Input
                              value={formData.city}
                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                              disabled={!isEditing}
                              placeholder="City"
                            />
                          </Field>
                          <Field>
                            <FieldLabel>Pincode</FieldLabel>
                            <Input
                              value={formData.pincode}
                              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                              disabled={!isEditing}
                              placeholder="Pincode"
                            />
                          </Field>
                        </div>
                        <Field>
                          <FieldLabel>State</FieldLabel>
                          <Input value={formData.state} disabled className="bg-muted" />
                        </Field>
                      </FieldGroup>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Orders</CardTitle>
                    <CardDescription>View and track your event bookings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {dashboard?.recentOrders && dashboard.recentOrders.length > 0 ? (
                      <div className="space-y-4">
                        {dashboard.recentOrders.map((order) => (
                          <Link key={order._id} href={`/orders/${order._id}`}>
                            <div className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                    {getStatusIcon(order.status)}
                                  </div>
                                  <div>
                                    <p className="font-semibold">{order.event.name}</p>
                                    <p className="text-sm text-muted-foreground">#{order.orderNumber}</p>
                                  </div>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(order.eventDetails.eventDate).toLocaleDateString('en-IN')}
                                  </div>
                                  <Badge className={getStatusBadge(order.status)}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </Badge>
                                  <p className="font-semibold">Rs.{order.pricing.total.toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-medium mb-2">No orders yet</p>
                        <p className="text-muted-foreground mb-4">Start planning your first event with us!</p>
                        <Link href="/events">
                          <Button className="gradient-primary">Browse Events</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
