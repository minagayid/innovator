"""Utility functions for InnovaRT."""

import json
import logging
from typing import Any, Dict
from datetime import datetime


def setup_logging(level=logging.INFO):
    """Configure logging for the system."""
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    return logging.getLogger("innovart")


def save_json(data: Dict[str, Any], filepath: str) -> None:
    """Save data to a JSON file."""
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2, default=str)


def load_json(filepath: str) -> Dict[str, Any]:
    """Load data from a JSON file."""
    with open(filepath, "r") as f:
        return json.load(f)


def timestamp() -> str:
    """Return current timestamp string."""
    return datetime.now().isoformat()


def format_currency(value: float, currency: str = "$") -> str:
    """Format a value as currency."""
    if value >= 1e9:
        return f"{currency}{value / 1e9:.1f}B"
    elif value >= 1e6:
        return f"{currency}{value / 1e6:.1f}M"
    elif value >= 1e3:
        return f"{currency}{value / 1e3:.1f}K"
    return f"{currency}{value:.2f}"
