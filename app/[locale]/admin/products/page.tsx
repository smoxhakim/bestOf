// bestOf/app/admin/products/page.tsx
"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Edit } from "lucide-react"
import { ProductSkeleton } from "@/components/product-skeleton"
import { DeleteProductDialog } from "@/components/delete-product-dialog"
import Image from "next/image"

// Define the Product interface
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  // Add other properties as needed
  description?: string;
  categoryId?: string;
  features?: string[];
  specs?: Record<string, any>;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  const handleProductDelete = (deletedProductId: string) => {
    setProducts(products.filter((product) => product.id !== deletedProductId))
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">Product List</h2>
        <Link href="/admin/products/add">
          <Button>Add New Product</Button>
        </Link>
      </div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <motion.div key={index} variants={item}>
                <ProductSkeleton />
              </motion.div>
            ))
          : products.map((product) => (
              <motion.div key={product.id} variants={item}>
                <Card>
                  <CardContent className="p-4">
                    <Image
                      src={product.imageUrl || "/placeholder.svg"}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-2">${product.price}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href={`/admin/products/${product.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <DeleteProductDialog
                      productId={product.id}
                      productName={product.name}
                      onDelete={() => handleProductDelete(product.id)}
                    />
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
      </motion.div>
    </div>
  )
}