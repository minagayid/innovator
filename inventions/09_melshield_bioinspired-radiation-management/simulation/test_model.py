import math
import unittest

from model import LAYERS, areal_mass, build_summary


class MelShieldModelTests(unittest.TestCase):
    def test_layer_sum(self):
        expected = sum(layer["thickness_m"] * layer["density_kg_m3"] for layer in LAYERS)
        self.assertTrue(math.isclose(areal_mass(LAYERS), expected))

    def test_thickness_scaling(self):
        base = areal_mass(LAYERS)
        self.assertTrue(math.isclose(areal_mass(LAYERS, 2.0), 2.0 * base))
        self.assertTrue(math.isclose(areal_mass(LAYERS, 0.5), 0.5 * base))

    def test_zero_area(self):
        self.assertEqual(build_summary(0.0)["total_mass_kg"], 0.0)

    def test_negative_inputs_rejected(self):
        with self.assertRaises(ValueError):
            areal_mass(LAYERS, -1.0)


if __name__ == "__main__":
    unittest.main()

