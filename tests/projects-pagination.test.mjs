import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_PROJECT_PAGE_SIZE,
  MAX_PROJECT_PAGE_SIZE,
  buildProjectListQuery,
  decodeProjectCursor,
  encodeProjectCursor,
  makeProjectPage,
  parseProjectListOptions,
} from "../db/project-pagination.ts";

test("project list options clamp page size and reject malformed cursors", () => {
  assert.deepEqual(parseProjectListOptions(new URLSearchParams()), {
    ok: true, value: { limit: DEFAULT_PROJECT_PAGE_SIZE, cursor: null },
  });
  assert.deepEqual(parseProjectListOptions(new URLSearchParams("limit=500")), {
    ok: true, value: { limit: MAX_PROJECT_PAGE_SIZE, cursor: null },
  });
  assert.equal(parseProjectListOptions(new URLSearchParams("limit=0")).ok, false);
  assert.equal(parseProjectListOptions(new URLSearchParams("cursor=invalid!")).ok, false);
});

test("project cursors round trip and reject invalid shapes", () => {
  const cursor = { updatedAt: "2026-09-15T12:34:56.789Z", id: "project_123" };
  assert.deepEqual(decodeProjectCursor(encodeProjectCursor(cursor)), cursor);
  assert.equal(decodeProjectCursor(encodeProjectCursor({ updatedAt: "bad", id: "project_123" })), null);
});

test("project page emits a stable next cursor only when a next row exists", () => {
  const rows = [
    { id: "one", updatedAt: "2026-09-15T00:00:03.000Z" },
    { id: "two", updatedAt: "2026-09-15T00:00:02.000Z" },
    { id: "three", updatedAt: "2026-09-15T00:00:01.000Z" },
  ];
  const page = makeProjectPage(rows, 2);
  assert.deepEqual(page.projects, rows.slice(0, 2));
  assert.deepEqual(decodeProjectCursor(page.nextCursor), rows[1]);
  assert.equal(makeProjectPage(rows.slice(0, 2), 2).nextCursor, null);
});

test("project listing SQL uses owner visibility, cursor tie-break, stable order, and bounded limit", () => {
  const cursor = { updatedAt: "2026-09-15T00:00:00.000Z", id: "project_1" };
  const query = buildProjectListQuery("user-1", { limit: 20, cursor });
  assert.match(query.sql, /p\.visibility = 'public' OR p\.owner_id = \?/);
  assert.match(query.sql, /p\.updated_at < \? OR \(p\.updated_at = \? AND p\.id < \?\)/);
  assert.match(query.sql, /ORDER BY p\.updated_at DESC, p\.id DESC LIMIT \?/);
  assert.deepEqual(query.values, ["user-1", cursor.updatedAt, cursor.updatedAt, cursor.id, 21]);

  const anonymous = buildProjectListQuery(undefined, { limit: 20, cursor: null });
  assert.match(anonymous.sql, /WHERE p\.visibility = 'public'/);
  assert.deepEqual(anonymous.values, [21]);
});
