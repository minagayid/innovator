#!/usr/bin/env python3
"""AURORA thermal-containment validation model.

This is a deterministic, non-nuclear lumped-parameter demonstration model. It
contains no plasma, magnetic, neutron, tritium, radiation-damage, or reactor-
control calculation. It tests whether a specified local loss-of-flow surrogate
propagates through an abstract sector network.

Usage:
    python3 aurora_thermal_containment.py --output-dir outputs/aurora
"""
from __future__ import annotations

import argparse
import json
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Dict, Iterable

import matplotlib.pyplot as plt
import numpy as np


@dataclass(frozen=True)
class AuroraConfig:
    sectors: int = 4
    duration_s: float = 1800.0
    time_step_s: float = 0.5
    coolant_temperature_k: float = 300.0
    initial_temperature_k: float = 330.0
    heat_input_w: float = 5_000.0
    heat_capacity_j_per_k: float = 180_000.0
    nominal_conductance_w_per_k: float = 210.0
    cross_coupling_w_per_k: float = 4.0
    fault_sector: int = 1
    fault_start_s: float = 300.0
    fault_conductance_factor: float = 0.18
    common_conductance_factor: float = 1.0
    unfaulted_max_temperature_k: float = 360.0
    any_sector_max_temperature_k: float = 430.0
    numerical_tolerance_fraction: float = 0.01


def make_coupling_matrix(sectors: int, coupling: float) -> np.ndarray:
    """Return nearest-neighbour thermal coupling on a closed ring."""
    matrix = np.zeros((sectors, sectors), dtype=float)
    for i in range(sectors):
        for neighbour in ((i - 1) % sectors, (i + 1) % sectors):
            matrix[i, neighbour] += coupling
    return matrix


def conductance_schedule(config: AuroraConfig, time_s: float) -> np.ndarray:
    conductance = np.full(config.sectors, config.nominal_conductance_w_per_k)
    if time_s >= config.fault_start_s:
        conductance *= config.common_conductance_factor
        conductance[config.fault_sector] *= config.fault_conductance_factor
    return conductance


def rhs(temperatures: np.ndarray, time_s: float, config: AuroraConfig, coupling: np.ndarray) -> np.ndarray:
    conductance = conductance_schedule(config, time_s)
    removal = conductance * (temperatures - config.coolant_temperature_k)
    cross_flow = np.zeros(config.sectors, dtype=float)
    for i in range(config.sectors):
        cross_flow[i] = np.sum(coupling[i] * (temperatures - temperatures[i]))
    return (config.heat_input_w - removal + cross_flow) / config.heat_capacity_j_per_k


def run_simulation(config: AuroraConfig) -> tuple[np.ndarray, np.ndarray]:
    steps = int(round(config.duration_s / config.time_step_s)) + 1
    time_s = np.linspace(0.0, config.duration_s, steps)
    temperatures = np.empty((steps, config.sectors), dtype=float)
    temperatures[0] = config.initial_temperature_k
    coupling = make_coupling_matrix(config.sectors, config.cross_coupling_w_per_k)
    for index in range(steps - 1):
        t = time_s[index]
        state = temperatures[index]
        dt = config.time_step_s
        # Classical RK4 retains deterministic accuracy without hidden solver state.
        k1 = rhs(state, t, config, coupling)
        k2 = rhs(state + 0.5 * dt * k1, t + 0.5 * dt, config, coupling)
        k3 = rhs(state + 0.5 * dt * k2, t + 0.5 * dt, config, coupling)
        k4 = rhs(state + dt * k3, t + dt, config, coupling)
        temperatures[index + 1] = state + dt * (k1 + 2 * k2 + 2 * k3 + k4) / 6.0
    return time_s, temperatures


def scenario_config(base: AuroraConfig, name: str, time_step_s: float | None = None) -> AuroraConfig:
    values = asdict(base)
    if time_step_s is not None:
        values["time_step_s"] = time_step_s
    if name == "nominal_control":
        values["fault_start_s"] = values["duration_s"] + 1.0
    elif name == "sector_isolated_fault":
        pass
    elif name == "common_cooling_negative_control":
        values["common_conductance_factor"] = 0.05
        values["fault_conductance_factor"] = 1.0
    else:
        raise ValueError(f"Unknown scenario: {name}")
    return AuroraConfig(**values)


def evaluate(config: AuroraConfig, temperatures: np.ndarray) -> Dict[str, object]:
    maxima = temperatures.max(axis=0)
    nonfaulted_indices = [i for i in range(config.sectors) if i != config.fault_sector]
    nonfaulted_maximum = float(maxima[nonfaulted_indices].max())
    any_maximum = float(maxima.max())
    return {
        "max_temperature_by_sector_k": [round(float(value), 5) for value in maxima],
        "unfaulted_sector_max_temperature_k": round(nonfaulted_maximum, 5),
        "any_sector_max_temperature_k": round(any_maximum, 5),
        "unfaulted_margin_k": round(config.unfaulted_max_temperature_k - nonfaulted_maximum, 5),
        "any_sector_margin_k": round(config.any_sector_max_temperature_k - any_maximum, 5),
        "passes_unfaulted_limit": nonfaulted_maximum < config.unfaulted_max_temperature_k,
        "passes_any_sector_limit": any_maximum < config.any_sector_max_temperature_k,
    }


def plot_results(output_dir: Path, time_s: np.ndarray, scenarios: Dict[str, tuple[AuroraConfig, np.ndarray]]) -> None:
    plt.style.use("seaborn-v0_8-whitegrid")
    figure, axes = plt.subplots(1, 3, figsize=(18, 5), sharey=True)
    for axis, (name, (config, temperatures)) in zip(axes, scenarios.items()):
        for sector in range(config.sectors):
            label = f"Sector {sector + 1}" + (" (faulted)" if sector == config.fault_sector else "")
            axis.plot(time_s / 60.0, temperatures[:, sector], label=label, linewidth=1.7)
        axis.axvline(config.fault_start_s / 60.0, color="#bb6b2a", linestyle="--", linewidth=1.2, label="fault onset")
        axis.axhline(config.unfaulted_max_temperature_k, color="#287a63", linestyle=":", label="unfaulted limit")
        axis.axhline(config.any_sector_max_temperature_k, color="#a42e2e", linestyle=":", label="any-sector limit")
        axis.set_title(name.replace("_", " ").title())
        axis.set_xlabel("Time (min)")
    axes[0].set_ylabel("Abstract sector temperature (K)")
    handles, labels = axes[-1].get_legend_handles_labels()
    figure.legend(handles, labels, loc="lower center", ncol=4, bbox_to_anchor=(0.5, -0.08))
    figure.suptitle("AURORA — deterministic non-nuclear thermal-containment scenarios", y=1.02, fontsize=14)
    figure.tight_layout()
    figure.savefig(output_dir / "aurora_thermal_containment.png", dpi=180, bbox_inches="tight")
    plt.close(figure)


def relative_difference(reference: float, comparison: float) -> float:
    return abs(reference - comparison) / max(abs(reference), 1e-12)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", default="outputs/aurora", help="Directory for JSON and PNG results.")
    args = parser.parse_args()

    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    base = AuroraConfig()
    names: Iterable[str] = ("nominal_control", "sector_isolated_fault", "common_cooling_negative_control")
    results: Dict[str, Dict[str, object]] = {}
    plot_scenarios: Dict[str, tuple[AuroraConfig, np.ndarray]] = {}
    time_reference: np.ndarray | None = None

    for name in names:
        config = scenario_config(base, name)
        time_s, temperatures = run_simulation(config)
        time_reference = time_s
        assessment = evaluate(config, temperatures)
        results[name] = {"config": asdict(config), "assessment": assessment}
        plot_scenarios[name] = (config, temperatures)

    fine_config = scenario_config(base, "sector_isolated_fault", time_step_s=base.time_step_s / 2.0)
    _, fine_temperatures = run_simulation(fine_config)
    coarse_peak = float(plot_scenarios["sector_isolated_fault"][1].max())
    fine_peak = float(fine_temperatures.max())
    sensitivity = relative_difference(coarse_peak, fine_peak)
    results["time_step_sensitivity"] = {
        "coarse_time_step_s": base.time_step_s,
        "fine_time_step_s": fine_config.time_step_s,
        "coarse_peak_k": round(coarse_peak, 8),
        "fine_peak_k": round(fine_peak, 8),
        "relative_difference": round(sensitivity, 10),
        "passes": sensitivity < base.numerical_tolerance_fraction,
    }
    results["model_scope"] = (
        "Finite, deterministic, non-nuclear lumped-parameter evidence only. "
        "It is not a reactor, blanket, plasma, magnetic-field, or safety-certification model."
    )
    results["overall"] = {
        "isolated_fault_passes_temperature_checks": bool(
            results["sector_isolated_fault"]["assessment"]["passes_unfaulted_limit"]
            and results["sector_isolated_fault"]["assessment"]["passes_any_sector_limit"]
        ),
        "negative_control_is_distinguishable": not bool(
            results["common_cooling_negative_control"]["assessment"]["passes_unfaulted_limit"]
            and results["common_cooling_negative_control"]["assessment"]["passes_any_sector_limit"]
        ),
        "time_step_check_passes": results["time_step_sensitivity"]["passes"],
    }
    (output_dir / "aurora_thermal_containment_summary.json").write_text(json.dumps(results, indent=2) + "\n")
    if time_reference is None:
        raise RuntimeError("No simulation results were generated.")
    plot_results(output_dir, time_reference, plot_scenarios)
    print(json.dumps(results["overall"], indent=2))


if __name__ == "__main__":
    main()
