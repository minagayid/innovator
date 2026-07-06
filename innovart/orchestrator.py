"""
InnovaRT Orchestrator
Coordinates all agents in the innovation pipeline.
"""

import time
from typing import List, Dict, Any, Optional, Callable
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

        trace: List[Dict[str, Any]] = []

        # Each stage is wrapped so a single agent failure is recorded in the
        # trace and the pipeline continues (degrading downstream stages that
        # depend on the missing output) instead of crashing the whole run.
        opportunities = self._stage(trace, "Patent Scout",
                                     lambda: self.pipeline[0][1].run(query=query, max_results=max_results),
                                     default=[])
        research_findings = self._stage(trace, "Research Agent",
                                        lambda: self.pipeline[1][1].run(opportunities),
                                        default=[])
        concepts = self._stage(trace, "Innovation Architect",
                               lambda: self.pipeline[2][1].run(opportunities, research_findings),
                               default=[])
        self._stage(trace, "Multimodal Design", lambda: self.pipeline[3][1].run(concepts), default=[])
        self._stage(trace, "Patentability Analyzer", lambda: self.pipeline[4][1].run(concepts), default=[])
        self._stage(trace, "Engineering Optimizer", lambda: self.pipeline[5][1].run(concepts), default=[])
        market_analysis = self._stage(trace, "Market Intelligence",
                                      lambda: self.pipeline[6][1].run(concepts),
                                      default=None)
        self._stage(trace, "Commercialization",
                    lambda: self.pipeline[7][1].run(concepts, market_analysis), default=[])
        self._stage(trace, "Marketing", lambda: self.pipeline[8][1].run(concepts), default=[])
        self._stage(trace, "Sales", lambda: self.pipeline[9][1].run(concepts), default=[])

        failed = [s["stage"] for s in trace if s["status"] == "failed"]
        result = PipelineResult(
            opportunities=opportunities,
            concepts=concepts,
            market_analysis=market_analysis,
            status="ok" if not failed else "partial",
            execution_trace=trace,
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
        self.logger.info("InnovaRT Pipeline Complete (%s)", result.status)
        self.logger.info(f"Opportunities: {len(opportunities)}")
        self.logger.info(f"Concepts: {len(concepts)}")
        if failed:
            self.logger.warning("Failed stages: %s", ", ".join(failed))
        self.logger.info("=" * 50)

        return result

    def _stage(self, trace: List[Dict[str, Any]], name: str, fn: Callable[[], Any], default: Any) -> Any:
        """Run one pipeline stage, recording status, timing and any error.

        On failure the error is logged and captured in the trace, and
        ``default`` is returned so downstream stages can proceed with an
        empty input rather than the whole pipeline aborting.
        """
        start = time.monotonic()
        try:
            value = fn()
            trace.append({
                "stage": name,
                "status": "ok",
                "duration_ms": round((time.monotonic() - start) * 1000, 2),
                "error": None,
            })
            return value
        except Exception as exc:
            self.logger.error("Stage '%s' failed: %s", name, exc)
            trace.append({
                "stage": name,
                "status": "failed",
                "duration_ms": round((time.monotonic() - start) * 1000, 2),
                "error": f"{type(exc).__name__}: {exc}",
            })
            return default

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
