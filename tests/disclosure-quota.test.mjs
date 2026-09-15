import assert from "node:assert/strict";
import test from "node:test";
import {
  consumeDisclosureQuota,
  runDisclosureProviderIfQuotaAllows,
  trustedDisclosureCallerHash,
} from "../db/disclosure-quota.ts";

function fakeDatabase() {
  const counters = new Map();
  return {
    counters,
    prepare(sql) {
      let values = [];
      return {
        bind(...boundValues) { values = boundValues; return this; },
        async run() {
          if (sql.startsWith("DELETE FROM disclosure_usage")) {
            const [cutoff] = values;
            for (const [key] of counters) {
              const windowStart = Number(key.slice(key.lastIndexOf(":") + 1));
              if (windowStart < cutoff) counters.delete(key);
            }
          }
          return { success: true };
        },
        async first() {
          const [scope, windowStart, limit] = values;
          const key = `${scope}:${windowStart}`;
          if (sql.includes("SELECT request_count")) {
            const count = counters.get(key);
            return count === undefined ? null : { requestCount: count };
          }
          if (!sql.includes("INSERT INTO disclosure_usage")) return null;
          const count = counters.get(key) ?? 0;
          if (count >= limit) return null;
          counters.set(key, count + 1);
          return { requestCount: count + 1 };
        },
      };
    },
  };
}

test("caller and shared quotas are atomic across requests", async () => {
  const db = fakeDatabase();
  const caller = "a".repeat(64);
  const now = Date.UTC(2026, 0, 1, 12);
  for (let attempt = 0; attempt < 4; attempt += 1) {
    assert.deepEqual(await consumeDisclosureQuota(db, caller, now), { allowed: true });
  }
  assert.deepEqual(await consumeDisclosureQuota(db, caller, now), { allowed: false, scope: "caller" });
  assert.deepEqual(await consumeDisclosureQuota(db, caller, now + 60 * 60 * 1000), { allowed: true });
});

test("concurrent callers cannot exceed the shared hourly quota", async () => {
  const db = fakeDatabase();
  const now = Date.UTC(2026, 0, 1, 12);
  const results = await Promise.all(Array.from({ length: 80 }, (_, caller) =>
    consumeDisclosureQuota(db, String(caller).padStart(64, "0"), now),
  ));

  assert.equal(results.filter((result) => result.allowed).length, 24);
  assert.equal(db.counters.get(`global-hour:${now}`), 24);
  assert.equal(db.counters.get(`global-day:${Date.UTC(2026, 0, 1)}`), 24);
});

test("hour and day windows stay independent when they begin at UTC midnight", async () => {
  const db = fakeDatabase();
  const caller = "b".repeat(64);
  const midnight = Date.UTC(2026, 0, 1, 0);
  assert.deepEqual(await consumeDisclosureQuota(db, caller, midnight), { allowed: true });
  assert.equal(db.counters.get(`caller-hour:${caller}:${midnight}`), 1);
  assert.equal(db.counters.get(`caller-day:${caller}:${midnight}`), 1);
  assert.equal(db.counters.get(`global-hour:${midnight}`), 1);
  assert.equal(db.counters.get(`global-day:${midnight}`), 1);

  assert.deepEqual(await consumeDisclosureQuota(db, caller, midnight + 30 * 60 * 1000), { allowed: true });
  assert.equal(db.counters.get(`caller-hour:${caller}:${midnight}`), 2);
  assert.equal(db.counters.get(`caller-day:${caller}:${midnight}`), 2);

  assert.deepEqual(await consumeDisclosureQuota(db, caller, midnight + 60 * 60 * 1000), { allowed: true });
  assert.equal(db.counters.get(`caller-hour:${caller}:${midnight + 60 * 60 * 1000}`), 1);
  assert.equal(db.counters.get(`caller-day:${caller}:${midnight}`), 3);
});

test("the global quota is shared across callers", async () => {
  const db = fakeDatabase();
  const now = Date.UTC(2026, 0, 1, 12);
  for (let caller = 0; caller < 24; caller += 1) {
    assert.deepEqual(await consumeDisclosureQuota(db, String(caller).padStart(64, "0"), now), { allowed: true });
  }
  assert.deepEqual(await consumeDisclosureQuota(db, "f".repeat(64), now), { allowed: false, scope: "global" });
});

test("global denial from new callers does not allocate caller rows", async () => {
  const db = fakeDatabase();
  const now = Date.UTC(2026, 0, 1, 12);
  for (let caller = 0; caller < 24; caller += 1) {
    assert.deepEqual(await consumeDisclosureQuota(db, String(caller).padStart(64, "0"), now), { allowed: true });
  }
  const callerRowsBeforeDenials = [...db.counters.keys()].filter((key) => key.startsWith("caller-")).length;
  for (let caller = 24; caller < 80; caller += 1) {
    assert.deepEqual(await consumeDisclosureQuota(db, String(caller).padStart(64, "0"), now), { allowed: false, scope: "global" });
  }
  const callerRowsAfterDenials = [...db.counters.keys()].filter((key) => key.startsWith("caller-")).length;
  assert.equal(callerRowsAfterDenials, callerRowsBeforeDenials);
});

test("stale rows are cleaned even when the caller quota denies", async () => {
  const db = fakeDatabase();
  const caller = "c".repeat(64);
  const now = Date.UTC(2026, 0, 10, 12);
  db.counters.set(`old-counter:${now - 3 * 24 * 60 * 60 * 1000}`, 1);
  db.counters.set(`caller-hour:${caller}:${now}`, 4);
  assert.deepEqual(await consumeDisclosureQuota(db, caller, now), { allowed: false, scope: "caller" });
  assert.equal(db.counters.has(`old-counter:${now - 3 * 24 * 60 * 60 * 1000}`), false);
});

test("caller hashing requires the configured edge boundary and ignores forwarded-for", async () => {
  const secret = "test-secret-that-is-long-enough-for-hmac";
  const forwardedOnly = new Request("https://example.test", { headers: { "x-forwarded-for": "203.0.113.1" } });
  assert.equal(await trustedDisclosureCallerHash(forwardedOnly, "true", secret), null);
  const edgeRequest = new Request("https://example.test", { headers: { "cf-connecting-ip": "203.0.113.1" } });
  const first = await trustedDisclosureCallerHash(edgeRequest, "true", secret);
  const repeated = await trustedDisclosureCallerHash(edgeRequest, "true", secret);
  assert.equal(first, repeated);
  assert.match(first, /^[a-f0-9]{64}$/);
  assert.notEqual(first, "203.0.113.1");
  assert.equal(await trustedDisclosureCallerHash(edgeRequest, "false", secret), null);
  assert.equal(await trustedDisclosureCallerHash(edgeRequest, "true", "short"), null);
});

test("paid provider gate never invokes the provider without trusted identity or usable D1 quota", async () => {
  let providerCalls = 0;
  let databaseCalls = 0;
  const provider = async () => { providerCalls += 1; return "paid"; };
  const secret = "test-secret-that-is-long-enough-for-hmac";
  const untrustedRequest = new Request("https://example.test", {
    headers: { "x-forwarded-for": "203.0.113.1" },
  });
  const callerHash = await trustedDisclosureCallerHash(untrustedRequest, "true", secret);
  assert.equal(callerHash, null);
  assert.deepEqual(await runDisclosureProviderIfQuotaAllows(callerHash, () => {
    databaseCalls += 1;
    return fakeDatabase();
  }, provider), { allowed: false });
  assert.equal(databaseCalls, 0);

  const saturated = fakeDatabase();
  const now = Date.UTC(2026, 0, 1, 12);
  saturated.counters.set(`global-hour:${now}`, 24);
  assert.deepEqual(await runDisclosureProviderIfQuotaAllows("a".repeat(64), () => saturated, provider, now), { allowed: false });

  assert.deepEqual(await runDisclosureProviderIfQuotaAllows("b".repeat(64), () => {
    throw new Error("D1 binding unavailable");
  }, provider, now), { allowed: false });
  assert.deepEqual(await runDisclosureProviderIfQuotaAllows("c".repeat(64), () => ({
    prepare() { throw new Error("D1 query failed"); },
  }), provider, now), { allowed: false });
  assert.equal(providerCalls, 0);
});
