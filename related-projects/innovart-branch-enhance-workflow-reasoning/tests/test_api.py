"""API tests for the InnovaRT FastAPI backend."""

import os
import tempfile
import time

# Point the DB at a temp dir BEFORE importing the server package.
os.environ["INNOVART_DATA_DIR"] = tempfile.mkdtemp(prefix="innovart_test_")

from fastapi.testclient import TestClient  # noqa: E402

from server.app import app  # noqa: E402

client = TestClient(app)


def _run_pipeline(query="test energy", max_results=3, timeout=15.0):
    res = client.post("/api/pipeline/run", json={"query": query, "max_results": max_results})
    assert res.status_code == 202
    run_id = res.json()["run_id"]
    deadline = time.time() + timeout
    while time.time() < deadline:
        run = client.get(f"/api/runs/{run_id}").json()
        if run["status"] != "running":
            return run
        time.sleep(0.2)
    raise AssertionError("pipeline did not finish in time")


def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"


def test_agents_lists_ten():
    res = client.get("/api/agents")
    assert res.status_code == 200
    agents = res.json()["agents"]
    assert len(agents) == 10
    assert agents[0]["name"] == "Patent Scout"
    assert agents[-1]["name"] == "Sales"


def test_run_pipeline_completes_and_persists():
    run = _run_pipeline(query="AI healthcare")
    assert run["status"] == "completed"
    assert run["query"] == "AI healthcare"
    assert len(run["opportunities"]) > 0
    assert len(run["concepts"]) > 0
    assert run["market_analysis"] is not None
    assert run["market_analysis"]["tam"] > 0
    opp = run["opportunities"][0]
    assert 0 <= opp["opportunity_score"] <= 1
    assert opp["priority"] in ("LOW", "MEDIUM", "HIGH", "CRITICAL")
    assert isinstance(opp["tags"], list)


def test_runs_list_and_stats():
    _run_pipeline(query="quantum sensors")
    runs = client.get("/api/runs").json()["runs"]
    assert len(runs) >= 1
    assert runs[0]["opportunity_count"] > 0

    stats = client.get("/api/stats").json()
    assert stats["total_runs"] >= 1
    assert stats["total_opportunities"] > 0
    assert stats["avg_opportunity_score"] > 0
    assert stats["latest_market"]["tam"] > 0


def test_opportunities_and_concepts_endpoints():
    _run_pipeline(query="clean water")
    opps = client.get("/api/opportunities").json()["opportunities"]
    concepts = client.get("/api/concepts").json()["concepts"]
    assert len(opps) > 0
    assert len(concepts) > 0
    assert "run_query" in opps[0]
    # sorted by score desc
    scores = [o["opportunity_score"] for o in opps]
    assert scores == sorted(scores, reverse=True)


def test_delete_run():
    run = _run_pipeline(query="to be deleted")
    res = client.delete(f"/api/runs/{run['id']}")
    assert res.status_code == 200
    assert client.get(f"/api/runs/{run['id']}").status_code == 404


def test_delete_missing_run_404():
    assert client.delete("/api/runs/nonexistent").status_code == 404


def test_run_validation():
    res = client.post("/api/pipeline/run", json={"query": "", "max_results": 5})
    assert res.status_code == 422
    res = client.post("/api/pipeline/run", json={"query": "x", "max_results": 999})
    assert res.status_code == 422


def test_dashboard_served():
    res = client.get("/")
    assert res.status_code == 200
    assert "InnovArt" in res.text
    assert client.get("/styles.css").status_code == 200
    assert client.get("/app.js").status_code == 200
