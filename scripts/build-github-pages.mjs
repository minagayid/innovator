#!/usr/bin/env node
/**
 * Build a static GitHub Pages companion archive for Innovator.
 * The main Vinext application has server-rendered routes and APIs; this script
 * intentionally publishes documentation, visual assets, source links and
 * regeneration commands only.
 */
import { copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "dist-pages");
const repository = "https://github.com/minagayid/innovator";
const sourceRoot = `${repository}/tree/main/inventions`;

const artifacts = [
  {
    name: "AURORA",
    label: "Non-nuclear thermal containment rig",
    evidence: "Finite thermal-network model with a sector fault and a common-cooling negative control.",
    gate: "Run a pre-registered multi-sector electrically heated rig test.",
    image: "aurora_multisector_test_rig.png",
    source: "01_aurora_veilight_energy-and-interstellar/validation",
    command: "python3 aurora_thermal_containment.py --output-dir outputs/aurora",
    color: "#2c735b",
  },
  {
    name: "VEILIGHT",
    label: "Low-power sail coupon laboratory",
    evidence: "Finite photon-force, restoring-response and thermal-balance screening with a flat control.",
    gate: "Measure lateral recovery and thermal margin of a vacuum coupon.",
    image: "veilight_coupon_test_chamber.png",
    source: "01_aurora_veilight_energy-and-interstellar/validation",
    command: "python3 veilight_sail_dynamics.py --output-dir outputs/veilight",
    color: "#426aa1",
  },
  {
    name: "TIDEGILL",
    label: "Direct-carbon research module",
    evidence: "A gated manufacturing and supply-chain roadmap for a sealed laboratory module.",
    gate: "Reconcile feed, energy, gas, solids and sample custody before material claims.",
    image: "tidegill_direct_carbon_research_module.png",
    source: "02_tidegill_carbon-cycle/manufacturing",
    command: "Review the versioned roadmap and supplier qualification template.",
    color: "#2b7b88",
  },
  {
    name: "NEREID",
    label: "Common safety capsule with one kit at a time",
    evidence: "Finite road, static-lift, water-reserve, shallow-recovery and single-fault supervisor screens.",
    gate: "Prove a physical capsule-interface fault-injection matrix before kit integration.",
    image: "nereid_mode_envelopes.png",
    source: "03_nereid_common-safety-capsule/simulation",
    command: "python3 nereid_mode_envelopes.py --output-dir outputs/nereid",
    color: "#8a5f36",
  },
];

const assetSources = [
  ["public/engineering/aurora_multisector_test_rig.png", "aurora_multisector_test_rig.png"],
  ["public/engineering/veilight_coupon_test_chamber.png", "veilight_coupon_test_chamber.png"],
  ["public/engineering/tidegill_direct_carbon_research_module.png", "tidegill_direct_carbon_research_module.png"],
  ["inventions/03_nereid_common-safety-capsule/simulation/outputs/nereid/nereid_mode_envelopes.png", "nereid_mode_envelopes.png"],
  ["inventions/03_nereid_common-safety-capsule/schematics/nereid_common_capsule_architecture.png", "nereid_common_capsule_architecture.png"],
  ["inventions/03_nereid_common-safety-capsule/schematics/nereid_fail_closed_supervisor.png", "nereid_fail_closed_supervisor.png"],
  ["inventions/03_nereid_common-safety-capsule/schematics/nereid_qualification_sequence.png", "nereid_qualification_sequence.png"],
];

function ensureCopy(relativeSource, relativeDestination) {
  const source = resolve(root, relativeSource);
  const destination = resolve(output, relativeDestination);
  if (!existsSync(source)) throw new Error(`Required publication asset is absent: ${relativeSource}`);
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(source, destination);
}

rmSync(output, { recursive: true, force: true });
mkdirSync(resolve(output, "assets"), { recursive: true });
for (const [source, destination] of assetSources) ensureCopy(source, `assets/${destination}`);

const cards = artifacts.map((item) => `
  <article class="card" style="--accent:${item.color}">
    <img src="assets/${item.image}" alt="${item.name} bounded research test article or evidence plot">
    <div class="card-body">
      <p class="eyebrow">${item.name}</p>
      <h2>${item.label}</h2>
      <p>${item.evidence}</p>
      <p class="gate"><strong>First gate:</strong> ${item.gate}</p>
      <pre><code>${item.command}</code></pre>
      <a href="${sourceRoot}/${item.source}" target="_blank" rel="noreferrer">Open versioned source ↗</a>
    </div>
  </article>`).join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Static research archive for the Innovator bounded-invention workspaces.">
  <title>Innovator — Reproducible Engineering Archive</title>
  <style>
    :root{--ink:#17221e;--muted:#627169;--paper:#f7faf7;--line:#dbe5dd;--dark:#10251d}*{box-sizing:border-box}body{margin:0;color:var(--ink);background:var(--paper);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.55}.wrap{width:min(1120px,calc(100% - 40px));margin:auto}header{background:linear-gradient(135deg,#0f2d21,#1c5a41);color:white;padding:68px 0 54px}header p{max-width:760px;color:#d2e4db}.eyebrow{font-weight:800;letter-spacing:.12em;font-size:.73rem;color:var(--accent,#68bc95);text-transform:uppercase;margin:0 0 10px}h1{font-size:clamp(2.35rem,5vw,4.75rem);letter-spacing:-.055em;line-height:1.01;margin:.1em 0 .25em}h2{font-size:1.35rem;line-height:1.2;margin:.15em 0 .65em}main{padding:44px 0 70px}.notice{border-left:4px solid #d39143;background:#fff7e9;padding:16px 20px;margin:0 0 32px}.notice p{margin:0}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}.card{border:1px solid var(--line);border-top:5px solid var(--accent);background:white;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(19,48,35,.05)}.card>img{width:100%;height:220px;object-fit:cover;display:block;background:#edf3ef}.card-body{padding:22px}.card p{color:var(--muted)}.gate{border-top:1px solid var(--line);padding-top:14px}.card a{font-weight:800;color:#1b6548;text-decoration:none}pre{overflow:auto;white-space:pre-wrap;background:#10251d;color:#dbeee4;padding:12px;border-radius:7px;font-size:.76rem;line-height:1.4}.schematics{margin-top:48px;padding-top:36px;border-top:1px solid var(--line)}.schematics img{display:block;width:100%;margin:18px 0;border:1px solid var(--line);border-radius:8px;background:white}footer{background:#eaf1ec;padding:28px 0;color:#55675e;font-size:.9rem}footer a{color:#1c6548;font-weight:700}@media(max-width:760px){.grid{grid-template-columns:1fr}header{padding:46px 0}.card>img{height:190px}}
  </style>
</head>
<body>
<header><div class="wrap"><p class="eyebrow">Static companion archive</p><h1>Innovator<br>reproducible engineering</h1><p>Versioned research workspaces for bounded invention mechanisms, finite validation models, test gates, technical diagrams and traceable source files.</p></div></header>
<main class="wrap"><section class="notice"><p><strong>Research boundary.</strong> This static archive is not the full server-rendered Innovator application. It contains no APIs, persistence, authentication or deployment claims. Each item below is finite research evidence—not a build release, safety case, certificate, mission result, carbon-removal claim or commercial product.</p></section><section class="grid">${cards}</section><section class="schematics"><p class="eyebrow" style="--accent:#8a5f36">NEREID technical schematics</p><h2>Common capsule, fail-closed supervisor and qualification sequence</h2><p>These are system schematics only. They have no dimensions, fabrication tolerances, load ratings, wiring release or approval status.</p><img src="assets/nereid_common_capsule_architecture.png" alt="NEREID common safety capsule and separate mobility kits schematic"><img src="assets/nereid_fail_closed_supervisor.png" alt="NEREID fail-closed mode supervisor schematic"><img src="assets/nereid_qualification_sequence.png" alt="NEREID qualification sequence schematic"></section></main>
<footer><div class="wrap">Generated from the public <a href="${repository}" target="_blank" rel="noreferrer">Innovator repository</a>. Review source, assumptions, controls and proof gaps before reusing any result.</div></footer>
</body></html>`;

writeFileSync(resolve(output, "index.html"), html);
writeFileSync(resolve(output, ".nojekyll"), "");
console.log(`Static GitHub Pages companion built: ${output}`);
