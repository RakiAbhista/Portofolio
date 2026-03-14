import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  // Protected routes
  if (pathname.startsWith("/dashboard")) {
    // Unauthenticated users are redirected to /login
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // RBAC: Admin can only access /dashboard/bots, not /dashboard/users
    if (token.role === "admin" && pathname.startsWith("/dashboard/users")) {
      return NextResponse.redirect(new URL("/dashboard/bots", request.url));
    }

    // Allow access to protected routes
    return NextResponse.next();
  }

  // If already logged in, don't allow access to /login
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard/bots", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"]
};
