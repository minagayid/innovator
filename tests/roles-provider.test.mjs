import assert from "node:assert/strict";
import test from "node:test";
import { runRoleProvider } from "../app/ai/roles.ts";

test("Hugging Face role provider returns proposed provenance for valid JSON", async () => {
  const previousToken = process.env.HF_TOKEN;
  const previousModel = process.env.HF_MODEL;
  const previousFetch = globalThis.fetch;
  process.env.HF_TOKEN = "test-token";
  process.env.HF_MODEL = "test/model";
  globalThis.fetch = async () => new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify({ finding: "proposed" }) } }] }), { status: 200, headers: { "content-type": "application/json" } });
  try {
    const result = await runRoleProvider("review", "A bounded test brief.");
    assert.equal(result?.provenance?.provider, "Hugging Face");
    assert.equal(result?.provenance?.model, "test/model");
    assert.equal(result?.provenance?.evidence, "proposed");
  } finally {
    globalThis.fetch = previousFetch;
    if (previousToken === undefined) delete process.env.HF_TOKEN; else process.env.HF_TOKEN = previousToken;
    if (previousModel === undefined) delete process.env.HF_MODEL; else process.env.HF_MODEL = previousModel;
  }
});

test("Hugging Face provider failure returns null when no fallback provider is configured", async () => {
  const previousToken = process.env.HF_TOKEN;
  const previousOpenAI = process.env.OPENAI_API_KEY;
  const previousFetch = globalThis.fetch;
  process.env.HF_TOKEN = "test-token";
  delete process.env.OPENAI_API_KEY;
  globalThis.fetch = async () => new Response(JSON.stringify({ choices: [] }), { status: 200 });
  try { assert.equal(await runRoleProvider("invention", "A bounded test brief."), null); }
  finally {
    globalThis.fetch = previousFetch;
    if (previousToken === undefined) delete process.env.HF_TOKEN; else process.env.HF_TOKEN = previousToken;
    if (previousOpenAI === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = previousOpenAI;
  }
});

test("Hugging Face role provider preserves configured provider routing suffix", async () => {
  const previousToken = process.env.HF_TOKEN;
  const previousModel = process.env.HF_MODEL;
  const previousFetch = globalThis.fetch;
  process.env.HF_TOKEN = "test-token";
  process.env.HF_MODEL = "Qwen/Qwen3-4B-Instruct-2507:fastest";
  let sentModel;
  globalThis.fetch = async (_url, init) => {
    sentModel = JSON.parse(init.body).model;
    return new Response(JSON.stringify({ choices: [{ message: { content: '{"finding":"proposed"}' } }] }), { status: 200 });
  };
  try {
    const result = await runRoleProvider("review", "A bounded test brief.");
    assert.equal(sentModel, process.env.HF_MODEL);
    assert.equal(result?.provenance?.model, process.env.HF_MODEL);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousToken === undefined) delete process.env.HF_TOKEN; else process.env.HF_TOKEN = previousToken;
    if (previousModel === undefined) delete process.env.HF_MODEL; else process.env.HF_MODEL = previousModel;
  }
});

