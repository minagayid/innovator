#!/usr/bin/env python3
"""Deterministic, dependency-free validation for NeuroForge V1 fixtures."""

from __future__ import annotations

import argparse
import json
import re
from datetime import date
from pathlib import Path
from typing import Any


FORBIDDEN_KEYS = {
    "dose", "dosage", "concentration", "administrationroute", "deliveryroute",
    "guidrna", "guiderna", "vectorsequence", "vectordesign",
    "patientid", "patientname", "mrn", "clinicalrecommendation",
    "treatmentselection", "responseprediction",
    "treatmentrecommendation", "clinicaldecision", "transplantationprotocol",
    "manufacturingprotocol", "cellmanufacturing", "synthesisreadysequence",
    "synthesissequence", "pressure", "exposuretime", "injectionroute",
}

ID_PATTERNS = {
    "candidate": re.compile(r"^NF-CAND-[0-9]{3}$"),
    "model": re.compile(r"^NF-MODEL-[0-9]{3}$"),
    "evidence": re.compile(r"^NF-EVID-[0-9]{3}$"),
    "experiment": re.compile(r"^NF-EXP-[0-9]{3}$"),
}


def _norm_key(value: str) -> str:
    return re.sub(r"[^a-z0-9]", "", value.lower())


def scan_forbidden(value: Any, path: str = "$", errors: list[str] | None = None) -> list[str]:
    errors = [] if errors is None else errors
    if isinstance(value, dict):
        for key, child in value.items():
            if _norm_key(str(key)) in FORBIDDEN_KEYS:
                errors.append(f"{path}.{key}: forbidden field")
            scan_forbidden(child, f"{path}.{key}", errors)
    elif isinstance(value, list):
        for index, child in enumerate(value):
            scan_forbidden(child, f"{path}[{index}]", errors)
    return errors


def _require(record: dict[str, Any], keys: list[str], errors: list[str]) -> None:
    for key in keys:
        if key not in record:
            errors.append(f"missing required field: {key}")


def _provenance(record: dict[str, Any], errors: list[str], path: str = "source_provenance") -> None:
    value = record.get(path)
    if not isinstance(value, dict):
        errors.append(f"{path}: must be an object")
        return
    for key in ("source_url", "retrieved_on", "license_or_consent_basis", "dataset_or_model_version"):
        if not value.get(key):
            errors.append(f"{path}.{key}: required")
    if value.get("source_url") and not str(value["source_url"]).startswith("https://"):
        errors.append(f"{path}.source_url: must use https")


def validate_record(record: Any, kind: str) -> list[str]:
    errors: list[str] = []
    if not isinstance(record, dict):
        return ["record must be an object"]
    errors.extend(scan_forbidden(record))

    if kind == "scope":
        expected = {
            "scope_id": "neuroforge-parkinson-v1",
            "active_disease": "parkinson_disease",
            "active_modality": "dopaminergic_cell_replacement_research",
            "research_only": True,
            "human_review_required": True,
            "clinical_decision_support": False,
            "patient_specific_outputs": False,
            "operational_protocols": False,
        }
        _require(record, list(expected), errors)
        for key, value in expected.items():
            if key in record and record[key] != value:
                errors.append(f"{key}: must equal {value!r}")
        return errors

    if kind == "candidate":
        _require(record, ["schema_version", "candidate_id", "disease_context", "modality", "mechanism_hypothesis", "model_systems", "evidence_refs", "evidence_axes", "known_risks", "unknowns", "transferability_limits", "negative_or_conflicting_evidence", "source_provenance", "research_only", "review_status", "blocked_action_types"], errors)
        if record.get("schema_version") != "0.1": errors.append("schema_version: must be 0.1")
        if not ID_PATTERNS["candidate"].match(str(record.get("candidate_id", ""))): errors.append("candidate_id: invalid")
        if record.get("disease_context") != ["parkinson_disease"]: errors.append("disease_context: V1 is Parkinson disease only")
        if record.get("modality") != "dopaminergic_cell_replacement_research": errors.append("modality: unsupported for V1")
        if not isinstance(record.get("evidence_refs"), list) or not record.get("evidence_refs"): errors.append("evidence_refs: at least one required")
        if record.get("research_only") is not True: errors.append("research_only: must be true")
        axes = record.get("evidence_axes")
        if not isinstance(axes, dict) or set((axes or {})) != {"mechanism", "safety", "efficacy"}: errors.append("evidence_axes: mechanism, safety, efficacy required")
        if not isinstance(record.get("blocked_action_types"), list) or len(record.get("blocked_action_types", [])) < 4: errors.append("blocked_action_types: at least four required")
        _provenance(record, errors)
        return errors

    if kind == "model":
        _require(record, ["model_id", "disease_context", "model_category", "task_validated_for", "known_limitations", "out_of_domain_status", "source_provenance"], errors)
        if not ID_PATTERNS["model"].match(str(record.get("model_id", ""))): errors.append("model_id: invalid")
        if record.get("disease_context") != "parkinson_disease": errors.append("disease_context: V1 is Parkinson disease only")
        _provenance(record, errors)
        return errors

    if kind == "evidence":
        _require(record, ["evidence_id", "study_type", "source_kind", "publication_date", "reviewer", "evidence_level", "source_provenance", "disease_context", "endpoint", "model_limitations", "uncertainty", "negative_or_conflicting_evidence", "transferability_limits"], errors)
        if not ID_PATTERNS["evidence"].match(str(record.get("evidence_id", ""))): errors.append("evidence_id: invalid")
        if record.get("disease_context") != "parkinson_disease": errors.append("disease_context: V1 is Parkinson disease only")
        if record.get("source_kind") not in {"peer_reviewed_article", "conference_abstract", "press_release", "clinical_trial_registry", "guideline", "review", "preprint", "synthetic_example", "other"}: errors.append("source_kind: unsupported")
        if not isinstance(record.get("reviewer"), str) or len(record.get("reviewer", "")) < 3: errors.append("reviewer: required")
        publication_date = record.get("publication_date")
        if publication_date is None:
            if record.get("source_kind") != "synthetic_example":
                errors.append("publication_date: required for sourced evidence")
        elif not isinstance(publication_date, str):
            errors.append("publication_date: must be an ISO date")
        else:
            try:
                date.fromisoformat(publication_date)
            except ValueError:
                errors.append("publication_date: must be a valid YYYY-MM-DD date")
        _provenance(record, errors)
        return errors

    if kind == "experiment":
        _require(record, ["experiment_id", "candidate_id", "model_system_id", "research_question", "hypothesis", "endpoint_category", "evidence_refs", "safety_classification", "human_review_status", "source_provenance"], errors)
        if not ID_PATTERNS["experiment"].match(str(record.get("experiment_id", ""))): errors.append("experiment_id: invalid")
        if record.get("safety_classification") not in {"research_metadata_only", "requires_external_safety_review", "quarantined"}: errors.append("safety_classification: invalid")
        if record.get("human_review_status") not in {"not_reviewed", "reviewed_for_research_only", "dissent_recorded", "quarantined"}: errors.append("human_review_status: invalid")
        _provenance(record, errors)
        return errors

    return [f"unknown record kind: {kind}"]


def infer_kind(path: Path) -> str:
    stem = path.stem.lower()
    if "scope" in stem: return "scope"
    if "candidate" in stem: return "candidate"
    if "model" in stem: return "model"
    if "evidence" in stem: return "evidence"
    if "experiment" in stem: return "experiment"
    raise ValueError(f"cannot infer record kind from {path.name}")


def validate_path(path: Path, kind: str | None = None) -> list[str]:
    try:
        record = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        return [f"{path}: {exc}"]
    return validate_record(record, kind or infer_kind(path))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("paths", nargs="+", type=Path)
    args = parser.parse_args()
    failed = False
    for path in args.paths:
        errors = validate_path(path)
        if errors:
            failed = True
            print(f"FAIL {path}")
            for error in errors: print(f"  - {error}")
        else:
            print(f"PASS {path}")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
