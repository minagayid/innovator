export const GOOGLE_SESSION_COOKIE = "innovator_google_session";
export const GOOGLE_OAUTH_STATE_COOKIE = "innovator_google_oauth_state";
export const GOOGLE_SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;
export const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;

export type GoogleSessionPayload = {
  provider: "google";
  sub: string;
  email: string;
  displayName: string;
  issuedAt: number;
  expiresAt: number;
};

export type GoogleOAuthStatePayload = {
  state: string;
  verifier: string;
  returnTo: string;
  issuedAt: number;
};

export type GoogleOAuthConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

const encoder = new TextEncoder();
const reservedReturnPaths = new Set([
  "/signin-with-chatgpt",
  "/signout-with-chatgpt",
  "/callback",
  "/api/auth/google",
  "/api/auth/google/callback",
  "/api/auth/logout",
]);

export function safeRelativeReturnPath(value: string | null | undefined): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/";
  try {
    const url = new URL(value, "https://innovator.invalid");
    if (url.origin !== "https://innovator.invalid" || reservedReturnPaths.has(url.pathname)) return "/";
    return url.pathname + url.search + url.hash;
  } catch {
    return "/";
  }
}

export function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function fromBase64Url(value: string): Uint8Array {
  if (!/^[A-Za-z0-9_-]*$/.test(value)) throw new Error("Invalid base64url value.");
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(normalized + "=".repeat((4 - normalized.length % 4) % 4));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

export function randomUrlToken(byteLength = 32): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return toBase64Url(bytes);
}

export async function signSignedPayload(payload: Record<string, unknown>, secret: string): Promise<string> {
  if (!secret || secret.length < 32) throw new Error("AUTH_SESSION_SECRET must contain at least 32 characters.");
  const payloadPart = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(payloadPart)));
  return payloadPart + "." + toBase64Url(signature);
}

export async function verifySignedPayload<T>(token: string | undefined, secret: string | undefined): Promise<T | null> {
  if (!token || token.length > 8192 || !secret || secret.length < 32) return null;
  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  try {
    const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const valid = await crypto.subtle.verify("HMAC", key, fromBase64Url(parts[1]), encoder.encode(parts[0]));
    if (!valid) return null;
    const value: unknown = JSON.parse(new TextDecoder().decode(fromBase64Url(parts[0])));
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    return value as T;
  } catch {
    return null;
  }
}

export function isGoogleEmailAllowed(email: string, rawAllowlist = ""): boolean {
  const normalized = email.trim().toLowerCase();
  const allowed = rawAllowlist.split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
  return allowed.length === 0 || allowed.includes(normalized);
}

export function getGoogleOAuthConfig(): GoogleOAuthConfig | null {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const redirectUri = process.env.GOOGLE_REDIRECT_URI?.trim();
  if (!clientId || !clientSecret || !redirectUri) return null;
  try {
    const redirect = new URL(redirectUri);
    const localHttp = redirect.protocol === "http:" && ["localhost", "127.0.0.1"].includes(redirect.hostname);
    if (redirect.protocol !== "https:" && !localHttp) return null;
    if (redirect.pathname !== "/api/auth/google/callback") return null;
    return { clientId, clientSecret, redirectUri: redirect.toString() };
  } catch {
    return null;
  }
}
