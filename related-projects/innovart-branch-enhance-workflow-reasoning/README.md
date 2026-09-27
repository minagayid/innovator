# InnovArt - Patent-Aware Innovation & Commercialization System

A multi-agent Python system for technology scouting, innovation analysis, patent landscaping, and commercialization — fully compliant with intellectual property law. Now with a **futuristic web dashboard**, a **FastAPI backend**, **SQLite persistence**, and a **one-click Windows desktop app**.

## Dashboard & Desktop App

InnovArt ships with an Innovation Command Center dashboard:

- **Overview** — animated stat cards, TAM/SAM/SOM market sizing bars, priority donut, recent runs
- **Run Pipeline** — launch all 10 agents with a live agent-flow animation
- **Opportunities / Concepts** — score-bar cards for every result across all runs
- **History** — every run stored in SQLite, view or delete any run

### Run the dashboard (dev)

```bash
pip install -r requirements.txt
uvicorn server.app:app --port 8765
# open http://127.0.0.1:8765
```

### Build the Windows desktop app (.exe + shortcut)

```powershell
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
.\build_exe.ps1     # builds dist\InnovArt.exe and creates a desktop shortcut
```

Double-click the **InnovArt** desktop shortcut: the backend starts on localhost, the dashboard opens in its own window, and the server shuts itself down when you close it. Data persists in `%LOCALAPPDATA%\InnovArt\innovart.db` (SQLite — free, embedded, zero-config).

### REST API

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Server + DB status |
| GET | `/api/stats` | Dashboard aggregates |
| GET | `/api/agents` | The 10-agent pipeline definition |
| POST | `/api/pipeline/run` | Launch a run `{query, max_results}` (202 + run_id) |
| GET | `/api/runs` | Run history |
| GET | `/api/runs/{id}` | Full run detail (opportunities, concepts, market) |
| DELETE | `/api/runs/{id}` | Delete a run |
| GET | `/api/opportunities` | All opportunities, score-sorted |
| GET | `/api/concepts` | All concepts, novelty-sorted |

## Architecture

```
Patent Scout → Research Agent → Innovation Architect → Multimodal Design →
Patentability Analyzer → Engineering Optimizer → Market Intelligence →
Commercialization → Marketing → Sales
```

**Resilient orchestration.** Each stage is wrapped so a single agent failure
is recorded and the pipeline continues — degrading downstream stages that
depended on the missing output — instead of crashing the whole run. Every run
carries an `execution_trace` (per-stage status, duration and error) and an
overall `status` of `ok` or `partial`, both persisted with the run and
returned from `GET /api/runs/{id}`.

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
├── desktop.py               # Desktop app launcher (PyInstaller entry point)
├── build_exe.ps1            # Builds InnovArt.exe + desktop shortcut
├── requirements.txt
├── pyproject.toml
├── README.md
├── server/
│   ├── app.py               # FastAPI backend (REST API + static hosting)
│   ├── db.py                # SQLite persistence layer
│   └── static/              # Dashboard frontend (HTML/CSS/JS, no build step)
├── assets/
│   └── make_icon.py         # App icon generator
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
