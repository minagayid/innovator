import assert from "node:assert/strict";
import test from "node:test";
import { GET } from "../app/healthz/route.ts";

test("health endpoint is unauthenticated and reports service readiness", async () => {
  const response = GET();
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, service: "innovator", runtime: "container" });
});
