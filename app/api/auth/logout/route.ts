import { NextRequest, NextResponse } from "next/server";
import { oauthStateCookieName, safeRelativeReturnPath, sessionCookieName, type AuthProvider } from "../../../auth/session";
import { EMAIL_SESSION_COOKIE } from "../../../auth/email";
const providers: AuthProvider[] = ["google", "github", "linkedin", "orcid"];
export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL(safeRelativeReturnPath(request.nextUrl.searchParams.get("return_to")), request.nextUrl.origin));
  const secure = request.nextUrl.protocol === "https:";
  for (const provider of providers) {
    response.cookies.set(sessionCookieName(provider), "", { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 0 });
    response.cookies.set(oauthStateCookieName(provider), "", { httpOnly: true, secure, sameSite: "lax", path: `/api/auth/${provider}/callback`, maxAge: 0 });
  }
  response.cookies.set(EMAIL_SESSION_COOKIE, "", { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}
