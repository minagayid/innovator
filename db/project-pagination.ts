export const DEFAULT_PROJECT_PAGE_SIZE = 20;
export const MAX_PROJECT_PAGE_SIZE = 50;
const MAX_CURSOR_LENGTH = 512;

export type ProjectCursor = { updatedAt: string; id: string };
export type ProjectListOptions = { limit: number; cursor: ProjectCursor | null };
export type ProjectListOptionsResult =
  | { ok: true; value: ProjectListOptions }
  | { ok: false; error: string };

function validCursor(value: unknown): value is ProjectCursor {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const cursor = value as Record<string, unknown>;
  if (typeof cursor.updatedAt !== "string" || typeof cursor.id !== "string") return false;
  const timestamp = new Date(cursor.updatedAt);
  return Number.isFinite(timestamp.getTime())
    && timestamp.toISOString() === cursor.updatedAt
    && /^[A-Za-z0-9_-]{1,128}$/.test(cursor.id);
}

export function encodeProjectCursor(cursor: ProjectCursor): string {
  const bytes = new TextEncoder().encode(JSON.stringify(cursor));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodeProjectCursor(encoded: string): ProjectCursor | null {
  if (!encoded || encoded.length > MAX_CURSOR_LENGTH || !/^[A-Za-z0-9_-]+$/.test(encoded)) return null;
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - base64.length % 4) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const value = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    return validCursor(value) ? value : null;
  } catch {
    return null;
  }
}

export function parseProjectListOptions(params: URLSearchParams): ProjectListOptionsResult {
  const rawLimit = params.get("limit");
  let limit = DEFAULT_PROJECT_PAGE_SIZE;
  if (rawLimit !== null) {
    if (!/^\d+$/.test(rawLimit)) return { ok: false, error: "limit must be a positive integer." };
    const parsed = Number(rawLimit);
    if (!Number.isSafeInteger(parsed) || parsed < 1) {
      return { ok: false, error: "limit must be a positive integer." };
    }
    limit = Math.min(parsed, MAX_PROJECT_PAGE_SIZE);
  }

  const rawCursor = params.get("cursor");
  if (rawCursor === null) return { ok: true, value: { limit, cursor: null } };
  const cursor = decodeProjectCursor(rawCursor);
  if (!cursor) return { ok: false, error: "cursor is invalid." };
  return { ok: true, value: { limit, cursor } };
}

export type ProjectPage<T extends ProjectCursor> = { projects: T[]; nextCursor: string | null };

export function makeProjectPage<T extends ProjectCursor>(rows: T[], limit: number): ProjectPage<T> {
  const hasMore = rows.length > limit;
  const projects = rows.slice(0, limit);
  const last = projects.at(-1);
  return {
    projects,
    nextCursor: hasMore && last ? encodeProjectCursor(last) : null,
  };
}

export function buildProjectListQuery(
  viewerId: string | undefined,
  options: ProjectListOptions,
): { sql: string; values: Array<string | number> } {
  const base = `SELECT p.id, p.slug, p.owner_id AS ownerId, u.display_name AS ownerName, p.title, p.summary, p.category,
    p.status, p.readiness_stage AS readinessStage, p.visibility, p.document_key AS documentKey,
    p.created_at AS createdAt, p.updated_at AS updatedAt FROM projects p JOIN users u ON u.id = p.owner_id`;
  const conditions: string[] = [];
  const values: Array<string | number> = [];
  if (viewerId) {
    conditions.push("(p.visibility = 'public' OR p.owner_id = ?)");
    values.push(viewerId);
  } else {
    conditions.push("p.visibility = 'public'");
  }
  if (options.cursor) {
    conditions.push("(p.updated_at < ? OR (p.updated_at = ? AND p.id < ?))");
    values.push(options.cursor.updatedAt, options.cursor.updatedAt, options.cursor.id);
  }
  values.push(options.limit + 1);
  return {
    sql: `${base} WHERE ${conditions.join(" AND ")} ORDER BY p.updated_at DESC, p.id DESC LIMIT ?`,
    values,
  };
}
