import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/server-auth";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  /** Historical `/admin` URLs → canonical paths (same URLs as post-login admin) */
  if (pathname === "/admin" || pathname === "/admin/") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/admin/")) {
    url.pathname = pathname.slice("/admin".length) || "/dashboard";
    return NextResponse.redirect(url);
  }

  const protectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/wishlist") ||
    pathname.startsWith("/users");

  if (!protectedRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;
  if (!token) {
    const login = new URL("/login", request.url);
    login.searchParams.set(
      "next",
      `${pathname}${request.nextUrl.search}`
    );
    return NextResponse.redirect(login);
  }

  const payload = await verifyToken(token);
  if (!payload || payload.typ !== "access") {
    const login = new URL("/login", request.url);
    login.searchParams.set(
      "next",
      `${pathname}${request.nextUrl.search}`
    );
    return NextResponse.redirect(login);
  }

  const adminOnly =
    pathname.startsWith("/users") ||
    pathname === "/products/new" ||
    pathname.startsWith("/products/new/");

  if (adminOnly && payload.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/profile",
    "/profile/:path*",
    "/orders",
    "/orders/:path*",
    "/products",
    "/products/:path*",
    "/cart",
    "/cart/:path*",
    "/checkout",
    "/checkout/:path*",
    "/wishlist",
    "/wishlist/:path*",
    "/users",
    "/users/:path*",
  ],
};
