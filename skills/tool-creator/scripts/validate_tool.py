#!/usr/bin/env python3
"""Validate a portable tool manifest and its local input/output fixtures."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any


def validate(value: Any, schema: dict[str, Any], path: str = "$", root: Any = None) -> list[str]:
    root = schema if root is None else root
    if "$ref" in schema:
        ref = schema["$ref"]
        if ref.startswith("#/$defs/"):
            schema = root["$defs"][ref.removeprefix("#/$defs/")]
    errors: list[str] = []
    if "const" in schema and value != schema["const"]:
        errors.append(f"{path}: expected {schema['const']!r}")
        return errors
    if "enum" in schema and value not in schema["enum"]:
        errors.append(f"{path}: expected one of {schema['enum']!r}")
        return errors
    expected = schema.get("type")
    types = expected if isinstance(expected, list) else [expected] if expected else []
    matches = any(
        (t == "object" and isinstance(value, dict))
        or (t == "array" and isinstance(value, list))
        or (t == "string" and isinstance(value, str))
        or (t == "integer" and isinstance(value, int) and not isinstance(value, bool))
        or (t == "number" and isinstance(value, (int, float)) and not isinstance(value, bool))
        or (t == "boolean" and isinstance(value, bool))
        or (t == "null" and value is None)
        for t in types
    )
    if types and not matches:
        return [f"{path}: expected {types}, got {type(value).__name__}"]
    if isinstance(value, str):
        if len(value) < schema.get("minLength", 0):
            errors.append(f"{path}: shorter than minLength")
        if "pattern" in schema and not re.fullmatch(schema["pattern"], value):
            errors.append(f"{path}: does not match pattern")
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        if value < schema.get("minimum", value):
            errors.append(f"{path}: below minimum")
        if value > schema.get("maximum", value):
            errors.append(f"{path}: above maximum")
    if isinstance(value, list):
        if len(value) < schema.get("minItems", 0):
            errors.append(f"{path}: fewer than minItems")
        if "items" in schema:
            for i, item in enumerate(value):
                errors.extend(validate(item, schema["items"], f"{path}[{i}]", root))
    if isinstance(value, dict):
        for key in schema.get("required", []):
            if key not in value:
                errors.append(f"{path}: missing required property {key!r}")
        properties = schema.get("properties", {})
        if schema.get("additionalProperties") is False:
            errors.extend(f"{path}: unknown property {key!r}" for key in value if key not in properties)
        for key, item in value.items():
            if key in properties:
                errors.extend(validate(item, properties[key], f"{path}.{key}", root))
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest", type=Path)
    args = parser.parse_args()
    try:
        manifest = json.loads(args.manifest.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(json.dumps({"ok": False, "errors": [f"cannot read JSON: {exc}"]}, indent=2))
        return 2

    errors = validate(manifest, {
        "type": "object",
        "required": ["kind", "schema_version", "function", "execution", "result", "errors", "tests"],
    })
    function = manifest.get("function", {})
    execution = manifest.get("execution", {})
    approval = manifest.get("approval", {})
    idempotency = manifest.get("idempotency", {})
    parameters = function.get("parameters", {})
    result_schema = manifest.get("result", {}).get("schema", {})
    if function.get("strict") is not True:
        errors.append("function.strict must be true")
    if not re.fullmatch(r"[a-z][a-z0-9_]{1,63}", str(function.get("name", ""))):
        errors.append("function.name is not valid lowercase snake_case")
    if parameters.get("type") != "object" or parameters.get("additionalProperties") is not False:
        errors.append("function.parameters must be a closed object schema")
    mode = execution.get("mode")
    if mode not in {"read_only", "write", "destructive"}:
        errors.append("execution.mode is invalid")
    mutating = mode in {"write", "destructive"}
    if bool(execution.get("external_side_effects")) != mutating:
        errors.append("external_side_effects disagrees with execution.mode")
    if mutating and approval.get("required") is not True:
        errors.append("mutating tools require approval.required=true")
    if mutating and idempotency.get("required") is not True:
        errors.append("mutating tools require idempotency.required=true")
    valid_count = invalid_count = 0
    for case in manifest.get("tests", []):
        case_errors = validate(case.get("input"), parameters)
        if case.get("kind") == "valid":
            valid_count += 1
            errors.extend(f"test {case.get('name')}: {err}" for err in case_errors)
            if "mock_output" in case:
                errors.extend(f"test {case.get('name')} output: {err}" for err in validate(case["mock_output"], result_schema))
        elif case.get("kind") == "invalid":
            invalid_count += 1
            if not case_errors:
                errors.append(f"test {case.get('name')}: invalid fixture was accepted")
        else:
            errors.append(f"test {case.get('name')}: kind must be valid or invalid")
    if valid_count == 0 or invalid_count == 0:
        errors.append("include at least one valid and one invalid test fixture")
    summary = {"ok": not errors, "manifest": str(args.manifest.resolve()), "function": function.get("name"), "tests": {"valid": valid_count, "invalid": invalid_count}, "errors": errors}
    print(json.dumps(summary, indent=2))
    return 0 if not errors else 1


if __name__ == "__main__":
    raise SystemExit(main())
