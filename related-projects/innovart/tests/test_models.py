"""
Tests for innovart.models module
"""

import pytest
from innovart.models import (
    PatentReference,
    Opportunity,
    InnovationConcept,
    MarketAnalysis,
    PipelineResult,
    Priority,
    AgentStatus,
)


class TestPatentReference:
    def test_create_patent_reference(self):
        p = PatentReference(
            patent_id="WO2024001A1",
            title="AI-Driven Drug Discovery",
            assignee="BioTech Corp",
            filing_date="2024-01-15",
            status="published",
            claims=["Claim 1", "Claim 2"],
            url="https://patentscope.wipo.int/...",
        )
        assert p.patent_id == "WO2024001A1"
        assert p.title == "AI-Driven Drug Discovery"
        assert p.assignee == "BioTech Corp"
        assert len(p.claims) == 2
        assert p.url

    def test_patent_reference_defaults(self):
        p = PatentReference(
            patent_id="US123456",
            title="Test Patent",
            assignee="Test Inc",
            filing_date="2023-06-01",
            status="pending",
        )
        assert p.claims == []
        assert p.abstract == ""
        assert p.url == ""


class TestOpportunity:
    def test_create_opportunity(self):
        opp = Opportunity(
            title="Quantum Battery",
            description="Breakthrough energy storage",
            opportunity_score=0.9,
            commercial_potential=0.85,
            legal_risk=0.2,
            priority=Priority.HIGH,
            tags=["energy", "quantum"],
        )
        assert opp.opportunity_score == 0.9
        assert opp.priority == Priority.HIGH
        assert "energy" in opp.tags

    def test_opportunity_id_generated(self):
        opp = Opportunity(title="Test")
        assert opp.opportunity_id is not None
        assert len(opp.opportunity_id) > 0

    def test_opportunity_to_dict(self):
        opp = Opportunity(
            title="Test Opp",
            opportunity_score=0.75,
            priority=Priority.MEDIUM,
        )
        d = opp.to_dict()
        assert d["title"] == "Test Opp"
        assert d["opportunity_score"] == 0.75
        assert d["priority"] == "MEDIUM"
        assert "id" in d


class TestInnovationConcept:
    def test_create_concept(self):
        concept = InnovationConcept(
            title="Solid-State Battery v2",
            description="Next-gen storage tech",
            novelty_score=0.88,
            technical_specifications={"material": "graphene", "capacity": "500Wh/kg"},
        )
        assert concept.novelty_score == 0.88
        assert concept.technical_specifications["material"] == "graphene"

    def test_concept_to_dict(self):
        concept = InnovationConcept(
            title="New Inflatable Airbag",
            novelty_score=0.92,
        )
        d = concept.to_dict()
        assert d["title"] == "New Inflatable Airbag"
        assert d["novelty_score"] == 0.92


class TestMarketAnalysis:
    def test_create_market_analysis(self):
        ma = MarketAnalysis(
            tam=50e9,
            sam=10e9,
            som=1e9,
            competitors=[{"name": "Corp A", "share": 0.3}],
            pricing_strategy="Freemium → Enterprise",
            market_entry_plan="SE Asia first, then NA",
        )
        assert ma.tam == 50e9
        assert len(ma.competitors) == 1

    def test_market_analysis_defaults(self):
        ma = MarketAnalysis()
        assert ma.tam == 0.0
        assert ma.competitors == []


class TestPipelineResult:
    def test_create_result(self):
        result = PipelineResult()
        assert len(result.opportunities) == 0
        assert len(result.concepts) == 0
        assert result.market_analysis is None

    def test_result_to_json(self):
        result = PipelineResult()
        json_str = result.to_json()
        assert "pipeline_id" in json_str
        assert "opportunities_count" in json_str


class TestEnums:
    def test_priority_values(self):
        assert Priority.LOW.value == 1
        assert Priority.MEDIUM.value == 2
        assert Priority.HIGH.value == 3
        assert Priority.CRITICAL.value == 4

    def test_agent_status_values(self):
        assert AgentStatus.IDLE.value == "idle"
        assert AgentStatus.RUNNING.value == "running"
        assert AgentStatus.COMPLETED.value == "completed"
        assert AgentStatus.FAILED.value == "failed"
