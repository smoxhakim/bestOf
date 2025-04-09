import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET a specific blog post by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await db.blogPost.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    )
  }
}

// PUT update a blog post
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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
    
    // Check if the post exists
    const existingPost = await db.blogPost.findUnique({
      where: { id: params.id },
    })
    
    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      )
    }
    
    // If slug is being changed, check for uniqueness
    if (body.slug && body.slug !== existingPost.slug) {
      const slugExists = await db.blogPost.findUnique({
        where: { slug: body.slug },
      })
      
      if (slugExists) {
        return NextResponse.json(
          { error: "A post with this slug already exists" },
          { status: 400 }
        )
      }
    }
    
    // Update the blog post
    const updatedPost = await db.blogPost.update({
      where: { id: params.id },
      data: {
        title: body.title,
        slug: body.slug || existingPost.slug,
        content: body.content,
        excerpt: body.excerpt,
        coverImage: body.coverImage,
        published: body.published !== undefined ? body.published : existingPost.published,
        tags: body.tags || existingPost.tags,
      },
    })
    
    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error("Error updating blog post:", error)
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    )
  }
}

// DELETE a blog post
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and has admin role
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Check if the post exists
    const existingPost = await db.blogPost.findUnique({
      where: { id: params.id },
    })
    
    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      )
    }
    
    // Delete the blog post
    await db.blogPost.delete({
      where: { id: params.id },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    )
  }
}
