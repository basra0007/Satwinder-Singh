import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /login, /dashboard)
  const path = request.nextUrl.pathname

  // Get the token from cookies
  const isAuthenticated = request.cookies.get("isAuthenticated")?.value
  const userRole = request.cookies.get("userRole")?.value

  // Public paths that don't require authentication
  const publicPaths = ["/", "/login", "/manager/login"]

  // Check if the path is public
  const isPublicPath = publicPaths.includes(path)

  // If the path is public and user is authenticated, redirect to dashboard
  if (isPublicPath && isAuthenticated && path !== "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // If the path is not public and user is not authenticated,
  // redirect to login page
  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If trying to access admin routes without admin role
  if (
    path.startsWith("/dashboard/") &&
    (path.includes("/companies") || path.includes("/employees") || path.includes("/settings")) &&
    userRole !== "admin"
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
