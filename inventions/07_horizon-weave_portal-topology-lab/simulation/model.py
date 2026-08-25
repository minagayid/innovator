#!/usr/bin/env python3
"""Run a bounded Morris–Thorne energy-condition toy study.

This script evaluates a prescribed static metric family.  It is not a numerical
relativity solver and cannot model portal construction, wormhole formation,
black-hole/white-hole maintenance, material sourcing, or physical stability.
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

ALPHAS = (0.25, 0.5, 1.0, 2.0)
THROAT_RADII = (0.5, 1.0, 2.0)
GRID_SIZES = (501, 1001, 2001, 4001)
X_MAX = 30.0
INTERIOR_MARGIN = 5
FLAT_TOLERANCE = 1e-14


def shape_function(r: np.ndarray, r0: float, alpha: float) -> np.ndarray:
    """Return b(r)=r0*(r0/r)**alpha in geometrized units."""
    return r0 * (r0 / r) ** alpha


def analytic_b_prime(r: np.ndarray, r0: float, alpha: float) -> np.ndarray:
    """Return the exact radial derivative of the prescribed shape function."""
    return -alpha * shape_function(r, r0, alpha) / r


def analytic_stress_energy(
    r: np.ndarray, r0: float, alpha: float
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Return rho, radial pressure, and rho+p_r for Phi=0, G=c=1."""
    b = shape_function(r, r0, alpha)
    b_prime = analytic_b_prime(r, r0, alpha)
    rho = b_prime / (8.0 * math.pi * r**2)
    p_radial = -b / (8.0 * math.pi * r**3)
    nec = rho + p_radial
    return rho, p_radial, nec


def numeric_stress_energy(
    r: np.ndarray, r0: float, alpha: float
) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """Return b, finite-difference b', rho, and radial NEC diagnostic."""
    b = shape_function(r, r0, alpha)
    b_prime_fd = np.gradient(b, r, edge_order=2)
    rho_fd = b_prime_fd / (8.0 * math.pi * r**2)
    p_radial = -b / (8.0 * math.pi * r**3)
    return b, b_prime_fd, rho_fd, rho_fd + p_radial


def relative_error(actual: np.ndarray, expected: np.ndarray) -> np.ndarray:
    denominator = np.maximum(np.abs(expected), 1e-300)
    return np.abs(actual - expected) / denominator


def flat_control(r: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Return rho, p_r, and NEC for b=0, Phi=0 exactly in this implementation."""
    zero = np.zeros_like(r)
    return zero, zero, zero


def schwarzschild_lapse(x: np.ndarray) -> np.ndarray:
    """Return f=1-1/x outside a normalized Schwarzschild radius, x>1."""
    return 1.0 - 1.0 / x


def case_result(r0: float, alpha: float, n_grid: int) -> tuple[dict, dict[str, np.ndarray]]:
    """Evaluate one finite-grid case and return scalar summary plus profiles."""
    x = np.linspace(1.0, X_MAX, n_grid)
    r = r0 * x
    b, b_prime_fd, rho_fd, nec_fd = numeric_stress_energy(r, r0, alpha)
    b_prime_exact = analytic_b_prime(r, r0, alpha)
    rho_exact, p_radial, nec_exact = analytic_stress_energy(r, r0, alpha)
    interior = slice(INTERIOR_MARGIN, -INTERIOR_MARGIN)
    deriv_err = relative_error(b_prime_fd[interior], b_prime_exact[interior])
    nec_err = relative_error(nec_fd[interior], nec_exact[interior])

    flat_rho, flat_pr, flat_nec = flat_control(r)
    lapse_x = np.array([1.001, 1.01, 1.1, 2.0, 10.0])
    lapse = schwarzschild_lapse(lapse_x)

    summary = {
        "alpha": alpha,
        "r0": r0,
        "n_grid": n_grid,
        "x_max": X_MAX,
        "interior_margin": INTERIOR_MARGIN,
        "throat_identity_abs_error": float(abs(b[0] - r0)),
        "flare_out_value_bprime_at_throat": float(b_prime_exact[0]),
        "max_rel_error_bprime_interior": float(np.max(deriv_err)),
        "max_rel_error_nec_interior": float(np.max(nec_err)),
        "max_numeric_nec_interior": float(np.max(nec_fd[interior])),
        "min_numeric_nec_interior": float(np.min(nec_fd[interior])),
        "all_analytic_nec_negative": bool(np.all(nec_exact[interior] < 0.0)),
        "all_numeric_nec_negative": bool(np.all(nec_fd[interior] < 0.0)),
        "flat_control_max_abs": float(
            max(np.max(np.abs(flat_rho)), np.max(np.abs(flat_pr)), np.max(np.abs(flat_nec)))
        ),
        "schwarzschild_lapse_samples": [float(value) for value in lapse],
        "schwarzschild_lapse_strictly_increases_away_from_horizon": bool(
            np.all(np.diff(lapse) > 0.0)
        ),
    }
    profiles = {
        "x": x,
        "r": r,
        "b": b,
        "b_prime_fd": b_prime_fd,
        "b_prime_exact": b_prime_exact,
        "rho_fd": rho_fd,
        "rho_exact": rho_exact,
        "p_radial": p_radial,
        "nec_fd": nec_fd,
        "nec_exact": nec_exact,
    }
    return summary, profiles


def write_selected_profile(path: Path, profiles: dict[str, np.ndarray]) -> None:
    """Write one highest-resolution profile per alpha at r0=1 to CSV."""
    fields = list(profiles)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle, lineterminator="\n")
        writer.writerow(fields)
        for row in zip(*(profiles[field] for field in fields), strict=True):
            writer.writerow([f"{value:.17e}" for value in row])


def write_summary_csv(path: Path, summaries: list[dict]) -> None:
    keys = [
        "alpha", "r0", "n_grid", "throat_identity_abs_error",
        "flare_out_value_bprime_at_throat", "max_rel_error_bprime_interior",
        "max_rel_error_nec_interior", "max_numeric_nec_interior",
        "min_numeric_nec_interior", "all_analytic_nec_negative",
        "all_numeric_nec_negative", "flat_control_max_abs",
        "schwarzschild_lapse_strictly_increases_away_from_horizon",
    ]
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=keys, lineterminator="\n")
        writer.writeheader()
        writer.writerows([{key: item[key] for key in keys} for item in summaries])


def plot_nec_profiles(output_dir: Path, selected: dict[float, dict[str, np.ndarray]]) -> None:
    figure, axis = plt.subplots(figsize=(8, 5), constrained_layout=True)
    for alpha, profiles in sorted(selected.items()):
        axis.plot(
            profiles["x"],
            profiles["nec_exact"],
            label=rf"$\alpha={alpha:g}$",
            linewidth=1.8,
        )
    axis.axhline(0.0, color="black", linewidth=0.8)
    axis.set_xscale("log")
    axis.set_xlabel(r"Normalized radius $x=r/r_0$")
    axis.set_ylabel(r"Radial NEC diagnostic $\rho+p_r$ ($r_0=1$, $G=c=1$)")
    axis.set_title("Prescribed Morris–Thorne toy family: radial NEC diagnostic")
    axis.legend(title="Shape exponent")
    axis.grid(True, alpha=0.25)
    figure.savefig(output_dir / "nec_profiles.png", dpi=180)
    plt.close(figure)


def plot_refinement(output_dir: Path, summaries: list[dict]) -> None:
    figure, axis = plt.subplots(figsize=(8, 5), constrained_layout=True)
    for alpha in ALPHAS:
        items = [item for item in summaries if item["alpha"] == alpha and item["r0"] == 1.0]
        items.sort(key=lambda item: item["n_grid"])
        axis.loglog(
            [item["n_grid"] for item in items],
            [item["max_rel_error_nec_interior"] for item in items],
            marker="o",
            label=rf"$\alpha={alpha:g}$",
        )
    axis.set_xlabel("Grid points")
    axis.set_ylabel("Maximum interior relative NEC error")
    axis.set_title("Finite-difference refinement against analytic NEC")
    axis.legend(title="Shape exponent")
    axis.grid(True, which="both", alpha=0.25)
    figure.savefig(output_dir / "refinement.png", dpi=180)
    plt.close(figure)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(65536), b""):
            digest.update(block)
    return digest.hexdigest()


def run(output_dir: Path) -> dict:
    output_dir.mkdir(parents=True, exist_ok=True)
    summaries: list[dict] = []
    selected: dict[float, dict[str, np.ndarray]] = {}
    for r0 in THROAT_RADII:
        for alpha in ALPHAS:
            for n_grid in GRID_SIZES:
                summary, profiles = case_result(r0, alpha, n_grid)
                summaries.append(summary)
                if r0 == 1.0 and n_grid == max(GRID_SIZES):
                    selected[alpha] = profiles
                    write_selected_profile(output_dir / f"profile_alpha_{alpha:g}.csv", profiles)

    write_summary_csv(output_dir / "summary.csv", summaries)
    plot_nec_profiles(output_dir, selected)
    plot_refinement(output_dir, summaries)
    manifest = {
        "study": "static_morris_thorne_energy_condition_toy",
        "created_utc": datetime.now(timezone.utc).isoformat(),
        "units": "geometrized G=c=1",
        "parameters": {
            "alphas": ALPHAS,
            "throat_radii": THROAT_RADII,
            "grid_sizes": GRID_SIZES,
            "x_max": X_MAX,
            "interior_margin": INTERIOR_MARGIN,
            "random_seed": None,
        },
        "environment": {
            "python": sys.version,
            "platform": platform.platform(),
            "numpy": np.__version__,
            "matplotlib": matplotlib.__version__,
        },
        "conclusion_boundary": (
            "Computed finite verification of a prescribed metric-family implementation only; "
            "not physical validation or portal feasibility."
        ),
        "case_count": len(summaries),
        "cases": summaries,
        "source_sha256": {
            path.name: sha256(path)
            for path in (
                Path(__file__),
                Path(__file__).parent / "test_model.py",
                Path(__file__).parent / "validate_outputs.py",
                Path(__file__).parent / "MODEL_SPEC.md",
                Path(__file__).parent / "FORMAL_CLAIM.md",
                Path(__file__).parent / "EXTERNAL_CONSTRAINTS_LEDGER.md",
            )
            if path.is_file()
        },
    }
    (output_dir / "summary.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    output_hashes = {
        path.name: sha256(path)
        for path in sorted(output_dir.iterdir())
        if path.is_file() and path.name != "manifest.json"
    }
    manifest["output_sha256"] = output_hashes
    (output_dir / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    return manifest


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output-dir", type=Path, default=Path(__file__).parent / "outputs",
        help="Directory for regenerated numeric results and plots.",
    )
    args = parser.parse_args()
    manifest = run(args.output_dir)
    print(
        "PASS: generated "
        f"{manifest['case_count']} finite toy cases in {args.output_dir}; "
        "this is not a portal-feasibility result."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
