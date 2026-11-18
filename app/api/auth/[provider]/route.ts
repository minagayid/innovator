import { NextRequest, NextResponse } from "next/server";
import { getOAuthConfig, isAuthProvider, oauthStateCookieName, randomUrlToken, safeRelativeReturnPath, signSignedPayload, toBase64Url } from "../../../auth/session";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest, context: { params: Promise<{ provider: string }> }) {
  const { provider: rawProvider } = await context.params;
  if (!isAuthProvider(rawProvider) || rawProvider === "google") return NextResponse.json({ error: "Unsupported OAuth provider." }, { status: 404 });
  const provider = rawProvider;
  const config = getOAuthConfig(provider);
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!config || !secret || secret.length < 32) return NextResponse.json({ error: `${provider} OAuth is not configured.` }, { status: 503 });
  const state = randomUrlToken(32);
  const verifier = randomUrlToken(48);
  const challenge = toBase64Url(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))));
  const signedState = await signSignedPayload({ state, verifier, provider, returnTo: safeRelativeReturnPath(request.nextUrl.searchParams.get("return_to")), issuedAt: Date.now() }, secret);
  const authorization = new URL(config.authorizationUrl);
  authorization.searchParams.set("client_id", config.clientId);
  authorization.searchParams.set("redirect_uri", config.redirectUri);
  authorization.searchParams.set("response_type", "code");
  authorization.searchParams.set("scope", config.scopes);
  authorization.searchParams.set("state", state);
  if (provider !== "github") { authorization.searchParams.set("code_challenge", challenge); authorization.searchParams.set("code_challenge_method", "S256"); }
  const secure = new URL(config.redirectUri).protocol === "https:";
  const response = NextResponse.redirect(authorization);
  response.cookies.set(oauthStateCookieName(provider), signedState, { httpOnly: true, secure, sameSite: "lax", path: `/api/auth/${provider}/callback`, maxAge: 600 });
  return response;
}
