import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

test("Docker uses the runtime-provided port and probes that port", async () => {
  const dockerfile = await readFile(resolve(root, "Dockerfile"), "utf8");
  assert.match(dockerfile, /PORT="8080"/);
  assert.match(dockerfile, /npm install --global pnpm@10\.8\.1/);
  assert.doesNotMatch(dockerfile, /corepack prepare/);
  const providerRoute = await readFile(resolve(root, "app/api/disclosure/route.ts"), "utf8");
  assert.match(providerRoute, /gpt-6\.1-sol/);
  assert.match(providerRoute, /gemini-3\.8-flash/);
  assert.doesNotMatch(providerRoute, /temperature\s*:/);
  assert.doesNotMatch(providerRoute, /candidateCount\s*:/);
  assert.match(providerRoute, /thinkingConfig:\s*\{\s*thinkingLevel:\s*"low"/);
  assert.match(dockerfile, /EXPOSE 8080/);
  assert.match(dockerfile, /process\.env\.PORT/);
  assert.doesNotMatch(dockerfile, /127\.0\.0\.1:3000/);
});

test("Docker excludes old invention samples and reusable skills from deployment", async () => {
  const ignore = await readFile(resolve(root, ".dockerignore"), "utf8");
  for (const path of ["archive/", "inventions/", "related-projects/", "assets/pictures/", "public/pictures/", "public/engineering/", "skills.md/", "tests/"]) {
    assert.ok(ignore.split(/\r?\n/).includes(path), "missing Docker exclusion: " + path);
  }
  assert.ok(!ignore.split(/\r?\n/).includes(".openai/"), "build still requires .openai/hosting.json");
});

test("active page is specification-driven while original demo records are preserved", async () => {
  const page = await readFile(resolve(root, "app/page.tsx"), "utf8");
  assert.match(page, /What problem should the invention solve/);
  assert.match(page, /Who will use it/);
  assert.match(page, /Constraints and exclusions/);
  assert.doesNotMatch(page, /Modular Prosthetic Hand|Solar Crop Dryer|AURORA Thermal Containment Rig|TIDEGILL Carbon Cell Module/);
  const archivedSeed = await readFile(resolve(root, "archive/seed-data.ts"), "utf8");
  assert.match(archivedSeed, /Modular Prosthetic Hand/);
});

test("Google identity headers are not trusted unless explicitly configured", async () => {
  const auth = await readFile(resolve(root, "app/chatgpt-auth.ts"), "utf8");
  assert.match(auth, /AUTH_TRUST_CHATGPT_HEADERS === "true"/);
  assert.match(auth, /verifySignedPayload/);
  assert.match(auth, /isGoogleEmailAllowed/);
});
