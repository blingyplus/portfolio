// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticated } from "./lib/appwrite";

export async function middleware(request: NextRequest) {
  const isAuth = await isAuthenticated();

  if (!isAuth && request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};