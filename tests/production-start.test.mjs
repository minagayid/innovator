import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "..");
const startScript = resolve(root, "scripts/start.mjs");
const port = "4187";

async function stopProcessTree(child) {
  if (!child.pid) return;
  if (process.platform === "win32") {
    try {
      execFileSync("taskkill", ["/pid", String(child.pid), "/t", "/f"], { stdio: "ignore" });
    } catch {
      // The process may already have exited between the request and cleanup.
    }
  } else {
    child.kill("SIGTERM");
  }
  await Promise.race([once(child, "exit"), new Promise((resolve) => setTimeout(resolve, 5_000))]);
}

async function waitForHttp(url, child, output) {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Production preview exited early.\n${output.join("")}`);
    }
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch {
      // The preview may still be starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for ${url}.\n${output.join("")}`);
}

test("production start serves the Cloudflare build through the configured launcher", async () => {
  assert.ok(existsSync(resolve(root, "dist/server/wrangler.json")), "run the production build before this smoke test");

  const output = [];
  const child = spawn(process.execPath, [startScript, "--host", "127.0.0.1", "--port", port], {
    cwd: root,
    env: { ...process.env, PORT: undefined, HOST: undefined },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });
  child.stdout.on("data", (chunk) => output.push(String(chunk)));
  child.stderr.on("data", (chunk) => output.push(String(chunk)));

  try {
    const page = await waitForHttp(`http://127.0.0.1:${port}/`, child, output);
    const html = await page.text();
    assert.match(html, /Innovator|Research Studio|invention/i);

    const image = await fetch(`http://127.0.0.1:${port}/pictures/11_neuroforge-neuroregenerative-research-twin.png`);
    assert.equal(image.status, 200);
    assert.match(image.headers.get("content-type") || "", /^image\/png/);
  } finally {
    await stopProcessTree(child);
  }
});
