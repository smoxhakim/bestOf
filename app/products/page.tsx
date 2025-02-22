// app/products/page.tsx
"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Monitor, Laptop, Mouse, HardDrive, Cpu, Router } from 'lucide-react'
import Link from 'next/link'

type Product = {
  id: string
  name: string
  category: string
  price: number
  description: string
  icon: React.ReactNode
}

const products: Product[] = [
  {
    id: '1',
    name: 'Professional Workstation',
    category: 'Computers',
    price: 1299,
    description: 'High-performance desktop computer for professional work',
    icon: <Monitor className="h-8 w-8" />,
  },
  {
    id: '2',
    name: 'Business Laptop',
    category: 'Laptops',
    price: 999,
    description: 'Powerful and portable laptop for business users',
    icon: <Laptop className="h-8 w-8" />,
  },
  {
    id: '3',
    name: 'Ergonomic Mouse',
    category: 'Accessories',
    price: 79,
    description: 'Comfortable mouse designed for long work hours',
    icon: <Mouse className="h-8 w-8" />,
  },
  {
    id: '4',
    name: 'Enterprise SSD',
    category: 'Storage',
    price: 249,
    description: 'High-speed storage solution for businesses',
    icon: <HardDrive className="h-8 w-8" />,
  },
  {
    id: '5',
    name: 'Server Processor',
    category: 'Components',
    price: 599,
    description: 'High-performance CPU for servers',
    icon: <Cpu className="h-8 w-8" />,
  },
  {
    id: '6',
    name: 'Business Router',
    category: 'Networking',
    price: 199,
    description: 'Enterprise-grade networking solution',
    icon: <Router className="h-8 w-8" />,
  },
]

const categories = ['All', 'Computers', 'Laptops', 'Accessories', 'Storage', 'Components', 'Networking']

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = products
    .filter(product => 
      (selectedCategory === 'All' || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price
      return a.name.localeCompare(b.name)
    })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
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
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Premium IT Equipment
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our range of high-quality computer equipment for your business needs
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={item}
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-lg shadow-sm p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {product.icon}
                </div>
                <span className="text-lg font-semibold">
                  ${product.price}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-muted-foreground mb-4 flex-grow">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{product.category}</span>
                <Button asChild>
                  <Link href={`/products/${product.id}`}>Learn More</Link>
                </Button>              
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}