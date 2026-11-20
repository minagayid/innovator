import json
import tempfile
import unittest
from pathlib import Path

from pipelines.prepare_patent_records import prepare_patent_records


class PreparePatentRecordsTests(unittest.TestCase):
    def test_requires_explicit_derivative_training_rights(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "patents.jsonl"
            rights = root / "rights.json"
            output = root / "prepared.jsonl"
            source.write_text(
                json.dumps({"publication_id": "WO2024000001A1", "family_id": "F1", "title": "Licensed invention", "abstract": "A bounded mechanism.", "description": "Detailed description.", "claims": ["A system comprising X."]}) + "\n"
                + json.dumps({"publication_id": "WO2024000002A1", "family_id": "F2", "title": "Unlicensed invention", "abstract": "Not authorized."}) + "\n",
                encoding="utf-8",
            )
            rights.write_text(json.dumps({"records": {
                "WO2024000001A1": {"training_authorized": True, "derivative_model_allowed": True, "license_id": "WIPO-ORDER-123", "source": "WIPO licensed PCT backfile"},
                "WO2024000002A1": {"training_authorized": False, "derivative_model_allowed": False, "license_id": "", "source": "public website"},
            }}), encoding="utf-8")
            report = prepare_patent_records(source, rights, output)
            rows = [json.loads(line) for line in output.read_text().splitlines()]
            self.assertEqual([row["publication_id"] for row in rows], ["WO2024000001A1"])
            self.assertEqual(rows[0]["license_id"], "WIPO-ORDER-123")
            self.assertEqual(report["excluded_rights"], 1)

    def test_refuses_model_weight_distribution_when_rights_do_not_allow_it(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "patents.jsonl"
            rights = root / "rights.json"
            output = root / "prepared.jsonl"
            source.write_text(json.dumps({"publication_id": "WO2024000001A1", "title": "Example", "abstract": "Example abstract."}) + "\n", encoding="utf-8")
            rights.write_text(json.dumps({"records": {"WO2024000001A1": {"training_authorized": True, "derivative_model_allowed": True, "redistribute_model_weights": False, "license_id": "ORDER-1"}}}), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "redistribute_model_weights"):
                prepare_patent_records(source, rights, output, require_redistributable_weights=True)


if __name__ == "__main__":
    unittest.main()
