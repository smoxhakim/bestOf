import { prisma } from "@/lib/prisma"
import type { ProductDetailed } from "@/app/products/[productId]/types"

export async function getProductData(id: string): Promise<ProductDetailed | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true, // Include the category relation
      },
    })

    if (!product) return null

    // Convert the product to ProductDetailed type
    return {
      id: product.id,
      name: product.name,
      category: product.category.name,
      price: product.price,
      description: product.description,
      icon: "/default-icon.svg", 
      specs: product.specs as Record<string, string>,
      features: product.features as string[],
      gallery: [product.imageUrl], 
      stock: 10, 
      rating: 4.5,
    }
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

