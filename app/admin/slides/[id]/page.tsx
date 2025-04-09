"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const slideSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Invalid URL"),
  buttonText: z.string().optional(),
  buttonLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  order: z.string().regex(/^\d+$/, "Order must be a positive integer"),
  active: z.boolean().default(true),
})

// Define the type for the form values
type SlideFormValues = z.infer<typeof slideSchema>

// Define the type for the API submission
interface SlideSubmission {
  title: string
  description: string
  imageUrl: string
  buttonText?: string
  buttonLink?: string
  order: number
  active: boolean
}

export default function EditSlidePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { id } = params

  const form = useForm({
    resolver: zodResolver(slideSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      buttonText: "",
      buttonLink: "",
      order: "0",
      active: true,
    },
  })

  useEffect(() => {
    const fetchSlide = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/slides/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch slide")
        }
        const data = await response.json()
        
        form.reset({
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl,
          buttonText: data.buttonText || "",
          buttonLink: data.buttonLink || "",
          order: data.order.toString(),
          active: data.active,
        })
      } catch (error) {
        console.error("Error fetching slide:", error)
        toast({
          title: "Error",
          description: "Failed to fetch slide data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchSlide()
  }, [id, form, toast])

  const onSubmit = async (data: SlideFormValues) => {
    setIsSubmitting(true)
    try {
      // Ensure order is sent as a number
      const formattedData = {
        ...data,
        order: parseInt(data.order.toString()),
      }
      
      const response = await fetch(`/api/slides/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      })

      if (!response.ok) {
        throw new Error("Failed to update slide")
      }

      toast({
        title: "Success",
        description: "Slide updated successfully",
      })

      router.push("/admin/slides")
    } catch (error) {
      console.error("Error updating slide:", error)
      toast({
        title: "Error",
        description: "Failed to update slide. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/admin/slides">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Slides
          </Link>
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-6">Edit Slide</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter slide title" {...field} />
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
                    <Textarea placeholder="Enter slide description" {...field} />
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
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="buttonText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button Text (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Learn More" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buttonLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button Link (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/page" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Order</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating Slide..." : "Update Slide"}
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  )
}
