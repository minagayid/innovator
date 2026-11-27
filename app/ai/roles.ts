import { freeLlmChat, freeLlmSelected } from "./freellmapi.ts";

export type RoleName = "invention" | "review" | "orchestration";
export const ROLE_DESCRIPTIONS: Record<RoleName, string> = { invention: "Mechanism designer: turns a bounded problem into a falsifiable invention candidate.", review: "Research and peer-review committee: attacks evidence, assumptions, safety, and testability.", orchestration: "Research orchestrator: sequences research, invention, review, and decisive next-test work." };
export function isRole(value: string): value is RoleName { return value === "invention" || value === "review" || value === "orchestration"; }
export function fallbackRole(role: RoleName, brief: string) { const compact = brief.trim().slice(0, 1200); if (role === "invention") return { role, mode: "deterministic-fallback", provenance: { provider: null, model: null, evidence: "proposed" }, candidate: { title: "Bounded mechanism candidate", brief: compact, mechanism: "Define a measurable state change that addresses the stated bottleneck, then compare it against a baseline.", components: [], noveltyHypothesis: "Unassessed hypothesis; no prior-art search was performed.", firstTest: "Specify baseline, intervention, measurement, sample size, and a result that would stop the idea.", openQuestions: ["What existing approach is the baseline?", "Which constraint is non-negotiable?", "What observation would falsify the mechanism?"] } }; if (role === "review") return { role, mode: "deterministic-fallback", provenance: { provider: null, model: null, evidence: "proposed" }, committee: [{ seat: "Evidence auditor", finding: "No source set was supplied; distinguish sourced facts from assumptions.", test: "Attach primary sources and record inclusion and exclusion criteria." }, { seat: "Failure analyst", finding: "The mechanism and boundary conditions are underspecified.", test: "Run a negative control and a sensitivity check before escalation." }, { seat: "Safety and deployment reviewer", finding: "Safety, legal, and operational readiness are unassessed.", test: "Obtain qualified domain review before any consequential use." }] }; return { role, mode: "deterministic-fallback", provenance: { provider: null, model: null, evidence: "proposed" }, plan: [{ stage: "research", action: `Search primary literature for: ${compact}`, output: "Sourced records with caveats" }, { stage: "invention", action: "Generate one bounded mechanism candidate", output: "Structured hypothesis" }, { stage: "review", action: "Attack assumptions and evidence gaps", output: "Objections and kill criteria" }, { stage: "test", action: "Choose the cheapest decisive experiment", output: "Baseline, measurement, and reversal condition" }] };
}

export async function runRoleProvider(role: RoleName, brief: string): Promise<Record<string, unknown> | null> {
  const prompt = `You are the ${ROLE_DESCRIPTIONS[role]} Return JSON only. Keep every claim explicitly sourced, computed, inferred, proposed, or unresolved. Never claim novelty, patentability, safety, feasibility, or validation. Brief: ${brief.slice(0, 5000)}`;
  if (freeLlmSelected()) {
    const result = await freeLlmChat([{ role: "system", content: prompt }, { role: "user", content: brief.slice(0, 6000) }], 1400);
    if (!result) return null;
    try { return { role, mode: "live", provenance: { provider: "FreeLLMAPI", model: result.model, evidence: "proposed" }, result: JSON.parse(result.text) }; }
    catch { return null; }
  }
  const hfToken = process.env.HF_TOKEN;
  const hfModel = /^[A-Za-z0-9][A-Za-z0-9._/-]{0,200}(?::[A-Za-z0-9._-]{1,80})?$/.test(process.env.HF_MODEL || "") ? process.env.HF_MODEL! : "Qwen/Qwen3-4B-Instruct-2507:fastest";
  if (hfToken) {
    try {
      const response = await fetch("https://router.huggingface.co/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${hfToken}` }, body: JSON.stringify({ model: hfModel, temperature: 0.2, max_tokens: 1400, messages: [{ role: "system", content: prompt }, { role: "user", content: brief.slice(0, 6000) }] }), signal: AbortSignal.timeout(15000) });
      if (response.ok) {
        const payload = await response.json() as { choices?: Array<{ message?: { content?: unknown } }> };
        const content = payload.choices?.[0]?.message?.content;
        if (typeof content === "string") return { role, mode: "live", provenance: { provider: "Hugging Face", model: hfModel, evidence: "proposed" }, result: JSON.parse(content) };
      }
    } catch { /* fall through to another configured provider or deterministic output */ }
  }
  const token = process.env.OPENAI_API_KEY;
  if (!token) return null;
  const model = /^[A-Za-z0-9._-]{1,100}$/.test(process.env.OPENAI_MODEL || "") ? process.env.OPENAI_MODEL! : "gpt-6.1-sol";
  try {
    const response = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ model, max_output_tokens: 1400, input: prompt, text: { format: { type: "json_object" } } }), signal: AbortSignal.timeout(15000) });
    if (!response.ok) return null;
    const payload = await response.json() as { output_text?: string };
    if (!payload.output_text) return null;
    const value = JSON.parse(payload.output_text) as Record<string, unknown>;
    return { role, mode: "live", provenance: { provider: "OpenAI", model, evidence: "proposed" }, result: value };
  } catch { return null; }
}

