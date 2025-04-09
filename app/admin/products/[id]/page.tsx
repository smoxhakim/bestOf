"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, X } from "lucide-react"

// Define the Category interface
interface Category {
  id: string;
  name: string;
}

const specItemSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required")
})

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  categoryId: z.string().min(1, "Category is required"),
  specItems: z.array(specItemSchema).optional().default([]),
  features: z.string().optional(),
  rating: z.string().regex(/^\d+(\.\d{1,2})?$/, "Rating must be a number between 0 and 5").optional(),
})

export default function EditProduct({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { id } = params

  // Properly type the categories state
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    }
    fetchCategories()
  }, [])

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      categoryId: "",
      specItems: [{ key: "", value: "" }],
      features: "",
      rating: "4.5",
    },
  })
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "specItems"
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log("Fetched product data:", data) // Add this line for debugging
        // Convert specs object to specItems array
        const specItems = data.specs 
          ? Object.entries(data.specs).map(([key, value]) => ({ key, value: String(value) }))
          : [{ key: "", value: "" }];
        
        form.reset({
          ...data,
          price: data.price.toString(),
          specItems,
          features: Array.isArray(data.features) ? data.features.join(", ") : "",
          categoryId: data.categoryId || "", // Ensure categoryId is set
          rating: data.rating ? data.rating.toString() : "4.5",
        })
      } catch (error) {
        console.error("Error fetching product:", error)
        toast({
          title: "Error",
          description: "Failed to fetch product data. Please try again.",
          variant: "destructive",
        })
      }
    }
    if (id) fetchProduct()
  }, [id, form, toast])

  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    setIsSubmitting(true)
    try {
      console.log("Submitting data:", data) // Add this for debugging

      // Convert specItems array to specs object
      const specs = data.specItems.reduce((acc, item) => {
        if (item.key && item.value) {
          acc[item.key] = item.value;
        }
        return acc;
      }, {} as Record<string, string>);

      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          price: Number.parseFloat(data.price),
          specs, // Use the converted specs object
          features: data.features ? data.features.split(",").map((f) => f.trim()) : [],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const updatedProduct = await response.json()
      console.log("Updated product:", updatedProduct)

      toast({
        title: "Product updated successfully",
        description: "The product has been updated in your inventory.",
        variant: "success",
      })
      router.push("/admin/products")
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h2 className="text-2xl font-semibold mb-6">Edit Product</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter product description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL (optional)</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel className="text-base">Specifications</FormLabel>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => append({ key: "", value: "" })}
                className="h-8 px-2 lg:px-3"
              >
                <PlusCircle className="h-3.5 w-3.5 mr-1" />
                Add Spec
              </Button>
            </div>
            
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start space-x-3 bg-muted/40 p-3 rounded-md relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 h-6 w-6 p-0 text-muted-foreground"
                  onClick={() => fields.length > 1 && remove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <div className="grid grid-cols-2 gap-3 w-full">
                  <FormField
                    control={form.control}
                    name={`specItems.${index}.key`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Key</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CPU, RAM, Storage" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`specItems.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Value</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Intel i7, 16GB, 1TB SSD" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Features (comma-separated)</FormLabel>
                <FormControl>
                  <Input placeholder="Feature 1, Feature 2, Feature 3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating (0-5)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="5" 
                    step="0.1" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating Product..." : "Update Product"}
          </Button>
        </form>
      </Form>
    </motion.div>
  )
}