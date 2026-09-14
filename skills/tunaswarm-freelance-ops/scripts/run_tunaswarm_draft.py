#!/usr/bin/env python3
"""Run TunaSwarm's local draft-only orchestration and save its output.

This wrapper intentionally invokes only the repository's local runner. It does
not browse marketplaces, submit proposals, send messages, accept contracts,
deploy work, or process payments.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Run a local TunaSwarm simulation and save the JSON output."
    )
    parser.add_argument(
        "--repo",
        type=Path,
        required=True,
        help="Path to the cloned TunaSwarm repository.",
    )
    parser.add_argument(
        "--run-id",
        default="draft-run",
        help="Simulation run identifier.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        required=True,
        help="Path for the saved JSON artifact.",
    )
    args = parser.parse_args()

    repo = args.repo.expanduser().resolve()
    output = args.output.expanduser().resolve()
    runner = repo / "orchestration" / "runner.py"
    if not runner.is_file():
        raise SystemExit(f"TunaSwarm runner not found: {runner}")

    command = [
        sys.executable,
        "-m",
        "orchestration.runner",
        "run-all",
        args.run_id,
    ]
    completed = subprocess.run(
        command,
        cwd=repo,
        env={**__import__("os").environ, "PYTHONPATH": str(repo)},
        capture_output=True,
        text=True,
        check=False,
    )

    artifact = {
        "wrapper": "tunaswarm-freelance-ops",
        "mode": "local-draft-only",
        "external_actions_performed": False,
        "captured_at": datetime.now(timezone.utc).isoformat(),
        "command": "PYTHONPATH=. python -m orchestration.runner run-all " + args.run_id,
        "returncode": completed.returncode,
        "stdout": completed.stdout,
        "stderr": completed.stderr,
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(artifact, indent=2), encoding="utf-8")
    print(output)
    return completed.returncode


if __name__ == "__main__":
    raise SystemExit(main())
