import { env } from "cloudflare:workers";
import { insertProjectWithCompensation } from "./project-persistence.ts";
import { buildProjectListQuery, makeProjectPage, type ProjectCursor, type ProjectPage } from "./project-pagination.ts";
import { buildVisibleProjectQuery } from "./project-access.ts";

export type StoredUser = { id: string; email: string; displayName: string; createdAt: string; updatedAt: string };
export type ProjectRecord = {
  id: string; slug: string; ownerId: string; ownerName: string; title: string; summary: string; category: string;
  status: string; readinessStage: string; visibility: string; documentKey: string; createdAt: string; updatedAt: string;
};

type RuntimeEnv = { DB?: D1Database; PROJECTS?: R2Bucket };

function bindings(): RuntimeEnv { return env as unknown as RuntimeEnv; }

export function getDatabase(): D1Database {
  const db = bindings().DB;
  if (!db) throw new Error("D1 binding `DB` is unavailable.");
  return db;
}

export function getProjectStore(): R2Bucket {
  const bucket = bindings().PROJECTS;
  if (!bucket) throw new Error("R2 binding `PROJECTS` is unavailable.");
  return bucket;
}

export async function ensureDataSchema() {
  const db = getDatabase();
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY NOT NULL,
      email TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      owner_id TEXT NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      readiness_stage TEXT NOT NULL DEFAULT 'Structured concept',
      visibility TEXT NOT NULL DEFAULT 'private',
      document_key TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS projects_owner_idx ON projects (owner_id)"),
    db.prepare("CREATE INDEX IF NOT EXISTS projects_visibility_idx ON projects (visibility)"),
    db.prepare("CREATE INDEX IF NOT EXISTS projects_updated_idx ON projects (updated_at)"),
  ]);
}

export async function upsertUser(email: string, displayName: string): Promise<StoredUser> {
  await ensureDataSchema();
  const db = getDatabase();
  const now = new Date().toISOString();
  const existing = await db.prepare("SELECT id, email, display_name AS displayName, created_at AS createdAt, updated_at AS updatedAt FROM users WHERE email = ?").bind(email).first<StoredUser>();
  if (existing) {
    await db.prepare("UPDATE users SET display_name = ?, updated_at = ? WHERE id = ?").bind(displayName, now, existing.id).run();
    return { ...existing, displayName, updatedAt: now };
  }
  const user = { id: crypto.randomUUID(), email, displayName, createdAt: now, updatedAt: now };
  await db.prepare("INSERT INTO users (id, email, display_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)").bind(user.id, user.email, user.displayName, user.createdAt, user.updatedAt).run();
  return user;
}

export async function listProjects(
  viewerId: string | undefined,
  options: { limit: number; cursor: ProjectCursor | null },
): Promise<ProjectPage<ProjectRecord>> {
  await ensureDataSchema();
  const db = getDatabase();
  const query = buildProjectListQuery(viewerId, options);
  const rows = (await db.prepare(query.sql).bind(...query.values).all<ProjectRecord>()).results;
  return makeProjectPage(rows, options.limit);
}

export async function getProjectVisibleToUser(viewerId: string | undefined, projectId: string): Promise<ProjectRecord | null> {
  await ensureDataSchema();
  const db = getDatabase();
  const query = buildVisibleProjectQuery(viewerId, projectId);
  return db.prepare(query.sql).bind(...query.values).first<ProjectRecord>();
}

export async function createProject(owner: StoredUser, input: { title: string; summary: string; category: string; visibility?: string; document: Record<string, unknown> }): Promise<ProjectRecord> {
  await ensureDataSchema();
  const db = getDatabase();
  const store = getProjectStore();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const slugBase = input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 50) || "invention";
  const slug = `${slugBase}-${id.slice(0, 8)}`;
  const documentKey = `projects/${id}.json`;
  const visibility = input.visibility === "public" ? "public" : "private";
  const record: ProjectRecord = {
    id, slug, ownerId: owner.id, ownerName: owner.displayName, title: input.title, summary: input.summary,
    category: input.category, status: "draft", readinessStage: "Structured concept", visibility,
    documentKey, createdAt: now, updatedAt: now,
  };
  await store.put(documentKey, JSON.stringify({
    ...input.document,
    version: 1, projectId: id, ownerId: owner.id, title: input.title, summary: input.summary, category: input.category,
    createdAt: now, updatedAt: now,
  }), { httpMetadata: { contentType: "application/json" }, customMetadata: { ownerId: owner.id, projectId: id } });
  await insertProjectWithCompensation({
    insert: () => db.prepare(`INSERT INTO projects (id, slug, owner_id, title, summary, category, status, readiness_stage, visibility, document_key, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'draft', 'Structured concept', ?, ?, ?, ?)`)
      .bind(id, slug, owner.id, input.title, input.summary, input.category, visibility, documentKey, now, now).run(),
    rowExists: async () => Boolean(await db.prepare("SELECT id FROM projects WHERE id = ?").bind(id).first<{ id: string }>()),
    removeDocument: () => store.delete(documentKey),
    reportIssue: (issue) => {
      if (issue === "commit-status-unknown") {
        console.error("Could not confirm project persistence; retained its document because commit state is unknown.");
      } else {
        console.error("Could not remove an unreferenced project document after database failure.");
      }
    },
  });
  return record;
}
