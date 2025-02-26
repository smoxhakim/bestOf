import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  })
  if (product) {
    return NextResponse.json(product)
  } else {
    return NextResponse.json({ message: "Product not found" }, { status: 404 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { name, description, price, imageUrl } = await request.json()

    // Ensure price is a number
    const numericPrice = typeof price === "string" ? Number.parseFloat(price) : price

    if (isNaN(numericPrice)) {
      return NextResponse.json({ error: "Invalid price format" }, { status: 400 })
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price: numericPrice,
        imageUrl,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.product.delete({
    where: { id: params.id },
  })
  return new NextResponse(null, { status: 204 })
}

