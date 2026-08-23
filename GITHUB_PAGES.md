# GitHub Pages Companion Archive

The Innovator repository contains a Vinext application with server-rendered routes and API endpoints. **GitHub Pages cannot run that runtime.** The repository therefore ships a separate static companion archive for publicly browsing the engineering research, diagrams, renders, source links, and regeneration commands. It does not expose project persistence, APIs, authentication, or any server-side behaviour.

## Local regeneration

```bash
pnpm install --frozen-lockfile
pnpm run pages:build
```

The command writes the static artifact to `dist-pages/`. It copies only approved visual assets and writes a static `index.html` with a visible research boundary. Review the output locally before deployment. The directory is generated and intentionally ignored by Git.

## One-time GitHub setting

The tested workflow is stored as [`deployment-templates/deploy-pages.yml`](deployment-templates/deploy-pages.yml). It is kept outside `.github/workflows/` because the current automation credential is not permitted to create GitHub Actions workflow files. A repository administrator should copy that **unchanged** file to `.github/workflows/deploy-pages.yml` through the GitHub web editor or a token that has the `workflows` permission.

After the file is committed, open the repository’s **Settings → Pages** screen and select **GitHub Actions** as the publishing source. GitHub then authorizes the workflow to upload and deploy the static artifact.

The workflow triggers on `main` only when invention sources, relevant assets, the static builder, lockfile, package manifest, or the workflow itself changes. It can also be started manually from the Actions tab. Once GitHub finishes a deployment, the repository’s Pages settings show the generated URL.

## Boundaries

| What Pages publishes | What remains outside Pages |
|---|---|
| Static research archive, renders, schematics, source links, scope statements and regeneration commands. | The Vinext SSR application, API routes, authentication, database operations, file storage and other server-bound behaviour. |

> Do not change the workflow to upload `dist/` unless the application is first converted and verified as a complete static export. Doing so would create a site that appears deployed while silently losing server-dependent functionality. The only manual activation step is moving the reviewed template into `.github/workflows/`; it does not change the static artefact’s boundary.

## References

[1] [GitHub Docs, “Creating a GitHub Pages site.”](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

[2] [Vite, “Deploying a Static Site.”](https://vite.dev/guide/static-deploy)

[3] [Cloudflare Vinext documentation.](https://github.com/cloudflare/vinext)
