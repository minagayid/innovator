import assert from "node:assert/strict";
import test from "node:test";
import { buildResearchResponse } from "../app/api/research/input.ts";

const item = (title, source) => ({ id: title, title, authors: [], year: 2026, venue: "Test", url: "https://example.org", source, evidence: "sourced" });

test("research response reports partial provider failure while retaining successful source results", () => {
  const payload = buildResearchResponse("machine learning", { status: "fulfilled", value: [item("A", "OpenAlex")] }, { status: "rejected", reason: new Error("network timeout") });
  assert.equal(payload.results.length, 1);
  assert.deepEqual(payload.sourceStatus, { OpenAlex: { status: "ok", count: 1 }, Crossref: { status: "error", count: 0 } });
  assert.deepEqual(payload.errors, ["Crossref unavailable (network, timeout, or HTTP error)."]);
});

test("research response reports both source failures instead of silently returning an empty result set", () => {
  const payload = buildResearchResponse("radiative cooling", { status: "rejected", reason: new Error("private transport details") }, { status: "rejected", reason: new Error("another private detail") });
  assert.equal(payload.results.length, 0);
  assert.deepEqual(payload.errors, ["OpenAlex unavailable (network, timeout, or HTTP error).", "Crossref unavailable (network, timeout, or HTTP error)."]);
  assert.equal(JSON.stringify(payload).includes("private transport details"), false);
});
