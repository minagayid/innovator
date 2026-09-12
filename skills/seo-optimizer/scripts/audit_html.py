#!/usr/bin/env python3
"""Run a dependency-free signal audit over one HTML file or a directory."""

from __future__ import annotations

import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from typing import Any


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.title_parts: list[str] = []
        self.text_parts: list[str] = []
        self.meta: dict[str, str] = {}
        self.canonicals: list[str] = []
        self.headings: list[dict[str, str]] = []
        self.images: list[dict[str, Any]] = []
        self.links: list[dict[str, str]] = []
        self._in_title = False
        self._heading: dict[str, str] | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key.lower(): value or "" for key, value in attrs}
        if tag.lower() == "title":
            self._in_title = True
        if tag.lower() in {"h1", "h2", "h3", "h4", "h5", "h6"}:
            self._heading = {"level": tag.lower(), "text": ""}
        if tag.lower() == "meta":
            key = values.get("name", "").lower()
            if key in {"description", "robots"}:
                self.meta[key] = values.get("content", "")
        if tag.lower() == "link" and values.get("rel", "").lower() == "canonical":
            self.canonicals.append(values.get("href", ""))
        if tag.lower() == "img":
            self.images.append({"src": values.get("src", ""), "alt": values.get("alt"), "has_alt": "alt" in values})
        if tag.lower() == "a":
            self.links.append({"href": values.get("href", ""), "text": ""})

    def handle_endtag(self, tag: str) -> None:
        lower = tag.lower()
        if lower == "title":
            self._in_title = False
        if self._heading and lower == self._heading["level"]:
            self._heading["text"] = re.sub(r"\s+", " ", self._heading["text"]).strip()
            self.headings.append(self._heading)
            self._heading = None

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title_parts.append(data)
        if self._heading is not None:
            self._heading["text"] += data
        if self.links and data.strip():
            self.links[-1]["text"] += data
        self.text_parts.append(data)


def audit_file(path: Path) -> dict[str, Any]:
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8", errors="replace"))
    title = re.sub(r"\s+", " ", " ".join(parser.title_parts)).strip()
    description = parser.meta.get("description", "").strip()
    h1_count = sum(item["level"] == "h1" for item in parser.headings)
    words = re.findall(r"\b[\w'-]+\b", " ".join(parser.text_parts))
    issues: list[dict[str, str]] = []
    if not title:
        issues.append({"code": "missing_title", "severity": "high"})
    if not description:
        issues.append({"code": "missing_meta_description", "severity": "medium"})
    if h1_count != 1:
        issues.append({"code": "h1_count_not_one", "severity": "medium", "detail": str(h1_count)})
    if len(parser.canonicals) != 1 or not parser.canonicals[0]:
        issues.append({"code": "canonical_missing_or_ambiguous", "severity": "medium"})
    missing_alt = [image["src"] for image in parser.images if not image["has_alt"]]
    if missing_alt:
        issues.append({"code": "images_missing_alt", "severity": "medium", "detail": str(len(missing_alt))})
    if "noindex" in parser.meta.get("robots", "").lower():
        issues.append({"code": "noindex_present", "severity": "high", "detail": "confirm this is intentional"})
    return {
        "file": str(path.resolve()),
        "title": title,
        "meta_description": description,
        "headings": parser.headings,
        "h1_count": h1_count,
        "canonical_count": len(parser.canonicals),
        "images": len(parser.images),
        "images_missing_alt": missing_alt,
        "links": len(parser.links),
        "word_count": len(words),
        "issues": issues,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("path", type=Path)
    parser.add_argument("--pretty", action="store_true")
    args = parser.parse_args()
    if args.path.is_file():
        paths = [args.path]
    elif args.path.is_dir():
        paths = sorted({*args.path.rglob("*.html"), *args.path.rglob("*.htm")})
    else:
        parser.error(f"path does not exist: {args.path}")
    if not paths:
        parser.error("no HTML files found")
    payload = [audit_file(path) for path in paths]
    print(json.dumps(payload[0] if len(payload) == 1 else payload, indent=2 if args.pretty else None))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
