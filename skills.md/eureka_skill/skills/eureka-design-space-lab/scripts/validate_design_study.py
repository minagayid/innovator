#!/usr/bin/env python3
"""Check required sections in a Eureka design-space study specification."""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

REQUIRED = (
    "Decision and claim boundary",
    "Design variables and constraints",
    "Objectives and baselines",
    "Sampling and budget",
    "Model credibility",
    "Sensitivity and robustness",
    "Pareto or trade-off interpretation",
    "Reproducibility manifest",
    "Stop condition and proof gap",
)


def normalize_heading(line: str) -> str | None:
    match = re.match(r"^#{1,6}\s+(.+?)\s*$", line)
    return re.sub(r"[^a-z0-9]+", " ", match.group(1).lower()).strip() if match else None


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate a Eureka design-space Markdown specification.")
    parser.add_argument("spec", type=Path)
    args = parser.parse_args()
    if not args.spec.is_file():
        print(f"FAIL: specification not found: {args.spec}")
        return 2
    headings = {value for line in args.spec.read_text(encoding="utf-8").splitlines() if (value := normalize_heading(line))}
    required_normalized = {re.sub(r"[^a-z0-9]+", " ", item.lower()).strip(): item for item in REQUIRED}
    missing = [item for normalized, item in required_normalized.items() if normalized not in headings]
    if missing:
        print(f"FAIL: {args.spec}")
        for item in missing:
            print(f"  missing heading: ## {item}")
        return 1
    print(f"PASS: {args.spec} contains all {len(REQUIRED)} required sections.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
