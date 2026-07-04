/* InnovArt dashboard - vanilla JS, no dependencies */

const $ = (id) => document.getElementById(id);
const api = async (path, opts) => {
  const res = await fetch(path, opts);
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || res.statusText);
  return res.json();
};

const PRIORITY_COLORS = { CRITICAL: "#f87171", HIGH: "#22d3ee", MEDIUM: "#a78bfa", LOW: "#8b96b8" };
const fmtMoney = (n) => {
  if (n >= 1e9) return "$" + (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(1) + "M";
  return "$" + Math.round(n).toLocaleString();
};
const fmtDate = (iso) => iso ? new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "—";
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- navigation ---------- */
function switchView(name) {
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach((n) => n.classList.toggle("active", n.dataset.view === name));
  $("view-" + name).classList.add("active");
  if (name === "overview") loadOverview();
  if (name === "opportunities") loadOpportunities();
  if (name === "concepts") loadConcepts();
  if (name === "history") loadHistory();
}
document.querySelectorAll(".nav-item").forEach((btn) =>
  btn.addEventListener("click", () => switchView(btn.dataset.view))
);

function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ---------- health ---------- */
async function checkHealth() {
  try {
    await api("/api/health");
    $("apiStatus").className = "status-dot online";
    $("apiStatusText").textContent = "API online · SQLite";
  } catch {
    $("apiStatus").className = "status-dot offline";
    $("apiStatusText").textContent = "API offline";
  }
}

/* ---------- overview ---------- */
function animateCount(el, target, suffix = "") {
  const start = performance.now(), dur = 700, from = 0;
  const step = (t) => {
    const p = Math.min((t - start) / dur, 1);
    el.textContent = Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3))) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

async function loadOverview() {
  const s = await api("/api/stats");
  animateCount($("statRuns"), s.total_runs);
  animateCount($("statOpps"), s.total_opportunities);
  animateCount($("statConcepts"), s.total_concepts);
  animateCount($("statCommercial"), Math.round(s.avg_commercial_potential * 100), "%");
  $("statRunsSub").textContent = `${s.completed_runs} completed`;
  $("statOppsSub").textContent = `avg score ${(s.avg_opportunity_score * 100).toFixed(0)}%`;
  $("statConceptsSub").textContent = `avg novelty ${(s.avg_novelty_score * 100).toFixed(0)}%`;

  // market bars
  const mb = $("marketBars");
  if (s.latest_market && s.latest_market.tam > 0) {
    const m = s.latest_market;
    const rows = [
      ["TAM — Total Addressable", m.tam, "linear-gradient(90deg,#22d3ee,#67e8f9)", 100],
      ["SAM — Serviceable Addressable", m.sam, "linear-gradient(90deg,#a78bfa,#c4b5fd)", (m.sam / m.tam) * 100],
      ["SOM — Serviceable Obtainable", m.som, "linear-gradient(90deg,#34d399,#6ee7b7)", (m.som / m.tam) * 100],
    ];
    mb.innerHTML = rows.map(([label, val, grad, pct]) => `
      <div class="mrow">
        <div class="mlabel"><b>${label}</b><span>${fmtMoney(val)}</span></div>
        <div class="mtrack"><div class="mfill" style="width:0;background:${grad}" data-w="${pct}"></div></div>
      </div>`).join("");
    requestAnimationFrame(() =>
      mb.querySelectorAll(".mfill").forEach((f) => (f.style.width = f.dataset.w + "%"))
    );
  } else {
    mb.innerHTML = '<div class="empty-hint">Run the pipeline to generate market analysis</div>';
  }

  drawDonut(s.priority_breakdown || {});

  // recent runs
  const { runs } = await api("/api/runs?limit=5");
  renderRunList($("recentRuns"), runs, false);
}

function drawDonut(breakdown) {
  const svg = $("priorityDonut");
  const legend = $("donutLegend");
  const entries = Object.entries(breakdown).filter(([, n]) => n > 0);
  const total = entries.reduce((a, [, n]) => a + n, 0);
  svg.innerHTML = "";
  if (!total) {
    svg.innerHTML = `<circle cx="60" cy="60" r="46" fill="none" stroke="rgba(120,150,255,.12)" stroke-width="14"/>
      <text x="60" y="65" text-anchor="middle" fill="#8b96b8" font-size="11">no data</text>`;
    legend.innerHTML = "";
    return;
  }
  const C = 2 * Math.PI * 46;
  let offset = 0;
  entries.forEach(([prio, n]) => {
    const frac = n / total;
    const seg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    seg.setAttribute("cx", 60); seg.setAttribute("cy", 60); seg.setAttribute("r", 46);
    seg.setAttribute("fill", "none");
    seg.setAttribute("stroke", PRIORITY_COLORS[prio] || "#8b96b8");
    seg.setAttribute("stroke-width", 14);
    seg.setAttribute("stroke-dasharray", `${frac * C} ${C}`);
    seg.setAttribute("stroke-dashoffset", -offset * C);
    seg.setAttribute("transform", "rotate(-90 60 60)");
    seg.setAttribute("stroke-linecap", "butt");
    svg.appendChild(seg);
    offset += frac;
  });
  const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
  label.setAttribute("x", 60); label.setAttribute("y", 66);
  label.setAttribute("text-anchor", "middle");
  label.setAttribute("fill", "#e6ecff"); label.setAttribute("font-size", "20");
  label.setAttribute("font-weight", "800");
  label.textContent = total;
  svg.appendChild(label);
  legend.innerHTML = entries.map(([p, n]) =>
    `<div class="lg"><span class="sw" style="background:${PRIORITY_COLORS[p]}"></span>${p} · ${n}</div>`).join("");
}

/* ---------- run lists ---------- */
function renderRunList(el, runs, withActions) {
  if (!runs.length) {
    el.innerHTML = '<div class="empty-hint">No runs yet — launch your first pipeline</div>';
    return;
  }
  el.innerHTML = runs.map((r) => `
    <div class="run-row">
      <span class="badge ${r.status}">${r.status}</span>
      <span class="run-query">${esc(r.query)}</span>
      <span class="run-meta">${r.opportunity_count} opps · ${r.concept_count} concepts</span>
      <span class="run-meta">${fmtDate(r.started_at)}</span>
      ${withActions ? `
        <button class="btn btn-view" onclick="viewRun('${r.id}')">View</button>
        <button class="btn btn-ghost" onclick="deleteRun('${r.id}')">Delete</button>` : ""}
    </div>`).join("");
}

async function loadHistory() {
  const { runs } = await api("/api/runs?limit=100");
  renderRunList($("historyList"), runs, true);
}

async function deleteRun(id) {
  if (!confirm("Delete this run and all its results?")) return;
  await api("/api/runs/" + id, { method: "DELETE" });
  toast("Run deleted");
  loadHistory();
}

async function viewRun(id) {
  const run = await api("/api/runs/" + id);
  switchView("pipeline");
  showRunResult(run);
}

/* ---------- pipeline ---------- */
let agents = [];
async function initAgentFlow() {
  ({ agents } = await api("/api/agents"));
  $("agentFlow").innerHTML = agents.map((a, i) => `
    <div class="agent-node" id="agent-${i}">
      <div class="anum">AGENT ${String(i + 1).padStart(2, "0")}</div>
      <div class="aname">${esc(a.name)}</div>
      <div class="arole">${esc(a.role)}</div>
    </div>`).join("");
}

let animTimer = null;
function animateAgents() {
  let i = 0;
  const nodes = agents.map((_, idx) => $("agent-" + idx));
  nodes.forEach((n) => (n.className = "agent-node"));
  animTimer = setInterval(() => {
    if (i > 0) { nodes[i - 1].classList.remove("active"); nodes[i - 1].classList.add("done"); }
    if (i < nodes.length) nodes[i].classList.add("active");
    i++;
    if (i > nodes.length) i = nodes.length; // hold on last until run completes
  }, 380);
}
function finishAgents(ok) {
  clearInterval(animTimer);
  agents.forEach((_, idx) => {
    const n = $("agent-" + idx);
    n.classList.remove("active");
    if (ok) n.classList.add("done");
  });
}

$("maxResults").addEventListener("input", (e) => ($("maxResultsVal").textContent = e.target.value));

$("launchBtn").addEventListener("click", async () => {
  const btn = $("launchBtn");
  const query = $("queryInput").value.trim() || "emerging technologies";
  btn.disabled = true;
  btn.textContent = "⚡ Running…";
  $("runResultPanel").style.display = "none";
  animateAgents();
  try {
    const { run_id } = await api("/api/pipeline/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, max_results: +$("maxResults").value }),
    });
    // poll until finished
    let run, tries = 0;
    do {
      await new Promise((r) => setTimeout(r, 450));
      run = await api("/api/runs/" + run_id);
    } while (run.status === "running" && ++tries < 120);
    finishAgents(run.status === "completed");
    if (run.status === "completed") {
      toast(`Pipeline complete — ${run.opportunities.length} opportunities`);
      showRunResult(run);
    } else {
      toast("Pipeline " + run.status + (run.error ? ": " + run.error : ""));
    }
  } catch (e) {
    finishAgents(false);
    toast("Error: " + e.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = "&#9889; Launch Pipeline";
  }
});

function scoreBar(label, value, color) {
  const pct = Math.round(value * 100);
  return `
    <div class="score-row"><span>${label}</span><b>${pct}%</b></div>
    <div class="mtrack" style="margin-bottom:10px"><div class="mfill" style="width:${pct}%;background:${color}"></div></div>`;
}

function oppCard(o) {
  return `
    <div class="item-card">
      <div class="ctop">
        <h4>${esc(o.title)}</h4>
        <span class="badge" style="color:${PRIORITY_COLORS[o.priority]};background:${PRIORITY_COLORS[o.priority]}22">${o.priority}</span>
      </div>
      <p>${esc(o.description)}</p>
      ${scoreBar("Opportunity", o.opportunity_score, "linear-gradient(90deg,#22d3ee,#67e8f9)")}
      ${scoreBar("Commercial", o.commercial_potential, "linear-gradient(90deg,#34d399,#6ee7b7)")}
      ${scoreBar("Legal risk", o.legal_risk, "linear-gradient(90deg,#fbbf24,#f87171)")}
      ${o.patent_id ? `<div class="patent-ref">${esc(o.patent_id)} · ${esc(o.patent_assignee || "")}</div>` : ""}
      ${(o.tags || []).length ? `<div class="tag-row">${o.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>` : ""}
    </div>`;
}

function conceptCard(c) {
  const specs = c.specs || c.technical_specifications || {};
  return `
    <div class="item-card">
      <div class="ctop">
        <h4>${esc(c.title)}</h4>
        <span class="badge" style="color:${PRIORITY_COLORS[c.priority]};background:${PRIORITY_COLORS[c.priority]}22">${c.priority}</span>
      </div>
      <p>${esc(c.description)}</p>
      ${scoreBar("Novelty", c.novelty_score, "linear-gradient(90deg,#a78bfa,#c4b5fd)")}
      ${Object.keys(specs).length ? `<div class="tag-row">${Object.entries(specs).slice(0, 4)
        .map(([k, v]) => `<span class="tag">${esc(k)}: ${esc(String(v).slice(0, 30))}</span>`).join("")}</div>` : ""}
    </div>`;
}

function showRunResult(run) {
  $("runResultPanel").style.display = "";
  $("runResultId").textContent = `#${run.id} · "${run.query}" · ${fmtDate(run.completed_at)}`;
  const m = run.market_analysis;
  $("runResultBody").innerHTML = `
    ${m ? `<div class="stat-grid" style="margin-bottom:18px">
      <div class="stat-card"><div class="stat-label">TAM</div><div class="stat-value accent-cyan">${fmtMoney(m.tam)}</div></div>
      <div class="stat-card"><div class="stat-label">SAM</div><div class="stat-value accent-violet">${fmtMoney(m.sam)}</div></div>
      <div class="stat-card"><div class="stat-label">SOM</div><div class="stat-value accent-green">${fmtMoney(m.som)}</div></div>
    </div>` : ""}
    <h3>Opportunities (${run.opportunities.length})</h3>
    <div class="card-grid" style="margin-bottom:22px">${run.opportunities.map(oppCard).join("") || '<div class="empty-hint">None</div>'}</div>
    <h3>Concepts (${run.concepts.length})</h3>
    <div class="card-grid">${run.concepts.map(conceptCard).join("") || '<div class="empty-hint">None</div>'}</div>`;
  $("runResultPanel").scrollIntoView({ behavior: "smooth" });
}

/* ---------- opportunities & concepts views ---------- */
async function loadOpportunities() {
  const { opportunities } = await api("/api/opportunities");
  $("oppList").innerHTML = opportunities.map(oppCard).join("") ||
    '<div class="empty-hint">No opportunities yet — run the pipeline first</div>';
}

async function loadConcepts() {
  const { concepts } = await api("/api/concepts");
  $("conceptList").innerHTML = concepts.map(conceptCard).join("") ||
    '<div class="empty-hint">No concepts yet — run the pipeline first</div>';
}

/* ---------- init ---------- */
window.switchView = switchView;
window.viewRun = viewRun;
window.deleteRun = deleteRun;
checkHealth();
setInterval(checkHealth, 15000);
initAgentFlow();
loadOverview();
