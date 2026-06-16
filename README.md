# InnovaRT - Patent-Aware Innovation & Commercialization System

A multi-agent Python system for technology scouting, innovation analysis, patent landscaping, and commercialization — fully compliant with intellectual property law.

## Architecture

```
Patent Scout → Research Agent → Innovation Architect → Multimodal Design →
Patentability Analyzer → Engineering Optimizer → Market Intelligence →
Commercialization → Marketing → Sales
```

## Agents (10 total)

| # | Agent | Role |
|---|-------|------|
| 1 | Patent Scout | Search WIPO, USPTO, EPO for opportunities |
| 2 | Scientific Research Agent | Gather scientific evidence from PubMed/arXiv |
| 3 | Innovation Architect | Create genuinely new invention concepts (TRIZ-based) |
| 4 | Multimodal Design Agent | Generate engineering designs and prototypes |
| 5 | Patentability Analyzer | Assess new-invention patent eligibility |
| 6 | Engineering Optimization Agent | Improve cost, reliability, manufacturability |
| 7 | Market Intelligence Agent | TAM/SAM/SOM analysis, competitor mapping |
| 8 | Commercialization Agent | Licensing strategy, investor materials |
| 9 | Marketing Agent | Brand, SEO, campaigns, sales assets |
| 10 | Sales Agent | Lead generation, CRM, negotiation support |

## Quick Start

```bash
# Create virtual environment
python3 -m venv .venv && source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run full pipeline
python main.py --query "AI healthcare"

# Run with verbose logging
python main.py -q "clean energy" -n 10 -v

# Check agent status
python main.py --status
```

## Project Structure

```
innovart/
├── main.py                  # CLI entry point
├── requirements.txt
├── pyproject.toml
├── README.md
├── innovart/
│   ├── __init__.py
│   ├── config.py            # System configuration
│   ├── models.py            # Data models (Opportunity, Concept, etc.)
│   ├── utils.py             # Logging, JSON helpers
│   ├── orchestrator.py      # 10-agent pipeline coordinator
│   └── agents/
│       ├── __init__.py
│       ├── base.py          # Abstract BaseAgent class
│       ├── patent_scout.py
│       ├── research_agent.py
│       ├── innovation_architect.py
│       ├── multimodal_design.py
│       ├── patentability_analyzer.py
│       ├── engineering_optimizer.py
│       ├── market_intelligence.py
│       ├── commercialization.py
│       ├── marketing.py
│       └── sales.py
└── tests/
    ├── test_models.py
    ├── test_agents.py
    ├── test_orchestrator.py
    └── test_base_agent.py
```

## Compliance

InnovaRT is designed for **lawful patent-aware innovation**. It:
- Searches public patent databases for white-space opportunities
- Creates genuinely novel inventions that avoid existing patent claims
- Generates commercialization strategies for new IP
- Does NOT bypass, copy, or infringe existing patents

## License

MIT
