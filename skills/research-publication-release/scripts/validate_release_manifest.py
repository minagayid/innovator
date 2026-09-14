#!/usr/bin/env python3
"""Validate a research-publication release manifest and local artifact hashes."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import sys


def sha256(path: Path, chunk_size: int = 1024 * 1024) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(chunk_size), b""):
            digest.update(chunk)
    return digest.hexdigest()


def require_string(obj: dict, key: str, errors: list[str], prefix: str = "") -> None:
    value = obj.get(key)
    if not isinstance(value, str) or not value.strip():
        errors.append(f"{prefix}{key} must be a non-empty string")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest", type=Path)
    parser.add_argument("--root", type=Path, default=None, help="Root used to resolve artifact paths")
    parser.add_argument("--skip-hashes", action="store_true", help="Check manifest structure without reading artifacts")
    args = parser.parse_args()

    errors: list[str] = []
    try:
        data = json.loads(args.manifest.read_text(encoding="utf-8"))
    except Exception as exc:  # pragma: no cover - CLI error path
        print(f"ERROR: cannot read JSON manifest: {exc}", file=sys.stderr)
        return 2

    if not isinstance(data, dict):
        print("ERROR: manifest root must be an object", file=sys.stderr)
        return 2

    for key in ("release_tag", "title", "license", "funding_statement", "conflict_statement"):
        require_string(data, key, errors)

    authors = data.get("authors")
    if not isinstance(authors, list) or not authors:
        errors.append("authors must be a non-empty list")
    else:
        for index, author in enumerate(authors):
            if not isinstance(author, dict):
                errors.append(f"authors[{index}] must be an object")
                continue
            for key in ("name", "orcid"):
                require_string(author, key, errors, f"authors[{index}].")

    for section, keys in {
        "archive": ("platform", "doi", "url"),
        "repository": ("url",),
        "approval": (),
    }.items():
        value = data.get(section)
        if not isinstance(value, dict):
            errors.append(f"{section} must be an object")
            continue
        for key in keys:
            require_string(value, key, errors, f"{section}.")

    artifacts = data.get("artifacts")
    if not isinstance(artifacts, list):
        errors.append("artifacts must be a list")
        artifacts = []

    root = args.root or args.manifest.parent
    checked = 0
    for index, artifact in enumerate(artifacts):
        if not isinstance(artifact, dict):
            errors.append(f"artifacts[{index}] must be an object")
            continue
        require_string(artifact, "path", errors, f"artifacts[{index}].")
        require_string(artifact, "sha256", errors, f"artifacts[{index}].")
        if args.skip_hashes or not isinstance(artifact.get("path"), str):
            continue
        path = root / artifact["path"]
        if not path.is_file():
            # A manifest may describe a package whose artifacts live in a sibling directory.
            # Missing files are a hard error unless --skip-hashes is used deliberately.
            errors.append(f"artifacts[{index}] file not found: {path}")
            continue
        actual = sha256(path)
        checked += 1
        expected = artifact.get("sha256", "").lower()
        if actual.lower() != expected:
            errors.append(f"artifacts[{index}] hash mismatch for {path}: expected {expected}, got {actual}")

    if errors:
        print("Manifest validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"Manifest valid: {args.manifest}")
    if not args.skip_hashes:
        print(f"Verified artifact hashes: {checked}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
