"""Illustrative MEL-SHIELD areal-mass accounting.

The numbers are placeholders for software verification only. No radiation
attenuation or human-protection claim is computed.
"""

from __future__ import annotations

import json
from pathlib import Path


LAYERS = [
    {"name": "outer_skin", "thickness_m": 0.0015, "density_kg_m3": 1500.0},
    {"name": "melanin_composite", "thickness_m": 0.0020, "density_kg_m3": 1200.0},
    {"name": "hydrogen_rich_layer", "thickness_m": 0.0100, "density_kg_m3": 950.0},
    {"name": "neutron_management_layer", "thickness_m": 0.0010, "density_kg_m3": 1100.0},
]


def areal_mass(layers: list[dict[str, float]], thickness_scale: float = 1.0) -> float:
    if thickness_scale < 0:
        raise ValueError("thickness scale must be non-negative")
    total = 0.0
    for layer in layers:
        if layer["thickness_m"] < 0 or layer["density_kg_m3"] < 0:
            raise ValueError("thickness and density must be non-negative")
        total += layer["thickness_m"] * thickness_scale * layer["density_kg_m3"]
    return total


def build_summary(area_m2: float = 1.0) -> dict[str, object]:
    if area_m2 < 0:
        raise ValueError("area must be non-negative")
    base = areal_mass(LAYERS)
    return {
        "model": "melshield_illustrative_areal_mass",
        "parameter_status": "illustrative placeholders; no attenuation claim",
        "area_m2": area_m2,
        "layer_areal_mass_kg_m2": {
            layer["name"]: layer["thickness_m"] * layer["density_kg_m3"]
            for layer in LAYERS
        },
        "total_areal_mass_kg_m2": base,
        "total_mass_kg": area_m2 * base,
        "thickness_sensitivity": {
            str(scale): {"areal_mass_kg_m2": areal_mass(LAYERS, scale)}
            for scale in (0.5, 1.0, 2.0)
        },
    }


if __name__ == "__main__":
    out = Path(__file__).parent / "outputs" / "melshield_areal_mass_summary.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(build_summary(), indent=2) + "\n", encoding="utf-8")
    print(out)

