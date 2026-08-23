#!/usr/bin/env python3
"""NEREID finite mode-envelope and supervisor test suite.

This is a deterministic research-screening model for an uncrewed common safety
capsule fitted with ONE kit at a time. It is not a flight-dynamics, pressure-
hull, vessel-stability, roadworthiness, vehicle-control, or certification tool.

Usage:
  python3 nereid_mode_envelopes.py --output-dir outputs/nereid
"""
from __future__ import annotations

import argparse
import json
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Dict

import matplotlib.pyplot as plt
import numpy as np

G = 9.80665
RHO_WATER = 1000.0


@dataclass(frozen=True)
class NereidConfig:
    road_mass_kg: float = 850.0
    road_grade: float = 0.10
    road_acceleration_mps2: float = 0.55
    road_rolling_resistance: float = 0.02
    road_nominal_mu: float = 0.70
    road_negative_mu: float = 0.10
    road_required_margin_fraction: float = 0.20

    flight_mass_kg: float = 960.0
    flight_lift_units: int = 8
    flight_unit_static_thrust_n: float = 1600.0
    flight_min_twr: float = 1.30

    surface_mass_kg: float = 820.0
    surface_nominal_displacement_m3: float = 1.15
    surface_negative_displacement_m3: float = 0.98
    surface_min_reserve_n: float = 2000.0
    surface_min_excess_volume_m3: float = 0.20

    sub_mass_kg: float = 860.0
    sub_nominal_volume_m3: float = 1.05
    sub_negative_volume_m3: float = 0.96
    sub_downward_drag_allowance_n: float = 300.0
    sub_min_upward_reserve_n: float = 1000.0
    sub_quadratic_drag_n_per_mps2: float = 420.0
    sub_duration_s: float = 2.0
    sub_time_step_s: float = 0.002
    numerical_tolerance_fraction: float = 0.01


def road_screen(config: NereidConfig, friction_coefficient: float) -> Dict[str, float | bool]:
    """Screen a declared low-speed force demand against a tire-force proxy."""
    theta = np.arctan(config.road_grade)
    normal_force = config.road_mass_kg * G * np.cos(theta)
    available_force = friction_coefficient * normal_force
    required_force = (
        config.road_mass_kg * config.road_acceleration_mps2
        + config.road_mass_kg * G * np.sin(theta)
        + config.road_rolling_resistance * normal_force
    )
    margin = (available_force - required_force) / required_force
    return {
        "friction_coefficient": friction_coefficient,
        "available_traction_force_n": available_force,
        "declared_force_demand_n": required_force,
        "force_margin_fraction": margin,
        "passes": margin >= config.road_required_margin_fraction,
    }


def flight_screen(config: NereidConfig, available_units: int) -> Dict[str, float | int | bool]:
    """Screen only static lift accounting; no aerodynamic or flight-control claim."""
    total_thrust = available_units * config.flight_unit_static_thrust_n
    weight = config.flight_mass_kg * G
    twr = total_thrust / weight
    return {
        "available_lift_units": available_units,
        "total_static_thrust_n": total_thrust,
        "weight_n": weight,
        "thrust_to_weight_ratio": twr,
        "passes": twr >= config.flight_min_twr,
    }


def water_screen(mass_kg: float, displacement_m3: float, threshold_n: float, volume_threshold_m3: float) -> Dict[str, float | bool]:
    buoyancy = RHO_WATER * displacement_m3 * G
    weight = mass_kg * G
    reserve = buoyancy - weight
    excess_volume = displacement_m3 - mass_kg / RHO_WATER
    return {
        "mass_kg": mass_kg,
        "displacement_m3": displacement_m3,
        "buoyancy_force_n": buoyancy,
        "weight_n": weight,
        "reserve_force_n": reserve,
        "excess_displacement_volume_m3": excess_volume,
        "passes_reserve": reserve >= threshold_n,
        "passes_excess_volume": excess_volume >= volume_threshold_m3,
        "passes": reserve >= threshold_n and excess_volume >= volume_threshold_m3,
    }


def recovery_rhs(velocity_mps: float, config: NereidConfig, volume_m3: float) -> float:
    buoyancy = RHO_WATER * volume_m3 * G
    weight = config.sub_mass_kg * G
    drag = config.sub_quadratic_drag_n_per_mps2 * velocity_mps * abs(velocity_mps)
    return (buoyancy - weight - config.sub_downward_drag_allowance_n - drag) / config.sub_mass_kg


def submersion_recovery(config: NereidConfig, volume_m3: float, time_step_s: float | None = None) -> Dict[str, object]:
    """Integrate a simplified normal propulsion-loss upward response in a basin."""
    dt = time_step_s or config.sub_time_step_s
    count = int(round(config.sub_duration_s / dt)) + 1
    time_s = np.linspace(0.0, config.sub_duration_s, count)
    velocity = np.zeros(count)
    displacement = np.zeros(count)
    for index in range(count - 1):
        state_v = velocity[index]
        # RK4 for v and trapezoidal displacement update.
        k1 = recovery_rhs(state_v, config, volume_m3)
        k2 = recovery_rhs(state_v + 0.5 * dt * k1, config, volume_m3)
        k3 = recovery_rhs(state_v + 0.5 * dt * k2, config, volume_m3)
        k4 = recovery_rhs(state_v + dt * k3, config, volume_m3)
        next_v = state_v + dt * (k1 + 2 * k2 + 2 * k3 + k4) / 6.0
        velocity[index + 1] = next_v
        displacement[index + 1] = displacement[index] + 0.5 * dt * (state_v + next_v)

    static = water_screen(config.sub_mass_kg, volume_m3, 0.0, 0.0)
    upward_reserve = float(static["reserve_force_n"]) - config.sub_downward_drag_allowance_n
    return {
        "time_s": time_s,
        "velocity_mps": velocity,
        "displacement_m": displacement,
        "volume_m3": volume_m3,
        "upward_reserve_n": upward_reserve,
        "terminal_velocity_proxy_mps": float(velocity[-1]),
        "upward_displacement_proxy_m": float(displacement[-1]),
        "passes": upward_reserve >= config.sub_min_upward_reserve_n and float(velocity[-1]) > 0.0,
    }


def supervisor_state(mode: str, signals: Dict[str, bool], unsafe_ignore_secondary_lock: bool = False) -> str:
    """Fail-closed supervisor. It is an abstract interface-state checker only."""
    common = signals["lock_primary"] and signals["mode_controller"] and signals["reserve_low_voltage"]
    secondary = True if unsafe_ignore_secondary_lock else signals["lock_secondary"]
    if not common or not secondary:
        return "DENY_LOCK_OR_CONTROLLER"
    if not signals["environment_permit"]:
        return "DENY_ENVIRONMENT"
    if not signals["energy_margin"]:
        return "DENY_ENERGY"
    if mode in {"surface", "submersion"} and not signals["leak_monitor"]:
        return "RECOVERY_WATER_INTEGRITY"
    if mode == "submersion" and not signals["positive_ascent_reserve"]:
        return "RECOVERY_ASCENT"
    return "ADMIT_MODE"


def fault_matrix(unsafe_ignore_secondary_lock: bool = False) -> Dict[str, object]:
    modes = ("road", "flight", "surface", "submersion")
    baseline = {
        "lock_primary": True,
        "lock_secondary": True,
        "mode_controller": True,
        "reserve_low_voltage": True,
        "leak_monitor": True,
        "energy_margin": True,
        "environment_permit": True,
        "positive_ascent_reserve": True,
    }
    relevant_faults = {
        "road": ("lock_primary", "lock_secondary", "mode_controller", "reserve_low_voltage", "energy_margin", "environment_permit"),
        "flight": ("lock_primary", "lock_secondary", "mode_controller", "reserve_low_voltage", "energy_margin", "environment_permit"),
        "surface": ("lock_primary", "lock_secondary", "mode_controller", "reserve_low_voltage", "leak_monitor", "energy_margin", "environment_permit"),
        "submersion": ("lock_primary", "lock_secondary", "mode_controller", "reserve_low_voltage", "leak_monitor", "energy_margin", "environment_permit", "positive_ascent_reserve"),
    }
    rows: list[Dict[str, str | bool]] = []
    for mode in modes:
        for fault in relevant_faults[mode]:
            signals = dict(baseline)
            signals[fault] = False
            state = supervisor_state(mode, signals, unsafe_ignore_secondary_lock)
            rows.append({
                "mode": mode,
                "fault": fault,
                "state": state,
                "unsafe_admission": state == "ADMIT_MODE",
                "fail_closed": state != "ADMIT_MODE",
            })
    unsafe = [row for row in rows if row["unsafe_admission"]]
    return {"rows": rows, "unsafe_admissions": len(unsafe), "passes": len(unsafe) == 0}


def plot_envelopes(output_dir: Path, results: Dict[str, object], sub_nominal: Dict[str, object], sub_negative: Dict[str, object]) -> None:
    plt.style.use("seaborn-v0_8-whitegrid")
    figure, axes = plt.subplots(1, 2, figsize=(13.5, 4.8))

    labels = ["Road\nmargin", "Flight\nT/W", "Surface\nreserve", "Submersion\nreserve"]
    nominal = [
        float(results["road_nominal"]["force_margin_fraction"]),
        float(results["flight_nominal"]["thrust_to_weight_ratio"]),
        float(results["surface_nominal"]["reserve_force_n"]) / 1000.0,
        float(sub_nominal["upward_reserve_n"]) / 1000.0,
    ]
    negative = [
        float(results["road_negative_control"]["force_margin_fraction"]),
        float(results["flight_single_unit_loss"]["thrust_to_weight_ratio"]),
        float(results["surface_negative_control"]["reserve_force_n"]) / 1000.0,
        float(sub_negative["upward_reserve_n"]) / 1000.0,
    ]
    x = np.arange(len(labels))
    width = 0.36
    axes[0].bar(x - width / 2, nominal, width, label="nominal", color="#236b58")
    axes[0].bar(x + width / 2, negative, width, label="negative control", color="#b65d4d")
    axes[0].set_xticks(x, labels)
    axes[0].set_title("Mode-specific screening metrics\n(unlike quantities are normalized or reported in kN)")
    axes[0].set_ylabel("Declared screening metric")
    axes[0].legend()

    axes[1].plot(sub_nominal["time_s"], sub_nominal["velocity_mps"], label="nominal recovery", color="#236b58", linewidth=2)
    axes[1].plot(sub_negative["time_s"], sub_negative["velocity_mps"], label="reduced reserve volume", color="#b65d4d", linewidth=2)
    axes[1].axhline(0.0, color="#333", linewidth=0.8)
    axes[1].set_title("Simplified uncrewed basin recovery proxy")
    axes[1].set_xlabel("Time (s)")
    axes[1].set_ylabel("Upward velocity proxy (m/s)")
    axes[1].legend()
    figure.suptitle("NEREID — finite one-kit-at-a-time screening suite", y=1.02, fontsize=14)
    figure.tight_layout()
    figure.savefig(output_dir / "nereid_mode_envelopes.png", dpi=180, bbox_inches="tight")
    plt.close(figure)


def relative_difference(reference: float, comparison: float) -> float:
    return abs(reference - comparison) / max(abs(reference), 1e-12)


def json_default(value: object) -> object:
    if isinstance(value, np.generic):
        return value.item()
    raise TypeError(f"Unsupported JSON value: {type(value)!r}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", default="outputs/nereid", help="Directory for JSON and PNG results.")
    args = parser.parse_args()
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    config = NereidConfig()

    sub_nominal = submersion_recovery(config, config.sub_nominal_volume_m3)
    sub_negative = submersion_recovery(config, config.sub_negative_volume_m3)
    sub_fine = submersion_recovery(config, config.sub_nominal_volume_m3, config.sub_time_step_s / 2.0)
    sensitivity = relative_difference(float(sub_nominal["terminal_velocity_proxy_mps"]), float(sub_fine["terminal_velocity_proxy_mps"]))

    safeguarded_faults = fault_matrix(False)
    unsafe_faults = fault_matrix(True)
    results: Dict[str, object] = {
        "config": asdict(config),
        "road_nominal": road_screen(config, config.road_nominal_mu),
        "road_negative_control": road_screen(config, config.road_negative_mu),
        "flight_nominal": flight_screen(config, config.flight_lift_units),
        "flight_single_unit_loss": flight_screen(config, config.flight_lift_units - 1),
        "surface_nominal": water_screen(config.surface_mass_kg, config.surface_nominal_displacement_m3, config.surface_min_reserve_n, config.surface_min_excess_volume_m3),
        "surface_negative_control": water_screen(config.surface_mass_kg, config.surface_negative_displacement_m3, config.surface_min_reserve_n, config.surface_min_excess_volume_m3),
        "submersion_nominal": {key: value for key, value in sub_nominal.items() if key not in {"time_s", "velocity_mps", "displacement_m"}},
        "submersion_negative_control": {key: value for key, value in sub_negative.items() if key not in {"time_s", "velocity_mps", "displacement_m"}},
        "fault_matrix_safeguarded": safeguarded_faults,
        "fault_matrix_negative_control": unsafe_faults,
        "time_step_sensitivity": {
            "coarse_time_step_s": config.sub_time_step_s,
            "fine_time_step_s": config.sub_time_step_s / 2.0,
            "coarse_terminal_velocity_proxy_mps": sub_nominal["terminal_velocity_proxy_mps"],
            "fine_terminal_velocity_proxy_mps": sub_fine["terminal_velocity_proxy_mps"],
            "relative_difference": sensitivity,
            "passes": sensitivity < config.numerical_tolerance_fraction,
        },
    }
    results["overall"] = {
        "road_nominal_passes": bool(results["road_nominal"]["passes"]),
        "road_negative_control_is_distinguishable": not bool(results["road_negative_control"]["passes"]),
        "flight_nominal_passes": bool(results["flight_nominal"]["passes"]),
        "flight_loss_control_is_distinguishable": not bool(results["flight_single_unit_loss"]["passes"]),
        "surface_nominal_passes": bool(results["surface_nominal"]["passes"]),
        "surface_negative_control_is_distinguishable": not bool(results["surface_negative_control"]["passes"]),
        "submersion_nominal_passes": bool(sub_nominal["passes"]),
        "submersion_negative_control_is_distinguishable": not bool(sub_negative["passes"]),
        "safeguarded_fault_matrix_passes": bool(safeguarded_faults["passes"]),
        "fault_matrix_negative_control_is_distinguishable": not bool(unsafe_faults["passes"]),
        "time_step_check_passes": sensitivity < config.numerical_tolerance_fraction,
    }
    results["model_scope"] = (
        "Finite, deterministic, one-kit-at-a-time research-screening evidence only. It is not a vehicle architecture release, "
        "flight, road, vessel, pressure-hull, public-operation, or safety-certification result."
    )
    (output_dir / "nereid_mode_envelopes_summary.json").write_text(json.dumps(results, indent=2, default=json_default) + "\n")
    plot_envelopes(output_dir, results, sub_nominal, sub_negative)
    print(json.dumps(results["overall"], indent=2))


if __name__ == "__main__":
    main()
