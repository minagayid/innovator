import json
import unittest
from pathlib import Path

from tools.validate_records import scan_forbidden, validate_record


class SafetyRedLineTests(unittest.TestCase):
    def test_nested_forbidden_fields_fail(self):
        record = json.loads((Path(__file__).parents[1] / "examples/candidate.parkinson.example.json").read_text())
        record["risk_notes"] = {"Guide-RNA": "blocked"}
        self.assertTrue(scan_forbidden(record))

    def test_missing_provenance_fails(self):
        record = json.loads((Path(__file__).parents[1] / "examples/evidence_record.example.json").read_text())
        del record["source_provenance"]["source_url"]
        self.assertTrue(validate_record(record, "evidence"))

    def test_patient_identifier_fails(self):
        record = json.loads((Path(__file__).parents[1] / "examples/candidate.parkinson.example.json").read_text())
        record["patient_id"] = "P-001"
        self.assertTrue(validate_record(record, "candidate"))

    def test_sourced_evidence_requires_source_kind_and_date(self):
        record = json.loads((Path(__file__).parents[1] / "examples/evidence_record.pd_trial.example.json").read_text())
        del record["source_kind"]
        self.assertTrue(validate_record(record, "evidence"))


if __name__ == "__main__":
    unittest.main()
