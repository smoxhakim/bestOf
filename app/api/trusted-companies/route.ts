import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"

// GET /api/trusted-companies - Get all trusted companies
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    // For admin routes, we'll check the session
    const isAdmin = session?.user?.role === "ADMIN"
    
    // Get all companies from the database
    const companies = await db.trustedCompany.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    
    // Return the companies as an array (even if empty)
    return NextResponse.json(companies)
  } catch (error) {
    console.error("[TRUSTED_COMPANIES_GET]", error)
    return NextResponse.json([], { status: 500 })
  }
}

// POST /api/trusted-companies - Create a new trusted company
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and is an admin for write operations
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const body = await req.json()
    const { name, logoUrl } = body
    
    if (!name || !logoUrl) {
      return NextResponse.json(
        { error: "Name and logo URL are required" },
        { status: 400 }
      )
    }
    
    const company = await db.trustedCompany.create({
      data: {
        name,
        logoUrl,
      },
    })
    
    return NextResponse.json(company)
  } catch (error) {
    console.error("[TRUSTED_COMPANIES_POST]", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
