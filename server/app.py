"""InnovaRT FastAPI backend - REST API over the 10-agent pipeline."""

import threading
import time
import uuid
from datetime import datetime
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from innovart import config
from innovart.orchestrator import InnovaRTOrchestrator
from . import db

STATIC_DIR = Path(__file__).resolve().parent / "static"

AGENTS = [
    {"name": "Patent Scout", "role": "Search WIPO, USPTO, EPO for opportunities", "icon": "radar"},
    {"name": "Research Agent", "role": "Gather scientific evidence from PubMed/arXiv", "icon": "flask"},
    {"name": "Innovation Architect", "role": "Create new invention concepts (TRIZ-based)", "icon": "bulb"},
    {"name": "Multimodal Design", "role": "Generate engineering designs and prototypes", "icon": "cube"},
    {"name": "Patentability Analyzer", "role": "Assess new-invention patent eligibility", "icon": "shield"},
    {"name": "Engineering Optimizer", "role": "Improve cost, reliability, manufacturability", "icon": "gear"},
    {"name": "Market Intelligence", "role": "TAM/SAM/SOM analysis, competitor mapping", "icon": "chart"},
    {"name": "Commercialization", "role": "Licensing strategy, investor materials", "icon": "briefcase"},
    {"name": "Marketing", "role": "Brand, SEO, campaigns, sales assets", "icon": "megaphone"},
    {"name": "Sales", "role": "Lead generation, CRM, negotiation support", "icon": "handshake"},
]

app = FastAPI(title="InnovaRT API", version=config.version)
db.init_db()

# Timestamp of the most recent request; the desktop launcher's watchdog uses
# this to shut the server down once the dashboard window is closed.
LAST_REQUEST = {"t": time.time()}


@app.middleware("http")
async def _track_activity(request, call_next):
    LAST_REQUEST["t"] = time.time()
    return await call_next(request)


class RunRequest(BaseModel):
    query: str = Field(default="emerging technologies", min_length=1, max_length=300)
    max_results: int = Field(default=5, ge=1, le=25)


def _execute_pipeline(run_id: str, query: str, max_results: int) -> None:
    try:
        orchestrator = InnovaRTOrchestrator()
        result = orchestrator.run_pipeline(query=query, max_results=max_results)
        db.complete_run(run_id, result, datetime.now().isoformat())
    except Exception as exc:  # pragma: no cover - defensive
        db.fail_run(run_id, str(exc), datetime.now().isoformat())


@app.get("/api/health")
def health():
    return {"status": "ok", "version": config.version, "db": str(db.DB_PATH)}


@app.get("/api/agents")
def agents():
    return {"agents": AGENTS}


@app.get("/api/stats")
def stats():
    return db.get_stats()


@app.post("/api/pipeline/run", status_code=202)
def run_pipeline(req: RunRequest):
    run_id = str(uuid.uuid4())[:8]
    db.create_run(run_id, req.query, req.max_results, datetime.now().isoformat())
    thread = threading.Thread(
        target=_execute_pipeline, args=(run_id, req.query, req.max_results), daemon=True
    )
    thread.start()
    return {"run_id": run_id, "status": "running"}


@app.get("/api/runs")
def runs(limit: int = 50):
    return {"runs": db.list_runs(limit=min(limit, 200))}


@app.get("/api/runs/{run_id}")
def run_detail(run_id: str):
    run = db.get_run(run_id)
    if run is None:
        raise HTTPException(status_code=404, detail="Run not found")
    return run


@app.delete("/api/runs/{run_id}")
def remove_run(run_id: str):
    if not db.delete_run(run_id):
        raise HTTPException(status_code=404, detail="Run not found")
    return {"deleted": run_id}


@app.get("/api/opportunities")
def opportunities(limit: int = 200):
    return {"opportunities": db.list_opportunities(limit=min(limit, 500))}


@app.get("/api/concepts")
def concepts(limit: int = 200):
    return {"concepts": db.list_concepts(limit=min(limit, 500))}


@app.get("/")
def index():
    return FileResponse(STATIC_DIR / "index.html")


app.mount("/", StaticFiles(directory=STATIC_DIR), name="static")
