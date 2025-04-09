import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"

// GET /api/trusted-companies/[companyId] - Get a specific trusted company
export async function GET(
  req: Request,
  { params }: { params: { companyId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const company = await db.trustedCompany.findUnique({
      where: {
        id: params.companyId,
      },
    })
    
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }
    
    return NextResponse.json(company)
  } catch (error) {
    console.error("[TRUSTED_COMPANY_GET]", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

// PUT /api/trusted-companies/[companyId] - Update a trusted company
export async function PUT(
  req: Request,
  { params }: { params: { companyId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and is an admin
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
    
    const company = await db.trustedCompany.update({
      where: {
        id: params.companyId,
      },
      data: {
        name,
        logoUrl,
      },
    })
    
    return NextResponse.json(company)
  } catch (error) {
    console.error("[TRUSTED_COMPANY_PUT]", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

// DELETE /api/trusted-companies/[companyId] - Delete a trusted company
export async function DELETE(
  req: Request,
  { params }: { params: { companyId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    await db.trustedCompany.delete({
      where: {
        id: params.companyId,
      },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[TRUSTED_COMPANY_DELETE]", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
