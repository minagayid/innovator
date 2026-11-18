import { NextRequest, NextResponse } from "next/server";
import { getOAuthConfig, isAuthProvider, oauthStateCookieName, sessionCookieName, AUTH_SESSION_TTL_SECONDS, OAUTH_STATE_TTL_MS, safeRelativeReturnPath, signSignedPayload, verifySignedPayload, type AuthProvider, type AuthSessionPayload, type OAuthStatePayload } from "../../../../auth/session";
export const dynamic = "force-dynamic";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function clearState(response: NextResponse, provider: AuthProvider, secure: boolean) { response.cookies.set(oauthStateCookieName(provider), "", { httpOnly: true, secure, sameSite: "lax", path: `/api/auth/${provider}/callback`, maxAge: 0 }); }
async function fetchToken(provider: AuthProvider, config: NonNullable<ReturnType<typeof getOAuthConfig>>, code: string, verifier: string) {
  const body = new URLSearchParams({ code, client_id: config.clientId, client_secret: config.clientSecret, redirect_uri: config.redirectUri, grant_type: "authorization_code" });
  if (provider !== "github") body.set("code_verifier", verifier);
  const response = await fetch(config.tokenUrl, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" }, body, signal: AbortSignal.timeout(12000) });
  if (!response.ok) return null;
  const payload = await response.json() as { access_token?: string; token_type?: string };
  return payload.access_token ? payload.access_token : null;
}
async function fetchProfile(provider: AuthProvider, config: NonNullable<ReturnType<typeof getOAuthConfig>>, accessToken: string) {
  const response = await fetch(config.userInfoUrl, { headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json", "User-Agent": "Innovator/1.0" }, signal: AbortSignal.timeout(12000) });
  if (!response.ok) return null;
  const profile = await response.json() as Record<string, unknown>;
  if (provider === "github" && !profile.email) {
    const emails = await fetch("https://api.github.com/user/emails", { headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github+json", "User-Agent": "Innovator/1.0" }, signal: AbortSignal.timeout(12000) });
    if (emails.ok) { const values = await emails.json() as Array<{ email?: string; primary?: boolean; verified?: boolean }>; const best = values.find((item) => item.primary && item.verified) || values.find((item) => item.verified); if (best?.email) profile.email = best.email; }
  }
  const sub = typeof profile.sub === "string" ? profile.sub : typeof profile.id === "string" || typeof profile.id === "number" ? String(profile.id) : "";
  const email = typeof profile.email === "string" ? profile.email.trim().toLowerCase() : "";
  const displayName = typeof profile.name === "string" && profile.name.trim() ? profile.name.trim() : typeof profile.login === "string" ? profile.login : email.split("@")[0];
  return sub && EMAIL_PATTERN.test(email) ? { sub, email, displayName: displayName.slice(0, 120) } : null;
}
export async function GET(request: NextRequest, context: { params: Promise<{ provider: string }> }) {
  const { provider: rawProvider } = await context.params;
  if (!isAuthProvider(rawProvider) || rawProvider === "google") return NextResponse.json({ error: "Unsupported OAuth provider." }, { status: 404 });
  const provider = rawProvider;
  const config = getOAuthConfig(provider); const secret = process.env.AUTH_SESSION_SECRET;
  if (!config || !secret || secret.length < 32) return NextResponse.json({ error: `${provider} OAuth is not configured.` }, { status: 503 });
  const origin = new URL(config.redirectUri).origin; const secure = new URL(config.redirectUri).protocol === "https:";
  const fail = (code: string) => { const response = NextResponse.redirect(new URL(`/?auth_error=${encodeURIComponent(code)}`, origin)); clearState(response, provider, secure); return response; };
  const state = request.nextUrl.searchParams.get("state"); const signed = request.cookies.get(oauthStateCookieName(provider))?.value; const statePayload = await verifySignedPayload<OAuthStatePayload>(signed, secret);
  if (!state || !statePayload || statePayload.provider !== provider || statePayload.state !== state || typeof statePayload.verifier !== "string" || typeof statePayload.issuedAt !== "number" || Date.now() - statePayload.issuedAt > OAUTH_STATE_TTL_MS || statePayload.issuedAt > Date.now() + 60000) return fail(`${provider}_invalid_state`);
  if (request.nextUrl.searchParams.has("error")) return fail(`${provider}_auth_cancelled`);
  const code = request.nextUrl.searchParams.get("code"); if (!code || code.length > 4096) return fail(`${provider}_missing_code`);
  try { const token = await fetchToken(provider, config, code, statePayload.verifier); if (!token) return fail(`${provider}_token_exchange_failed`); const profile = await fetchProfile(provider, config, token); if (!profile) return fail(`${provider}_profile_failed`); const issuedAt = Date.now(); const session: AuthSessionPayload = { provider, ...profile, issuedAt, expiresAt: issuedAt + AUTH_SESSION_TTL_SECONDS * 1000 }; const response = NextResponse.redirect(new URL(safeRelativeReturnPath(statePayload.returnTo), origin)); response.cookies.set(sessionCookieName(provider), await signSignedPayload(session, secret), { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: AUTH_SESSION_TTL_SECONDS }); clearState(response, provider, secure); return response; } catch { return fail(`${provider}_auth_failed`); }
}
