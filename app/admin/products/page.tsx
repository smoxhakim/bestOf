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
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Products</h2>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="px-4 py-2 rounded-md border border-input bg-background w-full sm:w-[200px] pl-9"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>
          <Link href="/admin/products/add">
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Add Product
            </Button>
          </Link>
        </div>
      </div>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
                <Card className="overflow-hidden hover:shadow-md transition-all border border-border">
                  <div className="relative">
                    <Image
                      src={product.imageUrl || "/placeholder.svg"}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 h-10 mb-2">
                      {product.description || "No description available"}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-tag"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>
                        {product.categoryId || "Uncategorized"}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between bg-muted/30 border-t border-border p-2">
                    <Link href={`/admin/products/${product.id}`} className="flex-1 mr-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="w-3 h-3 mr-1" />
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