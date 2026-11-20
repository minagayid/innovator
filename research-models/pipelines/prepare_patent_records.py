#!/usr/bin/env python3
"""Prepare normalized patent JSONL only when WIPO-derived rights allow it.

The input is a local normalized export acquired under a WIPO data-product
license or separate written authorization. This module never visits PATENTSCOPE
or downloads records. A separate rights register is mandatory.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

WHITESPACE = re.compile(r"\s+")


def clean_text(value: Any, limit: int = 200_000) -> str:
    if not isinstance(value, str):
        return ""
    return WHITESPACE.sub(" ", value).strip()[:limit]


def prepare_patent_records(source_path: Path, rights_path: Path, output_path: Path, *, require_redistributable_weights: bool = False) -> dict[str, int]:
    rights_payload = json.loads(Path(rights_path).read_text(encoding="utf-8"))
    rights = rights_payload.get("records") if isinstance(rights_payload, dict) else None
    if not isinstance(rights, dict):
        raise ValueError("rights manifest must contain a records object keyed by publication_id")

    output_rows: list[dict[str, Any]] = []
    seen: set[str] = set()
    report = {"records_seen": 0, "emitted_records": 0, "excluded_rights": 0, "duplicates": 0, "empty_records": 0}

    with Path(source_path).open("r", encoding="utf-8") as handle:
        for line_number, line in enumerate(handle, start=1):
            if not line.strip():
                continue
            report["records_seen"] += 1
            try:
                record = json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(f"Invalid patent JSONL on line {line_number}") from exc
            if not isinstance(record, dict):
                raise ValueError(f"Patent record must be a JSON object on line {line_number}")
            publication_id = clean_text(record.get("publication_id"), 100)
            if not publication_id:
                raise ValueError(f"publication_id is required on line {line_number}")
            if publication_id in seen:
                report["duplicates"] += 1
                continue
            seen.add(publication_id)
            grant = rights.get(publication_id)
            if not isinstance(grant, dict):
                report["excluded_rights"] += 1
                continue
            if grant.get("training_authorized") is not True or grant.get("derivative_model_allowed") is not True or not clean_text(grant.get("license_id"), 200):
                report["excluded_rights"] += 1
                continue
            if require_redistributable_weights and grant.get("redistribute_model_weights") is not True:
                raise ValueError(f"redistribute_model_weights is not explicitly allowed for {publication_id}")

            title = clean_text(record.get("title"), 500)
            abstract = clean_text(record.get("abstract"), 20_000)
            description = clean_text(record.get("description"), 200_000)
            claims_value = record.get("claims")
            claims = [clean_text(item, 20_000) for item in claims_value if isinstance(item, str)] if isinstance(claims_value, list) else []
            claims = [claim for claim in claims if claim]
            if not title or not (abstract or description or claims):
                report["empty_records"] += 1
                continue

            output_rows.append({
                "publication_id": publication_id,
                "family_id": clean_text(record.get("family_id"), 200) or publication_id,
                "title": title,
                "abstract": abstract,
                "description": description,
                "claims": claims,
                "publication_date": clean_text(record.get("publication_date"), 40),
                "priority_date": clean_text(record.get("priority_date"), 40),
                "language": clean_text(record.get("language"), 40),
                "ipc_cpc": record.get("ipc_cpc", []) if isinstance(record.get("ipc_cpc", []), list) else [],
                "citations": record.get("citations", []) if isinstance(record.get("citations", []), list) else [],
                "source": clean_text(grant.get("source"), 300),
                "license_id": clean_text(grant.get("license_id"), 200),
                "license_basis": clean_text(grant.get("license_basis"), 1000),
                "derivative_model_allowed": True,
                "redistribute_model_weights": grant.get("redistribute_model_weights") is True,
                "record_url": clean_text(record.get("record_url"), 1000),
            })

    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w", encoding="utf-8") as handle:
        for row in output_rows:
            handle.write(json.dumps(row, ensure_ascii=False, sort_keys=True) + "\n")
    report["emitted_records"] = len(output_rows)
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True, help="Local normalized patent JSONL from an authorized WIPO export")
    parser.add_argument("--rights-manifest", type=Path, required=True, help="JSON rights register")
    parser.add_argument("--output", type=Path, required=True, help="Output JSONL path")
    parser.add_argument("--require-redistributable-weights", action="store_true", help="Fail unless included rows permit model-weight redistribution")
    args = parser.parse_args()
    report = prepare_patent_records(args.source, args.rights_manifest, args.output, require_redistributable_weights=args.require_redistributable_weights)
    print(json.dumps(report, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
