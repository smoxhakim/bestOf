import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const search = searchParams.get("search")
  const sortBy = searchParams.get("sortBy")

  try {
    let categoryFilter = {}
    if (category && category !== "All") {
      const categoryRecord = await prisma.category.findFirst({
        where: { name: category },
      })
      if (categoryRecord) {
        categoryFilter = { categoryId: categoryRecord.id }
      } else {
        console.warn(`Category not found: ${category}`)
      }
    }

    const products = await prisma.product.findMany({
      where: {
        ...categoryFilter,
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: sortBy === "price" ? { price: "asc" } : { name: "asc" },
      include: {
        category: true,
      },
    })

    return NextResponse.json(products)
  } catch (error: unknown) {
    console.error("Error fetching products:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: "Failed to fetch products", details: errorMessage }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, price, imageUrl, categoryId, specs, features } = body

    // Handle specs properly - it can now be either an object or a string
    let parsedSpecs = null;
    if (specs) {
      // If specs is already an object, use it directly
      if (typeof specs === 'object' && !Array.isArray(specs)) {
        parsedSpecs = specs;
      } else if (typeof specs === 'string') {
        // For backward compatibility, try to parse if it's a string
        try {
          parsedSpecs = JSON.parse(specs);
        } catch (e) {
          console.error('Error parsing specs string:', e);
        }
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        imageUrl,
        categoryId,
        specs: parsedSpecs,
        features: features || [],
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: unknown) {
    console.error("Error creating product:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: "Failed to create product", details: errorMessage }, { status: 500 })
  }
}