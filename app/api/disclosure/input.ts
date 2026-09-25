export const MAX_BODY_BYTES = 20_000;
export const MAX_NOTES_CHARS = 8_000;
export const MAX_CATEGORY_CHARS = 100;
export const MAX_PROVIDER_RESPONSE_BYTES = 32_768;

export class RequestBodyTooLargeError extends Error {}

export type DisclosureInput = { notes: string; category: string };
export type DisclosureInputResult =
  | { ok: true; value: DisclosureInput }
  | { ok: false; status: 400 | 413; error: string };

export type DisclosureProvenance = {
  kind: "model-assisted-draft" | "deterministic-fallback";
  provider: "OpenAI" | "Gemini" | null;
  model: string | null;
};

export type StructuredDisclosure = {
  title: string;
  abstract: string;
  problem: string;
  solution: string;
  technicalField: string;
  noveltyHypothesis: string;
  components: string[];
  keywords: string[];
  missingQuestions: string[];
  publicSummary: string;
  mode: "live" | "gemini-live" | "demo-fallback";
  provenance: DisclosureProvenance;
};

export function buildFallbackDisclosure(notes: string, category: string): StructuredDisclosure {
  return {
    title: "Unstructured invention draft",
    abstract: `No model analysis ran. Your ${notes.length}-character note is preserved in the source notes.`,
    problem: "Unassessed. Use the source notes to define the specific problem, affected users, and baseline.",
    solution: "Unassessed. Describe the proposed mechanism and its operating conditions before evaluating it.",
    technicalField: category || "Unspecified",
    noveltyHypothesis: "Unknown. No prior-art search or novelty assessment was performed.",
    components: [],
    keywords: [],
    missingQuestions: [
      "What measurable problem does the design address, and against what baseline?",
      "What mechanism is proposed, and under which operating conditions?",
      "What observation would support or falsify the claimed benefit?",
    ],
    publicSummary: "Local fallback only. This draft does not assess scientific validity, engineering feasibility, novelty, or safety.",
    mode: "demo-fallback",
    provenance: { kind: "deterministic-fallback", provider: null, model: null },
  };
}

export function parseStructuredDisclosure(text: string): Record<string, unknown> | null {
  if (new TextEncoder().encode(text).byteLength > MAX_PROVIDER_RESPONSE_BYTES) return null;
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return null;
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const input = value as Record<string, unknown>;
  const stringFields = ["title", "abstract", "problem", "solution", "technicalField", "noveltyHypothesis", "publicSummary"];
  const listFields = ["components", "keywords", "missingQuestions"];
  const result: Record<string, unknown> = {};
  for (const field of stringFields) {
    const fieldValue = input[field];
    if (typeof fieldValue !== "string" || !fieldValue.trim()) return null;
    result[field] = fieldValue.trim().slice(0, field === "title" ? 200 : 1_000);
  }
  for (const field of listFields) {
    const items = input[field];
    if (!Array.isArray(items) || items.length > 30 || items.some((item) => typeof item !== "string")) return null;
    result[field] = items.map((item) => (item as string).trim().slice(0, 200)).filter(Boolean);
  }
  return result;
}

export async function readBoundedProviderResponse(response: Response): Promise<string> {
  const declaredLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_PROVIDER_RESPONSE_BYTES) {
    throw new RequestBodyTooLargeError();
  }
  const reader = response.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_PROVIDER_RESPONSE_BYTES) {
      await reader.cancel().catch(() => undefined);
      throw new RequestBodyTooLargeError();
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

export async function readBoundedBody(request: Request): Promise<string> {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    throw new RequestBodyTooLargeError();
  }

  const reader = request.body?.getReader();
  if (!reader) return "";

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_BODY_BYTES) {
      await reader.cancel().catch(() => undefined);
      throw new RequestBodyTooLargeError();
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

export function parseDisclosureBody(bodyText: string): DisclosureInputResult {
  if (new TextEncoder().encode(bodyText).byteLength > MAX_BODY_BYTES) {
    return { ok: false, status: 413, error: "Request body is too large." };
  }

  let body: unknown;
  try {
    body = JSON.parse(bodyText);
  } catch {
    return { ok: false, status: 400, error: "Request body must be valid JSON." };
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, status: 400, error: "Request body must be an object." };
  }

  const input = body as { notes?: unknown; category?: unknown };
  if (typeof input.notes !== "string" || !input.notes.trim()) {
    return { ok: false, status: 400, error: "Notes are required." };
  }
  if (input.notes.length > MAX_NOTES_CHARS) {
    return { ok: false, status: 413, error: "Notes are too long." };
  }
  if (input.category !== undefined && (typeof input.category !== "string" || input.category.length > MAX_CATEGORY_CHARS)) {
    return { ok: false, status: 400, error: "Category must be a short string." };
  }

  return {
    ok: true,
    value: {
      notes: input.notes.trim(),
      category: typeof input.category === "string" ? input.category.trim() : "unspecified",
    },
  };
}
