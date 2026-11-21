import { NextRequest, NextResponse } from "next/server";
import { AUTH_SESSION_TTL_SECONDS, safeRelativeReturnPath, signSignedPayload } from "../../../../auth/session";
import {
  EMAIL_SESSION_COOKIE,
  buildEmailSessionPayload,
  normalizeEmail,
  verifyPassword,
  hashPassword,
  loginAttempts,
} from "../../../../auth/email";
import { getUserForEmailAuth } from "../../../../../db";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8 * 1024;
const INVALID_CREDENTIALS = "That email and password combination did not match an account.";

// A real-format hash so unknown emails cost the same PBKDF2 work as known ones.
let dummyHashPromise: Promise<string> | null = null;
function dummyHash(): Promise<string> {
  dummyHashPromise ??= hashPassword("dummy-password-for-timing-1");
  return dummyHashPromise;
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

export async function POST(request: NextRequest) {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    return NextResponse.json({ error: "Email sign-in is not configured on this deployment." }, { status: 503 });
  }

  const body = await readBody(request);
  if (!body) return NextResponse.json({ error: "Send a JSON body with email and password." }, { status: 400 });

  const email = normalizeEmail(body.email);
  if (!email || typeof body.password !== "string" || !body.password) {
    return NextResponse.json({ error: "Enter a valid email address and password." }, { status: 400 });
  }

  const limiterKey = `login:email:${email}`;
  const waitSeconds = loginAttempts.check(limiterKey);
  if (waitSeconds > 0) {
    return NextResponse.json(
      { error: `Too many sign-in attempts. Try again in ${Math.ceil(waitSeconds / 60)} minute(s).` },
      { status: 429, headers: { "retry-after": String(waitSeconds) } },
    );
  }

  const user = await getUserForEmailAuth(email);
  const storedHash = user?.passwordHash ?? await dummyHash();
  const passwordOk = await verifyPassword(body.password, storedHash);
  if (!user || !user.passwordHash || !passwordOk) {
    loginAttempts.record(limiterKey);
    return NextResponse.json({ error: INVALID_CREDENTIALS }, { status: 401 });
  }

  loginAttempts.reset(limiterKey);
  const returnTo = safeRelativeReturnPath(typeof body.returnTo === "string" ? body.returnTo : null);
  const token = await signSignedPayload(
    buildEmailSessionPayload(user, AUTH_SESSION_TTL_SECONDS),
    secret,
  );
  const response = NextResponse.json({
    user: { id: user.id, email: user.email, displayName: user.displayName },
    returnTo,
  });
  response.cookies.set(EMAIL_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: request.nextUrl.protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_SESSION_TTL_SECONDS,
  });
  return response;
}
