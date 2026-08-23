# Static Publication Boundaries

## Decide the runtime first

Use GitHub Pages only for a static artifact: HTML, CSS, browser JavaScript, images, downloadable source files, and documentation. Inspect the project before adding a workflow.

| Project feature | GitHub Pages alone | Required publication choice |
|---|---|---|
| Static HTML / client-only app | Supported. | Deploy a static artifact. |
| Server-side rendering | Unsupported at runtime. | Keep a Worker, Node, or compatible SSR host. |
| API routes, databases, secrets, authentication | Unsupported at runtime. | Keep a backend-capable host. |
| Research documentation and visual assets | Supported. | Build a companion static archive with source links. |

## Companion-archive pattern

1. Build a separate static directory such as `dist-pages/`.
2. Include a clear title, the repository and commit reference, research boundaries, regeneration commands, links to versioned source, diagrams and generated outputs.
3. Do not copy server-only routes or suggest that interactive persistence works on Pages.
4. Use a GitHub Actions Pages workflow with `pages: write` and `id-token: write` permissions.
5. In repository settings, select **Pages → Source → GitHub Actions** once. The workflow then deploys the static artifact on future pushes.

## Verification

Validate the static build locally. After the workflow runs, confirm its artifact and deployment URL. Treat a deployment failure as a hosting/configuration issue; do not redesign the research model to work around it.
