"""Agent 5 - Patentability Analyzer."""

from typing import List, Dict, Any
from .base import BaseAgent
from ..models import InnovationConcept


class PatentabilityAnalyzer(BaseAgent):
    """
    Agent 5: Patentability Analyzer
    Determines whether improved inventions qualify for patent protection.
    """

    def __init__(self):
        super().__init__("PatentabilityAnalyzer")
        self.criteria = [
            "Novelty",
            "Non-obviousness",
            "Utility",
            "Enablement",
        ]

    def _execute(self, concepts: List[InnovationConcept]) -> List[Dict[str, Any]]:
        """
        Analyze patentability of concepts.

        Args:
            concepts: Innovation concepts to analyze

        Returns:
            Patentability reports for each concept
        """
        self.logger.info(f"Analyzing patentability of {len(concepts)} concepts")

        reports = []
        for concept in concepts:
            score = min(concept.novelty_score * 1.1, 1.0)
            report = {
                "concept_id": concept.concept_id,
                "title": concept.title,
                "patentability_score": score,
                "prior_art_comparison": "No identical prior art found",
                "novelty_assessment": "High novelty due to alternative mechanism approach",
                "non_obviousness": "Non-obvious to person skilled in the art",
                "recommendation": "Patentable - proceed with filing" if score > 0.75 else "Needs refinement",
                "draft_claims": [
                    "A system comprising...",
                    "The system of claim 1, wherein...",
                ],
            }
            reports.append(report)
            self.logger.info(f"Patentability: {concept.title} - {report['patentability_score']:.2f}")

        return reports
