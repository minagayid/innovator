import json
import tempfile
import unittest
from pathlib import Path

from pipelines.prepare_ncbi_sequences import prepare_sequences


class PrepareNCBISequencesTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.fasta = self.root / "input.fasta"
        self.manifest = self.root / "rights.tsv"
        self.output = self.root / "prepared.jsonl"

    def tearDown(self):
        self.temp.cleanup()

    def write_manifest(self, rows):
        self.manifest.write_text(
            "accession\tsequence_type\ttaxid\torganism\tsource_database\trelease\ttraining_authorized\tderivative_model_allowed\tredistribute_model_weights\tcommercial_use_allowed\tlicense_basis\n"
            + "\n".join("\t".join(row) for row in rows) + "\n",
            encoding="utf-8",
        )

    def test_only_manifest_authorized_records_are_emitted(self):
        self.fasta.write_text(
            ">NC_000001.11 Homo sapiens taxid=9606\nACGTACGT\n"
            ">AB_000002.1 unknown sample taxid=9606\nACGTACGT\n",
            encoding="utf-8",
        )
        self.write_manifest([
            ["NC_000001.11", "DNA", "9606", "Homo sapiens", "RefSeq", "R1", "true", "true", "false", "false", "public-ncbi-record; rights-reviewed"],
        ])
        report = prepare_sequences(self.fasta, self.manifest, self.output)
        rows = [json.loads(line) for line in self.output.read_text().splitlines()]
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["accession"], "NC_000001.11")
        self.assertEqual(rows[0]["taxid"], 9606)
        self.assertEqual(rows[0]["sequence_type"], "DNA")
        self.assertEqual(report["excluded_no_rights"], 1)

    def test_rejects_ambiguous_rights_and_invalid_alphabet(self):
        self.fasta.write_text(
            ">NC_000001.11 taxid=9606\nACGTNN\n"
            ">NP_000002.1 taxid=9606\nMPEPTIDE*\n"
            ">NC_000003.1 taxid=9606\nACGT!\n",
            encoding="utf-8",
        )
        self.write_manifest([
            ["NC_000001.11", "DNA", "9606", "Human", "RefSeq", "R1", "true", "true", "false", "false", ""],
            ["NP_000002.1", "PROTEIN", "9606", "Human", "RefSeq", "R1", "true", "true", "false", "false", "public-ncbi-record; rights-reviewed"],
            ["NC_000003.1", "DNA", "9606", "Human", "RefSeq", "R1", "true", "true", "false", "false", "public-ncbi-record; rights-reviewed"],
        ])
        report = prepare_sequences(self.fasta, self.manifest, self.output)
        rows = [json.loads(line) for line in self.output.read_text().splitlines()]
        self.assertEqual([row["accession"] for row in rows], ["NP_000002.1"])
        self.assertEqual(report["excluded_no_rights"], 1)
        self.assertEqual(report["excluded_invalid_sequence"], 1)

    def test_deduplicates_sequence_but_retains_source_provenance(self):
        self.fasta.write_text(
            ">NC_000001.11 taxid=9606\nACGTACGT\n"
            ">NC_000003.1 taxid=9606\nACGTACGT\n",
            encoding="utf-8",
        )
        self.write_manifest([
            [accession, "DNA", "9606", "Human", "RefSeq", "R1", "true", "true", "true", "true", "reviewed-bulk-license"]
            for accession in ["NC_000001.11", "NC_000003.1"]
        ])
        report = prepare_sequences(self.fasta, self.manifest, self.output)
        rows = [json.loads(line) for line in self.output.read_text().splitlines()]
        self.assertEqual(len(rows), 1)
        self.assertEqual(report["duplicate_sequences"], 1)
        self.assertEqual(rows[0]["source_accessions"], ["NC_000001.11", "NC_000003.1"])

    def test_refuses_public_weight_release_without_explicit_rights(self):
        self.fasta.write_text(">NC_000001.11 taxid=9606\nACGTACGT\n", encoding="utf-8")
        self.write_manifest([["NC_000001.11", "DNA", "9606", "Human", "RefSeq", "R1", "true", "true", "false", "false", "reviewed-internal-use-only"]])
        with self.assertRaisesRegex(ValueError, "redistribute_model_weights"):
            prepare_sequences(self.fasta, self.manifest, self.output, require_redistributable_weights=True)


if __name__ == "__main__":
    unittest.main()
