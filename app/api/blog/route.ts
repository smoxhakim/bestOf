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
    
    // In development, allow creating posts without authentication
    const isDevelopment = process.env.NODE_ENV === "development"
    
    // Check if user is authenticated and has admin role (skip in development)
    if (!isDevelopment && (!session || session.user.role !== "ADMIN")) {
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
    
    // In development mode, first find or create a user to use as author
    let authorId = session?.user?.id
    
    if (!authorId && isDevelopment) {
      // Try to find an admin user
      const adminUser = await db.user.findFirst({
        where: { role: "ADMIN" }
      })
      
      if (adminUser) {
        authorId = adminUser.id
      } else {
        // If no admin user exists, create one
        const newAdmin = await db.user.create({
          data: {
            name: "Admin User",
            email: "admin@example.com",
            password: "$2a$10$GQH.xZm5x6FzEQJ3L6RVKuH4qVlAWx9dq.tWD8y.5Xs1aMDF9oZHm", // hashed 'password123'
            role: "ADMIN"
          }
        })
        authorId = newAdmin.id
      }
    }
    
    if (!authorId) {
      return NextResponse.json(
        { error: "No valid author found" },
        { status: 500 }
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
        authorId: authorId,
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
