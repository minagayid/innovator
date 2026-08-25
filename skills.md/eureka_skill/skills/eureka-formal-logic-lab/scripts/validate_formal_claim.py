#!/usr/bin/env python3
"""Check required sections in a Eureka formal claim specification."""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

REQUIRED = (
    "Claim type and scope",
    "Formal statement",
    "Assumptions and definitions",
    "Reference cases and invariants",
    "Method and tool assumptions",
    "Finite coverage or proof obligation",
    "Counterexample strategy",
    "Reproducibility record",
    "Conclusion boundary",
)


def heading(line: str) -> str | None:
    match = re.match(r"^#{1,6}\s+(.+?)\s*$", line)
    return re.sub(r"[^a-z0-9]+", " ", match.group(1).lower()).strip() if match else None


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate a Eureka formal claim Markdown specification.")
    parser.add_argument("spec", type=Path)
    args = parser.parse_args()
    if not args.spec.is_file():
        print(f"FAIL: specification not found: {args.spec}")
        return 2
    headings = {value for line in args.spec.read_text(encoding="utf-8").splitlines() if (value := heading(line))}
    missing = [item for item in REQUIRED if item.lower() not in headings]
    if missing:
        print(f"FAIL: {args.spec}")
        for item in missing:
            print(f"  missing heading: ## {item}")
        return 1
    print(f"PASS: {args.spec} contains all {len(REQUIRED)} required sections.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
