import math
import unittest

from model import calculate


class MycoCleanModelTests(unittest.TestCase):
    def test_mass_balance(self):
        result = calculate(
            {
                "input_kg_day": 100.0,
                "capture_fraction": 0.8,
                "sort_fraction": 0.75,
                "conversion_fraction": 0.5,
                "product_recovery_fraction": 0.9,
                "energy_kwh_per_kg_accepted": 2.0,
            }
        )
        self.assertTrue(math.isclose(result["mass_balance_error_kg_day"], 0.0))
        self.assertLessEqual(result["product_kg_day"], result["input_kg_day"])

    def test_zero_capture_is_zero_product(self):
        result = calculate(
            {
                "input_kg_day": 100.0,
                "capture_fraction": 0.0,
                "sort_fraction": 1.0,
                "conversion_fraction": 1.0,
                "product_recovery_fraction": 1.0,
                "energy_kwh_per_kg_accepted": 2.0,
            }
        )
        self.assertEqual(result["accepted_kg_day"], 0.0)
        self.assertEqual(result["product_kg_day"], 0.0)

    def test_invalid_fraction_rejected(self):
        with self.assertRaises(ValueError):
            calculate(
                {
                    "input_kg_day": 1.0,
                    "capture_fraction": 1.1,
                    "sort_fraction": 1.0,
                    "conversion_fraction": 1.0,
                    "product_recovery_fraction": 1.0,
                    "energy_kwh_per_kg_accepted": 1.0,
                }
            )


if __name__ == "__main__":
    unittest.main()

