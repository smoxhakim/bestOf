import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"
import createMiddleware from "next-intl/middleware"
import { locales, defaultLocale } from "./i18n.config"

const localesArray = Array.isArray(locales) ? locales : Object.values(locales)

// Create the next-intl middleware
const intlMiddleware = createMiddleware({
  locales: localesArray,
  defaultLocale: defaultLocale,
  localePrefix: "always", // Changed from "as-needed" to "always"
})

export async function middleware(req: NextRequest) {
  const publicPatterns = ["/", "/products", "/services", "/about", "/contact", "/auth/signin"]
  const isPublicPage = publicPatterns.some(
    (pattern) =>
      req.nextUrl.pathname === pattern || // Exact match for root path
      (pattern !== "/" && req.nextUrl.pathname.startsWith(pattern)), // Prefix match for other paths
  )

  // Handle root path redirect
  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, req.url))
  }

  // For public routes, use the intl middleware
  if (isPublicPage) {
    try {
      return await intlMiddleware(req)
    } catch (error) {
      console.error("Error in intlMiddleware:", error)
      return new Response("Internal Server Error", { status: 500 })
    }
  }

  const response = NextResponse.next()

  // Add security headers
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "origin-when-cross-origin")
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:;",
  )
  response.headers.set("X-DNS-Prefetch-Control", "on")
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
}

