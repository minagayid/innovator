#!/usr/bin/env python3
"""Independent numerical audit of the selected Morris–Thorne toy family.

The audit checks two derived properties with a route independent from model.py's
finite-difference calculation: (1) b(r)/r is below one outside the throat, and
(2) a volume-weighted radial NEC integral agrees with its analytic expression.
It does not test quantum inequalities, a material source, dynamical stability,
formation, or portal feasibility.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
import platform
import sys
from datetime import datetime, timezone
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

plt.rcParams["font.family"] = "DejaVu Sans"
plt.rcParams["axes.unicode_minus"] = True

AUDIT_GRID_SIZES = (501, 1001, 2001, 4001)
AUDIT_X_MAX = 30.0


def analytic_volume_nec_debt(r0: float, alpha: float, x_max: float) -> float:
    """Return integral_{r0}^{x_max*r0} 4*pi*r^2*(rho+p_r) dr."""
    return -((alpha + 1.0) * r0 / (2.0 * alpha)) * (1.0 - x_max ** (-alpha))


def numeric_volume_nec_debt(r0: float, alpha: float, x_max: float, n_grid: int) -> float:
    """Integrate the analytic stress-energy profile with independent quadrature."""
    r = np.linspace(r0, x_max * r0, n_grid)
    nec = -((alpha + 1.0) * r0 ** (alpha + 1.0)) / (8.0 * math.pi * r ** (alpha + 3.0))
    integrand = 4.0 * math.pi * r**2 * nec
    return float(np.trapezoid(integrand, r))


def shape_domain_check(r0: float, alpha: float, x_max: float, n_grid: int) -> dict:
    """Check b/r = (r0/r)^(alpha+1) at and outside the specified throat."""
    r = np.linspace(r0, x_max * r0, n_grid)
    ratio = (r0 / r) ** (alpha + 1.0)
    return {
        "ratio_at_throat": float(ratio[0]),
        "max_ratio_interior": float(np.max(ratio[1:])),
        "all_interior_strictly_below_one": bool(np.all(ratio[1:] < 1.0)),
    }


def run_case(r0: float, alpha: float, n_grid: int) -> dict:
    numeric = numeric_volume_nec_debt(r0, alpha, AUDIT_X_MAX, n_grid)
    analytic = analytic_volume_nec_debt(r0, alpha, AUDIT_X_MAX)
    domain = shape_domain_check(r0, alpha, AUDIT_X_MAX, n_grid)
    return {
        "r0": r0,
        "alpha": alpha,
        "n_grid": n_grid,
        "x_max": AUDIT_X_MAX,
        "volume_nec_debt_numeric": numeric,
        "volume_nec_debt_analytic": analytic,
        "volume_nec_debt_rel_error": abs(numeric - analytic) / abs(analytic),
        "volume_nec_debt_negative": bool(numeric < 0.0),
        **domain,
    }


def plot_debt(output_dir: Path) -> None:
    figure, axis = plt.subplots(figsize=(8, 5), constrained_layout=True)
    x = np.linspace(1.0, AUDIT_X_MAX, 1000)
    for alpha in (0.25, 0.5, 1.0, 2.0):
        normalized = -((alpha + 1.0) / (2.0 * alpha)) * (1.0 - x ** (-alpha))
        axis.plot(x, normalized, label=rf"$\alpha={alpha:g}$")
    axis.axhline(0.0, color="black", linewidth=0.8)
    axis.set_xscale("log")
    axis.set_xlabel(r"Outer integration radius $R/r_0$")
    axis.set_ylabel(r"$\int_{r_0}^{R}4\pi r^2(\rho+p_r)dr\,/\,r_0$")
    axis.set_title("Integrated radial NEC debt of the prescribed toy family")
    axis.grid(True, alpha=0.25)
    axis.legend(title="Shape exponent")
    figure.savefig(output_dir / "integrated_nec_debt.png", dpi=180)
    plt.close(figure)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(65536), b""):
            digest.update(block)
    return digest.hexdigest()


def run(output_dir: Path) -> dict:
    output_dir.mkdir(parents=True, exist_ok=True)
    cases = [
        run_case(r0, alpha, n_grid)
        for r0 in (0.5, 1.0, 2.0)
        for alpha in (0.25, 0.5, 1.0, 2.0)
        for n_grid in AUDIT_GRID_SIZES
    ]
    with (output_dir / "adversarial_audit.csv").open("w", newline="", encoding="utf-8") as handle:
        fields = list(cases[0])
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        writer.writerows(cases)
    plot_debt(output_dir)
    report = {
        "study": "independent_shape_and_integrated_nec_audit",
        "created_utc": datetime.now(timezone.utc).isoformat(),
        "units": "geometrized G=c=1",
        "scope": (
            "Checks a prescribed metric's shape-domain and integrated radial NEC identity only; "
            "not a source, stability, QEI, formation, causality, or portal-feasibility calculation."
        ),
        "parameters": {
            "alphas": [0.25, 0.5, 1.0, 2.0],
            "throat_radii": [0.5, 1.0, 2.0],
            "grid_sizes": list(AUDIT_GRID_SIZES),
            "x_max": AUDIT_X_MAX,
        },
        "case_count": len(cases),
        "cases": cases,
        "environment": {
            "python": sys.version,
            "platform": platform.platform(),
            "numpy": np.__version__,
            "matplotlib": matplotlib.__version__,
        },
        "source_sha256": {
            path.name: sha256(path)
            for path in (
                Path(__file__),
                Path(__file__).parent / "test_adversarial_audit.py",
                Path(__file__).parent / "MODEL_SPEC.md",
                Path(__file__).parent / "FORMAL_CLAIM.md",
            )
            if path.is_file()
        },
    }
    (output_dir / "adversarial_audit.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output-dir", type=Path, default=Path(__file__).parent / "outputs",
        help="Directory for audit outputs.",
    )
    args = parser.parse_args()
    report = run(args.output_dir)
    failures = [
        item for item in report["cases"]
        if not item["volume_nec_debt_negative"]
        or not item["all_interior_strictly_below_one"]
        or item["ratio_at_throat"] != 1.0
    ]
    if failures:
        print(f"FAIL: {len(failures)} audit cases failed; inspect {args.output_dir}.")
        return 1
    print(
        f"PASS: {report['case_count']} independent finite audit cases matched the declared "
        "negative integrated NEC diagnostic and exterior shape-domain check. "
        "This does not resolve physical portal proof gaps."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
