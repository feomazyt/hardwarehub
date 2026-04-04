import type { AuthUserDTO } from "@/types/auth";

const SESSION_COOKIE_NAME = "hh_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

type SessionPayload = {
  iat: number;
  exp: number;
  sub: string;
  email: string;
  name: string | null;
};

const SESSION_HEADER = {
  alg: "HS256",
  typ: "JWT",
} as const;

function getSessionSecret() {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) {
    // Dev fallback; in production set AUTH_SECRET.
    return new TextEncoder().encode("hardwarehub-dev-auth-secret-change-me");
  }
  return new TextEncoder().encode(secret);
}

function base64UrlEncode(input: string | Uint8Array) {
  if (typeof input === "string") {
    input = new TextEncoder().encode(input);
  }

  if (typeof Buffer !== "undefined") {
    return Buffer.from(input)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }

  let binary = "";
  for (const byte of input) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecodeToBytes(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);

  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(padded, "base64"));
  }

  const binary = atob(padded);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i);
  return out;
}

function base64UrlDecodeToString(input: string) {
  return new TextDecoder().decode(base64UrlDecodeToBytes(input));
}

async function signHmacSha256(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    getSessionSecret(),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value)
  );
  return new Uint8Array(signature);
}

export async function signSessionToken(user: AuthUserDTO) {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
    sub: user.id,
    email: user.email,
    name: user.name,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(SESSION_HEADER));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = await signHmacSha256(signingInput);
  const encodedSig = base64UrlEncode(signature);

  return `${signingInput}.${encodedSig}`;
}

export async function verifySessionToken(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [encodedHeader, encodedPayload, encodedSig] = parts;

  const header = JSON.parse(base64UrlDecodeToString(encodedHeader)) as {
    alg?: string;
    typ?: string;
  };
  if (header.alg !== "HS256" || header.typ !== "JWT") return null;

  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const expectedSig = await signHmacSha256(signingInput);
  const actualSig = base64UrlDecodeToBytes(encodedSig);

  if (expectedSig.length !== actualSig.length) return null;
  let mismatch = 0;
  for (let i = 0; i < expectedSig.length; i += 1) {
    mismatch |= expectedSig[i] ^ actualSig[i];
  }
  if (mismatch !== 0) return null;

  const payload = JSON.parse(base64UrlDecodeToString(encodedPayload)) as SessionPayload;
  const now = Math.floor(Date.now() / 1000);
  if (!payload.exp || payload.exp < now) return null;
  if (!payload.sub || !payload.email) return null;

  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name ?? null,
  } satisfies AuthUserDTO;
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

export function getSessionMaxAge() {
  return SESSION_TTL_SECONDS;
}
