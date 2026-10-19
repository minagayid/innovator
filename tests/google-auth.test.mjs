import assert from "node:assert/strict";
import test from "node:test";
import { isGoogleEmailAllowed, safeRelativeReturnPath, signSignedPayload, verifySignedPayload } from "../app/auth/session.ts";
import { authenticatedDisclosureCallerHash } from "../db/disclosure-quota.ts";

const secret = "test-session-secret-with-at-least-32-characters";

test("return paths stay same-origin and reject authentication endpoints", () => {
  assert.equal(safeRelativeReturnPath("/workspace?id=1#top"), "/workspace?id=1#top");
  assert.equal(safeRelativeReturnPath("https://attacker.example/"), "/");
  assert.equal(safeRelativeReturnPath("//attacker.example/"), "/");
  assert.equal(safeRelativeReturnPath("/\\attacker.example/"), "/");
  assert.equal(safeRelativeReturnPath("/api/auth/google/callback"), "/");
  assert.equal(safeRelativeReturnPath(null), "/");
});

test("signed payload verifies only with the correct secret and intact bytes", async () => {
  const payload = { provider: "google", email: "inventor@example.com", issuedAt: 1, expiresAt: 2 };
  const token = await signSignedPayload(payload, secret);
  assert.deepEqual(await verifySignedPayload(token, secret), payload);
  assert.equal(await verifySignedPayload(token, secret + "-wrong"), null);
  const mutated = token.slice(0, -1) + (token.endsWith("a") ? "b" : "a");
  assert.equal(await verifySignedPayload(mutated, secret), null);
  assert.equal(await verifySignedPayload(token, "short"), null);
});

test("Google allowlist is case-insensitive and empty means no allowlist", () => {
  assert.equal(isGoogleEmailAllowed("Inventor@example.com", "owner@example.com, inventor@example.com"), true);
  assert.equal(isGoogleEmailAllowed("other@example.com", "owner@example.com"), false);
  assert.equal(isGoogleEmailAllowed("anyone@example.com", ""), true);
});

test("authenticated caller hashes normalize email and require a strong secret", async () => {
  const upper = await authenticatedDisclosureCallerHash("Inventor@example.com", secret);
  const lower = await authenticatedDisclosureCallerHash("inventor@example.com", secret);
  assert.equal(upper, lower);
  assert.equal(upper?.length, 64);
  assert.equal(await authenticatedDisclosureCallerHash("not-an-email", secret), null);
  assert.equal(await authenticatedDisclosureCallerHash("inventor@example.com", "short"), null);
});
