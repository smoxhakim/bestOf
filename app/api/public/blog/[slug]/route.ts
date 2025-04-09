import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET a specific blog post by slug
export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await db.blogPost.findUnique({
      where: { 
        slug: params.slug,
        published: true, // Only return published posts
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
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

    // Serialize dates to avoid issues with Next.js response handling
    const serializedPost = {
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }

    return NextResponse.json(serializedPost)
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    )
  }
}
