#!/usr/bin/env python3
"""Regression tests for the bounded Morris–Thorne toy study."""
from __future__ import annotations

import math
import unittest

import numpy as np

import model


class MorrisThorneToyTests(unittest.TestCase):
    def test_analytic_nec_is_negative_for_declared_domain(self) -> None:
        r0 = 1.0
        alpha = 0.5
        r = np.linspace(r0, 20.0 * r0, 101)
        _, _, nec = model.analytic_stress_energy(r, r0, alpha)
        expected = -((alpha + 1.0) * r0 ** (alpha + 1.0)) / (8.0 * math.pi * r ** (alpha + 3.0))
        self.assertTrue(np.all(nec < 0.0))
        np.testing.assert_allclose(nec, expected, rtol=1e-14, atol=0.0)

    def test_throat_and_flare_out_conditions(self) -> None:
        r0 = 2.0
        alpha = 1.0
        r = np.array([r0])
        self.assertEqual(float(model.shape_function(r, r0, alpha)[0]), r0)
        self.assertEqual(float(model.analytic_b_prime(r, r0, alpha)[0]), -alpha)
        self.assertLess(float(model.analytic_b_prime(r, r0, alpha)[0]), 1.0)

    def test_flat_negative_control_is_zero(self) -> None:
        r = np.linspace(1.0, 5.0, 10)
        rho, p_radial, nec = model.flat_control(r)
        self.assertEqual(float(np.max(np.abs(rho))), 0.0)
        self.assertEqual(float(np.max(np.abs(p_radial))), 0.0)
        self.assertEqual(float(np.max(np.abs(nec))), 0.0)
        b, b_prime, rho_fd, nec_fd = model.numeric_stress_energy_from_shape(r, np.zeros_like(r))
        np.testing.assert_array_equal(b, np.zeros_like(r))
        np.testing.assert_array_equal(b_prime, np.zeros_like(r))
        np.testing.assert_array_equal(rho_fd, np.zeros_like(r))
        np.testing.assert_array_equal(nec_fd, np.zeros_like(r))

    def test_schwarzschild_lapse_increases_outside_normalized_horizon(self) -> None:
        x = np.array([1.001, 1.01, 1.1, 2.0, 10.0])
        lapse = model.schwarzschild_lapse(x)
        self.assertGreater(lapse[0], 0.0)
        self.assertTrue(np.all(np.diff(lapse) > 0.0))
        self.assertLess(lapse[0], 0.01)

    def test_refinement_reduces_nec_error(self) -> None:
        coarse, _ = model.case_result(r0=1.0, alpha=1.0, n_grid=501)
        fine, _ = model.case_result(r0=1.0, alpha=1.0, n_grid=4001)
        self.assertTrue(coarse["all_analytic_nec_negative"])
        self.assertTrue(fine["all_numeric_nec_negative"])
        self.assertLess(fine["max_rel_error_nec_interior"], coarse["max_rel_error_nec_interior"])
        self.assertLess(fine["max_rel_error_nec_interior"], 1e-3)


if __name__ == "__main__":
    unittest.main()
