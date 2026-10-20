---
name: data-models-and-migrations
description: Build or modify relational data models, SQLAlchemy mappings, PostgreSQL schemas, constraints, indexes, and Alembic migrations while preserving existing data and enabling safe rollout.
---

# Data Models and Migrations

## Inspect before modeling

Read current models, schema history, database versions, naming conventions, transaction boundaries, repository/unit-of-work patterns, test fixtures, and deployment startup behavior. Clarify record ownership, lifecycle, expected scale, uniqueness, retention, and deletion semantics.

## Model for invariants

1. Express business invariants as database constraints whenever possible, not only request-level checks.
2. Normalize identity keys intentionally; enforce unique email or external identity according to documented product rules.
3. Use foreign keys, suitable delete behavior, check constraints, indexes, and non-nullability where the domain supports them.
4. Store timestamps consistently in UTC and specify precision/time-zone behavior. Define how historical rows are treated when fields or meaning change.
5. Avoid storing secrets or provider credentials in user/profile records. Separate authentication/session state from general user-facing profile data when their lifecycles differ.
6. Plan audit events and retention only where required. Do not silently add invasive tracking.

## Migration protocol

- Generate or write an explicit Alembic revision and review every operation; never assume autogenerate output is correct.
- Test a clean install from an empty database and an upgrade from a representative previous schema.
- Define rollback or forward-repair behavior. Data migrations need explicit handling for existing rows, nulls, collisions, invalid legacy values, and batch size.
- For production changes, prefer expand-and-contract: add compatible schema, deploy code that can handle old and new representations, backfill safely, validate, and remove obsolete schema in a later release.
- Treat table rewrites, unique constraints, not-null transitions, type conversions, drops, and large backfills as operationally risky. Explain lock duration and backup/restore assumptions.
- Keep migrations idempotent only when the framework supports that property safely; do not mask migration failures with broad exception handling.
- If multiple web replicas may start at once, avoid uncoordinated migrations in every replica's startup path. Prefer a single migration job/release step or a deployment platform's migration phase, and document the chosen lock/serialization behavior.

## Verification

Verify that models, migration DDL, application queries, and test fixtures agree. Check index and constraint names for consistency, transaction scope, connection cleanup, and database-specific behavior. Tests should cover duplicates, missing/invalid references, deletion semantics, timestamp handling, migration from old schemas, and the intended failure path.

## Completion record

Report the schema changes, revision identifiers, data compatibility and rollback strategy, tests run, and any deployment sequencing requirement. Never say a migration is safe for production based only on a successful autogenerate or an empty test database.
