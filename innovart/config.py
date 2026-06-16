"""
InnovaRT - Patent-Aware Innovation & Commercialization System
Configuration module
"""

from dataclasses import dataclass
from typing import Optional
import os


@dataclass
class Config:
    """Configuration for the InnovaRT system."""

    # System
    project_name: str = "InnovaRT"
    version: str = "1.0.0"
    debug: bool = False

    # Data sources
    wipo_url: str = "https://patentscope.wipo.int"
    uspto_url: str = "https://patentcenter.uspto.gov"
    epo_url: str = "https://worldwide.espacenet.com"

    # AI/LLM settings
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    default_model: str = "gpt-4"

    # Storage
    data_dir: str = "./data"
    reports_dir: str = "./reports"
    vector_db_path: str = "./data/vector_db"

    # Orchestration
    max_agents: int = 10
    parallel_execution: bool = True

    def __post_init__(self):
        """Load environment variables."""
        self.openai_api_key = os.getenv("OPENAI_API_KEY", self.openai_api_key)
        self.anthropic_api_key = os.getenv("ANTHROPIC_API_KEY", self.anthropic_api_key)

        # Ensure directories exist
        for dir_path in [self.data_dir, self.reports_dir, self.vector_db_path]:
            os.makedirs(dir_path, exist_ok=True)


# Global config instance
config = Config()
