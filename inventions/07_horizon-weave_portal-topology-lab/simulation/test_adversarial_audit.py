#!/usr/bin/env python3
"""Regression tests for the independent shape and integrated-NEC audit."""
from __future__ import annotations

import math
import unittest

import adversarial_audit


class AdversarialAuditTests(unittest.TestCase):
    def test_analytic_integral_matches_manual_formula(self) -> None:
        value = adversarial_audit.analytic_volume_nec_debt(1.0, 1.0, 30.0)
        self.assertAlmostEqual(value, -(1.0 - 1.0 / 30.0), places=15)

    def test_integrated_nec_debt_is_negative(self) -> None:
        value = adversarial_audit.analytic_volume_nec_debt(2.0, 0.5, 30.0)
        self.assertLess(value, 0.0)
        self.assertTrue(math.isfinite(value))

    def test_shape_domain_is_horizon_free_outside_throat(self) -> None:
        check = adversarial_audit.shape_domain_check(1.0, 2.0, 30.0, 1001)
        self.assertEqual(check["ratio_at_throat"], 1.0)
        self.assertTrue(check["all_interior_strictly_below_one"])
        self.assertLess(check["max_ratio_interior"], 1.0)

    def test_quadrature_refines_toward_analytic_integral(self) -> None:
        expected = adversarial_audit.analytic_volume_nec_debt(1.0, 0.25, 30.0)
        coarse = adversarial_audit.numeric_volume_nec_debt(1.0, 0.25, 30.0, 501)
        fine = adversarial_audit.numeric_volume_nec_debt(1.0, 0.25, 30.0, 4001)
        self.assertLess(abs(fine - expected), abs(coarse - expected))
        self.assertLess(abs(fine - expected) / abs(expected), 1e-5)


if __name__ == "__main__":
    unittest.main()
