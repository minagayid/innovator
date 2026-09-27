"""
Tests for individual InnovaRT agents
"""

import pytest
from unittest.mock import patch, MagicMock

from innovart.agents.patent_scout import PatentScout
from innovart.agents.research_agent import ResearchAgent
from innovart.agents.innovation_architect import InnovationArchitect
from innovart.agents.patentability_analyzer import PatentabilityAnalyzer
from innovart.agents.engineering_optimizer import EngineeringOptimizer
from innovart.agents.market_intelligence import MarketIntelligence
from innovart.agents.commercialization import CommercializationAgent
from innovart.agents.marketing import MarketingAgent
from innovart.agents.sales import SalesAgent


class TestPatentScout:
    def test_create(self):
        scout = PatentScout()
        assert scout.name == "PatentScout"
        assert any("WIPO" in s for s in scout.data_sources)

    def test_run_returns_opportunities(self):
        scout = PatentScout()
        results = scout.run(query="AI", max_results=3)
        assert isinstance(results, list)
        assert len(results) > 0
        assert hasattr(results[0], "title")
        assert hasattr(results[0], "opportunity_score")

    def test_run_filters_by_min_score(self):
        scout = PatentScout()
        results = scout.run(query="AI", max_results=10, min_opportunity_score=0.95)
        for r in results:
            assert r.opportunity_score >= 0.95


class TestResearchAgent:
    def test_create(self):
        agent = ResearchAgent()
        assert agent.name == "ResearchAgent"

    def test_run_returns_findings(self):
        agent = ResearchAgent()
        # Create a mock opportunity
        from innovart.models import Opportunity
        opp = Opportunity(title="Test", opportunity_score=0.8)
        results = agent.run([opp])
        assert results is not None
        assert len(results) > 0


class TestInnovationArchitect:
    def test_create(self):
        agent = InnovationArchitect()
        assert agent.name == "InnovationArchitect"

    def test_run_returns_concepts(self):
        agent = InnovationArchitect()
        from innovart.models import Opportunity
        opp = Opportunity(title="Battery Tech", opportunity_score=0.85)
        results = agent.run([opp], research_findings=[])
        assert isinstance(results, list)
        if results:
            assert hasattr(results[0], "novelty_score")


class TestPatentabilityAnalyzer:
    def test_create(self):
        agent = PatentabilityAnalyzer()
        assert agent.name == "PatentabilityAnalyzer"

    def test_run_returns_reports(self):
        agent = PatentabilityAnalyzer()
        from innovart.models import InnovationConcept
        concept = InnovationConcept(title="New Motor", novelty_score=0.9)
        results = agent.run([concept])
        assert isinstance(results, list)
        assert len(results) > 0


class TestEngineeringOptimizer:
    def test_create(self):
        agent = EngineeringOptimizer()
        assert agent.name == "EngineeringOptimizer"

    def test_run_returns_optimizations(self):
        agent = EngineeringOptimizer()
        from innovart.models import InnovationConcept
        concept = InnovationConcept(title="Solar Panel", description="Test")
        results = agent.run([concept])
        assert isinstance(results, list)
        assert len(results) > 0


class TestMarketIntelligence:
    def test_create(self):
        agent = MarketIntelligence()
        assert agent.name == "MarketIntelligence"

    def test_run_returns_analysis(self):
        agent = MarketIntelligence()
        from innovart.models import InnovationConcept
        concept = InnovationConcept(title="EV Battery", description="Test")
        result = agent.run([concept])
        from innovart.models import MarketAnalysis
        assert isinstance(result, MarketAnalysis)


class TestCommercializationAgent:
    def test_create(self):
        agent = CommercializationAgent()
        assert agent.name == "CommercializationAgent"

    def test_run_returns_plans(self):
        agent = CommercializationAgent()
        from innovart.models import InnovationConcept
        concept = InnovationConcept(title="Biotech Device", description="Test")
        market = {"tam": 10e9, "sam": 2e9}
        results = agent.run([concept], market_analysis=market)
        assert isinstance(results, list)
        assert len(results) > 0


class TestMarketingAgent:
    def test_create(self):
        agent = MarketingAgent()
        assert agent.name == "MarketingAgent"

    def test_run_returns_campaigns(self):
        agent = MarketingAgent()
        from innovart.models import InnovationConcept
        concept = InnovationConcept(title="Smart Home Hub", description="Test")
        results = agent.run([concept])
        assert isinstance(results, list)
        assert len(results) > 0


class TestSalesAgent:
    def test_create(self):
        agent = SalesAgent()
        assert agent.name == "SalesAgent"

    def test_run_returns_strategies(self):
        agent = SalesAgent()
        from innovart.models import InnovationConcept
        concept = InnovationConcept(title="Drone Delivery", description="Test")
        results = agent.run([concept])
        assert isinstance(results, list)
        assert len(results) > 0
