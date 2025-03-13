import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const categories = await prisma.category.findMany()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json()
    const category = await prisma.category.create({
      data: { name },
    })
    return NextResponse.json(category)
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 })
    }
    
    const { name } = await request.json()
    
    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }
    
    // Update the category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name },
    })
    
    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 })
    }
    
    // Check if category is used by any products
    const productsWithCategory = await prisma.product.findMany({
      where: { categoryId: id },
      select: { id: true },
    })
    
    if (productsWithCategory.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete category that is used by products" },
        { status: 400 }
      )
    }
    
    // Delete the category
    await prisma.category.delete({
      where: { id },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}

