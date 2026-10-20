# Technical Reference Skill Set

A routed collection of reusable skills for selecting, inspecting, and applying the saved technical repositories across product engineering, backend systems, reverse engineering, and cybersecurity. This set complements—not replaces—the existing [Full-stack Engineering Skill Set](full-stack-engineering-suite.md), [Reference-Driven Engineering Skill Set](skill-sets/README.md), and evidence-first innovation and verification skills.

## Entry point

- [Technical Reference Router](technical-reference-router/SKILL.md) — choose the right existing or new specialist skill and determine which repositories deserve inspection for the task.

## Specialists

| Skill | Trigger | Principal references |
|---|---|---|
| [Backend and Cloud Reference Guide](backend-cloud-reference-guide/SKILL.md) | API/backend, signup/login, user data, Docker, cloud, deployment, hardening | FastAPI, FastAPI Full Stack Template, SQLAlchemy, Alembic, Pydantic Settings, PostgreSQL, Redis, Uvicorn, Supabase, Keycloak, ZITADEL, Authlib, Docker Compose, Traefik, Coolify, Bandit, pip-audit, Trivy, Terraform |
| [Reverse Engineering Investigation](reverse-engineering-investigation/SKILL.md) | App behavior, compiled code, binaries, obfuscated strings, memory captures | REA, Ghidra, Awesome Reverse Engineering, FLARE-FLOSS, Volatility 3 |
| [Authorized Security Assessment](authorized-security-assessment/SKILL.md) | Web security review, vulnerability reproduction, defensive validation, scoped penetration testing | OWASP Juice Shop, WebGoat, DVWA, ZAP, ASVS, Cheat Sheet Series |
| [Red-Team Emulation](red-team-emulation/SKILL.md) | Explicitly authorized adversary emulation and control validation | Metasploit, MITRE CALDERA, Atomic Red Team, MITRE ATT&CK |
| [Threat Research and Detection Engineering](threat-research-detection/SKILL.md) | Malware triage, indicators, detection rules, threat hunting, incident response | Sigma, YARA Rules, ATT&CK data, CAPEv2, Ghidra, FLARE-FLOSS, Volatility 3 |

## Routing policy

1. Start with the router for cross-cutting work; use the existing full-stack router for connected product changes and the reference-driven set for frontend/product architecture.
2. Inspect the actual target repository and requirements before choosing technologies or copying patterns.
3. Check current upstream docs, support status, compatibility, license, and security advisories when relevant. A remembered URL is a discovery aid, not proof of current maintenance.
4. Use deliberately vulnerable labs for hands-on web testing. Run disruptive tools only in owned or explicitly authorized, scoped environments.
5. Pair offensive understanding with defensive controls: mechanism, realistic impact, observability, mitigations, and safe validation.
6. Separate observed facts, reproducible results, inferences, hypotheses, and unknowns.
7. Make small, reviewable changes, run relevant tests, and report limitations. Never claim inspection, execution, exploit confirmation, commit, or deployment work that did not happen.

## Source catalog

Product engineering: [ArtCraft](https://github.com/storytold/artcraft), [Everything](https://github.com/HeyPuter/everything).

Reverse engineering: [REA](https://github.com/morluto/rea), [Ghidra](https://github.com/NationalSecurityAgency/ghidra), [Awesome Reverse Engineering](https://github.com/morluto/awesome-reverse-engineering), [FLARE-FLOSS](https://github.com/mandiant/flare-floss), [Volatility 3](https://github.com/volatilityfoundation/volatility3).

White-hat security: [OWASP Juice Shop](https://github.com/juice-shop/juice-shop), [WebGoat](https://github.com/WebGoat/WebGoat), [DVWA](https://github.com/digininja/DVWA), [OWASP ZAP](https://github.com/zaproxy/zaproxy), [ASVS](https://github.com/OWASP/ASVS), [Cheat Sheet Series](https://github.com/OWASP/CheatSheetSeries).

Authorized emulation and defensive analysis: [Metasploit](https://github.com/rapid7/metasploit-framework), [CALDERA](https://github.com/mitre/caldera), [Atomic Red Team](https://github.com/redcanaryco/atomic-red-team), [Sigma](https://github.com/SigmaHQ/sigma), [YARA Rules](https://github.com/Yara-Rules/rules), [ATT&CK STIX data](https://github.com/mitre-attack/attack-stix-data), [CAPEv2](https://github.com/kevoreilly/CAPEv2), [Awesome Pentest](https://github.com/enaqx/awesome-pentest).

Backend, identity, data, containers and cloud: see the [Backend and Cloud Reference Guide](backend-cloud-reference-guide/SKILL.md).

This collection does not imply permission to access third-party systems. It is a task-routing and engineering guide, not a claim that every upstream repository has been audited in full.
