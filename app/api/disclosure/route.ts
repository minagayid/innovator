import { NextRequest, NextResponse } from "next/server";
import { buildFallbackDisclosure, parseDisclosureBody, parseStructuredDisclosure, readBoundedBody, readBoundedProviderResponse, RequestBodyTooLargeError } from "./input";
import { runDisclosureProviderIfQuotaAllows, trustedDisclosureCallerHash } from "../../../db/disclosure-quota.ts";
import { getDatabase } from "../../../db/index.ts";

const PROVIDER_TIMEOUT_MS = 15_000;
const MAX_PROVIDER_OUTPUT_TOKENS = 512;
const DISCLOSURE_SYSTEM_PROMPT = "You draft an unvalidated physical-invention disclosure from user notes. Do not invent facts, measurements, materials, equations, citations, prior-art results, performance, novelty, safety, manufacturability, or feasibility. Separate user-supplied statements from open questions. When the input does not support a field, say it is unknown or unassessed. noveltyHypothesis must remain a hypothesis, never a novelty determination. Never claim patentability. Return concise JSON only with title, abstract, problem, solution, technicalField, noveltyHypothesis, components, keywords, missingQuestions, and publicSummary.";

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
            systemInstruction: { parts: [{ text: DISCLOSURE_SYSTEM_PROMPT }] },
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
        if (disclosure) return NextResponse.json({
          ...disclosure,
          mode: "gemini-live",
          provenance: { kind: "model-assisted-draft", provider: "Gemini", model: safeModel },
        });
      }
    } catch { /* Use the deterministic fallback; do not spend on a second provider. */ }
    return NextResponse.json(buildFallbackDisclosure(notes, category));
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
          { role: "system", content: DISCLOSURE_SYSTEM_PROMPT },
          { role: "user", content: `Category: ${category || "unspecified"}\nNotes: ${notes}` },
        ],
        text: { format: { type: "json_object" } },
      }),
    });
    if (response.ok) {
      const responseText = await readBoundedProviderResponse(response);
      const payload = JSON.parse(responseText) as { output_text?: string };
      const disclosure = parseStructuredDisclosure(payload.output_text || "");
      if (disclosure) return NextResponse.json({
        ...disclosure,
        mode: "live",
        provenance: { kind: "model-assisted-draft", provider: "OpenAI", model: safeModel },
      });
    }
  } catch { /* Return the deterministic fallback if the provider is unavailable. */ }
  return NextResponse.json(buildFallbackDisclosure(notes, category));
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
  if (!hasGemini && !hasOpenAI) return NextResponse.json(buildFallbackDisclosure(notes, category));

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
  if (!gated.allowed) return NextResponse.json(buildFallbackDisclosure(notes, category));
  return gated.value;
}
