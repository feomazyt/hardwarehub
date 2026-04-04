import { cookies } from "next/headers";

import { getSessionCookieName, verifySessionToken } from "@/lib/auth/session";

export async function getCurrentUserFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  if (!token) return null;

  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}
