#!/usr/bin/env python3
"""Check the minimum evidence structure of a bounded invention workspace.

This is a structural checker. It cannot assess physical correctness, safety,
novelty, certification, or whether a model's assumptions are appropriate.
"""
from __future__ import annotations

import argparse
from pathlib import Path

REQUIRED = (
    "README.md",
    "REFINED_DESIGN.md",
    "simulation",
    "schematics",
)
SIMULATION_REQUIRED = (
    "README.md",
    "EXTERNAL_CONSTRAINTS_LEDGER.md",
)


def find_any(directory: Path, patterns: tuple[str, ...]) -> bool:
    return any(any(directory.glob(pattern)) for pattern in patterns)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("workspace", type=Path, help="Path to one invention workspace.")
    args = parser.parse_args()
    root = args.workspace.resolve()
    failures: list[str] = []
    warnings: list[str] = []

    if not root.is_dir():
        raise SystemExit(f"ERROR: workspace does not exist: {root}")
    for item in REQUIRED:
        if not (root / item).exists():
            failures.append(f"missing required path: {item}")

    simulation = root / "simulation"
    if simulation.is_dir():
        for item in SIMULATION_REQUIRED:
            if not (simulation / item).exists():
                failures.append(f"missing simulation artifact: simulation/{item}")
        if not find_any(simulation, ("*MODEL_SPEC.md", "*SIMULATION_SPEC.md")):
            failures.append("no model or simulation specification found under simulation/")
        if not find_any(simulation, ("*.py", "*.ipynb", "*.m", "*.jl", "*.R")):
            failures.append("no simulation source found under simulation/")
        if not find_any(simulation, ("test_*.py", "*_test.py", "tests/**")):
            warnings.append("no named regression test found under simulation/")
        if not find_any(simulation, ("outputs/*.json", "outputs/**/*.json")):
            warnings.append("no machine-readable JSON result found under simulation/outputs/")
        if not find_any(simulation, ("outputs/*.png", "outputs/**/*.png")):
            warnings.append("no rendered plot found under simulation/outputs/")

    schematics = root / "schematics"
    if schematics.is_dir():
        if not find_any(schematics, ("*.mmd", "*.d2", "*.puml")):
            failures.append("no schematic source found under schematics/")
        if not find_any(schematics, ("*.png", "*.svg")):
            warnings.append("no rendered schematic image found under schematics/")

    print(f"Workspace: {root}")
    for warning in warnings:
        print(f"WARNING: {warning}")
    if failures:
        for failure in failures:
            print(f"FAIL: {failure}")
        raise SystemExit(1)
    print("PASS: required bounded-invention workspace structure is present.")


if __name__ == "__main__":
    main()
