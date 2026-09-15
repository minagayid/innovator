const HOUR_MS = 60 * 60 * 1_000;
const DAY_MS = 24 * HOUR_MS;

/** Fixed-window creation ceilings; tune only with an explicit product decision. */
export const PROJECT_CREATION_QUOTAS = {
  callerHour: 3,
  callerDay: 10,
  globalHour: 25,
  globalDay: 100,
} as const;

export type ProjectQuotaResult = { allowed: true } | { allowed: false };

/**
 * Reserve one project creation with a single conditional INSERT. SQLite/D1
 * serializes competing writes, so all four caller/global window checks and the
 * reservation happen as one statement. Denied attempts create no quota row.
 */
export async function consumeProjectCreationQuota(
  db: D1Database,
  ownerId: string,
  now = Date.now(),
): Promise<ProjectQuotaResult> {
  const hourStart = Math.floor(now / HOUR_MS) * HOUR_MS;
  const dayStart = Math.floor(now / DAY_MS) * DAY_MS;

  await db.prepare(`CREATE TABLE IF NOT EXISTS project_creation_usage (
    id TEXT PRIMARY KEY NOT NULL,
    owner_id TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )`).run();
  await db.prepare("CREATE INDEX IF NOT EXISTS project_creation_usage_owner_time_idx ON project_creation_usage (owner_id, created_at)").run();
  await db.prepare("CREATE INDEX IF NOT EXISTS project_creation_usage_time_idx ON project_creation_usage (created_at)").run();

  // Keep at most the current and previous UTC day's reservations. The daily
  // global quota bounds this table to roughly 200 live rows.
  await db.prepare("DELETE FROM project_creation_usage WHERE created_at < ?")
    .bind(dayStart - DAY_MS)
    .run();

  const row = await db.prepare(`
    INSERT INTO project_creation_usage (id, owner_id, created_at)
    SELECT ?, ?, ?
    WHERE
      (SELECT COUNT(*) FROM project_creation_usage
        WHERE owner_id = ? AND created_at >= ? AND created_at < ?) < ?
      AND (SELECT COUNT(*) FROM project_creation_usage
        WHERE owner_id = ? AND created_at >= ? AND created_at < ?) < ?
      AND (SELECT COUNT(*) FROM project_creation_usage
        WHERE created_at >= ? AND created_at < ?) < ?
      AND (SELECT COUNT(*) FROM project_creation_usage
        WHERE created_at >= ? AND created_at < ?) < ?
    RETURNING id
  `).bind(
    crypto.randomUUID(), ownerId, now,
    ownerId, hourStart, hourStart + HOUR_MS, PROJECT_CREATION_QUOTAS.callerHour,
    ownerId, dayStart, dayStart + DAY_MS, PROJECT_CREATION_QUOTAS.callerDay,
    hourStart, hourStart + HOUR_MS, PROJECT_CREATION_QUOTAS.globalHour,
    dayStart, dayStart + DAY_MS, PROJECT_CREATION_QUOTAS.globalDay,
  ).first<{ id: string }>();

  return row ? { allowed: true } : { allowed: false };
}

export type ProjectCreationGateResult<T> =
  | { status: "allowed"; value: T }
  | { status: "denied" }
  | { status: "unavailable" };

/** Do not start R2/D1 project persistence unless a quota reservation succeeds. */
export async function runProjectCreationIfQuotaAllows<T>(
  db: D1Database,
  ownerId: string,
  create: () => Promise<T>,
  now = Date.now(),
): Promise<ProjectCreationGateResult<T>> {
  let quota: ProjectQuotaResult;
  try {
    quota = await consumeProjectCreationQuota(db, ownerId, now);
  } catch {
    return { status: "unavailable" };
  }
  if (!quota.allowed) return { status: "denied" };
  return { status: "allowed", value: await create() };
}
