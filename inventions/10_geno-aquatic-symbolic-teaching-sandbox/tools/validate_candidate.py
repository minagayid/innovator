#!/usr/bin/env python3
"""Offline structure and red-line checks for synthetic GENO-AQUATIC records."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

REQUIRED = {
    "schema_version", "candidate_id", "model_context", "trait_hypothesis",
    "symbolic_features", "evidence_status", "limitations", "research_only",
}
FORBIDDEN_KEYS = {
    "sequence", "dnasequence", "rnasequence", "proteinsequence", "nucleotide",
    "guidrna", "guide", "target", "construct", "vector", "promoter",
    "codon", "transformation", "breedingprotocol", "wetlabprotocol",
}
ID_PATTERN = re.compile(r"^GA-CAND-[0-9]{3}$")
FEATURE_PATTERN = re.compile(r"^SYMBOL_[A-Z0-9_]+$")
SEQUENCE_LIKE_PATTERN = re.compile(r"\b[ACGTU]{18,}\b", re.IGNORECASE)
FORBIDDEN_TEXT = (
    "guide rna", "crispr", "plasmid", "viral vector", "promoter",
    "transformation protocol", "wet-lab", "wet lab", "environmental release",
    "breeding protocol",
)


def _normalized(key: str) -> str:
    return re.sub(r"[^a-z0-9]", "", key.lower())


def _forbidden_key_errors(value: Any, path: str = "$", errors: list[str] | None = None) -> list[str]:
    errors = [] if errors is None else errors
    if isinstance(value, dict):
        for key, child in value.items():
            if _normalized(str(key)) in FORBIDDEN_KEYS:
                errors.append(f"{path}.{key}: prohibited field")
            _forbidden_key_errors(child, f"{path}.{key}", errors)
    elif isinstance(value, list):
        for index, child in enumerate(value):
            _forbidden_key_errors(child, f"{path}[{index}]", errors)
    elif isinstance(value, str):
        if SEQUENCE_LIKE_PATTERN.search(value):
            errors.append(f"{path}: sequence-like text is prohibited")
        normalized = value.lower()
        if any(term in normalized for term in FORBIDDEN_TEXT):
            errors.append(f"{path}: operational molecular or release language is prohibited")
    return errors


def validate(record: Any) -> list[str]:
    if not isinstance(record, dict):
        return ["record must be an object"]
    errors = _forbidden_key_errors(record)
    extra = set(record) - REQUIRED
    missing = REQUIRED - set(record)
    errors.extend(f"unexpected field: {key}" for key in sorted(extra))
    errors.extend(f"missing field: {key}" for key in sorted(missing))
    if record.get("schema_version") != "0.1":
        errors.append("schema_version must be 0.1")
    if not ID_PATTERN.fullmatch(str(record.get("candidate_id", ""))):
        errors.append("candidate_id must use GA-CAND-NNN format")
    if record.get("model_context") != "synthetic_aquatic_analogue":
        errors.append("model_context must remain synthetic_aquatic_analogue")
    if not isinstance(record.get("trait_hypothesis"), str) or len(record.get("trait_hypothesis", "")) < 12:
        errors.append("trait_hypothesis must be a descriptive string")
    features = record.get("symbolic_features")
    if not isinstance(features, list) or not features:
        errors.append("symbolic_features must be a non-empty list")
    elif any(not isinstance(item, str) or not FEATURE_PATTERN.fullmatch(item) for item in features):
        errors.append("symbolic_features may contain only SYMBOL_* labels")
    if record.get("evidence_status") not in {"synthetic_example", "hypothesis_only", "unverified"}:
        errors.append("evidence_status is unsupported")
    if not isinstance(record.get("limitations"), list) or len(record.get("limitations", [])) < 2:
        errors.append("limitations must list at least two boundaries")
    if record.get("research_only") is not True:
        errors.append("research_only must be true")
    return errors


def main(argv: list[str] | None = None) -> int:
    paths = [Path(arg) for arg in (argv if argv is not None else sys.argv[1:])]
    if not paths:
        print("usage: python tools/validate_candidate.py PATH [PATH ...]")
        return 2
    failed = False
    for path in paths:
        try:
            record = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            print(f"FAIL {path}: {exc}")
            failed = True
            continue
        errors = validate(record)
        if errors:
            failed = True
            print(f"FAIL {path}")
            for error in errors:
                print(f"  - {error}")
        else:
            print(f"PASS {path}")
    return int(failed)


if __name__ == "__main__":
    raise SystemExit(main())
