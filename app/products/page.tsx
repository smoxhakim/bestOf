"use client"
import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Monitor, Laptop, Mouse, HardDrive, Cpu, Router, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
  rating?: number
  features?: string[]
}

const iconMap: Record<string, React.ComponentType> = {
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
          className="text-center mb-12 bg-gradient-to-b from-background to-muted/30 py-8 rounded-lg shadow-sm border border-border/20"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">BESTOF – La tech au service de votre savoir</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez notre gamme complète de produits et services informatiques pour propulser votre entreprise vers le succès.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 bg-card/50 p-4 rounded-lg shadow-sm border border-border/40"
        >
          <h2 className="text-xl font-semibold col-span-full mb-2">Filtrer les produits</h2>
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
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <p className="text-xl text-muted-foreground">Chargement des produits...</p>
            </div>
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-64 text-center"
              >
                <div className="p-4 bg-muted rounded-full mb-4">
                  <Monitor className="h-10 w-10 text-muted-foreground" />
                </div>
                <p className="text-xl font-medium mb-2">Aucun produit trouvé</p>
                <p className="text-muted-foreground max-w-md">Essayez de modifier vos filtres ou votre recherche pour trouver ce que vous cherchez.</p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => {
                    setSelectedCategory("All");
                    setSortBy("name");
                    setSearchQuery("");
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </motion.div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {products.map((product) => {
                  const Icon = iconMap[product.category.name as keyof typeof iconMap] || Monitor;
                  return (
                    <motion.div
                      key={product.id}
                      variants={item}
                      whileHover={{ scale: 1.02 }}
                      className="overflow-hidden bg-card rounded-lg shadow-md flex flex-col h-full transition-all duration-300 hover:shadow-lg border border-border/40"
                    >
                      {/* Product Image */}
                      <div className="relative h-48 w-full bg-muted overflow-hidden">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={false}
                            onError={(e) => {
                              // Fallback to icon if image fails to load
                              (e.target as HTMLImageElement).style.display = 'none';
                              const parent = (e.target as HTMLImageElement).parentElement;
                              if (parent) {
                                parent.classList.add('flex', 'items-center', 'justify-center');
                                const iconDiv = document.createElement('div');
                                iconDiv.className = 'p-4 bg-primary/10 rounded-full';
                                parent.appendChild(iconDiv);
                              }
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="p-4 bg-primary/10 rounded-full">
                              <Icon className="h-12 w-12 text-primary" />
                            </div>
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="font-medium">
                            {product.category.name}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Product Content */}
                      <div className="p-5 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold line-clamp-1">{product.name}</h3>
                          <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                        </div>
                        
                        {/* Rating */}
                        {product.rating && (
                          <div className="flex items-center mb-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                            <span className="ml-1 text-sm text-muted-foreground">({product.rating})</span>
                          </div>
                        )}
                        
                        <p className="text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                        

                        
                        <div className="mt-auto pt-3">
                          <Button asChild className="w-full">
                            <Link href={`/products/${product.id}`}>En savoir plus</Link>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
