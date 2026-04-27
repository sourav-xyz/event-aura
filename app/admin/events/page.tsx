"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api/config"
import { 
  Plus, 
  Pencil, 
  Trash2,
  Calendar,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
  Eye
} from "lucide-react"
import Link from "next/link"

interface Event {
  _id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  category: { _id: string; name: string }
  images: string[]
  packages: Array<{ name: string; price: number; features: string[] }>
  themes: Array<{ name: string; price: number; description: string }>
  addons: Array<{ name: string; price: number; description: string }>
  isActive: boolean
  isFeatured: boolean
  createdAt: string
}

interface Category {
  _id: string
  name: string
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    category: "",
    basePrice: 0,
    coverImage: "",
    images: [""],
    packages: [{ name: "Silver", price: 15000, features: [""] }],
    themes: [{ name: "", price: 0, description: "" }],
    addons: [{ name: "", price: 0, description: "" }],
    isActive: true,
    isFeatured: false
  })

  useEffect(() => {
    fetchEvents()
    fetchCategories()
  }, [page])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/events?page=${page}&limit=10`)
      setEvents(response.data.data.events)
      setTotalPages(response.data.data.totalPages)
    } catch (error) {
      console.error("Failed to fetch events:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories")
      setCategories(response.data.categories)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      // Fallback categories with valid MongoDB ObjectIds
      const fallbackCategories = [
        { _id: "000000000000000000000001", name: "Wedding" },
        { _id: "000000000000000000000002", name: "Birthday" },
        { _id: "000000000000000000000003", name: "Thread Ceremony" },
        { _id: "000000000000000000000004", name: "Surprise Party" },
        { _id: "000000000000000000000005", name: "Corporate Event" },
        { _id: "000000000000000000000006", name: "College Event" },
        { _id: "000000000000000000000007", name: "Baby Shower" },
        { _id: "000000000000000000000008", name: "Anniversary" },
        { _id: "000000000000000000000009", name: "Housewarming" },
      ]
      setCategories(fallbackCategories)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const filteredImages = formData.images.filter(img => img.trim() !== "")
      const payload = {
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription,
        category: formData.category,
        basePrice: formData.basePrice,
        coverImage: formData.coverImage || (filteredImages[0] || ""),
        gallery: filteredImages,
        packages: formData.packages.filter(pkg => pkg.name.trim() !== ""),
        themes: formData.themes.filter(theme => theme.name.trim() !== ""),
        addons: formData.addons.filter(addon => addon.name.trim() !== ""),
        isActive: formData.isActive,
        isFeatured: formData.isFeatured
      }
      
      if (editingEvent) {
        await api.put(`/events/${editingEvent._id}`, payload)
      } else {
        await api.post("/events", payload)
      }
      fetchEvents()
      resetForm()
    } catch (error) {
      console.error("Failed to save event:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      name: event.name,
      description: event.description,
      shortDescription: event.shortDescription,
      category: event.category?._id || "",
      basePrice: event.basePrice || 0,
      coverImage: event.coverImage || "",
      images: event.gallery && event.gallery.length > 0 ? event.gallery : [""],
      packages: event.packages.length > 0 ? event.packages : [{ name: "Silver", price: 15000, features: [""] }],
      themes: event.themes.length > 0 ? event.themes : [{ name: "", price: 0, description: "" }],
      addons: event.addons.length > 0 ? event.addons : [{ name: "", price: 0, description: "" }],
      isActive: event.isActive,
      isFeatured: event.isFeatured
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return
    try {
      setDeleting(id)
      await api.delete(`/events/${id}`)
      fetchEvents()
    } catch (error) {
      console.error("Failed to delete event:", error)
    } finally {
      setDeleting(null)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingEvent(null)
    setFormData({
      name: "",
      description: "",
      shortDescription: "",
      category: "",
      basePrice: 0,
      coverImage: "",
      images: [""],
      packages: [{ name: "Silver", price: 15000, features: [""] }],
      themes: [{ name: "", price: 0, description: "" }],
      addons: [{ name: "", price: 0, description: "" }],
      isActive: true,
      isFeatured: false
    })
  }

  const addPackage = () => {
    setFormData({
      ...formData,
      packages: [...formData.packages, { name: "", price: 0, features: [""] }]
    })
  }

  const removePackage = (index: number) => {
    setFormData({
      ...formData,
      packages: formData.packages.filter((_, i) => i !== index)
    })
  }

  const addTheme = () => {
    setFormData({
      ...formData,
      themes: [...formData.themes, { name: "", price: 0, description: "" }]
    })
  }

  const removeTheme = (index: number) => {
    setFormData({
      ...formData,
      themes: formData.themes.filter((_, i) => i !== index)
    })
  }

  const addAddon = () => {
    setFormData({
      ...formData,
      addons: [...formData.addons, { name: "", price: 0, description: "" }]
    })
  }

  const removeAddon = (index: number) => {
    setFormData({
      ...formData,
      addons: formData.addons.filter((_, i) => i !== index)
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(search.toLowerCase()) ||
    event.category?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground">Events</h1>
          <p className="text-muted-foreground mt-1">Manage event services and packages</p>
        </div>
        <Button 
          className="gradient-primary text-primary-foreground"
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-serif">
              {editingEvent ? "Edit Event" : "Add New Event"}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={resetForm}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-foreground border-b border-border pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Event Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Royal Wedding Package"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Short Description</label>
                  <Input
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Brief one-liner about the event"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Base Price</label>
                    <Input
                      type="number"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: parseInt(e.target.value) || 0 })}
                      placeholder="e.g., 15000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Cover Image URL</label>
                    <Input
                      value={formData.coverImage}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed description..."
                    rows={4}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-border"
                    />
                    <label htmlFor="isActive" className="text-sm text-foreground">Active</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded border-border"
                    />
                    <label htmlFor="isFeatured" className="text-sm text-foreground">Featured</label>
                  </div>
                </div>
              </div>

              {/* Packages */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h3 className="font-medium text-foreground">Packages</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addPackage}>
                    <Plus className="h-4 w-4 mr-1" /> Add Package
                  </Button>
                </div>
                {formData.packages.map((pkg, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Package {index + 1}</span>
                      {formData.packages.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removePackage(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        value={pkg.name}
                        onChange={(e) => {
                          const newPackages = [...formData.packages]
                          newPackages[index].name = e.target.value
                          setFormData({ ...formData, packages: newPackages })
                        }}
                        placeholder="Package name (e.g., Silver)"
                      />
                      <Input
                        type="number"
                        value={pkg.price}
                        onChange={(e) => {
                          const newPackages = [...formData.packages]
                          newPackages[index].price = parseInt(e.target.value) || 0
                          setFormData({ ...formData, packages: newPackages })
                        }}
                        placeholder="Price"
                      />
                    </div>
                    <Input
                      value={pkg.features.join(", ")}
                      onChange={(e) => {
                        const newPackages = [...formData.packages]
                        newPackages[index].features = e.target.value.split(",").map(f => f.trim())
                        setFormData({ ...formData, packages: newPackages })
                      }}
                      placeholder="Features (comma-separated)"
                    />
                  </div>
                ))}
              </div>

              {/* Themes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h3 className="font-medium text-foreground">Themes</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addTheme}>
                    <Plus className="h-4 w-4 mr-1" /> Add Theme
                  </Button>
                </div>
                {formData.themes.map((theme, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Theme {index + 1}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeTheme(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        value={theme.name}
                        onChange={(e) => {
                          const newThemes = [...formData.themes]
                          newThemes[index].name = e.target.value
                          setFormData({ ...formData, themes: newThemes })
                        }}
                        placeholder="Theme name"
                      />
                      <Input
                        type="number"
                        value={theme.price}
                        onChange={(e) => {
                          const newThemes = [...formData.themes]
                          newThemes[index].price = parseInt(e.target.value) || 0
                          setFormData({ ...formData, themes: newThemes })
                        }}
                        placeholder="Price"
                      />
                    </div>
                    <Input
                      value={theme.description}
                      onChange={(e) => {
                        const newThemes = [...formData.themes]
                        newThemes[index].description = e.target.value
                        setFormData({ ...formData, themes: newThemes })
                      }}
                      placeholder="Description"
                    />
                  </div>
                ))}
              </div>

              {/* Add-ons */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h3 className="font-medium text-foreground">Add-ons</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addAddon}>
                    <Plus className="h-4 w-4 mr-1" /> Add Add-on
                  </Button>
                </div>
                {formData.addons.map((addon, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Add-on {index + 1}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeAddon(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        value={addon.name}
                        onChange={(e) => {
                          const newAddons = [...formData.addons]
                          newAddons[index].name = e.target.value
                          setFormData({ ...formData, addons: newAddons })
                        }}
                        placeholder="Add-on name"
                      />
                      <Input
                        type="number"
                        value={addon.price}
                        onChange={(e) => {
                          const newAddons = [...formData.addons]
                          newAddons[index].price = parseInt(e.target.value) || 0
                          setFormData({ ...formData, addons: newAddons })
                        }}
                        placeholder="Price"
                      />
                    </div>
                    <Input
                      value={addon.description}
                      onChange={(e) => {
                        const newAddons = [...formData.addons]
                        newAddons[index].description = e.target.value
                        setFormData({ ...formData, addons: newAddons })
                      }}
                      placeholder="Description"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button type="submit" className="gradient-primary text-primary-foreground" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : editingEvent ? "Update Event" : "Create Event"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card className="border-none shadow-md">
        <CardContent className="p-4">
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-serif">All Events</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredEvents.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Event</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden md:table-cell">Category</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden lg:table-cell">Packages</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map((event) => (
                      <tr key={event._id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            {event.images[0] && (
                              <img 
                                src={event.images[0]} 
                                alt={event.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-foreground">{event.name}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{event.shortDescription}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 hidden md:table-cell">
                          <span className="px-2 py-1 bg-muted rounded-full text-xs font-medium">
                            {event.category?.name}
                          </span>
                        </td>
                        <td className="py-3 px-2 hidden lg:table-cell">
                          <div className="text-sm">
                            {event.packages.slice(0, 2).map((pkg, idx) => (
                              <span key={idx} className="block text-muted-foreground">
                                {pkg.name}: {formatCurrency(pkg.price)}
                              </span>
                            ))}
                            {event.packages.length > 2 && (
                              <span className="text-xs text-muted-foreground">+{event.packages.length - 2} more</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              event.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {event.isActive ? "Active" : "Inactive"}
                            </span>
                            {event.isFeatured && (
                              <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Featured
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <Link href={`/events/${event.slug}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(event)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive"
                              onClick={() => handleDelete(event._id)}
                              disabled={deleting === event._id}
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

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No events found</p>
              <Button 
                className="mt-4 gradient-primary text-primary-foreground"
                onClick={() => setShowForm(true)}
              >
                Create your first event
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
