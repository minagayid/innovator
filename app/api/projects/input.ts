export const MAX_PROJECT_BODY_BYTES = 20_000;

export type ProjectInput = {
  title: string;
  summary: string;
  category: string;
  visibility: "public" | "private";
  document: Record<string, unknown>;
};

export type ProjectInputResult =
  | { ok: true; value: ProjectInput }
  | { ok: false; status: 400 | 413; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function parseProjectBody(bodyText: string): ProjectInputResult {
  if (new TextEncoder().encode(bodyText).byteLength > MAX_PROJECT_BODY_BYTES) {
    return { ok: false, status: 413, error: "Request body is too large." };
  }

  let body: unknown;
  try {
    body = JSON.parse(bodyText);
  } catch {
    return { ok: false, status: 400, error: "Request body must be valid JSON." };
  }
  if (!isRecord(body)) return { ok: false, status: 400, error: "Request body must be an object." };

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const summary = typeof body.summary === "string" ? body.summary.trim() : "";
  const category = body.category === undefined ? "Uncategorized" : body.category;
  const visibility = body.visibility === undefined ? "private" : body.visibility;
  const document = body.document === undefined ? {} : body.document;
  if (!title || !summary) return { ok: false, status: 400, error: "Title and summary are required." };
  if (title.length > 200 || summary.length > 2_000) {
    return { ok: false, status: 413, error: "Title or summary is too long." };
  }
  if (typeof category !== "string" || category.trim().length > 100) {
    return { ok: false, status: 400, error: "Category must be a short string." };
  }
  if (visibility !== "public" && visibility !== "private") {
    return { ok: false, status: 400, error: "Visibility must be public or private." };
  }
  if (!isRecord(document)) return { ok: false, status: 400, error: "Document must be an object." };

  return {
    ok: true,
    value: { title, summary, category: category.trim() || "Uncategorized", visibility, document },
  };
}
