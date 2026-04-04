import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  getSessionCookieName,
  getSessionMaxAge,
  signSessionToken,
  verifySessionToken,
} from "@/lib/auth/session";
import { AuthError, login, register } from "@/lib/services/auth.service";

function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(getSessionCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getSessionMaxAge(),
  });
}

function clearSessionCookie(response: NextResponse) {
  response.cookies.set(getSessionCookieName(), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

function parseBody(body: unknown) {
  if (!body || typeof body !== "object") return {};
  return body as Record<string, unknown>;
}

export async function registerUser(request: Request) {
  try {
    const body = parseBody(await request.json());
    const user = await register({
      email: String(body.email ?? ""),
      password: String(body.password ?? ""),
      name: body.name ? String(body.name) : undefined,
    });
    const token = await signSessionToken(user);
    const response = NextResponse.json({ user }, { status: 201 });
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Nie udało się utworzyć konta." }, { status: 500 });
  }
}

export async function loginUser(request: Request) {
  try {
    const body = parseBody(await request.json());
    const user = await login({
      email: String(body.email ?? ""),
      password: String(body.password ?? ""),
    });
    const token = await signSessionToken(user);
    const response = NextResponse.json({ user });
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Nie udało się zalogować." }, { status: 500 });
  }
}

export async function logoutUser() {
  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  if (!token) return NextResponse.json({ user: null });
  try {
    const user = await verifySessionToken(token);
    return NextResponse.json({ user });
  } catch {
    const response = NextResponse.json({ user: null });
    clearSessionCookie(response);
    return response;
  }
}
