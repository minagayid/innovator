import json
import unittest
from pathlib import Path

from tools.validate_records import validate_record


class ScopeLockTests(unittest.TestCase):
    def test_spinal_cord_injury_is_rejected(self):
        record = json.loads((Path(__file__).parents[1] / "examples/scope.example.json").read_text())
        record["active_disease"] = "spinal_cord_injury"
        self.assertTrue(validate_record(record, "scope"))

    def test_experiment_cannot_authorize_progression(self):
        record = json.loads((Path(__file__).parents[1] / "examples/experiment_record.example.json").read_text())
        record["human_review_status"] = "approved_for_clinical_use"
        self.assertTrue(validate_record(record, "experiment"))

    def test_unknown_modality_is_rejected(self):
        record = json.loads((Path(__file__).parents[1] / "examples/candidate.parkinson.example.json").read_text())
        record["modality"] = "de_novo_drug_generation"
        self.assertTrue(validate_record(record, "candidate"))


if __name__ == "__main__":
    unittest.main()
