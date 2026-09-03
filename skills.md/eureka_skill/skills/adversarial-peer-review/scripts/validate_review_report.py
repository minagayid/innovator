#!/usr/bin/env python3
"""Validate the structural completeness of an adversarial peer-review report."""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

REQUIRED_SECTIONS = (
    "## Review contract",
    "## Claim and evidence ledger",
    "### Flags",
    "### Resolutions",
    "### Round decision",
    "## Final verification pass",
    "## Residual evidence-gap ledger",
    "## Verdict",
)
REQUIRED_CONTRACT_FIELDS = (
    "Frozen version",
    "Purpose and decision",
    "Scope",
    "Exclusions",
    "Risk level",
    "Round cap",
    "Reversal condition",
)
VERDICTS = (
    "Clean within scope",
    "Repairable with residual risks",
    "Reframe required",
    "Reject",
    "Unable to conclude",
)


def validate(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8")
    errors: list[str] = []
    for section in REQUIRED_SECTIONS:
        if section not in text:
            errors.append(f"missing section: {section}")
    for field in REQUIRED_CONTRACT_FIELDS:
        if field not in text:
            errors.append(f"missing contract field: {field}")
    if not re.search(r"\|\s*Severity\s*\|", text):
        errors.append("missing flag table with Severity column")
    if not re.search(r"\|\s*Flag\s*\|", text):
        errors.append("missing resolution table with Flag column")
    if not any(verdict in text for verdict in VERDICTS):
        errors.append("missing scope-qualified verdict")
    if "Do not describe this report" not in text:
        errors.append("missing non-certification boundary")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("report", type=Path)
    args = parser.parse_args()
    if not args.report.is_file():
        print(f"FAIL: report not found: {args.report}")
        return 2
    errors = validate(args.report)
    if errors:
        print("FAIL:")
        for error in errors:
            print(f"- {error}")
        return 1
    print(f"PASS: {args.report} contains the required adversarial-review structure.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
