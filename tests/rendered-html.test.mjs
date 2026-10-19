import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("build contains generator-first product and private-workspace routes", async () => {
  await access(new URL("../dist/server/index.js", import.meta.url));
  const [page, projectsRoute, sessionRoute, migration, hosting] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/projects/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/session/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../drizzle/0000_cloudy_johnny_blaze.sql", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
  ]);
  assert.match(page, /What problem should the invention solve/);
  assert.match(page, /Constraints and exclusions/);
  assert.match(page, /Generate invention candidate/);
  assert.doesNotMatch(page, /Modular Prosthetic Hand|Solar Crop Dryer|AURORA Thermal Containment Rig|TIDEGILL Carbon Cell Module/);
  assert.match(projectsRoute, /createProject/);
  assert.match(projectsRoute, /chatGPTSignInPath/);
  assert.match(sessionRoute, /upsertUser/);
  assert.match(migration, /CREATE TABLE `users`/);
  assert.match(migration, /CREATE TABLE `projects`/);
  assert.match(hosting, /"d1": "DB"/);
  assert.match(hosting, /"r2": "PROJECTS"/);
});
