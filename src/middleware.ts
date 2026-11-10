import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

  // Auth.js v5 uses `authjs.session-token` (HTTP) or `__Secure-authjs.session-token` (HTTPS)
  // and passes the cookie name as the salt for HKDF decryption.
  const hasSecureCookie = req.cookies.has("__Secure-authjs.session-token");
  const cookieName = hasSecureCookie
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  let token = null;
  if (secret) {
    try {
      token = await getToken({
        req,
        secret,
        cookieName,
        salt: cookieName,
      });
    } catch {
      token = null;
    }
  }

  const isAuthenticated = !!token;
  const isAdmin = token?.role === "admin";

  // Protect Admin Area
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/notes?error=unauthorized_admin", req.url));
    }
  }

  // Protect User Library, Viewer, Orders, Profile
  if (
    pathname.startsWith("/library") ||
    pathname.startsWith("/viewer") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/profile")
  ) {
    if (!isAuthenticated) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/library/:path*",
    "/viewer/:path*",
    "/orders/:path*",
    "/profile/:path*",
  ],
};
