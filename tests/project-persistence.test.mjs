import test from "node:test";
import assert from "node:assert/strict";
import { insertProjectWithCompensation } from "../db/project-persistence.ts";

test("ambiguous insert succeeds when a follow-up read confirms the row committed", async () => {
  let deleted = false;
  await insertProjectWithCompensation({
    insert: async () => { throw new Error("insert response lost"); },
    rowExists: async () => true,
    removeDocument: async () => { deleted = true; },
  });
  assert.equal(deleted, false);
});

test("failed insert removes the unreferenced document and preserves the insert error", async () => {
  const failure = new Error("insert failed");
  let deleted = false;
  await assert.rejects(
    insertProjectWithCompensation({
      insert: async () => { throw failure; },
      rowExists: async () => false,
      removeDocument: async () => { deleted = true; },
    }),
    (error) => error === failure,
  );
  assert.equal(deleted, true);
});

test("unknown commit state retains the document and preserves the insert error", async () => {
  const failure = new Error("insert response lost");
  let deleted = false;
  const reported = [];
  await assert.rejects(
    insertProjectWithCompensation({
      insert: async () => { throw failure; },
      rowExists: async () => { throw new Error("read failed"); },
      removeDocument: async () => { deleted = true; },
      reportIssue: (issue) => reported.push(issue),
    }),
    (error) => error === failure,
  );
  assert.equal(deleted, false);
  assert.deepEqual(reported, ["commit-status-unknown"]);
});

test("cleanup failure is reported without replacing the insert error", async () => {
  const failure = new Error("insert failed");
  const reported = [];
  await assert.rejects(
    insertProjectWithCompensation({
      insert: async () => { throw failure; },
      rowExists: async () => false,
      removeDocument: async () => { throw new Error("delete failed"); },
      reportIssue: (issue) => reported.push(issue),
    }),
    (error) => error === failure,
  );
  assert.deepEqual(reported, ["document-cleanup-failed"]);
});
