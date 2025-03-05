"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"
import { Monitor, Laptop, Mouse, HardDrive, Cpu, Router } from "lucide-react"
import type { ProductDetailed } from "./types"
import { toast } from 'react-hot-toast'
import OrderModal from '@/app/components/OrderModal'
import { useRouter } from 'next/navigation'

export default function ProductClient({ product }: { product: ProductDetailed | null }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const router = useRouter()

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const getIconComponent = (iconName: string) => {
    const iconMap = {
      Monitor: <Monitor className="h-8 w-8" />,
      Laptop: <Laptop className="h-8 w-8" />,
      Mouse: <Mouse className="h-8 w-8" />,
      HardDrive: <HardDrive className="h-8 w-8" />,
      Cpu: <Cpu className="h-8 w-8" />,
      Router: <Router className="h-8 w-8" />,
    }
    return iconMap[iconName as keyof typeof iconMap] || null
  }

  const handleOrderSuccess = () => {
    toast.success('Your order is placed successfully! Our team will call you soon for confirmation.')
    setTimeout(() => {
      router.refresh()
    }, 3000)
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Product Not Found</CardTitle>
            <CardDescription>The requested product could not be found.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Ensure gallery exists and has items
  const galleryImages = product.gallery || []

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Product Images */}
          <div className="space-y-4">
            {galleryImages.length > 0 && (
              <>
                <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={galleryImages[selectedImage] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {galleryImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square relative bg-muted rounded-lg overflow-hidden ${
                        selectedImage === index ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2">{product.category}</Badge>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-2xl font-semibold mt-2">${product.price}</p>
              <p className="text-muted-foreground mt-4">{product.description}</p>
            </div>

            <Tabs defaultValue="specs">
              <TabsList>
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
              </TabsList>
              <TabsContent value="specs" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <dl className="space-y-4">
                      {product.specs &&
                        Object.entries(product.specs).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <dt className="font-medium text-muted-foreground">{key}</dt>
                            <dd>{value}</dd>
                          </div>
                        ))}
                      {(!product.specs || Object.keys(product.specs).length === 0) && (
                        <p>No specifications available.</p>
                      )}
                    </dl>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="features" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    {product.features && product.features.length > 0 ? (
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No features available.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex gap-4">
              <Button size="lg" className="flex-1" onClick={() => setIsOrderModalOpen(true)}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Order Now
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        productId={product.id}
        productName={product.name}
        onSuccess={handleOrderSuccess}
      />
    </div>
  )
}

