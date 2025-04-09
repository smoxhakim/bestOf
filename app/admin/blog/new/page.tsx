"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

// Define the form schema
const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  coverImage: z.string().url("Invalid URL").optional().or(z.literal("")),
  published: z.boolean().default(false),
  tags: z.string().optional(),
})

type FormValues = z.infer<typeof blogPostSchema>

export default function NewBlogPost() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      coverImage: "",
      published: false,
      tags: "",
    },
  })
  
  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    
    try {
      // Convert tags string to array
      const tagsArray = data.tags 
        ? data.tags.split(",").map(tag => tag.trim()).filter(tag => tag !== "")
        : []
      
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          tags: tagsArray,
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create blog post")
      }
      
      toast.success("Blog post created successfully")
      router.push("/admin/blog")
    } catch (error) {
      console.error("Error creating blog post:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create blog post")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Generate slug from title
  const generateSlug = () => {
    const title = form.getValues("title")
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
      
      form.setValue("slug", slug, { shouldValidate: true })
    }
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create New Blog Post</h1>
        <Button variant="outline" onClick={() => router.push("/admin/blog")}>
          Cancel
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Blog Post Details</CardTitle>
          <CardDescription>
            Create a new blog post for your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter post title" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e)
                            // Auto-generate slug when title changes if slug is empty
                            if (!form.getValues("slug")) {
                              setTimeout(generateSlug, 500)
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <div className="flex space-x-2">
                        <FormControl>
                          <Input placeholder="post-slug" {...field} />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={generateSlug}
                          className="shrink-0"
                        >
                          Generate
                        </Button>
                      </div>
                      <FormDescription>
                        URL-friendly version of the title
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief summary of the post (optional)" 
                        {...field} 
                        className="h-20"
                      />
                    </FormControl>
                    <FormDescription>
                      A short summary that will be displayed in blog listings
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write your blog post content here..." 
                        {...field} 
                        className="min-h-[300px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL to the cover image for this post (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="tag1, tag2, tag3" {...field} />
                      </FormControl>
                      <FormDescription>
                        Comma-separated list of tags (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Publish</FormLabel>
                      <FormDescription>
                        Make this post visible to the public
                      </FormDescription>
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
              
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push("/admin/blog")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Post"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
