import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET all blog posts (with optional filtering)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const published = searchParams.get("published")
    
    // Build query filters
    const filters: any = {}
    
    // Only filter by published status if explicitly provided
    if (published !== null) {
      filters.published = published === "true"
    }
    
    const posts = await db.blogPost.findMany({
      where: filters,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    )
  }
}

// POST create new blog post
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and has admin role
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const body = await req.json()
    
    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }
    
    // Generate slug from title if not provided
    if (!body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
    }
    
    // Check if slug already exists
    const existingPost = await db.blogPost.findUnique({
      where: { slug: body.slug },
    })
    
    if (existingPost) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 400 }
      )
    }
    
    // Create new blog post
    const post = await db.blogPost.create({
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt || null,
        coverImage: body.coverImage || null,
        published: body.published || false,
        tags: body.tags || [],
        authorId: session.user.id,
      },
    })
    
    return NextResponse.json(post)
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    )
  }
}
