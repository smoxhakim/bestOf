// bestOf/app/admin/categories/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
})

type Category = {
  id: string
  name: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  })
  
  // Reset form when editingCategory changes
  useEffect(() => {
    if (editingCategory) {
      form.reset({ name: editingCategory.name })
    } else {
      form.reset({ name: "" })
    }
  }, [editingCategory, form])

  const fetchCategories = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/categories")
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to fetch categories. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])
  
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleDeleteCategory = useCallback(async (categoryId: string) => {
    try {
      const response = await fetch(`/api/categories?id=${categoryId}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete category")
      }
      
      toast({
        title: "Category deleted",
        description: "The category has been successfully deleted.",
        variant: "success",
      })
      
      // Refresh categories list
      fetchCategories()
    } catch (error: any) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete category. Please try again.",
        variant: "destructive",
      })
    }
  }, [fetchCategories, toast])

  const handleEditCategory = useCallback((category: Category) => {
    setEditingCategory(category)
  }, [])
  
  const cancelEdit = useCallback(() => {
    setEditingCategory(null)
    form.reset({ name: "" })
  }, [form])
  
  const onSubmit = async (data: z.infer<typeof categorySchema>) => {
    setIsSubmitting(true)
    try {
      if (editingCategory) {
        // Update existing category
        const response = await fetch(`/api/categories?id=${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })

        if (!response.ok) throw new Error("Failed to update category")

        toast({
          title: "Category updated",
          description: "The category has been successfully updated.",
          variant: "success",
        })
      } else {
        // Add new category
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })

        if (!response.ok) throw new Error("Failed to add category")

        toast({
          title: "Category added",
          description: "The new category has been added.",
          variant: "success",
        })
      }
      
      setEditingCategory(null)
      form.reset()
      fetchCategories()
    } catch (error) {
      console.error("Error saving category:", error)
      toast({
        title: "Error",
        description: `Failed to ${editingCategory ? 'update' : 'add'} category. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-semibold mb-6">Manage Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting 
                      ? (editingCategory ? "Updating..." : "Adding...") 
                      : (editingCategory ? "Update Category" : "Add Category")
                    }
                  </Button>
                  {editingCategory && (
                    <Button type="button" variant="outline" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Existing Categories</h3>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-muted/30 rounded animate-pulse">
                    <div className="h-5 bg-muted rounded w-24"></div>
                    <div className="h-8 bg-muted rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : categories.length > 0 ? (
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id} className="flex items-center justify-between p-3 bg-card rounded-md border border-border">
                    <span className="font-medium">{category.name}</span>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil mr-1"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2 mr-1"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center p-4 border border-dashed border-border rounded-md">
                <p className="text-muted-foreground">No categories found</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

