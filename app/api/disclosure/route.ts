import { NextRequest, NextResponse } from "next/server";
import { parseDisclosureBody, parseStructuredDisclosure, readBoundedBody, readBoundedProviderResponse, RequestBodyTooLargeError } from "./input";
import { runDisclosureProviderIfQuotaAllows, trustedDisclosureCallerHash } from "../../../db/disclosure-quota.ts";
import { getDatabase } from "../../../db/index.ts";

const demo = {
  title: "Field-Repairable Modular Prosthetic Hand",
  abstract: "A body-powered prosthetic hand designed around locally printable, independently replaceable modules.",
  problem: "Affordable prostheses are difficult to fit, adapt, and repair in resource-limited clinics.",
  solution: "A printable common chassis accepts task-specific grip modules and a tool-free cable-tension cartridge.",
  technicalField: "Assistive devices; upper-limb prosthetics; body-powered mechanisms",
  noveltyHypothesis: "Possible novelty may lie in the combination of the standardized grip interface and removable tension cartridge.",
  components: ["palm chassis", "grip modules", "cable cartridge", "adaptive socket"],
  keywords: ["body-powered prosthetic", "modular hand", "field repair", "cable tension cartridge"],
  missingQuestions: ["How is tension retained under repeated loading?", "What grip forces are targeted?", "Which parts contact skin?"],
  publicSummary: "An open, repairable prosthetic-hand platform intended for local fabrication and maintenance.",
  mode: "demo",
};

const PROVIDER_TIMEOUT_MS = 15_000;
const MAX_PROVIDER_OUTPUT_TOKENS = 512;

function providerFetch(url: string, init: RequestInit): Promise<Response> {
  return fetch(url, { ...init, signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS) });
}

async function callPaidProvider(hasGemini: boolean, notes: string, category: string): Promise<NextResponse> {
  // Use one paid provider per request. A failed Gemini call does not fall through to OpenAI.
  if (hasGemini) {
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const safeModel = /^[a-zA-Z0-9._-]{1,100}$/.test(model) ? model : "gemini-2.5-flash";
    try {
      const response = await providerFetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${safeModel}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: "You structure rough physical-invention notes for a small business workflow. Never claim patentability. Use phrases such as possible novelty. Return concise JSON only with title, abstract, problem, solution, technicalField, noveltyHypothesis, components, keywords, missingQuestions, and publicSummary." }] },
            contents: [{ role: "user", parts: [{ text: `Category: ${category || "unspecified"}\nNotes: ${notes}` }] }],
            generationConfig: { responseMimeType: "application/json", temperature: 0.2, candidateCount: 1, maxOutputTokens: MAX_PROVIDER_OUTPUT_TOKENS },
          }),
        },
      );
      if (response.ok) {
        const responseText = await readBoundedProviderResponse(response);
        const payload = JSON.parse(responseText) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
        const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
        const disclosure = text ? parseStructuredDisclosure(text) : null;
        if (disclosure) return NextResponse.json({ ...disclosure, mode: "gemini-live" });
      }
    } catch { /* Use the deterministic fallback; do not spend on a second provider. */ }
    return NextResponse.json({ ...demo, mode: "demo-fallback" });
  }

  try {
    const model = process.env.OPENAI_MODEL || "gpt-5.6";
    const safeModel = /^[a-zA-Z0-9._-]{1,100}$/.test(model) ? model : "gpt-5.6";
    const response = await providerFetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: safeModel,
        max_output_tokens: MAX_PROVIDER_OUTPUT_TOKENS,
        input: [
          { role: "system", content: "You structure rough physical-invention notes. Never claim patentability. Use phrases such as possible novelty. Return concise JSON only with title, abstract, problem, solution, technicalField, noveltyHypothesis, components, keywords, missingQuestions, and publicSummary." },
          { role: "user", content: `Category: ${category || "unspecified"}\nNotes: ${notes}` },
        ],
        text: { format: { type: "json_object" } },
      }),
    });
    if (response.ok) {
      const responseText = await readBoundedProviderResponse(response);
      const payload = JSON.parse(responseText) as { output_text?: string };
      const disclosure = parseStructuredDisclosure(payload.output_text || "");
      if (disclosure) return NextResponse.json({ ...disclosure, mode: "live" });
    }
  } catch { /* Return the deterministic fallback if the provider is unavailable. */ }
  return NextResponse.json({ ...demo, mode: "demo-fallback" });
}

export async function POST(request: NextRequest) {
  let bodyText: string;
  try {
    bodyText = await readBoundedBody(request);
  } catch (error) {
    const status = error instanceof RequestBodyTooLargeError ? 413 : 400;
    const message = status === 413 ? "Request body is too large." : "Request body must be valid JSON.";
    return NextResponse.json({ error: message }, { status });
  }
  const parsed = parseDisclosureBody(bodyText);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  const { notes, category } = parsed.value;

  const hasGemini = Boolean(process.env.GEMINI_API_KEY);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  if (!hasGemini && !hasOpenAI) return NextResponse.json({ ...demo, mode: "demo-fallback" });

  // Paid work is guarded by trusted edge identity and the shared D1 quota.
  const callerHash = await trustedDisclosureCallerHash(
    request,
    process.env.DISCLOSURE_TRUST_CF_EDGE,
    process.env.DISCLOSURE_RATE_LIMIT_HMAC_SECRET,
  );
  const gated = await runDisclosureProviderIfQuotaAllows(
    callerHash,
    getDatabase,
    () => callPaidProvider(hasGemini, notes, category),
  );
  // Missing identity, missing D1, quota denials, and quota errors fail closed.
  if (!gated.allowed) return NextResponse.json({ ...demo, mode: "demo-fallback" });
  return gated.value;
}
