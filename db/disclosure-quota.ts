const HOUR_MS = 60 * 60 * 1_000;
const DAY_MS = 24 * HOUR_MS;

const QUOTAS = {
  callerHour: 4,
  callerDay: 12,
  globalHour: 24,
  globalDay: 120,
} as const;

export type DisclosureQuotaResult =
  | { allowed: true }
  | { allowed: false; scope: "caller" | "global" };

export type DisclosureProviderGateResult<T> =
  | { allowed: true; value: T }
  | { allowed: false };

async function consumeCounter(
  db: D1Database,
  scope: string,
  windowStart: number,
  limit: number,
): Promise<boolean> {
  const row = await db.prepare(`
    INSERT INTO disclosure_usage (scope, window_start, request_count)
    VALUES (?, ?, 1)
    ON CONFLICT(scope, window_start) DO UPDATE
      SET request_count = request_count + 1
      WHERE request_count < ?
    RETURNING request_count AS requestCount
  `).bind(scope, windowStart, limit).first<{ requestCount: number }>();
  return row !== null;
}

async function readCounter(
  db: D1Database,
  scope: string,
  windowStart: number,
): Promise<number> {
  const row = await db.prepare(`
    SELECT request_count AS requestCount
    FROM disclosure_usage
    WHERE scope = ? AND window_start = ?
  `).bind(scope, windowStart).first<{ requestCount: number }>();
  return row?.requestCount ?? 0;
}

async function hasCapacity(
  db: D1Database,
  counters: Array<[string, number, number]>,
): Promise<boolean> {
  for (const [scope, window, limit] of counters) {
    if (await readCounter(db, scope, window) >= limit) return false;
  }
  return true;
}

/** Shared D1-backed caller and deployment-wide quotas for paid inference. */
export async function consumeDisclosureQuota(
  db: D1Database,
  callerHash: string,
  now = Date.now(),
): Promise<DisclosureQuotaResult> {
  const hourStart = Math.floor(now / HOUR_MS) * HOUR_MS;
  const dayStart = Math.floor(now / DAY_MS) * DAY_MS;
  await db.prepare(`CREATE TABLE IF NOT EXISTS disclosure_usage (
    scope TEXT NOT NULL,
    window_start INTEGER NOT NULL,
    request_count INTEGER NOT NULL CHECK (request_count > 0),
    PRIMARY KEY (scope, window_start)
  )`).run();

  // Keep pseudonymous counter rows bounded, including on quota denials.
  const cleanupStaleRows = () => db.prepare(
    "DELETE FROM disclosure_usage WHERE window_start < ?",
  ).bind(dayStart - DAY_MS).run();
  await cleanupStaleRows();

  // Distinct scope names prevent hour/day collisions at midnight, when both
  // window starts have the same timestamp.
  const callerCounters: Array<[string, number, number]> = [
    [`caller-hour:${callerHash}`, hourStart, QUOTAS.callerHour],
    [`caller-day:${callerHash}`, dayStart, QUOTAS.callerDay],
  ];
  const globalCounters: Array<[string, number, number]> = [
    ["global-hour", hourStart, QUOTAS.globalHour],
    ["global-day", dayStart, QUOTAS.globalDay],
  ];

  // Check deployment-wide headroom before touching per-caller rows. This
  // prevents denied traffic from many unique callers growing the D1 table.
  if (!(await hasCapacity(db, globalCounters))) return { allowed: false, scope: "global" };
  if (!(await hasCapacity(db, callerCounters))) return { allowed: false, scope: "caller" };

  // Conditional upserts are the authoritative concurrency-safe checks. A
  // racing request can consume a global slot just before a caller slot fills;
  // this is conservative but never allows a request beyond either limit.
  for (const [scope, window, limit] of globalCounters) {
    if (!(await consumeCounter(db, scope, window, limit))) return { allowed: false, scope: "global" };
  }
  for (const [scope, window, limit] of callerCounters) {
    if (!(await consumeCounter(db, scope, window, limit))) return { allowed: false, scope: "caller" };
  }
  return { allowed: true };
}

/** Run paid work only after trusted identity and shared D1 quota both pass. */
export async function runDisclosureProviderIfQuotaAllows<T>(
  callerHash: string | null,
  getDb: () => D1Database,
  provider: () => Promise<T>,
  now = Date.now(),
): Promise<DisclosureProviderGateResult<T>> {
  if (!callerHash) return { allowed: false };
  try {
    const quota = await consumeDisclosureQuota(getDb(), callerHash, now);
    if (!quota.allowed) return { allowed: false };
  } catch {
    return { allowed: false };
  }
  return { allowed: true, value: await provider() };
}

/** Build an HMAC key from the Cloudflare edge IP only after deployment opts into that trust boundary. */
export async function trustedDisclosureCallerHash(
  request: Request,
  trustCloudflareEdge: string | undefined,
  hmacSecret: string | undefined,
): Promise<string | null> {
  if (trustCloudflareEdge !== "true" || !hmacSecret || hmacSecret.length < 32) return null;
  const ip = request.headers.get("cf-connecting-ip")?.trim();
  if (!ip || ip.length > 64 || /\s/.test(ip)) return null;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(hmacSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`disclosure:v1:${ip}`)));
  return Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
