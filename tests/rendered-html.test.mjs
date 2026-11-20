import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("build contains the staged research studio and private-workspace contracts", async () => {
  await access(new URL("../dist/server/index.js", import.meta.url));
  const [page, projectsRoute, sessionRoute, rolesRoute, manufacturingRoute, manufacturingInput, migration, hosting] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/projects/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/session/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/roles/[role]/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/manufacturing/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/manufacturing/input.ts", import.meta.url), "utf8"),
    readFile(new URL("../drizzle/0000_cloudy_johnny_blaze.sql", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
  ]);
  assert.match(page, /What problem should the invention solve/);
  assert.match(page, /Constraints and exclusions/);
  assert.match(page, /Generate invention candidate/);
  assert.match(page, /Stage 01 · Frame/);
  assert.match(page, /Stage 02 · Bridge/);
  assert.match(page, /Stage 03 · Challenge/);
  assert.match(page, /Stage 04 · Test/);
  assert.match(page, /Run research \+ peer-review committee/);
  assert.match(page, /Sequence next test/);
  assert.match(page, /Manufacturing handoff/);
  assert.doesNotMatch(page, /Modular Prosthetic Hand|Solar Crop Dryer|AURORA Thermal Containment Rig|TIDEGILL Carbon Cell Module/);
  assert.match(projectsRoute, /createProject/);
  assert.match(projectsRoute, /chatGPTSignInPath/);
  assert.match(sessionRoute, /upsertUser/);
  assert.match(rolesRoute, /runDisclosureProviderIfQuotaAllows/);
  assert.match(rolesRoute, /fallbackRole/);
  assert.match(rolesRoute, /HF_TOKEN/);
  assert.match(manufacturingRoute, /buildManufacturingHandoff/);
  assert.match(manufacturingInput, /not a build authorization/);
  assert.match(migration, /CREATE TABLE `users`/);
  assert.match(migration, /CREATE TABLE `projects`/);
  assert.match(hosting, /"d1": "DB"/);
  assert.match(hosting, /"r2": "PROJECTS"/);
});
