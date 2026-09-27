"""SQLite persistence layer for InnovaRT pipeline runs."""

import json
import os
import sqlite3
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional


def get_data_dir() -> Path:
    """Data directory: %LOCALAPPDATA%/InnovArt when frozen (exe), ./data in dev."""
    override = os.environ.get("INNOVART_DATA_DIR")
    if override:
        path = Path(override)
    elif getattr(sys, "frozen", False):
        base = os.environ.get("LOCALAPPDATA") or str(Path.home())
        path = Path(base) / "InnovArt"
    else:
        path = Path(__file__).resolve().parent.parent / "data"
    path.mkdir(parents=True, exist_ok=True)
    return path


DB_PATH = get_data_dir() / "innovart.db"

SCHEMA = """
CREATE TABLE IF NOT EXISTS runs (
    id            TEXT PRIMARY KEY,
    query         TEXT NOT NULL,
    max_results   INTEGER NOT NULL DEFAULT 5,
    status        TEXT NOT NULL DEFAULT 'running',
    error         TEXT,
    started_at    TEXT NOT NULL,
    completed_at  TEXT
);

CREATE TABLE IF NOT EXISTS opportunities (
    id                   TEXT NOT NULL,
    run_id               TEXT NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
    title                TEXT NOT NULL,
    description          TEXT,
    opportunity_score    REAL,
    commercial_potential REAL,
    legal_risk           REAL,
    priority             TEXT,
    tags                 TEXT,
    patent_id            TEXT,
    patent_assignee      TEXT,
    created_at           TEXT,
    PRIMARY KEY (id, run_id)
);

CREATE TABLE IF NOT EXISTS concepts (
    id            TEXT NOT NULL,
    run_id        TEXT NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
    title         TEXT NOT NULL,
    description   TEXT,
    novelty_score REAL,
    priority      TEXT,
    specs         TEXT,
    PRIMARY KEY (id, run_id)
);

CREATE TABLE IF NOT EXISTS market_analysis (
    run_id           TEXT PRIMARY KEY REFERENCES runs(id) ON DELETE CASCADE,
    tam              REAL,
    sam              REAL,
    som              REAL,
    pricing_strategy TEXT,
    market_entry     TEXT,
    competitors      TEXT
);
"""


def connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db() -> None:
    with connect() as conn:
        conn.executescript(SCHEMA)


def create_run(run_id: str, query: str, max_results: int, started_at: str) -> None:
    with connect() as conn:
        conn.execute(
            "INSERT INTO runs (id, query, max_results, status, started_at) VALUES (?, ?, ?, 'running', ?)",
            (run_id, query, max_results, started_at),
        )


def fail_run(run_id: str, error: str, completed_at: str) -> None:
    with connect() as conn:
        conn.execute(
            "UPDATE runs SET status='failed', error=?, completed_at=? WHERE id=?",
            (error, completed_at, run_id),
        )


def complete_run(run_id: str, result: Any, completed_at: str) -> None:
    """Persist a finished PipelineResult under the given run id."""
    with connect() as conn:
        for opp in result.opportunities:
            patent = opp.source_patent
            conn.execute(
                """INSERT OR REPLACE INTO opportunities
                   (id, run_id, title, description, opportunity_score,
                    commercial_potential, legal_risk, priority, tags,
                    patent_id, patent_assignee, created_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    opp.opportunity_id, run_id, opp.title, opp.description,
                    opp.opportunity_score, opp.commercial_potential, opp.legal_risk,
                    opp.priority.name, json.dumps(opp.tags),
                    patent.patent_id if patent else None,
                    patent.assignee if patent else None,
                    opp.created_at,
                ),
            )
        for concept in result.concepts:
            conn.execute(
                """INSERT OR REPLACE INTO concepts
                   (id, run_id, title, description, novelty_score, priority, specs)
                   VALUES (?, ?, ?, ?, ?, ?, ?)""",
                (
                    concept.concept_id, run_id, concept.title, concept.description,
                    concept.novelty_score, concept.priority.name,
                    json.dumps(concept.technical_specifications),
                ),
            )
        market = result.market_analysis
        if market is not None:
            conn.execute(
                """INSERT OR REPLACE INTO market_analysis
                   (run_id, tam, sam, som, pricing_strategy, market_entry, competitors)
                   VALUES (?, ?, ?, ?, ?, ?, ?)""",
                (
                    run_id, market.tam, market.sam, market.som,
                    market.pricing_strategy, market.market_entry_plan,
                    json.dumps(market.competitors),
                ),
            )
        conn.execute(
            "UPDATE runs SET status='completed', completed_at=? WHERE id=?",
            (completed_at, run_id),
        )


def _row_to_dict(row: sqlite3.Row) -> Dict[str, Any]:
    d = dict(row)
    for key in ("tags", "specs", "competitors"):
        if key in d and d[key]:
            try:
                d[key] = json.loads(d[key])
            except (json.JSONDecodeError, TypeError):
                pass
    return d


def list_runs(limit: int = 50) -> List[Dict[str, Any]]:
    with connect() as conn:
        rows = conn.execute(
            """SELECT r.*,
                      (SELECT COUNT(*) FROM opportunities o WHERE o.run_id = r.id) AS opportunity_count,
                      (SELECT COUNT(*) FROM concepts c WHERE c.run_id = r.id) AS concept_count
               FROM runs r ORDER BY r.started_at DESC LIMIT ?""",
            (limit,),
        ).fetchall()
        return [_row_to_dict(r) for r in rows]


def get_run(run_id: str) -> Optional[Dict[str, Any]]:
    with connect() as conn:
        row = conn.execute("SELECT * FROM runs WHERE id=?", (run_id,)).fetchone()
        if row is None:
            return None
        run = _row_to_dict(row)
        run["opportunities"] = [
            _row_to_dict(r) for r in conn.execute(
                "SELECT * FROM opportunities WHERE run_id=? ORDER BY opportunity_score DESC", (run_id,)
            ).fetchall()
        ]
        run["concepts"] = [
            _row_to_dict(r) for r in conn.execute(
                "SELECT * FROM concepts WHERE run_id=? ORDER BY novelty_score DESC", (run_id,)
            ).fetchall()
        ]
        market = conn.execute(
            "SELECT * FROM market_analysis WHERE run_id=?", (run_id,)
        ).fetchone()
        run["market_analysis"] = _row_to_dict(market) if market else None
        return run


def delete_run(run_id: str) -> bool:
    with connect() as conn:
        cur = conn.execute("DELETE FROM runs WHERE id=?", (run_id,))
        return cur.rowcount > 0


def list_opportunities(limit: int = 200) -> List[Dict[str, Any]]:
    with connect() as conn:
        rows = conn.execute(
            """SELECT o.*, r.query AS run_query FROM opportunities o
               JOIN runs r ON r.id = o.run_id
               ORDER BY o.opportunity_score DESC LIMIT ?""",
            (limit,),
        ).fetchall()
        return [_row_to_dict(r) for r in rows]


def list_concepts(limit: int = 200) -> List[Dict[str, Any]]:
    with connect() as conn:
        rows = conn.execute(
            """SELECT c.*, r.query AS run_query FROM concepts c
               JOIN runs r ON r.id = c.run_id
               ORDER BY c.novelty_score DESC LIMIT ?""",
            (limit,),
        ).fetchall()
        return [_row_to_dict(r) for r in rows]


def get_stats() -> Dict[str, Any]:
    with connect() as conn:
        stats = {
            "total_runs": conn.execute("SELECT COUNT(*) FROM runs").fetchone()[0],
            "completed_runs": conn.execute(
                "SELECT COUNT(*) FROM runs WHERE status='completed'"
            ).fetchone()[0],
            "total_opportunities": conn.execute(
                "SELECT COUNT(*) FROM opportunities"
            ).fetchone()[0],
            "total_concepts": conn.execute("SELECT COUNT(*) FROM concepts").fetchone()[0],
            "avg_opportunity_score": conn.execute(
                "SELECT COALESCE(AVG(opportunity_score), 0) FROM opportunities"
            ).fetchone()[0],
            "avg_novelty_score": conn.execute(
                "SELECT COALESCE(AVG(novelty_score), 0) FROM concepts"
            ).fetchone()[0],
            "avg_commercial_potential": conn.execute(
                "SELECT COALESCE(AVG(commercial_potential), 0) FROM opportunities"
            ).fetchone()[0],
        }
        stats["priority_breakdown"] = {
            row["priority"]: row["n"]
            for row in conn.execute(
                "SELECT priority, COUNT(*) AS n FROM opportunities GROUP BY priority"
            ).fetchall()
        }
        latest = conn.execute(
            "SELECT tam, sam, som FROM market_analysis ORDER BY rowid DESC LIMIT 1"
        ).fetchone()
        stats["latest_market"] = dict(latest) if latest else None
        return stats
