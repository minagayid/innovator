# GitHub Pages Companion Archive

The Innovator repository contains a Vinext application with server-rendered routes and API endpoints. **GitHub Pages cannot run that runtime.** The repository therefore ships a separate static companion archive for publicly browsing the engineering research, diagrams, renders, source links, regeneration commands, and a browser-based Hugging Face trial.

## Live LLM trial

The static page includes a **Try Innovator with a Hugging Face model** panel. A tester supplies their own fine-grained Hugging Face token with Inference Providers permission and an invention problem. The page calls `https://router.huggingface.co/v1/chat/completions` directly with `Qwen/Qwen3-4B-Instruct-2507:fastest` and renders a bounded candidate draft.

The tester's token is not embedded in the repository, injected by GitHub Actions, stored in local storage, or sent to Innovator. It remains in the page's in-memory form field and is sent directly to Hugging Face. This bring-your-own-token design is required because GitHub Pages is public static hosting and cannot protect a server secret. Hugging Face account credits, provider availability, rate limits, and browser network policy apply.

The static trial is intentionally less capable than the full application. It does not provide Google sign-in, private workspace persistence, quota enforcement, server-side provider routing, or the full structured disclosure API. The full server application keeps the owner's `HF_TOKEN` server-side and adds those controls when deployed on a server host.

## Local regeneration

```bash
pnpm install --frozen-lockfile
pnpm run pages:build
```

The command writes the static artifact to `dist-pages/`. It copies only approved visual assets and writes a static `index.html` with a visible research and credential boundary. Review the output locally before deployment. The directory is generated and intentionally ignored by Git.

## One-time GitHub setting

The deployment workflow is committed at [`.github/workflows/pages.yml`](.github/workflows/pages.yml). Open the repository's [Settings → Pages](https://github.com/minagayid/innovator/settings/pages) screen and select **GitHub Actions** as the publishing source. GitHub then authorizes the workflow to upload and deploy the static artifact.

The expected URL is `https://minagayid.github.io/innovator/` after the first successful workflow run. The workflow triggers on `main` and can also be started manually from the Actions tab.

## Boundaries

| What Pages publishes | What remains outside Pages |
|---|---|
| Static research archive, renders, schematics, source links, scope statements, regeneration commands and the tester-supplied-token Hugging Face trial. | The Vinext SSR application, API routes, authentication, database operations, file storage, server-side owner secrets, private workspaces, quotas and other server-bound behaviour. |

> Do not upload a server-side Hugging Face token or `.env` file to Pages. Do not describe the model draft as a patent search, novelty determination, patentability opinion, freedom-to-operate analysis, scientific result, safety case, or engineering release.

## References

- [GitHub Docs, Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Hugging Face chat completion API](https://huggingface.co/docs/inference-providers/en/tasks/chat-completion)
- [Hugging Face Inference Providers pricing](https://huggingface.co/docs/inference-providers/en/pricing)
