"""Agent 10 - Sales Agent."""

from typing import List, Dict, Any
from .base import BaseAgent
from ..models import InnovationConcept


class SalesAgent(BaseAgent):
    """
    Agent 10: Sales Agent
    Converts opportunities into revenue.
    """

    def __init__(self):
        super().__init__("SalesAgent")
        self.sales_methods = [
            "Direct sales",
            "Channel partners",
            "Licensing deals",
            "Strategic partnerships",
        ]

    def _execute(self, concepts: List[InnovationConcept]) -> List[Dict[str, Any]]:
        """
        Create sales strategies for concepts.

        Args:
            concepts: Innovation concepts to sell

        Returns:
            Sales strategies
        """
        self.logger.info(f"Creating sales strategies for {len(concepts)} concepts")

        strategies = []
        for concept in concepts:
            strategy = {
                "concept_id": concept.concept_id,
                "title": concept.title,
                "sales_method": self.sales_methods[0],
                "target_customers": [
                    "Enterprise customers",
                    "Research institutions",
                    "Government agencies",
                ],
                "lead_generation": {
                    "outreach": "Targeted outreach to potential customers",
                    "demos": "Product demonstrations and trials",
                    "referrals": "Customer referral program",
                },
                "crm_plan": f"CRM implementation for {concept.title} sales tracking",
                "pipeline": {
                    "prospecting": 20,
                    "qualification": 15,
                    "proposal": 10,
                    "negotiation": 5,
                    "closed": 2,
                },
                "revenue_forecast": {
                    "Q1": 100000,
                    "Q2": 250000,
                    "Q3": 500000,
                    "Q4": 750000,
                },
            }
            strategies.append(strategy)
            self.logger.info(f"Sales strategy: {concept.title}")

        return strategies
