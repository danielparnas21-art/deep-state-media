import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LAUNCHED, isAllowedInV1 } from "@/lib/launch";

/**
 * V1 gate. While the site is unlaunched, only the coming-soon landing ("/") and
 * the Meet the Team page ("/team") are reachable — every other route redirects
 * home so the teaser never exposes an unfinished page. Once LAUNCHED flips true
 * this is a no-op and the full site is served.
 */
export function middleware(request: NextRequest) {
  if (LAUNCHED) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (isAllowedInV1(pathname)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  // Run on everything except API routes, Next internals, and static assets.
  // API routes (e.g. /api/subscribe) must stay reachable in V1, so they're
  // excluded here rather than redirected home.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
