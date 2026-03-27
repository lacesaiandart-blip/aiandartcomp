import { NextResponse, type NextRequest } from "next/server";
import { isDemoMode } from "@/lib/env";

const protectedPrefixes = ["/submit", "/gallery", "/judge", "/admin"];

function hasSupabaseSessionCookie(request: NextRequest) {
  return request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("auth-token"));
}

export async function middleware(request: NextRequest) {
  if (isDemoMode) {
    return NextResponse.next();
  }

  const needsAuth = protectedPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix));
  if (needsAuth && !hasSupabaseSessionCookie(request)) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/submit/:path*", "/gallery/:path*", "/judge/:path*", "/admin/:path*"]
};
