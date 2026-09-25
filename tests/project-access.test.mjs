import assert from "node:assert/strict";
import test from "node:test";
import { buildVisibleProjectQuery } from "../db/project-access.ts";

test("project document query exposes public projects and only the signed-in owner's private projects", () => {
  const query = buildVisibleProjectQuery("owner-123", "project-456");
  assert.match(query.sql, /p\.id = \? AND \(p\.visibility = 'public' OR p\.owner_id = \?\)/);
  assert.deepEqual(query.values, ["project-456", "owner-123"]);

  const anonymousQuery = buildVisibleProjectQuery(undefined, "project-456");
  assert.deepEqual(anonymousQuery.values, ["project-456", ""]);
});
