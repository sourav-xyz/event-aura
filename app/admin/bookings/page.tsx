"use client"

import { useEffect, useState, useCallback } from "react"
import { api } from "@/lib/api/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  CalendarCheck, 
  Search, 
  Eye, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  MapPin,
  Users,
  Package,
  Phone,
  Mail,
  Clock,
  AlertCircle
} from "lucide-react"

interface Booking {
  _id: string
  trackingId: string
  name: string
  email: string
  phone: string
  eventType: string
  eventDate: string
  guestCount: number
  venue: string
  packageType: string
  customServices?: string[]
  additionalNotes?: string
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  totalAmount?: number
  createdAt: string
  updatedAt: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'in-progress': return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'completed': return 'bg-green-100 text-green-800 border-green-200'
    case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
    default: return 'bg-muted text-muted-foreground'
  }
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, pages: 0 })
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editStatus, setEditStatus] = useState('')
  const [editAmount, setEditAmount] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(statusFilter !== 'all' && { status: statusFilter }),
      })
      
      const data = await api.get<{
        success: boolean
        data: Booking[]
        pagination: Pagination
      }>(`/bookings?${params}`)
      
      if (data.success) {
        setBookings(data.data)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, statusFilter])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking)
    setViewModalOpen(true)
  }

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking)
    setEditStatus(booking.status)
    setEditAmount(booking.totalAmount?.toString() || '')
    setEditModalOpen(true)
  }

  const handleDelete = (booking: Booking) => {
    setSelectedBooking(booking)
    setDeleteModalOpen(true)
  }

  const handleUpdateBooking = async () => {
    if (!selectedBooking) return
    
    try {
      setActionLoading(true)
      const data = await api.put<{ success: boolean }>(`/bookings/${selectedBooking._id}`, {
        status: editStatus,
        totalAmount: editAmount ? parseFloat(editAmount) : undefined,
      })
      
      if (data.success) {
        setEditModalOpen(false)
        fetchBookings()
      }
    } catch (error) {
      console.error('Failed to update booking:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteBooking = async () => {
    if (!selectedBooking) return
    
    try {
      setActionLoading(true)
      const data = await api.delete<{ success: boolean }>(`/bookings/${selectedBooking._id}`)
      
      if (data.success) {
        setDeleteModalOpen(false)
        fetchBookings()
      }
    } catch (error) {
      console.error('Failed to delete booking:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const filteredBookings = bookings.filter(booking => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      booking.trackingId.toLowerCase().includes(query) ||
      booking.name.toLowerCase().includes(query) ||
      booking.email.toLowerCase().includes(query) ||
      booking.phone.includes(query)
    )
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground">Bookings</h1>
        <p className="text-muted-foreground mt-1">Manage all event booking requests</p>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by tracking ID, name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-serif flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-primary" />
            Booking Requests
            <Badge variant="secondary" className="ml-2">{pagination.total}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CalendarCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No bookings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Tracking ID</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden md:table-cell">Event</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden lg:table-cell">Date</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden lg:table-cell">Package</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr 
                      key={booking._id} 
                      className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-2">
                        <span className="font-mono text-sm font-medium text-primary">
                          {booking.trackingId}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium text-foreground text-sm">{booking.name}</p>
                          <p className="text-xs text-muted-foreground">{booking.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-2 hidden md:table-cell text-sm text-foreground">
                        {booking.eventType}
                      </td>
                      <td className="py-3 px-2 hidden lg:table-cell text-sm text-muted-foreground">
                        {formatDate(booking.eventDate)}
                      </td>
                      <td className="py-3 px-2">
                        <Badge className={`${getStatusColor(booking.status)} capitalize`}>
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 hidden lg:table-cell text-sm text-foreground">
                        {booking.packageType}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleView(booking)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleEdit(booking)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(booking)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.pages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" />
              Booking Details
            </DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Tracking ID</p>
                  <p className="font-mono text-lg font-bold text-primary">{selectedBooking.trackingId}</p>
                </div>
                <Badge className={`${getStatusColor(selectedBooking.status)} capitalize text-sm px-3 py-1`}>
                  {selectedBooking.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Customer Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{selectedBooking.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{selectedBooking.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{selectedBooking.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Event Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{selectedBooking.eventType}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{formatDate(selectedBooking.eventDate)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{selectedBooking.venue}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{selectedBooking.guestCount} guests</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Package
                </h4>
                <p className="text-foreground">{selectedBooking.packageType}</p>
                {selectedBooking.customServices && selectedBooking.customServices.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedBooking.customServices.map((service, index) => (
                      <Badge key={index} variant="secondary">{service}</Badge>
                    ))}
                  </div>
                )}
              </div>

              {selectedBooking.additionalNotes && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Additional Notes</h4>
                  <p className="text-muted-foreground text-sm p-3 bg-muted rounded-lg">
                    {selectedBooking.additionalNotes}
                  </p>
                </div>
              )}

              {selectedBooking.totalAmount && (
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                  <span className="font-semibold text-foreground">Total Amount</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(selectedBooking.totalAmount)}
                  </span>
                </div>
              )}

              <div className="text-sm text-muted-foreground border-t border-border pt-4">
                <p>Created: {formatDateTime(selectedBooking.createdAt)}</p>
                <p>Last Updated: {formatDateTime(selectedBooking.updatedAt)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Update Booking</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Tracking ID</p>
                <p className="font-mono font-medium">{selectedBooking.trackingId}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editStatus">Status</Label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger id="editStatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editAmount">Total Amount (INR)</Label>
                <Input
                  id="editAmount"
                  type="number"
                  placeholder="Enter amount"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBooking} disabled={actionLoading}>
              {actionLoading ? 'Updating...' : 'Update Booking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Delete Booking
            </DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Are you sure you want to delete this booking? This action cannot be undone.
              </p>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-mono font-medium">{selectedBooking.trackingId}</p>
                <p className="text-sm text-muted-foreground">{selectedBooking.name} - {selectedBooking.eventType}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBooking} disabled={actionLoading}>
              {actionLoading ? 'Deleting...' : 'Delete Booking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
