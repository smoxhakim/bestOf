// project/app/products/[productId]/data.ts
import { Monitor, Laptop, Mouse, HardDrive, Cpu, Router } from 'lucide-react'
import { ProductDetailed } from './types'

export interface Product {
  id: string
  name: string
  price: number
  description: string
}

// Mock data for development
export const productsData: Record<string, ProductDetailed> = {
  '1': {
    id: '1',
    name: 'Example Product',
    price: 99.99,
    description: 'Product description',
    category: 'Electronics',
    icon: 'Monitor', // Add missing required field
    stock: 10, // Add missing required field
    rating: 4.5, // Add missing required field
    gallery: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRekllonQFoQ2UYQ0uT6aFl98r6GTd8yAX5_A&s',
      'https://i0.wp.com/thedisconnekt.com/wp-content/uploads/2024/11/Apple-MacBook-Pro-M4-12.jpg?resize=1600%2C1067&ssl=1',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKwNy9bKbX3pLxStGW3yNYUcQf9niXYqy7KuOGn5zUJ6tPVALfRxVQ125_q1XYoy1dvjA&usqp=CAU'
    ],
    specs: {
      // your specs
      "Processor": "Intel i7",
      "RAM": "16GB"
    },
    features: [
      "Fast processing",
      "High resolution display"
    ]
  },
}

// Mock product data store without JSX
export function getProductsData(): Record<string, Product> {
  return productsData
}

export async function getProductData(id: string): Promise<Product | null> {
  const products = getProductsData()
  return products[id] || null
}