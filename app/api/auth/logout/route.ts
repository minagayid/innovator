import { NextRequest, NextResponse } from "next/server";
import {
  GOOGLE_OAUTH_STATE_COOKIE,
  GOOGLE_SESSION_COOKIE,
  safeRelativeReturnPath,
} from "../../../auth/session";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(
    new URL(safeRelativeReturnPath(request.nextUrl.searchParams.get("return_to")), request.nextUrl.origin),
  );
  const secure = request.nextUrl.protocol === "https:";
  response.cookies.set(GOOGLE_SESSION_COOKIE, "", {
    httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 0,
  });
  response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, "", {
    httpOnly: true, secure, sameSite: "lax", path: "/api/auth/google/callback", maxAge: 0,
  });
  return response;
}
