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
  FolderOpen,
  X,
  Save
} from "lucide-react"

interface Category {
  _id: string
  name: string
  slug: string
  description: string
  image: string
  icon: string
  isActive: boolean
  order: number
  eventsCount?: number
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    icon: "",
    order: 0,
    isActive: true
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await api.get("/categories")
      setCategories(response.data.data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, formData)
      } else {
        await api.post("/categories", formData)
      }
      fetchCategories()
      resetForm()
    } catch (error) {
      console.error("Failed to save category:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      image: category.image,
      icon: category.icon,
      order: category.order,
      isActive: category.isActive
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return
    try {
      setDeleting(id)
      await api.delete(`/categories/${id}`)
      fetchCategories()
    } catch (error) {
      console.error("Failed to delete category:", error)
    } finally {
      setDeleting(null)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingCategory(null)
    setFormData({
      name: "",
      description: "",
      image: "",
      icon: "",
      order: 0,
      isActive: true
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-1">Manage event categories</p>
        </div>
        <Button 
          className="gradient-primary text-primary-foreground"
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-serif">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={resetForm}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Wedding"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Icon (emoji or icon name)</label>
                  <Input
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="e.g., Heart or wedding-icon"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the category..."
                  rows={3}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Image URL</label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Display Order</label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    min={0}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <select
                    value={formData.isActive ? "active" : "inactive"}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "active" })}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button type="submit" className="gradient-primary text-primary-foreground" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <Card key={category._id} className="border-none shadow-md overflow-hidden">
              {category.image && (
                <div className="h-32 bg-muted">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{category.icon}</span>
                      <h3 className="font-semibold text-foreground">{category.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {category.description}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        category.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Order: {category.order}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEdit(category)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(category._id)}
                    disabled={deleting === category._id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No categories found</p>
            <Button 
              className="mt-4 gradient-primary text-primary-foreground"
              onClick={() => setShowForm(true)}
            >
              Create your first category
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
