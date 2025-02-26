import { prisma } from "@/lib/prisma"
import type { ProductDetailed } from "@/app/products/[productId]/types"

export async function getProductData(id: string): Promise<ProductDetailed | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) return null

    // Convert the product to ProductDetailed type
    // You might need to adjust this based on your actual data structure
    return {
      ...product,
      specs: product.specs as Record<string, string>,
      features: product.features as string[],
      gallery: [product.imageUrl], // Assuming you don't have a separate gallery field
      stock: 10, // You might want to add this field to your database
      rating: 4.5, // You might want to add this field to your database
    }
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

