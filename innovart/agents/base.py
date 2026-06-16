"""Base Agent class for InnovaRT."""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from ..models import AgentStatus
from ..utils import setup_logging


class BaseAgent(ABC):
    """Base class for all agents in the InnovaRT system."""

    def __init__(self, name: str):
        self.name = name
        self.status = AgentStatus.IDLE
        self.logger = setup_logging().getChild(f"agent.{name}")
        self._data: Dict[str, Any] = {}

    def run(self, *args, **kwargs) -> Any:
        """Execute the agent's main task."""
        self.status = AgentStatus.RUNNING
        try:
            result = self._execute(*args, **kwargs)
            self.status = AgentStatus.COMPLETED
            self.logger.info(f"{self.name} completed successfully")
            return result
        except Exception as e:
            self.status = AgentStatus.FAILED
            self.logger.error(f"{self.name} failed: {e}")
            raise

    @abstractmethod
    def _execute(self, *args, **kwargs) -> Any:
        """Override this method in subclasses."""
        pass

    def get_status(self) -> str:
        """Return current agent status."""
        return self.status.value
