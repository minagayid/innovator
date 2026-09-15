import assert from "node:assert/strict";
import test from "node:test";
import { MAX_PROJECT_BODY_BYTES, parseProjectBody } from "../app/api/projects/input.ts";

test("project input rejects invalid JSON and oversized bodies", () => {
  assert.equal(parseProjectBody("{").status, 400);
  assert.equal(parseProjectBody("x".repeat(MAX_PROJECT_BODY_BYTES + 1)).status, 413);
});

test("project input accepts bounded fields and supplies safe defaults", () => {
  assert.deepEqual(parseProjectBody(JSON.stringify({ title: "  Title ", summary: "Summary" })), {
    ok: true,
    value: {
      title: "Title", summary: "Summary", category: "Uncategorized",
      visibility: "private", document: {},
    },
  });
});

test("project input rejects invalid document shapes and visibility", () => {
  assert.equal(parseProjectBody(JSON.stringify({ title: "Title", summary: "Summary", document: [] })).status, 400);
  assert.equal(parseProjectBody(JSON.stringify({ title: "Title", summary: "Summary", visibility: "unlisted" })).status, 400);
});
