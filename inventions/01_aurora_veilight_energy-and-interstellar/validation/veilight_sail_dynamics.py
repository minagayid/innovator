#!/usr/bin/env python3
"""VEILIGHT laboratory sail-coupon dynamics model.

This deterministic script models a low-power laboratory coupon only. It does
not design a high-power optical array, estimate an interstellar trajectory,
calculate a target velocity, or certify beam safety. Restoring and damping
terms are phenomenological parameters to be measured in a physical coupon test.

Usage:
    python3 veilight_sail_dynamics.py --output-dir outputs/veilight
"""
from __future__ import annotations

import argparse
import json
from dataclasses import asdict, dataclass, replace
from pathlib import Path
from typing import Dict

import matplotlib.pyplot as plt
import numpy as np

C_LIGHT = 299_792_458.0
SIGMA = 5.670_374_419e-8


@dataclass(frozen=True)
class SailConfig:
    duration_s: float = 90.0
    time_step_s: float = 0.01
    optical_power_w: float = 1.2
    reflectance: float = 0.995
    absorptance: float = 5e-4
    emissivity: float = 0.75
    area_m2: float = 3.0e-3
    mass_kg: float = 3.0e-4
    thermal_capacity_j_per_k: float = 0.20
    environment_temperature_k: float = 295.0
    initial_temperature_k: float = 295.0
    initial_offset_m: float = 0.010
    initial_velocity_m_per_s: float = 0.0
    restoring_gain_n_per_m: float = 2.2e-5
    damping_n_s_per_m: float = 1.8e-5
    temperature_limit_k: float = 450.0
    endpoint_fraction_limit: float = 0.50
    numerical_tolerance_fraction: float = 0.01


def rhs(state: np.ndarray, config: SailConfig) -> np.ndarray:
    x, velocity, temperature = state
    photon_force = 2.0 * config.reflectance * config.optical_power_w / C_LIGHT
    # The forward component is reported for accounting. Lateral terms are a
    # deliberately abstract low-power coupon model, not a metasurface design.
    lateral_force = -config.restoring_gain_n_per_m * x - config.damping_n_s_per_m * velocity
    acceleration = lateral_force / config.mass_kg
    radiative_loss = config.emissivity * SIGMA * config.area_m2 * (temperature**4 - config.environment_temperature_k**4)
    temperature_rate = (config.absorptance * config.optical_power_w - radiative_loss) / config.thermal_capacity_j_per_k
    return np.array([velocity, acceleration, temperature_rate, photon_force], dtype=float)


def step_rk4(state: np.ndarray, config: SailConfig) -> np.ndarray:
    dt = config.time_step_s
    # Only the first three values are dynamic. Forward photon force is recomputed
    # deterministically for reporting and therefore excluded from integration.
    def f(dynamic: np.ndarray) -> np.ndarray:
        full_state = np.array([dynamic[0], dynamic[1], dynamic[2]])
        return rhs(full_state, config)[:3]

    dynamic = state[:3]
    k1 = f(dynamic)
    k2 = f(dynamic + 0.5 * dt * k1)
    k3 = f(dynamic + 0.5 * dt * k2)
    k4 = f(dynamic + dt * k3)
    next_dynamic = dynamic + dt * (k1 + 2 * k2 + 2 * k3 + k4) / 6.0
    forward_force = 2.0 * config.reflectance * config.optical_power_w / C_LIGHT
    return np.array([next_dynamic[0], next_dynamic[1], next_dynamic[2], forward_force])


def run(config: SailConfig) -> tuple[np.ndarray, np.ndarray]:
    steps = int(round(config.duration_s / config.time_step_s)) + 1
    time_s = np.linspace(0.0, config.duration_s, steps)
    states = np.empty((steps, 4), dtype=float)
    states[0] = [config.initial_offset_m, config.initial_velocity_m_per_s, config.initial_temperature_k, 0.0]
    states[0, 3] = 2.0 * config.reflectance * config.optical_power_w / C_LIGHT
    for index in range(steps - 1):
        states[index + 1] = step_rk4(states[index], config)
    return time_s, states


def scenario(base: SailConfig, name: str, time_step_s: float | None = None) -> SailConfig:
    values = asdict(base)
    if time_step_s is not None:
        values["time_step_s"] = time_step_s
    if name == "flat_specular_control":
        values["restoring_gain_n_per_m"] = 0.0
        values["damping_n_s_per_m"] = 0.0
    elif name == "candidate_restoring_coupon":
        pass
    elif name == "thermal_negative_control":
        values["optical_power_w"] = 5.0
        values["absorptance"] = 0.95
        values["emissivity"] = 0.01
        values["thermal_capacity_j_per_k"] = 0.01
    else:
        raise ValueError(f"Unknown scenario: {name}")
    return SailConfig(**values)


def assessment(config: SailConfig, states: np.ndarray) -> Dict[str, object]:
    max_offset = float(np.max(np.abs(states[:, 0])))
    final_offset = float(abs(states[-1, 0]))
    maximum_temperature = float(states[:, 2].max())
    photon_force = float(states[0, 3])
    return {
        "forward_photon_force_n": photon_force,
        "initial_offset_m": config.initial_offset_m,
        "peak_abs_offset_m": max_offset,
        "final_abs_offset_m": final_offset,
        "max_temperature_k": maximum_temperature,
        "endpoint_ratio": final_offset / abs(config.initial_offset_m),
        "passes_temperature": maximum_temperature < config.temperature_limit_k,
        "passes_endpoint": final_offset < config.endpoint_fraction_limit * abs(config.initial_offset_m),
    }


def plot(output_dir: Path, time_s: np.ndarray, results: Dict[str, tuple[SailConfig, np.ndarray]]) -> None:
    plt.style.use("seaborn-v0_8-whitegrid")
    figure, axes = plt.subplots(1, 2, figsize=(13, 4.8))
    colors = {"flat_specular_control": "#8b5e3c", "candidate_restoring_coupon": "#155d75", "thermal_negative_control": "#a43d3d"}
    for name, (config, states) in results.items():
        label = name.replace("_", " ").title()
        axes[0].plot(time_s, states[:, 0] * 1_000, label=label, color=colors[name], linewidth=1.8)
        axes[1].plot(time_s, states[:, 2], label=label, color=colors[name], linewidth=1.8)
    axes[0].axhline(0.0, color="#333", linewidth=0.8)
    axes[0].set_title("Lateral-offset response")
    axes[0].set_xlabel("Time (s)")
    axes[0].set_ylabel("Offset (mm)")
    axes[1].axhline(SailConfig().temperature_limit_k, color="#a43d3d", linestyle=":", label="temperature limit")
    axes[1].set_title("Radiative thermal balance")
    axes[1].set_xlabel("Time (s)")
    axes[1].set_ylabel("Coupon temperature (K)")
    for axis in axes:
        axis.legend(fontsize=8)
    figure.suptitle("VEILIGHT — low-power laboratory coupon model", y=1.02, fontsize=14)
    figure.tight_layout()
    figure.savefig(output_dir / "veilight_sail_dynamics.png", dpi=180, bbox_inches="tight")
    plt.close(figure)


def relative_difference(first: float, second: float) -> float:
    return abs(first - second) / max(abs(first), 1e-12)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", default="outputs/veilight", help="Directory for JSON and PNG results.")
    args = parser.parse_args()
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    base = SailConfig()
    names = ("flat_specular_control", "candidate_restoring_coupon", "thermal_negative_control")
    data: Dict[str, Dict[str, object]] = {}
    plotted: Dict[str, tuple[SailConfig, np.ndarray]] = {}
    time_reference: np.ndarray | None = None
    for name in names:
        config = scenario(base, name)
        time_s, states = run(config)
        time_reference = time_s
        data[name] = {"config": asdict(config), "assessment": assessment(config, states)}
        plotted[name] = (config, states)

    fine = scenario(base, "candidate_restoring_coupon", time_step_s=base.time_step_s / 2.0)
    _, fine_states = run(fine)
    coarse_peak = float(np.max(np.abs(plotted["candidate_restoring_coupon"][1][:, 0])))
    fine_peak = float(np.max(np.abs(fine_states[:, 0])))
    sensitivity = relative_difference(coarse_peak, fine_peak)
    candidate = data["candidate_restoring_coupon"]["assessment"]
    flat = data["flat_specular_control"]["assessment"]
    thermal_negative = data["thermal_negative_control"]["assessment"]
    data["time_step_sensitivity"] = {
        "coarse_time_step_s": base.time_step_s,
        "fine_time_step_s": fine.time_step_s,
        "coarse_peak_offset_m": coarse_peak,
        "fine_peak_offset_m": fine_peak,
        "relative_difference": sensitivity,
        "passes": sensitivity < base.numerical_tolerance_fraction,
    }
    data["overall"] = {
        "candidate_recovers_relative_to_initial_offset": bool(candidate["passes_endpoint"]),
        "candidate_stays_within_flat_control_envelope": bool(candidate["peak_abs_offset_m"] <= flat["peak_abs_offset_m"] * 1.10),
        "candidate_thermal_check_passes": bool(candidate["passes_temperature"]),
        "thermal_negative_control_is_distinguishable": not bool(thermal_negative["passes_temperature"]),
        "time_step_check_passes": data["time_step_sensitivity"]["passes"],
    }
    data["model_scope"] = (
        "Finite low-power laboratory coupon evidence only. It is not a high-power optical-array, "
        "spacecraft mission, materials qualification, beam-safety, or interstellar-trajectory model."
    )
    (output_dir / "veilight_sail_dynamics_summary.json").write_text(json.dumps(data, indent=2) + "\n")
    if time_reference is None:
        raise RuntimeError("No simulation results were generated.")
    plot(output_dir, time_reference, plotted)
    print(json.dumps(data["overall"], indent=2))


if __name__ == "__main__":
    main()
