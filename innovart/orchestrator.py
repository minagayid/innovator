"""
InnovaRT Orchestrator
Coordinates all agents in the innovation pipeline.
"""

from typing import List, Dict, Any, Optional
from .models import PipelineResult, Opportunity, InnovationConcept, MarketAnalysis
from .agents import (
    PatentScout,
    ResearchAgent,
    InnovationArchitect,
    MultimodalDesignAgent,
    PatentabilityAnalyzer,
    EngineeringOptimizer,
    MarketIntelligence,
    CommercializationAgent,
    MarketingAgent,
    SalesAgent,
)
from .utils import setup_logging, save_json
from datetime import datetime
import json


class InnovaRTOrchestrator:
    """
    Orchestrator that coordinates the 10-agent innovation pipeline.

    Pipeline flow:
    Patent Scout -> Research Agent -> Innovation Architect -> Multimodal Design
    -> Patentability Analyzer -> Engineering Optimizer -> Market Intelligence
    -> Commercialization -> Marketing -> Sales
    """

    def __init__(self):
        self.logger = setup_logging().getChild("orchestrator")
        self.pipeline = [
            ("Patent Scout", PatentScout()),
            ("Research Agent", ResearchAgent()),
            ("Innovation Architect", InnovationArchitect()),
            ("Multimodal Design", MultimodalDesignAgent()),
            ("Patentability Analyzer", PatentabilityAnalyzer()),
            ("Engineering Optimizer", EngineeringOptimizer()),
            ("Market Intelligence", MarketIntelligence()),
            ("Commercialization", CommercializationAgent()),
            ("Marketing", MarketingAgent()),
            ("Sales", SalesAgent()),
        ]

    def run_pipeline(
        self,
        query: str = "emerging technologies",
        max_results: int = 5,
    ) -> PipelineResult:
        """
        Run the full innovation pipeline.

        Args:
            query: Search query for patent scouting
            max_results: Maximum number of results

        Returns:
            PipelineResult with all outputs
        """
        self.logger.info("=" * 50)
        self.logger.info("Starting InnovaRT Pipeline")
        self.logger.info("=" * 50)

        # Step 1: Patent Scout
        patent_scout = self.pipeline[0][1]
        opportunities = patent_scout.run(query=query, max_results=max_results)

        # Step 2: Research Agent
        research_agent = self.pipeline[1][1]
        research_findings = research_agent.run(opportunities)

        # Step 3: Innovation Architect
        innovation_architect = self.pipeline[2][1]
        concepts = innovation_architect.run(opportunities, research_findings)

        # Step 4: Multimodal Design
        design_agent = self.pipeline[3][1]
        designs = design_agent.run(concepts)

        # Step 5: Patentability Analyzer
        patentability = self.pipeline[4][1]
        patent_reports = patentability.run(concepts)

        # Step 6: Engineering Optimizer
        optimizer = self.pipeline[5][1]
        optimizations = optimizer.run(concepts)

        # Step 7: Market Intelligence
        market_agent = self.pipeline[6][1]
        market_analysis = market_agent.run(concepts)

        # Step 8: Commercialization
        commercialization = self.pipeline[7][1]
        commercial_plans = commercialization.run(concepts, market_analysis)

        # Step 9: Marketing
        marketing = self.pipeline[8][1]
        marketing_plans = marketing.run(concepts)

        # Step 10: Sales
        sales = self.pipeline[9][1]
        sales_strategies = sales.run(concepts)

        # Compile results
        result = PipelineResult(
            opportunities=opportunities,
            concepts=concepts,
            market_analysis=market_analysis,
            reports={
                "research_findings": "Research findings saved",
                "patent_analysis": "Patent reports saved",
                "market_analysis": "Market analysis saved",
                "commercialization": "Commercialization plans saved",
                "marketing": "Marketing plans saved",
                "sales": "Sales strategies saved",
            },
        )

        self.logger.info("=" * 50)
        self.logger.info("InnovaRT Pipeline Complete")
        self.logger.info(f"Opportunities: {len(opportunities)}")
        self.logger.info(f"Concepts: {len(concepts)}")
        self.logger.info("=" * 50)

        return result

    def run_single_agent(self, agent_name: str, *args, **kwargs) -> Any:
        """Run a single agent by name."""
        for name, agent in self.pipeline:
            if name.lower() == agent_name.lower():
                self.logger.info(f"Running single agent: {name}")
                return agent.run(*args, **kwargs)
        raise ValueError(f"Agent '{agent_name}' not found in pipeline")

    def get_pipeline_status(self) -> Dict[str, str]:
        """Get status of all agents in the pipeline."""
        return {
            name: agent.get_status()
            for name, agent in self.pipeline
        }

    def save_results(self, result: PipelineResult, filepath: str = "innovart_results.json") -> None:
        """Save pipeline results to a JSON file."""
        data = {
            "pipeline_id": result.pipeline_id,
            "opportunities": [opp.to_dict() for opp in result.opportunities],
            "concepts": [concept.to_dict() for concept in result.concepts],
            "completed_at": result.completed_at,
        }
        save_json(data, filepath)
        self.logger.info(f"Results saved to {filepath}")
