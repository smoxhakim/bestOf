"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit, Plus, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface Slide {
  id: string
  title: string
  description: string
  imageUrl: string
  buttonText?: string | null
  buttonLink?: string | null
  order: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export default function SlidesPage() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const fetchSlides = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/slides")
      if (!response.ok) {
        throw new Error("Failed to fetch slides")
      }
      const data = await response.json()
      setSlides(data)
    } catch (error) {
      console.error("Error fetching slides:", error)
      toast({
        title: "Error",
        description: "Failed to fetch slides. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlides()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) {
      return
    }

    try {
      const response = await fetch(`/api/slides/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete slide")
      }

      toast({
        title: "Success",
        description: "Slide deleted successfully",
      })

      fetchSlides()
    } catch (error) {
      console.error("Error deleting slide:", error)
      toast({
        title: "Error",
        description: "Failed to delete slide. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleActive = async (slide: Slide) => {
    try {
      const response = await fetch(`/api/slides/${slide.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...slide,
          active: !slide.active,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update slide")
      }

      toast({
        title: "Success",
        description: `Slide ${!slide.active ? "activated" : "deactivated"} successfully`,
      })

      fetchSlides()
    } catch (error) {
      console.error("Error updating slide:", error)
      toast({
        title: "Error",
        description: "Failed to update slide. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReorder = async (slide: Slide, direction: "up" | "down") => {
    const currentIndex = slides.findIndex((s) => s.id === slide.id)
    const newOrder = direction === "up" ? slide.order - 1 : slide.order + 1
    
    try {
      const response = await fetch(`/api/slides/${slide.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...slide,
          order: newOrder,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update slide order")
      }

      // If we're moving up, we need to move the previous slide down
      if (direction === "up" && currentIndex > 0) {
        const prevSlide = slides[currentIndex - 1]
        await fetch(`/api/slides/${prevSlide.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...prevSlide,
            order: prevSlide.order + 1,
          }),
        })
      }
      
      // If we're moving down, we need to move the next slide up
      if (direction === "down" && currentIndex < slides.length - 1) {
        const nextSlide = slides[currentIndex + 1]
        await fetch(`/api/slides/${nextSlide.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...nextSlide,
            order: nextSlide.order - 1,
          }),
        })
      }

      toast({
        title: "Success",
        description: "Slide order updated successfully",
      })

      fetchSlides()
    } catch (error) {
      console.error("Error updating slide order:", error)
      toast({
        title: "Error",
        description: "Failed to update slide order. Please try again.",
        variant: "destructive",
      })
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Slides</h1>
        <Button asChild>
          <Link href="/admin/slides/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Slide
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : slides.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-muted-foreground mb-4">No slides found. Create your first slide!</p>
            <Button asChild>
              <Link href="/admin/slides/new">
                <Plus className="mr-2 h-4 w-4" /> Add New Slide
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6"
        >
          {slides.map((slide) => (
            <motion.div key={slide.id} variants={item}>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{slide.title}</CardTitle>
                      <CardDescription className="mt-1">Order: {slide.order}</CardDescription>
                    </div>
                    <Badge variant={slide.active ? "default" : "secondary"}>
                      {slide.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative h-40 rounded-md overflow-hidden">
                      <Image
                        src={slide.imageUrl}
                        alt={slide.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-muted-foreground mb-2">{slide.description}</p>
                      {slide.buttonText && (
                        <div className="mt-2">
                          <Badge variant="outline" className="mr-2">
                            Button: {slide.buttonText}
                          </Badge>
                          {slide.buttonLink && (
                            <Badge variant="outline">
                              Link: {slide.buttonLink}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="mr-2"
                      onClick={() => handleToggleActive(slide)}
                      title={slide.active ? "Deactivate" : "Activate"}
                    >
                      {slide.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="mr-2"
                      onClick={() => handleReorder(slide, "up")}
                      disabled={slide.order === 0}
                      title="Move Up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="mr-2"
                      onClick={() => handleReorder(slide, "down")}
                      disabled={slide.order === slides.length - 1}
                      title="Move Down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="mr-2"
                      onClick={() => router.push(`/admin/slides/${slide.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(slide.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
