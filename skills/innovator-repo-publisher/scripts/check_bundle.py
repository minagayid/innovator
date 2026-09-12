#!/usr/bin/env python3
"""Check a local skill/tool bundle without changing it."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


SECRET_PATTERNS = [
    re.compile(r"\bsk-[A-Za-z0-9_-]{12,}\b"),
    re.compile(r"(?i)\b(api[_-]?key|access[_-]?token|client[_-]?secret)\s*[:=]\s*['\"]?[^\s'\"]{8,}"),
]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("bundle", type=Path)
    args = parser.parse_args()
    root = args.bundle.resolve()
    errors: list[str] = []
    skills = []
    if not root.is_dir():
        errors.append(f"bundle directory does not exist: {root}")
    else:
        for child in sorted(root.iterdir()):
            if child.name.startswith(".") or child.name in {"tools"}:
                continue
            if not child.is_dir():
                continue
            skill_file = child / "SKILL.md"
            if not skill_file.is_file():
                errors.append(f"missing SKILL.md: {child.name}")
                continue
            text = skill_file.read_text(encoding="utf-8", errors="replace")
            if not text.startswith("---\n") or "\nname:" not in text or "\ndescription:" not in text:
                errors.append(f"invalid frontmatter: {skill_file}")
            if "TODO" in text or "[placeholder]" in text.lower():
                errors.append(f"unfinished scaffold marker: {skill_file}")
            if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", child.name):
                errors.append(f"skill directory is not hyphen-case: {child.name}")
            skills.append(child.name)
        for file in root.rglob("*"):
            if file.is_symlink():
                errors.append(f"symlink is not allowed: {file.relative_to(root)}")
                continue
            if file.is_file() and file.suffix.lower() in {".md", ".json", ".yaml", ".yml", ".py", ".txt"}:
                text = file.read_text(encoding="utf-8", errors="replace")
                if any(pattern.search(text) for pattern in SECRET_PATTERNS):
                    errors.append(f"possible secret pattern: {file.relative_to(root)}")
    result = {"ok": not errors, "bundle": str(root), "skills": skills, "skill_count": len(skills), "errors": errors}
    print(json.dumps(result, indent=2))
    return 0 if not errors else 1


if __name__ == "__main__":
    raise SystemExit(main())
