import { NextRequest, NextResponse } from "next/server";
import {
  getGoogleOAuthConfig,
  GOOGLE_OAUTH_STATE_COOKIE,
  randomUrlToken,
  safeRelativeReturnPath,
  signSignedPayload,
  toBase64Url,
} from "../../../auth/session";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const config = getGoogleOAuthConfig();
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!config || !secret || secret.length < 32) {
    return NextResponse.json(
      { error: "Google OAuth is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, and a 32+ character AUTH_SESSION_SECRET." },
      { status: 503 },
    );
  }

  const state = randomUrlToken(32);
  const verifier = randomUrlToken(48);
  const challengeBytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier)));
  const challenge = toBase64Url(challengeBytes);
  const stateCookie = await signSignedPayload({
    state,
    verifier,
    returnTo: safeRelativeReturnPath(request.nextUrl.searchParams.get("return_to")),
    issuedAt: Date.now(),
  }, secret);

  const authorization = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorization.searchParams.set("client_id", config.clientId);
  authorization.searchParams.set("redirect_uri", config.redirectUri);
  authorization.searchParams.set("response_type", "code");
  authorization.searchParams.set("scope", "openid email profile");
  authorization.searchParams.set("state", state);
  authorization.searchParams.set("code_challenge", challenge);
  authorization.searchParams.set("code_challenge_method", "S256");
  authorization.searchParams.set("prompt", "select_account");

  const secure = new URL(config.redirectUri).protocol === "https:";
  const response = NextResponse.redirect(authorization);
  response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, stateCookie, {
    httpOnly: true, secure, sameSite: "lax", path: "/api/auth/google/callback", maxAge: 600,
  });
  return response;
}
