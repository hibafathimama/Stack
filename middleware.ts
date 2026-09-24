
import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Allow Next.js files and images
  if (
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // Allow these pages
  const publicPaths = [
    "/",
    "/login",
    "/registration",
    "/products",
    "/products/add",
  ]

  // Allow every product detail page
  if (pathname.startsWith("/products/")) {
    return NextResponse.next()
  }

  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

