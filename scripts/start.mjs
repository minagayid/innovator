#!/usr/bin/env node
/**
 * Preview the Cloudflare Worker build locally.
 *
 * The application imports Cloudflare's `cloudflare:workers` binding module.
 * That module is valid in Workerd (the runtime used by the Cloudflare Vite
 * plugin) but cannot be loaded by Node's ESM loader, so `vinext start` is not
 * the correct launcher for this deployment target.
 */
import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const outputConfig = resolve(root, "dist/server/wrangler.json");
const viteBin = resolve(root, "node_modules/vite/bin/vite.js");
const port = process.env.PORT || "3000";
const host = process.env.HOST || "0.0.0.0";
const forwardedArgs = process.argv.slice(2);
if (forwardedArgs[0] === "--") forwardedArgs.shift();
let canStart = true;

try {
  await access(outputConfig);
} catch {
  console.error("Production output is missing. Run `pnpm build` before `pnpm start`.");
  canStart = false;
}

if (canStart) {
  const child = spawn(process.execPath, [viteBin, "preview", "--host", host, "--port", port, ...forwardedArgs], {
    cwd: root,
    stdio: "inherit",
    windowsHide: true,
  });

  const forwardSignal = (signal) => child.kill(signal);
  process.on("SIGINT", () => forwardSignal("SIGINT"));
  process.on("SIGTERM", () => forwardSignal("SIGTERM"));
  child.on("exit", (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    else process.exitCode = code ?? 1;
  });
}
