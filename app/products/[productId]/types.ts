// app/products/[productId]/types.ts
import { ReactNode } from 'react'

export type ProductDetailed = {
  id: string
  name: string
  category: string
  price: number
  description: string
  icon: string
  specs: {
    [key: string]: string
  }
  features: string[]
  gallery: string[]
  stock: number
  rating: number
}