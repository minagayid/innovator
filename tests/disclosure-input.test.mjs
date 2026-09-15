import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_BODY_BYTES,
  MAX_NOTES_CHARS,
  MAX_PROVIDER_RESPONSE_BYTES,
  parseDisclosureBody,
  parseStructuredDisclosure,
  readBoundedBody,
  readBoundedProviderResponse,
  RequestBodyTooLargeError,
} from "../app/api/disclosure/input.ts";

test("disclosure input rejects oversized and malformed requests", () => {
  assert.equal(parseDisclosureBody("{").status, 400);
  assert.equal(parseDisclosureBody(JSON.stringify({ notes: "x".repeat(MAX_NOTES_CHARS + 1) })).status, 413);
  assert.equal(parseDisclosureBody(JSON.stringify({ notes: "x", extra: "x".repeat(MAX_BODY_BYTES) })).status, 413);
});

test("disclosure input accepts only bounded strings and normalizes optional category", () => {
  assert.deepEqual(parseDisclosureBody(JSON.stringify({ notes: "  rough notes  " })), {
    ok: true,
    value: { notes: "rough notes", category: "unspecified" },
  });
  assert.equal(parseDisclosureBody(JSON.stringify({ notes: "valid", category: 42 })).status, 400);
});

test("provider output must match the bounded disclosure shape", () => {
  const disclosure = {
    title: "Title", abstract: "Abstract", problem: "Problem", solution: "Solution",
    technicalField: "Field", noveltyHypothesis: "Possible novelty", publicSummary: "Summary",
    components: ["Part"], keywords: ["keyword"], missingQuestions: ["Question"], extra: "discarded",
  };
  assert.deepEqual(parseStructuredDisclosure(JSON.stringify(disclosure)), {
    title: "Title", abstract: "Abstract", problem: "Problem", solution: "Solution",
    technicalField: "Field", noveltyHypothesis: "Possible novelty", publicSummary: "Summary",
    components: ["Part"], keywords: ["keyword"], missingQuestions: ["Question"],
  });
  assert.equal(parseStructuredDisclosure("[]"), null);
  assert.equal(parseStructuredDisclosure(JSON.stringify({ ...disclosure, components: [1] })), null);
  assert.equal(parseStructuredDisclosure(JSON.stringify({ ...disclosure, title: "" })), null);
});

test("streaming body reader stops when the actual request exceeds its byte limit", async () => {
  const request = new Request("http://localhost/api/disclosure", {
    method: "POST",
    body: JSON.stringify({ notes: "x", extra: "x".repeat(MAX_BODY_BYTES) }),
  });
  await assert.rejects(readBoundedBody(request), RequestBodyTooLargeError);
});

test("provider output is rejected above the byte limit before JSON parsing", async () => {
  const response = new Response("x".repeat(MAX_PROVIDER_RESPONSE_BYTES + 1), { status: 200 });
  await assert.rejects(readBoundedProviderResponse(response), RequestBodyTooLargeError);
  assert.equal(parseStructuredDisclosure("x".repeat(MAX_PROVIDER_RESPONSE_BYTES + 1)), null);
});
