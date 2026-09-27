"""
Tests for the InnovaRT Orchestrator
"""

import pytest

from innovart.orchestrator import InnovaRTOrchestrator
from innovart.models import PipelineResult


class TestOrchestrator:
    def test_create_orchestrator(self):
        orch = InnovaRTOrchestrator()
        assert orch is not None
        assert len(orch.pipeline) == 10

    def test_pipeline_order(self):
        orch = InnovaRTOrchestrator()
        names = [name for name, _ in orch.pipeline]
        expected = [
            "Patent Scout",
            "Research Agent",
            "Innovation Architect",
            "Multimodal Design",
            "Patentability Analyzer",
            "Engineering Optimizer",
            "Market Intelligence",
            "Commercialization",
            "Marketing",
            "Sales",
        ]
        assert names == expected

    def test_run_pipeline(self):
        orch = InnovaRTOrchestrator()
        result = orch.run_pipeline(query="AI Healthcare", max_results=3)
        assert isinstance(result, PipelineResult)
        assert result.pipeline_id is not None

    def test_run_pipeline_returns_opportunities(self):
        orch = InnovaRTOrchestrator()
        result = orch.run_pipeline(query="robotics", max_results=3)
        assert len(result.opportunities) > 0

    def test_run_pipeline_returns_concepts(self):
        orch = InnovaRTOrchestrator()
        result = orch.run_pipeline(query="energy storage", max_results=3)
        assert len(result.concepts) > 0

    def test_get_pipeline_status(self):
        orch = InnovaRTOrchestrator()
        status = orch.get_pipeline_status()
        assert isinstance(status, dict)
        assert len(status) == 10

    def test_run_pipeline_records_execution_trace(self):
        orch = InnovaRTOrchestrator()
        result = orch.run_pipeline(query="AI", max_results=2)
        assert result.status == "ok"
        assert len(result.execution_trace) == 10
        for stage in result.execution_trace:
            assert stage["status"] == "ok"
            assert stage["error"] is None
            assert "duration_ms" in stage
        assert result.failed_stages == []

    def test_pipeline_degrades_to_partial_on_stage_failure(self):
        orch = InnovaRTOrchestrator()

        # Force the Market Intelligence agent to raise; the pipeline should
        # record the failure, continue, and return a 'partial' result rather
        # than crashing.
        def boom(*args, **kwargs):
            raise RuntimeError("market data unavailable")

        orch.pipeline[6][1].run = boom  # Market Intelligence
        result = orch.run_pipeline(query="AI", max_results=2)

        assert result.status == "partial"
        assert "Market Intelligence" in result.failed_stages
        assert result.market_analysis is None
        # Upstream stages still produced their outputs.
        assert len(result.opportunities) > 0
        assert len(result.concepts) > 0
        # Downstream stages still ran after the failure.
        stage_names = [s["stage"] for s in result.execution_trace]
        assert stage_names.index("Sales") > stage_names.index("Market Intelligence")

    def test_save_results(self, tmp_path):
        import json
        orch = InnovaRTOrchestrator()
        result = orch.run_pipeline(query="test", max_results=2)
        output_file = str(tmp_path / "results.json")
        result_data = {
            "pipeline_id": result.pipeline_id,
            "opportunities": [o.to_dict() for o in result.opportunities],
            "concepts": [c.to_dict() for c in result.concepts],
            "completed_at": result.completed_at,
        }
        with open(output_file, "w") as f:
            json.dump(result_data, f, indent=2, default=str)
        with open(output_file) as f:
            loaded = json.load(f)
        assert loaded["pipeline_id"] == result.pipeline_id
