#!/usr/bin/env node
/**
 * End-to-end QA + stress probe for email auth. Runs against a live server
 * (default http://127.0.0.1:3100). Uses throwaway QA accounts only.
 */
import assert from "node:assert/strict";

const base = (process.env.BASE_URL || "http://127.0.0.1:3100").replace(/\/$/, "");
const stamp = Date.now();
const results = [];

async function request(path, init) {
  const started = performance.now();
  const response = await fetch(`${base}${path}`, { ...init, signal: AbortSignal.timeout(20000) });
  const text = await response.text();
  let body = null;
  try { body = JSON.parse(text); } catch { /* HTML */ }
  results.push({ path, status: response.status, ms: Math.round(performance.now() - started) });
  return { response, body, text };
}

function json(payload) {
  return { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) };
}

function cookiesOf(response) {
  const raw = response.headers.get("set-cookie") || "";
  return Object.fromEntries(raw.split(",").map((part) => part.trim().split(";")[0].split("=", 2)).filter((pair) => pair.length === 2 && pair[1]));
}

// 1. Login page renders.
const page = await request("/login");
assert.ok(page.response.ok, `login page failed: ${page.response.status}`);
assert.ok(page.text.includes("Sign in") && page.text.includes("Create account"), "login page missing mode tabs");

// 2. Validation: bad email, weak password, malformed JSON, oversized body.
const badEmail = await request("/api/auth/email/signup", json({ email: "nope", password: "valid-pass-123" }));
assert.equal(badEmail.response.status, 400);
const weak = await request("/api/auth/email/signup", json({ email: `qa-${stamp}@example.com`, password: "short1" }));
assert.equal(weak.response.status, 400);
const malformed = await request("/api/auth/email/signup", { method: "POST", headers: { "content-type": "application/json" }, body: "not-json" });
assert.equal(malformed.response.status, 400);
const oversized = await request("/api/auth/email/signup", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: "a@b.co", password: "p".repeat(9000) }) });
assert.equal(oversized.response.status, 400);

// 3. Signup -> session cookie -> /api/session reflects the user.
const email = `qa-${stamp}@example.com`;
const password = `Qa-pass-${stamp}-1`;
const signup = await request("/api/auth/email/signup", json({ email, password, displayName: "QA Inventor", returnTo: "/" }));
assert.equal(signup.response.status, 201, `signup failed: ${signup.text}`);
const cookie = Object.entries(cookiesOf(signup.response)).map(([k, v]) => `${k}=${v}`).join("; ");
assert.ok(cookie.includes("innovator_email_session="), "no session cookie on signup");
const session = await request("/api/session", { headers: { cookie } });
assert.equal(session.body?.user?.email, email, "session did not resolve the signed-up user");

// 4. Duplicate signup -> 409.
const dupe = await request("/api/auth/email/signup", json({ email, password }));
assert.equal(dupe.response.status, 409);

// 5. Wrong password -> 401, generic message.
const wrong = await request("/api/auth/email/login", json({ email, password: "wrong-pass-123" }));
assert.equal(wrong.response.status, 401);
assert.ok(!wrong.text.toLowerCase().includes("no account"), "error leaks account existence");

// 6. Correct login -> 200 + fresh cookie.
const login = await request("/api/auth/email/login", json({ email, password }));
assert.equal(login.response.status, 200, `login failed: ${login.text}`);
const loginCookie = Object.entries(cookiesOf(login.response)).map(([k, v]) => `${k}=${v}`).join("; ");
const session2 = await request("/api/session", { headers: { cookie: loginCookie } });
assert.equal(session2.body?.user?.displayName, "QA Inventor");

// 7. Unknown email -> 401 (not 404/500).
const unknown = await request("/api/auth/email/login", json({ email: `ghost-${stamp}@example.com`, password }));
assert.equal(unknown.response.status, 401);

// 8. Logout clears the email cookie.
const logout = await request("/api/auth/logout?return_to=%2F", { redirect: "manual" });
assert.ok((logout.response.headers.get("set-cookie") || "").includes("innovator_email_session="), "logout did not clear email cookie");

// 9. Stress: 40 concurrent good logins + 40 concurrent bad logins + 20 session reads.
const stressStart = performance.now();
const jobs = [];
for (let i = 0; i < 40; i += 1) jobs.push(request("/api/auth/email/login", json({ email, password })));
for (let i = 0; i < 40; i += 1) jobs.push(request("/api/auth/email/login", json({ email, password: "wrong-pass-123" })));
for (let i = 0; i < 20; i += 1) jobs.push(request("/api/session", { headers: { cookie: loginCookie } }));
await Promise.all(jobs);
const stressMs = Math.round(performance.now() - stressStart);
const goodLogins = results.filter((r) => r.path === "/api/auth/email/login").slice(2); // after scripted ones above
const goodStatuses = new Set(goodLogins.map((r) => r.status));
console.log(JSON.stringify({
  base,
  scriptedChecks: "all passed",
  stress: { totalRequests: results.length, wallMs: stressMs, loginStatuses: [...goodStatuses], maxMs: Math.max(...results.map((r) => r.ms)) },
  note: "10-attempt/10-min login throttle per email is expected to convert some of the 80 stress logins to 429; that is the limiter working, not a failure.",
}, null, 2));
const unexpected = results.filter((r) => ![200, 201, 302, 307, 400, 401, 409, 429].includes(r.status));
assert.equal(unexpected.length, 0, `unexpected statuses: ${JSON.stringify(unexpected)}`);
