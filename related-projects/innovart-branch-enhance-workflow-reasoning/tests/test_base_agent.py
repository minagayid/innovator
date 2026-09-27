"""
Tests for innovart.agents.base module
"""

import pytest
from unittest.mock import MagicMock, patch

from innovart.models import Priority, AgentStatus
from innovart.agents.base import BaseAgent


class ConcreteAgent(BaseAgent):
    """Concrete agent for testing the abstract base class."""

    def _execute(self, *args, **kwargs):
        return {"status": "ok", "data": args}


class TestBaseAgent:
    def test_create_agent(self):
        agent = ConcreteAgent("TestAgent")
        assert agent.name == "TestAgent"
        assert agent.status == AgentStatus.IDLE

    def test_run_success(self):
        agent = ConcreteAgent("TestAgent")
        result = agent.run("arg1", key="val")
        assert result["status"] == "ok"
        assert agent.status == AgentStatus.COMPLETED

    def test_run_failure(self):
        class FailingAgent(BaseAgent):
            def _execute(self, *args, **kwargs):
                raise RuntimeError("Intentional failure")

        agent = FailingAgent("FailingAgent")
        with pytest.raises(RuntimeError):
            agent.run()
        assert agent.status == AgentStatus.FAILED

    def test_get_status(self):
        agent = ConcreteAgent("TestAgent")
        assert agent.get_status() == "idle"
        agent.run()
        assert agent.get_status() == "completed"

    def test_abstract_method(self):
        with pytest.raises(TypeError):
            BaseAgent("Cannot instantiate abstract")
