#!/usr/bin/env python3
"""Validate recorded outputs from the bounded Morris–Thorne toy study."""
from __future__ import annotations

import argparse
import json
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output-dir", type=Path, default=Path(__file__).parent / "outputs",
        help="Directory produced by model.py.",
    )
    args = parser.parse_args()
    manifest_path = args.output_dir / "manifest.json"
    if not manifest_path.is_file():
        raise SystemExit(f"FAIL: missing manifest: {manifest_path}")
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    cases = manifest.get("cases", [])
    expected_case_count = 4 * 3 * 4
    errors: list[str] = []
    if len(cases) != expected_case_count:
        errors.append(f"expected {expected_case_count} cases, found {len(cases)}")
    for item in cases:
        if item["throat_identity_abs_error"] > 1e-14:
            errors.append(f"throat identity failure: {item}")
        if not item["flare_out_value_bprime_at_throat"] < 1.0:
            errors.append(f"flare-out failure: {item}")
        if not item["all_analytic_nec_negative"] or not item["all_numeric_nec_negative"]:
            errors.append(f"NEC-sign failure: {item}")
        if item["flat_control_max_abs"] > 1e-14:
            errors.append(f"flat-control residual: {item}")
        if not item["schwarzschild_lapse_strictly_increases_away_from_horizon"]:
            errors.append(f"horizon-lapse comparison failure: {item}")

    for alpha in manifest["parameters"]["alphas"]:
        subset = [
            item for item in cases
            if item["alpha"] == alpha and item["r0"] == 1.0
        ]
        subset.sort(key=lambda item: item["n_grid"])
        errors_by_grid = [item["max_rel_error_nec_interior"] for item in subset]
        if len(errors_by_grid) != 4 or not all(
            later < earlier for earlier, later in zip(errors_by_grid, errors_by_grid[1:])
        ):
            errors.append(f"non-monotone refinement for alpha={alpha}: {errors_by_grid}")

    missing_hashes = [
        name for name in manifest.get("output_sha256", {})
        if not (args.output_dir / name).is_file()
    ]
    if missing_hashes:
        errors.append(f"hash entries missing files: {missing_hashes}")

    if errors:
        print("FAIL: output validation found issues:")
        for error in errors:
            print(f"  - {error}")
        return 1
    print(
        "PASS: all finite toy cases meet recorded analytic/control/refinement checks. "
        "This is implementation verification, not physical portal validation."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
