import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET public blog posts (only published ones)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tag = searchParams.get("tag")
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined
    
    // Build query filters
    const filters: any = {
      published: true, // Only return published posts
    }
    
    // Filter by tag if provided
    if (tag) {
      filters.tags = {
        has: tag,
      }
    }
    
    const posts = await db.blogPost.findMany({
      where: filters,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    })
    
    // Convert dates to strings to avoid serialization issues
    const serializedPosts = posts.map(post => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }))
    
    return NextResponse.json(serializedPosts)
  } catch (error) {
    console.error("Error fetching public blog posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    )
  }
}
