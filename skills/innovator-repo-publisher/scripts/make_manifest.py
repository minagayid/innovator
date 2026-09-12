#!/usr/bin/env python3
"""Create a deterministic SHA-256 manifest for a skill bundle."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("bundle", type=Path)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    root = args.bundle.resolve()
    if not root.is_dir():
        parser.error(f"bundle directory does not exist: {root}")
    files = []
    for path in sorted(p for p in root.rglob("*") if p.is_file() and p.name != "bundle-manifest.json"):
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        files.append({"path": path.relative_to(root).as_posix(), "sha256": digest, "bytes": path.stat().st_size})
    payload = {"schema_version": "1.0", "bundle": root.name, "files": files}
    destination = (args.output or root / "bundle-manifest.json").resolve()
    destination.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"manifest": str(destination), "file_count": len(files)}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
