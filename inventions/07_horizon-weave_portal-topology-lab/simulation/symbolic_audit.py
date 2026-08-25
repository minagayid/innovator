#!/usr/bin/env python3
"""Symbolically audit the declared Morris–Thorne toy-metric identities.

This script proves only identities within the specified symbolic ansatz and the
static Phi=0 Einstein-equation expressions.  It does not prove that a physical
source, stable spacetime, or portal exists.
"""
from __future__ import annotations

import hashlib
import json
import platform
import sys
from datetime import datetime, timezone
from pathlib import Path

import sympy as sp


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(65536), b""):
            digest.update(block)
    return digest.hexdigest()


def as_text(expression: sp.Expr) -> str:
    return str(sp.simplify(expression))


def run(output_dir: Path) -> dict:
    output_dir.mkdir(parents=True, exist_ok=True)
    r, r0, R, alpha = sp.symbols("r r0 R alpha", positive=True, finite=True)
    pi = sp.pi
    b = r0 * (r0 / r) ** alpha
    b_prime = sp.diff(b, r)
    rho = b_prime / (8 * pi * r**2)
    p_radial = -b / (8 * pi * r**3)
    nec = sp.simplify(rho + p_radial)
    expected_nec = -((alpha + 1) * r0 ** (alpha + 1)) / (8 * pi * r ** (alpha + 3))
    expected_integral = -((alpha + 1) * r0 / (2 * alpha)) * (1 - (r0 / R) ** alpha)
    integral = sp.simplify(sp.integrate(4 * pi * r**2 * nec, (r, r0, R)))

    checks = {
        "shape_derivative_identity": sp.simplify(b_prime + alpha * b / r) == 0,
        "throat_identity": sp.simplify(b.subs(r, r0) - r0) == 0,
        "flare_out_expression": sp.simplify(b_prime.subs(r, r0) + alpha) == 0,
        "nec_identity": sp.simplify(nec - expected_nec) == 0,
        "integrated_nec_identity": sp.simplify(integral - expected_integral) == 0,
    }
    certificate = {
        "study": "symbolic_static_morris_thorne_identity_audit",
        "created_utc": datetime.now(timezone.utc).isoformat(),
        "assumptions": "r>0, r0>0, R>0, alpha>0; finite; R is treated as an outer radius.",
        "expressions": {
            "shape_function": as_text(b),
            "shape_derivative": as_text(b_prime),
            "radial_nec": as_text(nec),
            "expected_radial_nec": as_text(expected_nec),
            "integrated_radial_nec": as_text(integral),
            "expected_integrated_radial_nec": as_text(expected_integral),
        },
        "checks": checks,
        "environment": {
            "python": sys.version,
            "platform": platform.platform(),
            "sympy": sp.__version__,
        },
        "source_sha256": {
            path.name: sha256(path)
            for path in (
                Path(__file__),
                Path(__file__).parent / "FORMAL_CLAIM.md",
                Path(__file__).parent / "MODEL_SPEC.md",
            )
            if path.is_file()
        },
        "conclusion_boundary": (
            "Symbolic identity verification for a prescribed static metric ansatz only; "
            "not a source, stability, quantum-gravity, causality, or portal-feasibility proof."
        ),
    }
    (output_dir / "symbolic_certificate.json").write_text(
        json.dumps(certificate, indent=2) + "\n", encoding="utf-8"
    )
    return certificate


def main() -> int:
    output_dir = Path(__file__).parent / "outputs"
    certificate = run(output_dir)
    if not all(certificate["checks"].values()):
        print("FAIL: one or more symbolic identities did not simplify to zero.")
        return 1
    print(
        "PASS: all five symbolic identities hold for the declared ansatz. "
        "This is not a physical portal proof."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
