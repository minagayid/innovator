import assert from "node:assert/strict";
import test from "node:test";
import { buildManufacturingHandoff, parseManufacturingBody } from "../app/api/manufacturing/input.ts";

test("manufacturing handoff is bounded and explicitly non-operational", () => {
  const parsed = parseManufacturingBody(JSON.stringify({ title: "Candidate", problem: "Measure a bounded change", components: ["sensor"], category: "materials", researchEvidence: ["OpenAlex record"] }));
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  const handoff = buildManufacturingHandoff(parsed.value);
  assert.equal(handoff.mode, "deterministic-gated");
  assert.equal(handoff.gates.length, 5);
  assert.match(handoff.boundary, /not a build authorization/);
  assert.ok(handoff.exclusions.some((item) => /recipes/i.test(item)));
  assert.ok(handoff.exclusions.some((item) => /safety bypass/i.test(item)));
  assert.ok(handoff.unresolved.length >= 4);
});

test("manufacturing parser rejects malformed and oversized input", () => {
  assert.equal(parseManufacturingBody("nope").ok, false);
  assert.equal(parseManufacturingBody(JSON.stringify({ title: "", problem: "x" })).ok, false);
  assert.equal(parseManufacturingBody(JSON.stringify({ title: "x", problem: "x".repeat(2100) })).ok, false);
  assert.equal(parseManufacturingBody(JSON.stringify({ title: "x", problem: "x", components: Array.from({ length: 31 }, () => "part") })).ok, false);
});
