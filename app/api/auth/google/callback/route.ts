import { NextRequest, NextResponse } from "next/server";
import {
  getGoogleOAuthConfig,
  GOOGLE_OAUTH_STATE_COOKIE,
  GOOGLE_SESSION_COOKIE,
  GOOGLE_SESSION_TTL_SECONDS,
  OAUTH_STATE_TTL_MS,
  isGoogleEmailAllowed,
  safeRelativeReturnPath,
  signSignedPayload,
  verifySignedPayload,
  type GoogleOAuthStatePayload,
  type GoogleSessionPayload,
} from "../../../../auth/session";

export const dynamic = "force-dynamic";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clearStateCookie(response: NextResponse, secure: boolean) {
  response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, "", {
    httpOnly: true, secure, sameSite: "lax", path: "/api/auth/google/callback", maxAge: 0,
  });
}

export async function GET(request: NextRequest) {
  const config = getGoogleOAuthConfig();
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!config || !secret || secret.length < 32) {
    return NextResponse.json({ error: "Google OAuth is not configured." }, { status: 503 });
  }
  const origin = new URL(config.redirectUri).origin;
  const secure = new URL(config.redirectUri).protocol === "https:";
  const fail = (code: string) => {
    const destination = new URL("/", origin);
    destination.searchParams.set("auth_error", code);
    const response = NextResponse.redirect(destination);
    clearStateCookie(response, secure);
    return response;
  };

  const returnedState = request.nextUrl.searchParams.get("state");
  const stateToken = request.cookies.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;
  const statePayload = await verifySignedPayload<GoogleOAuthStatePayload>(stateToken, secret);
  if (!returnedState || !statePayload || statePayload.state !== returnedState
    || typeof statePayload.issuedAt !== "number" || Date.now() - statePayload.issuedAt > OAUTH_STATE_TTL_MS
    || statePayload.issuedAt > Date.now() + 60_000 || typeof statePayload.verifier !== "string") {
    return fail("google_invalid_state");
  }
  if (request.nextUrl.searchParams.has("error")) return fail("google_auth_cancelled");
  const code = request.nextUrl.searchParams.get("code");
  if (!code || code.length > 4096) return fail("google_missing_code");

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri,
        grant_type: "authorization_code",
        code_verifier: statePayload.verifier,
      }),
      signal: AbortSignal.timeout(12_000),
    });
    if (!tokenResponse.ok) return fail("google_token_exchange_failed");
    const tokenPayload = await tokenResponse.json() as { access_token?: string; token_type?: string };
    if (!tokenPayload.access_token || tokenPayload.token_type?.toLowerCase() !== "bearer") return fail("google_token_invalid");

    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: "Bearer " + tokenPayload.access_token },
      signal: AbortSignal.timeout(12_000),
    });
    if (!profileResponse.ok) return fail("google_profile_failed");
    const profile = await profileResponse.json() as {
      sub?: unknown; email?: unknown; email_verified?: unknown; name?: unknown;
    };
    const sub = typeof profile.sub === "string" ? profile.sub : "";
    const email = typeof profile.email === "string" ? profile.email.trim().toLowerCase() : "";
    const displayName = typeof profile.name === "string" && profile.name.trim()
      ? profile.name.trim().slice(0, 120) : email.split("@")[0];
    if (!sub || !EMAIL_PATTERN.test(email) || profile.email_verified !== true) return fail("google_email_unverified");
    if (!isGoogleEmailAllowed(email, process.env.GOOGLE_ALLOWED_EMAILS)) return fail("google_email_not_allowed");

    const issuedAt = Date.now();
    const sessionPayload: GoogleSessionPayload = {
      provider: "google", sub, email, displayName, issuedAt,
      expiresAt: issuedAt + GOOGLE_SESSION_TTL_SECONDS * 1000,
    };
    const sessionToken = await signSignedPayload(sessionPayload, secret);
    const destination = new URL(safeRelativeReturnPath(statePayload.returnTo), origin);
    const response = NextResponse.redirect(destination);
    response.cookies.set(GOOGLE_SESSION_COOKIE, sessionToken, {
      httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: GOOGLE_SESSION_TTL_SECONDS,
    });
    clearStateCookie(response, secure);
    return response;
  } catch {
    return fail("google_auth_failed");
  }
}
