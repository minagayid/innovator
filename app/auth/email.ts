import { toBase64Url, fromBase64Url } from "./session.ts";

/**
 * Email + password authentication for the Innovator studio.
 *
 * This module is deliberately free of runtime bindings (no `cloudflare:workers`
 * imports) so it can be unit-tested under plain Node and reused by route
 * handlers running in Workerd. Passwords are hashed with PBKDF2-SHA256 via
 * Web Crypto, which is available in both runtimes.
 */

export const EMAIL_SESSION_COOKIE = "innovator_email_session";
export const EMAIL_AUTH_PROVIDER = "email" as const;

export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_MAX_LENGTH = 128;
export const EMAIL_MAX_LENGTH = 254;
export const DISPLAY_NAME_MAX_LENGTH = 80;

const PBKDF2_ITERATIONS = 210_000;
const PBKDF2_KEY_LENGTH_BYTES = 32;
const HASH_FORMAT = "pbkdf2-sha256";

const encoder = new TextEncoder();

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type EmailSessionPayload = {
  provider: typeof EMAIL_AUTH_PROVIDER;
  sub: string;
  email: string;
  displayName: string;
  issuedAt: number;
  expiresAt: number;
};

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (!email || email.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(email)) return null;
  return email;
}

export function normalizeDisplayName(value: unknown, fallbackEmail: string): string {
  if (typeof value === "string") {
    const name = value.trim().replace(/\s+/g, " ");
    if (name) return name.slice(0, DISPLAY_NAME_MAX_LENGTH);
  }
  const localPart = fallbackEmail.split("@")[0] || "inventor";
  return localPart.slice(0, DISPLAY_NAME_MAX_LENGTH);
}

/** Returns null when the password is acceptable, otherwise a user-facing reason. */
export function passwordPolicyError(password: unknown): string | null {
  if (typeof password !== "string") return "Password is required.";
  if (password.length < PASSWORD_MIN_LENGTH) return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  if (password.length > PASSWORD_MAX_LENGTH) return `Password must be at most ${PASSWORD_MAX_LENGTH} characters.`;
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return "Password must include at least one letter and one number.";
  return null;
}

/** Rough 0-4 strength score for the interactive meter; not a policy gate. */
export function passwordStrengthScore(password: string): number {
  let score = 0;
  if (password.length >= PASSWORD_MIN_LENGTH) score += 1;
  if (password.length >= 14) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 4);
}

async function pbkdf2(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations },
    key,
    PBKDF2_KEY_LENGTH_BYTES * 8,
  );
  return new Uint8Array(bits);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  const hash = await pbkdf2(password, salt, PBKDF2_ITERATIONS);
  return [HASH_FORMAT, String(PBKDF2_ITERATIONS), toBase64Url(salt), toBase64Url(hash)].join("$");
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  const length = Math.max(a.length, b.length);
  let diff = a.length === b.length ? 0 : 1;
  for (let i = 0; i < length; i += 1) diff |= (a[i % a.length] ?? 0) ^ (b[i % b.length] ?? 0);
  return diff === 0;
}

export async function verifyPassword(password: string, stored: string | null | undefined): Promise<boolean> {
  if (typeof stored !== "string") return false;
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== HASH_FORMAT) return false;
  const iterations = Number(parts[1]);
  if (!Number.isInteger(iterations) || iterations < 100_000 || iterations > 2_000_000) return false;
  let salt: Uint8Array;
  let expected: Uint8Array;
  try {
    salt = fromBase64Url(parts[2]);
    expected = fromBase64Url(parts[3]);
  } catch {
    return false;
  }
  if (salt.length < 16 || expected.length !== PBKDF2_KEY_LENGTH_BYTES) return false;
  const actual = await pbkdf2(password, salt, iterations);
  return timingSafeEqual(actual, expected);
}

export function buildEmailSessionPayload(user: { id: string; email: string; displayName: string }, ttlSeconds: number): EmailSessionPayload {
  const now = Date.now();
  return {
    provider: EMAIL_AUTH_PROVIDER,
    sub: user.id,
    email: user.email,
    displayName: user.displayName,
    issuedAt: now,
    expiresAt: now + ttlSeconds * 1000,
  };
}

export function isValidEmailSession(session: EmailSessionPayload | null): session is EmailSessionPayload {
  return Boolean(
    session
    && session.provider === EMAIL_AUTH_PROVIDER
    && typeof session.sub === "string" && session.sub
    && typeof session.email === "string" && EMAIL_PATTERN.test(session.email)
    && typeof session.displayName === "string"
    && typeof session.expiresAt === "number" && session.expiresAt > Date.now()
    && typeof session.issuedAt === "number" && session.issuedAt <= Date.now() + 60_000,
  );
}

/**
 * Fixed-window in-memory rate limiter. On Cloudflare Workers this applies per
 * isolate, so it is a best-effort throttle rather than a global counter; the
 * deterministic unit tests exercise the counting contract.
 */
export type RateLimiter = {
  /** Returns the seconds until `key` may retry, or 0 when the attempt is allowed. */
  check(key: string, now?: number): number;
  /** Records an attempt for `key`. */
  record(key: string, now?: number): void;
  /** Clears recorded attempts, e.g. after a successful login. */
  reset(key: string): void;
};

export function createRateLimiter(limit: number, windowMs: number): RateLimiter {
  const attempts = new Map<string, { count: number; resetAt: number }>();
  return {
    check(key, now = Date.now()) {
      const entry = attempts.get(key);
      if (!entry || entry.resetAt <= now) return 0;
      return entry.count >= limit ? Math.ceil((entry.resetAt - now) / 1000) : 0;
    },
    record(key, now = Date.now()) {
      const entry = attempts.get(key);
      if (!entry || entry.resetAt <= now) {
        attempts.set(key, { count: 1, resetAt: now + windowMs });
      } else {
        entry.count += 1;
      }
      if (attempts.size > 10_000) {
        for (const [storedKey, value] of attempts) {
          if (value.resetAt <= now) attempts.delete(storedKey);
        }
      }
    },
    reset(key) {
      attempts.delete(key);
    },
  };
}

/** Shared limiters for the route handlers: per-email login attempts and per-IP signups. */
export const loginAttempts = createRateLimiter(10, 10 * 60 * 1000);
export const signupAttempts = createRateLimiter(5, 60 * 60 * 1000);
