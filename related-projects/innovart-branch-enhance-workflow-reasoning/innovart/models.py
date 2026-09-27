"""
InnovaRT - Patent-Aware Innovation & Commercialization System
Core models and utilities
"""

from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional
from enum import Enum
import json
import uuid
from datetime import datetime


class Priority(Enum):
    """Priority levels for tasks and findings."""
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    CRITICAL = 4


class AgentStatus(Enum):
    """Status of an agent in the pipeline."""
    IDLE = "idle"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


@dataclass
class PatentReference:
    """Represents a patent reference."""
    patent_id: str
    title: str
    assignee: str
    filing_date: str
    status: str
    claims: List[str] = field(default_factory=list)
    abstract: str = ""
    url: str = ""


@dataclass
class Opportunity:
    """Represents a business opportunity found by an agent."""
    opportunity_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    title: str = ""
    description: str = ""
    source_patent: Optional[PatentReference] = None
    opportunity_score: float = 0.0
    commercial_potential: float = 0.0
    legal_risk: float = 0.0
    priority: Priority = Priority.MEDIUM
    tags: List[str] = field(default_factory=list)
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.opportunity_id,
            "title": self.title,
            "description": self.description,
            "opportunity_score": self.opportunity_score,
            "commercial_potential": self.commercial_potential,
            "legal_risk": self.legal_risk,
            "priority": self.priority.name,
            "tags": self.tags,
            "created_at": self.created_at,
        }


@dataclass
class InnovationConcept:
    """Represents an innovation concept."""
    concept_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    title: str = ""
    description: str = ""
    novelty_score: float = 0.0
    technical_specifications: Dict[str, Any] = field(default_factory=dict)
    design_files: List[str] = field(default_factory=list)
    priority: Priority = Priority.MEDIUM

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.concept_id,
            "title": self.title,
            "description": self.description,
            "novelty_score": self.novelty_score,
            "technical_specifications": self.technical_specifications,
            "priority": self.priority.name,
        }


@dataclass
class MarketAnalysis:
    """Represents market analysis results."""
    tam: float = 0.0  # Total Addressable Market
    sam: float = 0.0  # Serviceable Addressable Market
    som: float = 0.0  # Serviceable Obtainable Market
    competitors: List[Dict[str, Any]] = field(default_factory=list)
    pricing_strategy: str = ""
    market_entry_plan: str = ""


@dataclass
class PipelineResult:
    """Result of running the full pipeline."""
    pipeline_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    opportunities: List[Opportunity] = field(default_factory=list)
    concepts: List[InnovationConcept] = field(default_factory=list)
    market_analysis: Optional[MarketAnalysis] = None
    reports: Dict[str, str] = field(default_factory=dict)
    completed_at: str = field(default_factory=lambda: datetime.now().isoformat())
    # "ok" when every stage completed, "partial" if any stage failed.
    status: str = "ok"
    # Per-stage record: {stage, status, duration_ms, error}. Lets callers see
    # exactly which agents ran, how long they took, and what (if anything) failed.
    execution_trace: List[Dict[str, Any]] = field(default_factory=list)

    @property
    def failed_stages(self) -> List[str]:
        return [s["stage"] for s in self.execution_trace if s.get("status") == "failed"]

    def to_json(self) -> str:
        return json.dumps({
            "pipeline_id": self.pipeline_id,
            "status": self.status,
            "opportunities_count": len(self.opportunities),
            "concepts_count": len(self.concepts),
            "failed_stages": self.failed_stages,
            "completed_at": self.completed_at,
        }, indent=2)
