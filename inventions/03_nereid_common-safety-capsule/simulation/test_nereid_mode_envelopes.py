#!/usr/bin/env python3
"""Regression checks for the bounded NEREID finite scenario suite."""
from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from nereid_mode_envelopes import supervisor_state

ROOT = Path(__file__).resolve().parent


class NereidModeEnvelopeTests(unittest.TestCase):
    def test_all_declared_checks_and_controls(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory)
            subprocess.run(
                [sys.executable, str(ROOT / "nereid_mode_envelopes.py"), "--output-dir", str(output)],
                check=True,
                cwd=ROOT,
                capture_output=True,
                text=True,
            )
            summary = json.loads((output / "nereid_mode_envelopes_summary.json").read_text())
        expected = {
            "road_nominal_passes",
            "road_negative_control_is_distinguishable",
            "flight_nominal_passes",
            "flight_loss_control_is_distinguishable",
            "surface_nominal_passes",
            "surface_negative_control_is_distinguishable",
            "submersion_nominal_passes",
            "submersion_negative_control_is_distinguishable",
            "safeguarded_fault_matrix_passes",
            "fault_matrix_negative_control_is_distinguishable",
            "time_step_check_passes",
        }
        self.assertEqual(set(summary["overall"]), expected)
        self.assertTrue(all(summary["overall"].values()))
        self.assertGreater(summary["fault_matrix_negative_control"]["unsafe_admissions"], 0)
        self.assertEqual(summary["fault_matrix_safeguarded"]["unsafe_admissions"], 0)

    def test_active_interlock_failure_is_separate_from_pre_entry_denial(self) -> None:
        signals = {
            "lock_primary": False,
            "lock_secondary": True,
            "mode_controller": True,
            "reserve_low_voltage": True,
            "leak_monitor": True,
            "energy_margin": True,
            "environment_permit": True,
            "positive_ascent_reserve": True,
        }
        self.assertEqual(supervisor_state("submersion", signals, phase="pre_entry"), "DENY_LOCK_OR_CONTROLLER")
        self.assertEqual(supervisor_state("submersion", signals, phase="active"), "RECOVERY_REQUIRED_NO_ACTION_VALIDATED")

    def test_ascent_reserve_failure_denies_entry_and_does_not_claim_recovery(self) -> None:
        signals = {
            "lock_primary": True,
            "lock_secondary": True,
            "mode_controller": True,
            "reserve_low_voltage": True,
            "leak_monitor": True,
            "energy_margin": True,
            "environment_permit": True,
            "positive_ascent_reserve": False,
        }
        self.assertEqual(supervisor_state("submersion", signals, phase="pre_entry"), "DENY_ASCENT_RESERVE")
        self.assertEqual(supervisor_state("submersion", signals, phase="active"), "RECOVERY_REQUIRED_NO_ACTION_VALIDATED")


if __name__ == "__main__":
    unittest.main()
