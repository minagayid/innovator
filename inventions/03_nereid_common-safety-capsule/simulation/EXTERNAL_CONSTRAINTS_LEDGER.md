# External Constraints Ledger

The NEREID simulation and deployment work uses the following external constraints. These are **boundaries**, not a claim of compliance or endorsement.

| Source | Finding used | Design consequence |
|---|---|---|
| FAA, *AC 21.17-4 — Type Certification—Powered-lift* [1] | Powered-lift is a special-class certification path with type-specific performance-based airworthiness criteria; the guidance discusses complex integrated distributed-propulsion designs and dedicated function / reliability test expectations. | A static thrust screen is explicitly not flight certification. NEREID flight testing remains restricted and separately qualified from its road and water kits. |
| U.S. Coast Guard, *Simplified Stability* [2] | The Coast Guard maintains distinct marine policy and stability standards functions. | A buoyancy arithmetic screen is not intact/damaged stability or marine compliance evidence. |
| GitHub Docs, *Creating a GitHub Pages site* [3] | Pages deploys static files or an Actions-generated artifact and cannot serve server-side languages. | The SSR / API Innovator application cannot be represented as a full GitHub Pages deployment without changing its runtime. The deployment path must instead produce a transparent static companion archive. |
| Vinext documentation [4] | Vinext supports static export, but the existing application contains server-rendered routes and API endpoints; Cloudflare Workers is its most direct runtime target. | Preserve the full application for a worker-capable host and create a separate static Pages artifact rather than publishing a falsely functional SSR build. |

## References

[1] [FAA, “AC 21.17-4 — Type Certification—Powered-lift.”](https://www.faa.gov/media/80526)

[2] [U.S. Coast Guard, “Simplified Stability.”](https://www.dco.uscg.mil/Our-Organization/Assistant-Commandant-for-Prevention-Policy-CG-5P/Office-of-Design-and-Engineering-Standards-CG-ENG/Naval-Architecture-Division-ENG-2/Simplified-Stability/)

[3] [GitHub Docs, “Creating a GitHub Pages site.”](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

[4] [Cloudflare Vinext documentation.](https://github.com/cloudflare/vinext)
