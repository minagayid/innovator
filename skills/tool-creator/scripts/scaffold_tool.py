#!/usr/bin/env python3
"""Create a portable, side-effect-free callable-tool manifest."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("name", help="lowercase snake_case function name")
    parser.add_argument("--output", type=Path, required=True, help="directory for tool.json")
    parser.add_argument("--description", default="Return the supplied text without external side effects.")
    args = parser.parse_args()

    if not re.fullmatch(r"[a-z][a-z0-9_]{1,63}", args.name):
        parser.error("name must match [a-z][a-z0-9_]{1,63}")

    manifest = {
        "kind": "function",
        "schema_version": "1.0",
        "function": {
            "name": args.name,
            "description": args.description,
            "strict": True,
            "parameters": {
                "type": "object",
                "properties": {"text": {"type": "string", "minLength": 1}},
                "required": ["text"],
                "additionalProperties": False,
            },
        },
        "execution": {
            "mode": "read_only",
            "external_side_effects": False,
            "idempotent": True,
            "timeout_ms": 10000,
        },
        "approval": {"required": False, "reason": None},
        "idempotency": {"required": False},
        "result": {
            "schema": {
                "type": "object",
                "properties": {"text": {"type": "string"}},
                "required": ["text"],
                "additionalProperties": False,
            }
        },
        "errors": [
            {"code": "invalid_input", "retryable": False, "description": "Arguments do not match the input schema."},
            {"code": "execution_failed", "retryable": False, "description": "The local handler failed."},
        ],
        "tests": [
            {"name": "minimal-valid", "kind": "valid", "input": {"text": "hello"}, "mock_output": {"text": "hello"}},
            {"name": "unknown-field-rejected", "kind": "invalid", "input": {"text": "hello", "extra": True}},
        ],
    }

    args.output.mkdir(parents=True, exist_ok=True)
    destination = args.output / "tool.json"
    destination.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(destination.resolve())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
