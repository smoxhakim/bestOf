import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/public/trusted-companies - Get all trusted companies (public endpoint)
export async function GET() {
  try {
    console.log('Fetching trusted companies for public API')
    
    const companies = await db.trustedCompany.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    
    console.log(`Found ${companies.length} trusted companies`)
    
    // Always return an array, even if empty
    return NextResponse.json(companies)
  } catch (error) {
    console.error("[PUBLIC_TRUSTED_COMPANIES_GET]", error)
    // Return an empty array instead of an error object
    return NextResponse.json([])
  }
}
