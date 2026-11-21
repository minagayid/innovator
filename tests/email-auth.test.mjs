import assert from "node:assert/strict";
import test from "node:test";
import {
  EMAIL_SESSION_COOKIE,
  buildEmailSessionPayload,
  createRateLimiter,
  hashPassword,
  isValidEmailSession,
  normalizeDisplayName,
  normalizeEmail,
  passwordPolicyError,
  passwordStrengthScore,
  verifyPassword,
} from "../app/auth/email.ts";
import { signSignedPayload, verifySignedPayload } from "../app/auth/session.ts";

const secret = "test-session-secret-with-at-least-32-characters";

test("email normalization trims, lowercases, and rejects malformed addresses", () => {
  assert.equal(normalizeEmail("  Inventor@Example.COM "), "inventor@example.com");
  assert.equal(normalizeEmail("not-an-email"), null);
  assert.equal(normalizeEmail(""), null);
  assert.equal(normalizeEmail("a@b"), null);
  assert.equal(normalizeEmail(42), null);
  assert.equal(normalizeEmail("x".repeat(245) + "@example.com"), null);
});

test("password policy enforces length and letter+number mix", () => {
  assert.equal(passwordPolicyError("short1a"), "Password must be at least 10 characters.");
  assert.equal(passwordPolicyError("onlyletters here"), "Password must include at least one letter and one number.");
  assert.equal(passwordPolicyError("12345678901"), "Password must include at least one letter and one number.");
  assert.equal(passwordPolicyError("x".repeat(129) + "1a"), "Password must be at most 128 characters.");
  assert.equal(passwordPolicyError("valid-pass-123"), null);
  assert.equal(passwordPolicyError(undefined), "Password is required.");
});

test("strength meter tracks length and variety without gating", () => {
  assert.equal(passwordStrengthScore(""), 0);
  assert.equal(passwordStrengthScore("abcdefghij"), 1);
  assert.ok(passwordStrengthScore("Abcdefgh1!2345") >= 3);
});

test("hash + verify round-trips and rejects wrong passwords and tampered hashes", async () => {
  const stored = await hashPassword("correct-horse-42");
  assert.ok(stored.startsWith("pbkdf2-sha256$"));
  assert.equal(await verifyPassword("correct-horse-42", stored), true);
  assert.equal(await verifyPassword("correct-horse-43", stored), false);
  assert.equal(await verifyPassword("correct-horse-42", null), false);
  assert.equal(await verifyPassword("correct-horse-42", "not-a-hash"), false);
  const parts = stored.split("$");
  parts[3] = parts[3].slice(0, -1) + (parts[3].endsWith("a") ? "b" : "a");
  assert.equal(await verifyPassword("correct-horse-42", parts.join("$")), false);
  const weakIterations = ["pbkdf2-sha256", "1000", parts[2], parts[3]].join("$");
  assert.equal(await verifyPassword("correct-horse-42", weakIterations), false);
});

test("two hashes of the same password use different salts", async () => {
  const first = await hashPassword("same-password-1");
  const second = await hashPassword("same-password-1");
  assert.notEqual(first, second);
  assert.equal(await verifyPassword("same-password-1", first), true);
  assert.equal(await verifyPassword("same-password-1", second), true);
});

test("email session payload validates expiry, provider, and shape", async () => {
  const payload = buildEmailSessionPayload({ id: "user-1", email: "inventor@example.com", displayName: "Inventor" }, 3600);
  assert.equal(payload.provider, "email");
  assert.ok(isValidEmailSession(payload));
  assert.ok(!isValidEmailSession({ ...payload, provider: "google" }));
  assert.ok(!isValidEmailSession({ ...payload, expiresAt: Date.now() - 1000 }));
  assert.ok(!isValidEmailSession({ ...payload, email: "not-an-email" }));
  assert.ok(!isValidEmailSession(null));

  const token = await signSignedPayload(payload, secret);
  const verified = await verifySignedPayload(token, secret);
  assert.deepEqual(verified, payload);
  assert.ok(isValidEmailSession(verified));
});

test("rate limiter blocks after the limit, resets, and reports wait seconds", () => {
  const limiter = createRateLimiter(3, 60_000);
  const now = 1_000_000;
  assert.equal(limiter.check("k", now), 0);
  limiter.record("k", now);
  limiter.record("k", now);
  assert.equal(limiter.check("k", now), 0);
  limiter.record("k", now);
  const wait = limiter.check("k", now);
  assert.ok(wait > 0 && wait <= 60);
  limiter.reset("k");
  assert.equal(limiter.check("k", now), 0);

  const expired = createRateLimiter(1, 1000);
  expired.record("k", now);
  assert.ok(expired.check("k", now + 500) > 0);
  assert.equal(expired.check("k", now + 1500), 0);
});

test("display names fall back to the email local part and stay bounded", () => {
  assert.equal(normalizeDisplayName("  Mina   Gayid ", "mina@example.com"), "Mina Gayid");
  assert.equal(normalizeDisplayName("", "mina@example.com"), "mina");
  assert.equal(normalizeDisplayName(undefined, "mina@example.com"), "mina");
  assert.ok(normalizeDisplayName("x".repeat(200), "mina@example.com").length <= 80);
});

test("email session cookie name is namespaced like the OAuth cookies", () => {
  assert.equal(EMAIL_SESSION_COOKIE, "innovator_email_session");
});
