#!/usr/bin/env python3
"""Regression checks for the bounded AURORA and VEILIGHT validation models."""
from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent


class ValidationModelTests(unittest.TestCase):
    def run_model(self, script_name: str, summary_name: str) -> dict:
        with tempfile.TemporaryDirectory() as temp_dir:
            output = Path(temp_dir)
            subprocess.run(
                [sys.executable, str(ROOT / script_name), "--output-dir", str(output)],
                check=True,
                cwd=ROOT,
                capture_output=True,
                text=True,
            )
            return json.loads((output / summary_name).read_text())

    def test_aurora_controls_and_time_step_check(self) -> None:
        summary = self.run_model("aurora_thermal_containment.py", "aurora_thermal_containment_summary.json")
        self.assertTrue(summary["overall"]["isolated_fault_passes_temperature_checks"])
        self.assertTrue(summary["overall"]["negative_control_is_distinguishable"])
        self.assertTrue(summary["overall"]["time_step_check_passes"])

    def test_veilight_controls_and_time_step_check(self) -> None:
        summary = self.run_model("veilight_sail_dynamics.py", "veilight_sail_dynamics_summary.json")
        self.assertTrue(summary["overall"]["candidate_recovers_relative_to_initial_offset"])
        self.assertTrue(summary["overall"]["candidate_stays_within_flat_control_envelope"])
        self.assertTrue(summary["overall"]["candidate_thermal_check_passes"])
        self.assertTrue(summary["overall"]["thermal_negative_control_is_distinguishable"])
        self.assertTrue(summary["overall"]["time_step_check_passes"])


if __name__ == "__main__":
    unittest.main()
