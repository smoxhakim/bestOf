import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"
import createMiddleware from "next-intl/middleware"
import { locales, defaultLocale } from "./i18n.config"

// Create the next-intl middleware
const intlMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: defaultLocale,
  localePrefix: "always",
})

export async function middleware(req: NextRequest) {
  // First, check if the pathname is missing a locale
  const pathname = req.nextUrl.pathname;
  
  // Handle root path redirect
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, req.url));
  }
  
  // Check if the path already has a locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    // For paths without locale, redirect to the default locale
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, req.url));
  }
  
  // For paths with locale, use the intl middleware
  try {
    const response = await intlMiddleware(req);
    
    // Add security headers
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("Referrer-Policy", "origin-when-cross-origin")
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:;"
    )
    response.headers.set("X-DNS-Prefetch-Control", "on")
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")

    // Protect admin routes
    if (pathname.startsWith("/admin")) {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
      if (!token || token.role !== "ADMIN") {
        return NextResponse.redirect(new URL(`/${defaultLocale}/auth/signin`, req.url))
      }
    }
    
    return response;
  } catch (error) {
    console.error("Error in intlMiddleware:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}

export const config = {
  // Match all routes except for API, next internal routes, and static files
  matcher: ['/((?!api|_next|.*\\..*).*)']
}