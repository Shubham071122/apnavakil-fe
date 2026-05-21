import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "auth_token";
const AUTH_ROUTES = ["/login", "/signup"];

function getPayload(token: string) {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;
    const decodedJson = Buffer.from(payloadBase64, "base64").toString();
    return JSON.parse(decodedJson);
  } catch {
    return null;
  }
}

type TokenPayload = {
  exp?: number;
  isVerified?: boolean;
};

function isTokenPayload(payload: unknown): payload is TokenPayload {
  return typeof payload === "object" && payload !== null;
}

function isTokenExpired(payload: TokenPayload | null) {
  if (!payload) return true;
  const exp = payload.exp;
  if (!exp) return false;
  return Date.now() >= exp * 1000;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const decodedPayload = token ? getPayload(token) : null;
  const payload = isTokenPayload(decodedPayload) ? decodedPayload : null;
  
  const isValid = payload && !isTokenExpired(payload);
  const isVerified = isValid && payload.isVerified === true;

  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isVerifyEmailRoute = pathname === "/verify-email";
  const isProtectedRoute = pathname === "/chat" || pathname.startsWith("/admin");

  if (!isValid) {
    if (isProtectedRoute || isVerifyEmailRoute) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      if (token) response.cookies.delete(COOKIE_NAME);
      return response;
    }
    return NextResponse.next();
  }

  if (!isVerified) {
    if (!isVerifyEmailRoute) {
      return NextResponse.redirect(new URL("/verify-email", request.url));
    }
    return NextResponse.next();
  }

  if (isVerifyEmailRoute || isAuthRoute) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ],
};
