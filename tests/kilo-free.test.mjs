import assert from "node:assert/strict";
import test from "node:test";
import { callKiloFree, KILO_FREE_MODEL } from "../app/ai/kilo-free.ts";
import { parseDisclosureBody } from "../app/api/disclosure/input.ts";

test("Kilo consent requires the literal boolean true", () => {
  for (const value of [false, "true", 1, null]) {
    assert.equal(parseDisclosureBody(JSON.stringify({ notes: "test", kiloConsent: value })).value.kiloConsent, undefined);
  }
  assert.equal(parseDisclosureBody(JSON.stringify({ notes: "test", kiloConsent: true })).value.kiloConsent, true);
});

test("Kilo sends one anonymous request to a fixed free model and validates the structured reply", async () => {
  const previousFetch = globalThis.fetch;
  let request;
  const draft = { title: "Example", abstract: "Draft", problem: "Problem", solution: "Proposal", technicalField: "Field", noveltyHypothesis: "Unknown", publicSummary: "Unverified", components: [], keywords: [], missingQuestions: [] };
  globalThis.fetch = async (url, init) => { request = { url, init }; return Response.json({ choices: [{ message: { content: JSON.stringify(draft) } }] }); };
  try {
    assert.deepEqual(await callKiloFree("system", "synthetic test"), draft);
    assert.equal(request.url, "https://ai-gateway.kilo.ai/api/v1/chat/completions");
    assert.equal(JSON.parse(request.init.body).model, KILO_FREE_MODEL);
    assert.equal(request.init.headers.Authorization, undefined);
    assert.equal(request.init.redirect, "error");
  } finally { globalThis.fetch = previousFetch; }
});

test("Kilo rejects error responses and invalid or oversized provider output", async () => {
  const previousFetch = globalThis.fetch;
  try {
    for (const response of [new Response(null, { status: 429 }), Response.json({ choices: [] }), new Response("x".repeat(32769))]) {
      globalThis.fetch = async () => response;
      assert.equal(await callKiloFree("system", "test"), null);
    }
  } finally { globalThis.fetch = previousFetch; }
});
