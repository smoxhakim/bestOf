import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// Helper function to add CORS headers
function corsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

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
    
    return corsHeaders(NextResponse.json(posts))
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return corsHeaders(NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    ))
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
      return corsHeaders(NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ))
    }
    
    const body = await req.json()
    
    // Validate required fields
    if (!body.title || !body.content) {
      return corsHeaders(NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      ))
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
      return corsHeaders(NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 400 }
      ))
    }
    
    // Get the author ID from the session - this should be the logged-in user
    let authorId = session?.user?.id
    
    // Log the session information for debugging
    console.log("Session info:", { 
      hasSession: !!session, 
      userId: session?.user?.id,
      userName: session?.user?.name,
      userEmail: session?.user?.email
    })
    
    // Only use fallbacks if absolutely necessary (development mode without session)
    if (!authorId && isDevelopment) {
      console.log("Using development fallback for author ID")
      // Try to find an admin user
      const adminUser = await db.user.findFirst({
        where: { role: "ADMIN" }
      })
      
      if (adminUser) {
        authorId = adminUser.id
        console.log("Using admin user as fallback:", adminUser.name)
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
        console.log("Created new admin user as fallback")
      }
    }
    
    // If we still don't have an authorId, try to find a valid user
    if (!authorId) {
      console.log("No author ID from session, trying to find a valid user")
      
      // First try to find the current user by email if available
      if (session?.user?.email) {
        const userByEmail = await db.user.findUnique({
          where: { email: session.user.email }
        })
        
        if (userByEmail) {
          console.log("Found user by email:", userByEmail.name)
          authorId = userByEmail.id
        }
      }
      
      // If still no author, try to find any admin user
      if (!authorId) {
        const adminUser = await db.user.findFirst({
          where: { role: "ADMIN" }
        })
        
        if (adminUser) {
          console.log("Using admin user as fallback:", adminUser.name)
          authorId = adminUser.id
        } else {
          // Last resort: use any user
          const anyUser = await db.user.findFirst({})
          if (anyUser) {
            console.log("Using any user as fallback:", anyUser.name)
            authorId = anyUser.id
          }
        }
      }
    }
    
    // If we still don't have an authorId after all attempts, return an error
    if (!authorId) {
      console.error("Failed to find any valid author ID")
      return corsHeaders(NextResponse.json(
        { error: "No valid author found. Please ensure you are logged in as an admin user." },
        { status: 500 }
      ))
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
    
    return corsHeaders(NextResponse.json(post))
  } catch (error) {
    console.error("Error creating blog post:", error)
    return corsHeaders(NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    ))
  }
}
