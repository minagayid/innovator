#!/usr/bin/env python3
"""Validate the structural contract of a Eureka computational study specification."""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

REQUIRED = (
    "Target and decision",
    "Evidence classification",
    "Model and numerical method",
    "Inputs and bounds",
    "Controls and baselines",
    "Verification",
    "Validation",
    "Uncertainty",
    "Reproducibility manifest",
    "Proof gap and stop condition",
)


def heading_key(line: str) -> str | None:
    match = re.match(r"^#{1,6}\s+(.+?)\s*$", line)
    if not match:
        return None
    return re.sub(r"[^a-z0-9]+", " ", match.group(1).lower()).strip()


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Check a Eureka computational study Markdown specification."
    )
    parser.add_argument("spec", type=Path, help="Path to a Markdown computation specification")
    args = parser.parse_args()

    if not args.spec.is_file():
        print(f"FAIL: specification not found: {args.spec}")
        return 2

    headings = {key for line in args.spec.read_text(encoding="utf-8").splitlines() if (key := heading_key(line))}
    missing = [section for section in REQUIRED if section.lower() not in headings]

    if missing:
        print(f"FAIL: {args.spec}")
        for section in missing:
            print(f"  missing heading: ## {section}")
        return 1

    print(f"PASS: {args.spec} contains all {len(REQUIRED)} required sections.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
