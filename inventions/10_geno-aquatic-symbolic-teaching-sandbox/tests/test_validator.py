import json
import unittest
from pathlib import Path

from tools.validate_candidate import validate


ROOT = Path(__file__).parents[1]


class SymbolicCandidateTests(unittest.TestCase):
    def test_synthetic_example_passes(self):
        example = json.loads((ROOT / "examples/candidate.example.json").read_text(encoding="utf-8"))
        self.assertEqual(validate(example), [])

    def test_sequence_fields_are_rejected(self):
        example = json.loads((ROOT / "examples/candidate.example.json").read_text(encoding="utf-8"))
        example["DNA_sequence"] = "ACGT"
        self.assertTrue(any("prohibited field" in error for error in validate(example)))

    def test_real_species_context_is_rejected(self):
        example = json.loads((ROOT / "examples/candidate.example.json").read_text(encoding="utf-8"))
        example["model_context"] = "named_fish_species"
        self.assertTrue(any("model_context" in error for error in validate(example)))

    def test_unknown_fields_are_rejected(self):
        example = json.loads((ROOT / "examples/candidate.example.json").read_text(encoding="utf-8"))
        example["protocol"] = "not allowed"
        self.assertTrue(any("unexpected field" in error for error in validate(example)))

    def test_sequence_like_text_is_rejected(self):
        example = json.loads((ROOT / "examples/candidate.example.json").read_text(encoding="utf-8"))
        example["trait_hypothesis"] = "A" * 24
        self.assertTrue(any("sequence-like" in error for error in validate(example)))

    def test_operational_language_is_rejected(self):
        example = json.loads((ROOT / "examples/candidate.example.json").read_text(encoding="utf-8"))
        example["limitations"].append("CRISPR plasmid protocol")
        self.assertTrue(any("operational molecular" in error for error in validate(example)))


if __name__ == "__main__":
    unittest.main()
