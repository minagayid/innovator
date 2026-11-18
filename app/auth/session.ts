export type AuthProvider = "google" | "github" | "linkedin" | "orcid";
export type AuthSessionPayload = { provider: AuthProvider; sub: string; email: string; displayName: string; issuedAt: number; expiresAt: number };
export type GoogleSessionPayload = AuthSessionPayload & { provider: "google" };
export type OAuthStatePayload = { state: string; verifier: string; returnTo: string; issuedAt: number; provider: AuthProvider };
export type GoogleOAuthStatePayload = OAuthStatePayload & { provider: "google" };
export type OAuthProviderConfig = { provider: AuthProvider; clientId: string; clientSecret: string; redirectUri: string; authorizationUrl: string; tokenUrl: string; userInfoUrl: string; scopes: string };
export const GOOGLE_SESSION_COOKIE = "innovator_google_session";
export const GOOGLE_OAUTH_STATE_COOKIE = "innovator_google_oauth_state";
export const AUTH_SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;
export const GOOGLE_SESSION_TTL_SECONDS = AUTH_SESSION_TTL_SECONDS;
export const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;
const encoder = new TextEncoder();
const providerCookies: Record<AuthProvider, string> = { google: GOOGLE_SESSION_COOKIE, github: "innovator_github_session", linkedin: "innovator_linkedin_session", orcid: "innovator_orcid_session" };
const stateCookies: Record<AuthProvider, string> = { google: GOOGLE_OAUTH_STATE_COOKIE, github: "innovator_github_oauth_state", linkedin: "innovator_linkedin_oauth_state", orcid: "innovator_orcid_oauth_state" };
const reservedReturnPaths = new Set(["/signin-with-chatgpt", "/signout-with-chatgpt", "/callback", "/api/auth/google", "/api/auth/google/callback", "/api/auth/logout"]);
const providerSettings: Record<AuthProvider, Omit<OAuthProviderConfig, "clientId" | "clientSecret" | "redirectUri">> = {
  google: { provider: "google", authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth", tokenUrl: "https://oauth2.googleapis.com/token", userInfoUrl: "https://openidconnect.googleapis.com/v1/userinfo", scopes: "openid email profile" },
  github: { provider: "github", authorizationUrl: "https://github.com/login/oauth/authorize", tokenUrl: "https://github.com/login/oauth/access_token", userInfoUrl: "https://api.github.com/user", scopes: "read:user user:email" },
  linkedin: { provider: "linkedin", authorizationUrl: "https://www.linkedin.com/oauth/v2/authorization", tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken", userInfoUrl: "https://api.linkedin.com/v2/userinfo", scopes: "openid profile email" },
  orcid: { provider: "orcid", authorizationUrl: "https://orcid.org/oauth/authorize", tokenUrl: "https://orcid.org/oauth/token", userInfoUrl: "https://orcid.org/oauth/userinfo", scopes: "openid profile email" },
};
export function sessionCookieName(provider: AuthProvider): string { return providerCookies[provider]; }
export function oauthStateCookieName(provider: AuthProvider): string { return stateCookies[provider]; }
export function isAuthProvider(value: string): value is AuthProvider { return value in providerSettings; }
export function safeRelativeReturnPath(value: string | null | undefined): string { if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/"; try { const url = new URL(value, "https://innovator.invalid"); return url.origin !== "https://innovator.invalid" || reservedReturnPaths.has(url.pathname) ? "/" : url.pathname + url.search + url.hash; } catch { return "/"; } }
export function toBase64Url(bytes: Uint8Array): string { let binary = ""; for (const byte of bytes) binary += String.fromCharCode(byte); return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, ""); }
export function fromBase64Url(value: string): Uint8Array { if (!/^[A-Za-z0-9_-]*$/.test(value)) throw new Error("Invalid base64url value."); const normalized = value.replace(/-/g, "+").replace(/_/g, "/"); const binary = atob(normalized + "=".repeat((4 - normalized.length % 4) % 4)); return Uint8Array.from(binary, (character) => character.charCodeAt(0)); }
export function randomUrlToken(byteLength = 32): string { const bytes = new Uint8Array(byteLength); crypto.getRandomValues(bytes); return toBase64Url(bytes); }
export async function signSignedPayload(payload: Record<string, unknown>, secret: string): Promise<string> { if (!secret || secret.length < 32) throw new Error("AUTH_SESSION_SECRET must contain at least 32 characters."); const payloadPart = toBase64Url(encoder.encode(JSON.stringify(payload))); const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]); const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(payloadPart))); return payloadPart + "." + toBase64Url(signature); }
export async function verifySignedPayload<T>(token: string | undefined, secret: string | undefined): Promise<T | null> { if (!token || token.length > 8192 || !secret || secret.length < 32) return null; const parts = token.split("."); if (parts.length !== 2 || !parts[0] || !parts[1]) return null; try { const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]); if (!await crypto.subtle.verify("HMAC", key, fromBase64Url(parts[1]), encoder.encode(parts[0]))) return null; const value: unknown = JSON.parse(new TextDecoder().decode(fromBase64Url(parts[0]))); return value && typeof value === "object" && !Array.isArray(value) ? value as T : null; } catch { return null; } }
export function isGoogleEmailAllowed(email: string, rawAllowlist = ""): boolean { const normalized = email.trim().toLowerCase(); const allowed = rawAllowlist.split(",").map((value) => value.trim().toLowerCase()).filter(Boolean); return allowed.length === 0 || allowed.includes(normalized); }
function envKey(provider: AuthProvider, suffix: string): string { return `${provider.toUpperCase()}_${suffix}`; }
export function getOAuthConfig(provider: AuthProvider): OAuthProviderConfig | null { const clientId = process.env[envKey(provider, "CLIENT_ID")]?.trim(); const clientSecret = process.env[envKey(provider, "CLIENT_SECRET")]?.trim(); const redirectUri = process.env[envKey(provider, "REDIRECT_URI")]?.trim(); if (!clientId || !clientSecret || !redirectUri) return null; try { const redirect = new URL(redirectUri); const localHttp = redirect.protocol === "http:" && ["localhost", "127.0.0.1"].includes(redirect.hostname); if ((redirect.protocol !== "https:" && !localHttp) || redirect.pathname !== `/api/auth/${provider}/callback`) return null; return { ...providerSettings[provider], clientId, clientSecret, redirectUri: redirect.toString() }; } catch { return null; } }
export function getGoogleOAuthConfig(): OAuthProviderConfig | null { return getOAuthConfig("google"); }
