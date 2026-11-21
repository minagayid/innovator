import { NextRequest, NextResponse } from "next/server";
import { AUTH_SESSION_TTL_SECONDS, safeRelativeReturnPath, signSignedPayload } from "../../../../auth/session";
import {
  EMAIL_SESSION_COOKIE,
  buildEmailSessionPayload,
  normalizeDisplayName,
  normalizeEmail,
  passwordPolicyError,
  hashPassword,
  signupAttempts,
  loginAttempts,
} from "../../../../auth/email";
import { attachPasswordToUser, createEmailUser, getUserForEmailAuth, type StoredUser } from "../../../../../db";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8 * 1024;

function clientKey(request: NextRequest): string {
  return request.headers.get("cf-connecting-ip")
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
}

async function readBody(request: NextRequest): Promise<Record<string, unknown> | null> {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > MAX_BODY_BYTES) return null;
  try {
    const body: unknown = await request.json();
    return body && typeof body === "object" && !Array.isArray(body) ? body as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

function sessionResponse(request: NextRequest, user: StoredUser, returnTo: string, secret: string, status = 200) {
  return signSignedPayload(buildEmailSessionPayload(user, AUTH_SESSION_TTL_SECONDS), secret).then((token) => {
    const response = NextResponse.json(
      { user: { id: user.id, email: user.email, displayName: user.displayName }, returnTo },
      { status },
    );
    response.cookies.set(EMAIL_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: request.nextUrl.protocol === "https:",
      sameSite: "lax",
      path: "/",
      maxAge: AUTH_SESSION_TTL_SECONDS,
    });
    return response;
  });
}

export async function POST(request: NextRequest) {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    return NextResponse.json({ error: "Email sign-in is not configured on this deployment." }, { status: 503 });
  }

  const ipKey = `signup:ip:${clientKey(request)}`;
  const waitSeconds = signupAttempts.check(ipKey);
  if (waitSeconds > 0) {
    return NextResponse.json(
      { error: `Too many sign-up attempts. Try again in ${Math.ceil(waitSeconds / 60)} minute(s).` },
      { status: 429, headers: { "retry-after": String(waitSeconds) } },
    );
  }

  const body = await readBody(request);
  if (!body) return NextResponse.json({ error: "Send a JSON body with email, password, and an optional displayName." }, { status: 400 });

  const email = normalizeEmail(body.email);
  if (!email) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });

  const passwordError = passwordPolicyError(body.password);
  if (passwordError) return NextResponse.json({ error: passwordError }, { status: 400 });

  signupAttempts.record(ipKey);

  const passwordHash = await hashPassword(body.password as string);
  const returnTo = safeRelativeReturnPath(typeof body.returnTo === "string" ? body.returnTo : null);

  const existing = await getUserForEmailAuth(email);
  if (existing) {
    if (existing.passwordHash) {
      return NextResponse.json({ error: "An account with this email already exists. Sign in instead." }, { status: 409 });
    }
    // The account was created through an OAuth provider; link a password to it.
    const linked = await attachPasswordToUser(existing.id, passwordHash);
    if (!linked) return NextResponse.json({ error: "Could not update the existing account." }, { status: 500 });
    loginAttempts.reset(`login:email:${email}`);
    return sessionResponse(request, linked, returnTo, secret);
  }

  const displayName = normalizeDisplayName(body.displayName, email);
  const user = await createEmailUser(email, displayName, passwordHash);
  loginAttempts.reset(`login:email:${email}`);
  return sessionResponse(request, user, returnTo, secret, 201);
}
