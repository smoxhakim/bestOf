"use client"
import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Monitor, Laptop, Mouse, HardDrive, Cpu, Router } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

type Category = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

type Product = {
  id: string
  name: string
  category: Category
  price: number
  description: string
  imageUrl: string
}

const iconMap = {
  Computers: Monitor,
  Laptops: Laptop,
  Accessories: Mouse,
  Storage: HardDrive,
  Components: Cpu,
  Networking: Router,
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("name")
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/categories")
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      setCategories([{ id: "all", name: "All" } as Category, ...data])
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to fetch categories. Please try again.",
        variant: "destructive",
      })
    }
  }, [toast])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        category: selectedCategory !== "All" ? selectedCategory : "",
        search: searchQuery,
        sortBy,
      })
      const response = await fetch(`/api/products?${params}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch products")
      }
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch products. Please try again.",
        variant: "destructive",
      })
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, sortBy, searchQuery, toast])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

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
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">BESTOF – La tech au service de votre savoir</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez notre gamme complète de produits et services informatiques pour propulser votre entreprise vers le succès.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Rechercher des produits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nom</SelectItem>
              <SelectItem value="price">Prix</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-muted-foreground">Chargement des produits...</p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {products.map((product) => {
              const Icon = iconMap[product.category.name as keyof typeof iconMap] || Monitor
              return (
                <motion.div
                  key={product.id}
                  variants={item}
                  whileHover={{ scale: 1.02 }}
                  className="bg-card rounded-lg shadow-sm p-6 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-8 w-8" />
                    </div>
                    <span className="text-lg font-semibold">${product.price.toFixed(2)}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-muted-foreground mb-4 flex-grow">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{product.category.name}</span>
                    <Button asChild>
                      <Link href={`/products/${product.id}`}>En savoir plus</Link>
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}

