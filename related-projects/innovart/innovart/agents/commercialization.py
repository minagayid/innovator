"""Agent 8 - Commercialization Agent."""

from typing import List, Dict, Any
from .base import BaseAgent
from ..models import InnovationConcept, MarketAnalysis


class CommercializationAgent(BaseAgent):
    """
    Agent 8: Commercialization Agent
    Prepares inventions for sale, licensing, or startup formation.
    """

    def __init__(self):
        super().__init__("CommercializationAgent")
        self.strategies = [
            "Direct licensing",
            "Startup formation",
            "Technology transfer",
            "Joint venture",
        ]

    def _execute(
        self,
        concepts: List[InnovationConcept],
        market_analysis: MarketAnalysis,
    ) -> List[Dict[str, Any]]:
        """
        Develop commercialization plans.

        Args:
            concepts: Innovation concepts
            market_analysis: Market analysis results

        Returns:
            Commercialization plans
        """
        self.logger.info(f"Developing commercialization for {len(concepts)} concepts")

        plans = []
        for concept in concepts:
            plan = {
                "concept_id": concept.concept_id,
                "title": concept.title,
                "strategy": self.strategies[0],
                "licensing_package": f"Licensing package for {concept.title}",
                "investor_materials": f"Investor pitch deck for {concept.title}",
                "partnership_targets": [
                    "Target Company A",
                    "Target Company B",
                ],
                "commercial_roadmap": f"1. Validation 2. Pilot 3. Scale for {concept.title}",
                "revenue_projections": {
                    "year_1": 500000,
                    "year_3": 5000000,
                    "year_5": 25000000,
                },
            }
            plans.append(plan)
            self.logger.info(f"Commercialization plan: {concept.title}")

        return plans
