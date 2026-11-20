#!/usr/bin/env node
import assert from "node:assert/strict";

const base = (process.env.BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const concurrency = Math.min(Math.max(Number(process.env.CONCURRENCY || 4), 1), 8);
const rounds = Math.min(Math.max(Number(process.env.ROUNDS || 2), 1), 5);
const results = [];

async function request(path, init) {
  const started = performance.now();
  const response = await fetch(`${base}${path}`, { ...init, signal: AbortSignal.timeout(15000) });
  const text = await response.text();
  let body = null;
  try { body = JSON.parse(text); } catch { /* HTML/text is retained for diagnostics */ }
  results.push({ path, status: response.status, ms: Math.round(performance.now() - started) });
  return { response, body, text };
}

const health = await request("/healthz");
assert.ok(health.response.ok, `healthz failed: ${health.response.status}`);
const session = await request("/api/session");
assert.ok(session.response.ok, `session failed: ${session.response.status}`);
assert.ok(session.body && Object.prototype.hasOwnProperty.call(session.body, "user"), "session contract missing user");
const anonymousRole = await request("/api/roles/review", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ brief: "Bounded acceptance probe: improve a measurable process outcome without claiming validation." }) });
assert.ok([200, 401, 429].includes(anonymousRole.response.status), `unexpected role status: ${anonymousRole.response.status}`);
if (anonymousRole.response.status === 200) assert.equal(anonymousRole.body?.provenance?.evidence, "proposed");
const research = await request("/api/research?q=thermal%20storage");
assert.ok([200, 502, 503, 504].includes(research.response.status), `unexpected research status: ${research.response.status}`);
const malformed = await request("/api/roles/review", { method: "POST", headers: { "content-type": "application/json" }, body: "not-json" });
assert.equal(malformed.response.status, 400);
const oversized = await request("/api/roles/review", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ brief: "x".repeat(13000) }) });
assert.equal(oversized.response.status, 413);
const manufacturing = await request("/api/manufacturing", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ title: "Acceptance candidate", problem: "Measure a bounded change", components: ["test article"], category: "materials" }) });
assert.equal(manufacturing.response.status, 200);
assert.equal(manufacturing.body?.mode, "deterministic-gated");

const jobs = [];
for (let round = 0; round < rounds; round += 1) {
  for (let i = 0; i < concurrency; i += 1) jobs.push(request("/api/session"));
}
await Promise.all(jobs);
const sessionLoads = results.filter((item) => item.path === "/api/session").slice(-concurrency * rounds);
assert.equal(sessionLoads.length, concurrency * rounds);
const failures = sessionLoads.filter((item) => item.status !== 200);
console.log(JSON.stringify({ base, concurrency, rounds, checks: results.slice(0, 7), sessionLoad: { requests: sessionLoads.length, failures: failures.length, maxMs: Math.max(...sessionLoads.map((item) => item.ms)), statuses: [...new Set(sessionLoads.map((item) => item.status))] }, authentication: "Only unauthenticated session contract tested; no credentials were fabricated or stored.", database: "This HTTP probe does not prove production D1 write concurrency; deterministic quota/persistence tests remain the database evidence." }, null, 2));
assert.equal(failures.length, 0, `session load failures: ${JSON.stringify(failures)}`);
