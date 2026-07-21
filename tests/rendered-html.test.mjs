import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL(`../dist/server/index.js?test=${Date.now()}`, import.meta.url);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the InventionHub product shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /InventionHub/);
  assert.match(html, /Ideas worth building/);
  assert.match(html, /Open invention network/i);
  assert.match(html, /Prior-art results are informational/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});
