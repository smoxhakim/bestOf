import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { category: true },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    console.log("Fetched product:", product) // Add this line for debugging

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Failed to fetch product", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { name, description, price, imageUrl, categoryId, specs, features } = await request.json()

    // Ensure price is a number
    const numericPrice = typeof price === "string" ? Number.parseFloat(price) : price

    if (isNaN(numericPrice)) {
      return NextResponse.json({ error: "Invalid price format" }, { status: 400 })
    }

    // Ensure specs is an object or null
    const parsedSpecs = specs && typeof specs === "object" ? specs : null

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price: numericPrice,
        imageUrl,
        categoryId,
        specs: parsedSpecs,
        features: features || [],
      },
    })

    console.log("Updated product in database:", product) // Add this for debugging

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      {
        error: "Failed to update product",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
