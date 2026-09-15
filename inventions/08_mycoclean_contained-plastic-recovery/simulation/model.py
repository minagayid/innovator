"""Illustrative MYCO-CLEAN stream-allocation screen.

This is an accounting model, not a biological or deployment model. Parameters
are placeholders and must not be interpreted as field-ready values.
"""

from __future__ import annotations

import json
from pathlib import Path


SCENARIOS = {
    "nominal": {
        "input_kg_day": 1000.0,
        "capture_fraction": 0.90,
        "sort_fraction": 0.85,
        "conversion_fraction": 0.75,
        "product_recovery_fraction": 0.90,
        "energy_kwh_per_kg_accepted": 1.5,
    },
    "lower_recovery": {
        "input_kg_day": 1000.0,
        "capture_fraction": 0.75,
        "sort_fraction": 0.70,
        "conversion_fraction": 0.45,
        "product_recovery_fraction": 0.75,
        "energy_kwh_per_kg_accepted": 2.2,
    },
    "upper_recovery": {
        "input_kg_day": 1000.0,
        "capture_fraction": 0.95,
        "sort_fraction": 0.92,
        "conversion_fraction": 0.85,
        "product_recovery_fraction": 0.94,
        "energy_kwh_per_kg_accepted": 1.2,
    },
}


def calculate(p: dict[str, float]) -> dict[str, float]:
    fractions = (
        p["capture_fraction"],
        p["sort_fraction"],
        p["conversion_fraction"],
        p["product_recovery_fraction"],
    )
    if any(not 0.0 <= f <= 1.0 for f in fractions):
        raise ValueError("all process fractions must lie in [0, 1]")
    if p["input_kg_day"] < 0 or p["energy_kwh_per_kg_accepted"] < 0:
        raise ValueError("mass and energy parameters must be non-negative")

    input_mass = p["input_kg_day"]
    captured = input_mass * p["capture_fraction"]
    uncaptured = input_mass - captured
    accepted = captured * p["sort_fraction"]
    sorting_rejects = captured - accepted
    converted = accepted * p["conversion_fraction"]
    unconverted = accepted - converted
    product = converted * p["product_recovery_fraction"]
    product_recovery_losses = converted - product
    unrecovered = uncaptured + sorting_rejects + unconverted + product_recovery_losses
    return {
        "accounting_basis": "illustrative_stream_allocation_from_input_fractions; not measured closure",
        "input_kg_day": input_mass,
        "captured_kg_day": captured,
        "uncaptured_kg_day": uncaptured,
        "accepted_kg_day": accepted,
        "sorting_rejects_kg_day": sorting_rejects,
        "converted_kg_day": converted,
        "unconverted_kg_day": unconverted,
        "product_kg_day": product,
        "product_recovery_losses_kg_day": product_recovery_losses,
        "unrecovered_kg_day": unrecovered,
        "energy_kwh_day": accepted * p["energy_kwh_per_kg_accepted"],
    }


def build_summary() -> dict[str, object]:
    return {
        "model": "mycoclean_illustrative_stream_allocation",
        "parameter_status": "illustrative placeholders; not field-ready values",
        "scenarios": {name: calculate(params) for name, params in SCENARIOS.items()},
    }


if __name__ == "__main__":
    out = Path(__file__).parent / "outputs" / "mycoclean_mass_balance_summary.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(build_summary(), indent=2) + "\n", encoding="utf-8")
    print(out)

