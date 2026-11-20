#!/usr/bin/env python3
"""Prepare locally acquired NCBI FASTA records with an explicit rights allowlist.

This script intentionally performs no network access. Acquire records through
NCBI's official Datasets/FTP products or other authorized channels, then supply
an accession-level TSV rights manifest. Records without explicit permission
and provenance are excluded.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
from pathlib import Path
from typing import Iterator

ACCESSION_RE = re.compile(r"(?:[A-Z]{1,4}_\d+\.\d+|[A-Z]{1,2}\d+\.\d+)")
ALPHABETS = {
    "DNA": set("ACGTNRYKMSWBDHV"),
    "RNA": set("ACGUNRYKMSWBDHV"),
    "PROTEIN": set("ABCDEFGHIKLMNPQRSTVWXYZUO"),
}
REQUIRED_MANIFEST_COLUMNS = {
    "accession", "sequence_type", "taxid", "organism", "source_database",
    "release", "training_authorized", "license_basis",
}


def parse_bool(value: str, field: str) -> bool:
    normalized = value.strip().lower()
    if normalized not in {"true", "false"}:
        raise ValueError(f"{field} must be exactly true or false")
    return normalized == "true"


def parse_fasta(path: Path) -> Iterator[tuple[str, str]]:
    header: str | None = None
    parts: list[str] = []
    with path.open("r", encoding="utf-8") as handle:
        for line_number, raw in enumerate(handle, start=1):
            line = raw.strip()
            if not line:
                continue
            if line.startswith(">"):
                if header is not None:
                    yield header, "".join(parts).upper()
                header = line[1:].strip()
                if not header:
                    raise ValueError(f"FASTA header is empty at line {line_number}")
                parts = []
            else:
                if header is None:
                    raise ValueError(f"Sequence data appears before a FASTA header at line {line_number}")
                parts.append(re.sub(r"\s+", "", line))
    if header is not None:
        yield header, "".join(parts).upper()


def accession_from_header(header: str) -> str:
    match = ACCESSION_RE.search(header)
    if match:
        return match.group(0)
    return header.split()[0].split("|")[0]


def load_rights_manifest(path: Path) -> dict[str, dict[str, str | int | bool]]:
    with path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle, delimiter="\t")
        columns = set(reader.fieldnames or [])
        missing = sorted(REQUIRED_MANIFEST_COLUMNS - columns)
        if missing:
            raise ValueError(f"Rights manifest is missing columns: {', '.join(missing)}")
        manifest: dict[str, dict[str, str | int | bool]] = {}
        for line_number, row in enumerate(reader, start=2):
            accession = (row.get("accession") or "").strip()
            if not accession:
                raise ValueError(f"Missing accession in rights manifest line {line_number}")
            if accession in manifest:
                raise ValueError(f"Duplicate accession in rights manifest: {accession}")
            sequence_type = (row.get("sequence_type") or "").strip().upper()
            if sequence_type not in ALPHABETS:
                raise ValueError(f"Unsupported sequence_type for {accession}: {sequence_type}")
            try:
                taxid = int((row.get("taxid") or "").strip())
            except ValueError as exc:
                raise ValueError(f"Invalid taxid for {accession}") from exc
            if taxid <= 0:
                raise ValueError(f"taxid must be positive for {accession}")
            manifest[accession] = {
                "sequence_type": sequence_type,
                "taxid": taxid,
                "organism": (row.get("organism") or "").strip(),
                "source_database": (row.get("source_database") or "").strip(),
                "release": (row.get("release") or "").strip(),
                "training_authorized": parse_bool(row.get("training_authorized") or "", "training_authorized"),
                "license_basis": (row.get("license_basis") or "").strip(),
            }
    return manifest


def prepare_sequences(fasta_path: Path, rights_manifest_path: Path, output_path: Path) -> dict[str, int]:
    rights = load_rights_manifest(Path(rights_manifest_path))
    grouped: dict[tuple[str, str], dict[str, object]] = {}
    seen_accessions: set[str] = set()
    report = {
        "records_seen": 0,
        "emitted_sequences": 0,
        "excluded_no_rights": 0,
        "excluded_invalid_sequence": 0,
        "duplicate_sequences": 0,
        "duplicate_accessions": 0,
    }

    for header, sequence in parse_fasta(Path(fasta_path)):
        report["records_seen"] += 1
        accession = accession_from_header(header)
        metadata = rights.get(accession)
        if metadata is None or not metadata["training_authorized"] or not metadata["license_basis"]:
            report["excluded_no_rights"] += 1
            continue
        if accession in seen_accessions:
            report["duplicate_accessions"] += 1
            continue
        seen_accessions.add(accession)
        sequence_type = str(metadata["sequence_type"])
        # A terminal protein stop marker is not a residue; internal stops remain invalid.
        if sequence_type == "PROTEIN" and sequence.endswith("*"):
            sequence = sequence[:-1]
        if not sequence or any(base not in ALPHABETS[sequence_type] for base in sequence):
            report["excluded_invalid_sequence"] += 1
            continue
        digest = hashlib.sha256(sequence.encode("ascii")).hexdigest()
        key = (sequence_type, digest)
        entry = grouped.get(key)
        if entry is None:
            grouped[key] = {
                "accession": accession,
                "sequence_type": sequence_type,
                "sequence": sequence,
                "sequence_sha256": digest,
                "source_accessions": [accession],
                "taxids": [int(metadata["taxid"])],
                "organisms": [str(metadata["organism"])],
                "source_databases": [str(metadata["source_database"])],
                "releases": [str(metadata["release"])],
                "license_bases": [str(metadata["license_basis"])],
            }
        else:
            report["duplicate_sequences"] += 1
            for key_name, value in (
                ("source_accessions", accession),
                ("taxids", int(metadata["taxid"])),
                ("organisms", str(metadata["organism"])),
                ("source_databases", str(metadata["source_database"])),
                ("releases", str(metadata["release"])),
                ("license_bases", str(metadata["license_basis"])),
            ):
                collection = entry[key_name]
                assert isinstance(collection, list)
                if value not in collection:
                    collection.append(value)

    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w", encoding="utf-8") as handle:
        for entry in grouped.values():
            for key in ("source_accessions", "taxids", "organisms", "source_databases", "releases", "license_bases"):
                values = entry[key]
                assert isinstance(values, list)
                values.sort()
            entry["accession"] = entry["source_accessions"][0]
            entry["taxid"] = entry["taxids"][0]
            handle.write(json.dumps(entry, ensure_ascii=False, sort_keys=True) + "\n")
    report["emitted_sequences"] = len(grouped)
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--fasta", type=Path, required=True, help="Local NCBI FASTA export")
    parser.add_argument("--rights-manifest", type=Path, required=True, help="Accession-level TSV rights allowlist")
    parser.add_argument("--output", type=Path, required=True, help="Output JSONL path")
    args = parser.parse_args()
    print(json.dumps(prepare_sequences(args.fasta, args.rights_manifest, args.output), indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
