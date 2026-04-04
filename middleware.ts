import { NextRequest, NextResponse } from "next/server";

import { getSessionCookieName, verifySessionToken } from "@/lib/auth/session";

function buildLoginRedirect(request: NextRequest) {
  const loginUrl = new URL("/auth/login", request.url);
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  loginUrl.searchParams.set("next", nextPath);
  return loginUrl;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(getSessionCookieName())?.value;
  if (!token) {
    return NextResponse.redirect(buildLoginRedirect(request));
  }

  try {
    const user = await verifySessionToken(token);
    if (!user) {
      const response = NextResponse.redirect(buildLoginRedirect(request));
      response.cookies.set(getSessionCookieName(), "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
      });
      return response;
    }
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(buildLoginRedirect(request));
    response.cookies.set(getSessionCookieName(), "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
