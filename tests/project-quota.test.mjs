import assert from "node:assert/strict";
import test from "node:test";
import {
  PROJECT_CREATION_QUOTAS,
  consumeProjectCreationQuota,
  runProjectCreationIfQuotaAllows,
} from "../db/project-quota.ts";

function fakeDatabase() {
  const rows = new Map();
  return {
    rows,
    prepare(sql) {
      let values = [];
      return {
        bind(...boundValues) { values = boundValues; return this; },
        async run() {
          if (sql.startsWith("DELETE FROM project_creation_usage")) {
            const [cutoff] = values;
            for (const [id, row] of rows) if (row.createdAt < cutoff) rows.delete(id);
          }
          return { success: true };
        },
        async first() {
          if (!sql.includes("INSERT INTO project_creation_usage")) return null;
          const [id, ownerId, now,
            callerHourOwner, callerHourStart, callerHourEnd, callerHourLimit,
            callerDayOwner, callerDayStart, callerDayEnd, callerDayLimit,
            globalHourStart, globalHourEnd, globalHourLimit,
            globalDayStart, globalDayEnd, globalDayLimit] = values;
          const count = (predicate) => [...rows.values()].filter(predicate).length;
          const callerHourCount = count((row) => row.ownerId === callerHourOwner && row.createdAt >= callerHourStart && row.createdAt < callerHourEnd);
          const callerDayCount = count((row) => row.ownerId === callerDayOwner && row.createdAt >= callerDayStart && row.createdAt < callerDayEnd);
          const globalHourCount = count((row) => row.createdAt >= globalHourStart && row.createdAt < globalHourEnd);
          const globalDayCount = count((row) => row.createdAt >= globalDayStart && row.createdAt < globalDayEnd);
          if (callerHourCount >= callerHourLimit || callerDayCount >= callerDayLimit
            || globalHourCount >= globalHourLimit || globalDayCount >= globalDayLimit) return null;
          rows.set(id, { ownerId, createdAt: now });
          return { id };
        },
      };
    },
  };
}

test("concurrent project reservations enforce caller and global limits in one atomic insert", async () => {
  const db = fakeDatabase();
  const now = Date.UTC(2026, 0, 1, 12);
  const results = await Promise.all(Array.from({ length: 80 }, (_, index) =>
    consumeProjectCreationQuota(db, `user-${index}`, now),
  ));

  assert.equal(results.filter((result) => result.allowed).length, PROJECT_CREATION_QUOTAS.globalHour);
  assert.equal(db.rows.size, PROJECT_CREATION_QUOTAS.globalHour);
});

test("concurrent creations for one owner stop at the caller-hour quota", async () => {
  const db = fakeDatabase();
  const now = Date.UTC(2026, 0, 1, 12);
  const results = await Promise.all(Array.from({ length: 40 }, () =>
    consumeProjectCreationQuota(db, "same-user", now),
  ));

  assert.equal(results.filter((result) => result.allowed).length, PROJECT_CREATION_QUOTAS.callerHour);
  assert.equal(db.rows.size, PROJECT_CREATION_QUOTAS.callerHour);
});

test("project-creation D1 failures and quota denials never start project persistence", async () => {
  let createCalls = 0;
  const create = async () => { createCalls += 1; return "created"; };
  const brokenDatabase = { prepare() { throw new Error("D1 unavailable"); } };
  assert.deepEqual(
    await runProjectCreationIfQuotaAllows(brokenDatabase, "user", create),
    { status: "unavailable" },
  );

  const db = fakeDatabase();
  const now = Date.UTC(2026, 0, 1, 12);
  for (let attempt = 0; attempt < PROJECT_CREATION_QUOTAS.callerHour; attempt += 1) {
    assert.deepEqual(await runProjectCreationIfQuotaAllows(db, "user", create, now), {
      status: "allowed", value: "created",
    });
  }
  assert.deepEqual(await runProjectCreationIfQuotaAllows(db, "user", create, now), { status: "denied" });
  assert.equal(createCalls, PROJECT_CREATION_QUOTAS.callerHour);
});

test("daily caller quota remains authoritative across UTC hourly windows", async () => {
  const db = fakeDatabase();
  const dayStart = Date.UTC(2026, 0, 1);
  let allowed = 0;
  for (let hour = 0; hour < 4; hour += 1) {
    const now = dayStart + hour * 60 * 60 * 1000 + 1_000;
    const results = await Promise.all(Array.from({ length: 3 }, () =>
      consumeProjectCreationQuota(db, "daily-user", now),
    ));
    allowed += results.filter((result) => result.allowed).length;
  }
  assert.equal(allowed, PROJECT_CREATION_QUOTAS.callerDay);
});
