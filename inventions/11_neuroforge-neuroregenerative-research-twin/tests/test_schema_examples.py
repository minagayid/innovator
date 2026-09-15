import json
import unittest
from pathlib import Path

from tools.validate_records import validate_path


ROOT = Path(__file__).parents[1]


class SchemaExampleTests(unittest.TestCase):
    def test_examples_pass(self):
        for path in sorted((ROOT / "examples").glob("*.json")):
            self.assertEqual(validate_path(path), [], path.name)


if __name__ == "__main__":
    unittest.main()
