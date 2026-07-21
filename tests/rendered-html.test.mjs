import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("build contains the InventionHub product and persistence routes", async () => {
  await access(new URL("../dist/server/index.js", import.meta.url));
  const [page, projectsRoute, sessionRoute, migration, hosting] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/projects/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/session/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../drizzle/0000_cloudy_johnny_blaze.sql", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
  ]);
  assert.match(page, /InventionHub/);
  assert.match(page, /signin-with-chatgpt/);
  assert.match(page, /fetch\("\/api\/projects"/);
  assert.match(projectsRoute, /createProject/);
  assert.match(sessionRoute, /upsertUser/);
  assert.match(migration, /CREATE TABLE `users`/);
  assert.match(migration, /CREATE TABLE `projects`/);
  assert.match(hosting, /"d1": "DB"/);
  assert.match(hosting, /"r2": "PROJECTS"/);
});
