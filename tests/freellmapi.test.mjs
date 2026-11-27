import assert from "node:assert/strict";
import test from "node:test";
import { freeLlmChat, freeLlmConfig } from "../app/ai/freellmapi.ts";
import { runRoleProvider } from "../app/ai/roles.ts";

test("configured router sends bounded OpenAI-compatible chat and records its model", async () => {
  const previous = { ...process.env };
  const oldFetch = globalThis.fetch;
  process.env.FREELLMAPI_BASE_URL = "https://router.example/v1/";
  process.env.FREELLMAPI_API_KEY = "test-key";
  process.env.FREELLMAPI_MODEL = "auto";
  let request;
  globalThis.fetch = async (url, init) => {
    request = { url, init };
    return Response.json({ choices: [{ message: { content: '{"finding":"proposed"}' } }] });
  };
  try {
    const value = await runRoleProvider("review", "A test problem");
    assert.equal(request.url, "https://router.example/v1/chat/completions");
    assert.equal(request.init.redirect, "error");
    assert.equal(request.init.headers.Authorization, "Bearer test-key");
    assert.equal(JSON.parse(request.init.body).model, "auto");
    assert.equal(value?.provenance?.provider, "FreeLLMAPI");
    assert.equal(value?.result?.finding, "proposed");
  } finally { process.env = previous; globalThis.fetch = oldFetch; }
});

test("router requires both credentials and a safe HTTPS endpoint", async () => {
  const previous = { ...process.env };
  try {
    process.env.FREELLMAPI_API_KEY = "test-key";
    process.env.FREELLMAPI_MODEL = "auto";
    for (const url of ["http://router.example/v1", "https://user:pass@router.example/v1", "https://router.example/v1?key=secret"]) {
      process.env.FREELLMAPI_BASE_URL = url;
      assert.equal(freeLlmConfig(), null);
    }
    process.env.FREELLMAPI_BASE_URL = "https://router.example/v1";
    delete process.env.FREELLMAPI_API_KEY;
    assert.equal(await freeLlmChat([], 20), null);
  } finally { process.env = previous; }
});

test("router failure does not fall through to another provider", async () => {
  const previous = { ...process.env };
  const oldFetch = globalThis.fetch;
  process.env.FREELLMAPI_BASE_URL = "https://router.example/v1";
  process.env.FREELLMAPI_API_KEY = "test-key";
  process.env.FREELLMAPI_MODEL = "auto";
  process.env.OPENAI_API_KEY = "another-test-key";
  let calls = 0;
  globalThis.fetch = async () => { calls++; return new Response("unavailable", { status: 503 }); };
  try { assert.equal(await runRoleProvider("invention", "A test problem"), null); assert.equal(calls, 1); }
  finally { process.env = previous; globalThis.fetch = oldFetch; }
});

test("incomplete router configuration does not fall through to a paid provider", async () => {
  const previous = { ...process.env };
  const oldFetch = globalThis.fetch;
  process.env.FREELLMAPI_BASE_URL = "https://router.example/v1";
  delete process.env.FREELLMAPI_API_KEY;
  process.env.OPENAI_API_KEY = "another-test-key";
  let calls = 0;
  globalThis.fetch = async () => { calls++; return new Response(null, { status: 500 }); };
  try { assert.equal(await runRoleProvider("invention", "A test problem"), null); assert.equal(calls, 0); }
  finally { process.env = previous; globalThis.fetch = oldFetch; }
});
