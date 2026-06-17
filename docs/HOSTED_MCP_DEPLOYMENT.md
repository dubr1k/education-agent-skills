# Hosted MCP deployment checklist

This checklist is for self-hosting the bilingual Educational Skills RU MCP server over HTTP, for example on Vercel.

Use hosted MCP only when local plugin, local skill files, or local stdio MCP are not enough. Hosted MCP creates infrastructure cost and exposes a remote endpoint, so ship it with token-based access enabled.

## Release inputs

- Repository is on the intended branch, normally `main`.
- `registry.json` reports 165 skills across 20 domains.
- `mcp-server/src/skills.json` is committed and in sync with the skills.
- Root `CHANGELOG.md` describes the current RU fork release.
- `mcp-server/CHANGELOG.md` describes MCP runtime changes.
- `mcp-server/README.md` explains snapshot runtime, local stdio, hosted HTTP, auth, and `SKILLS_FILTER`.

## Build and bundle

Run this from a clean checkout before deployment:

```bash
PYTHONPATH=/tmp/educational-skills-pyyaml python3 scripts/generate-registry.py
cd mcp-server
npm install
npm run bundle-skills
npm run build
npm test
cd ..
npm test
git diff --check
```

Do not deploy if `registry.json` or `mcp-server/src/skills.json` changes during this sequence without committing those files.

## Hosted HTTP endpoint

- `/mcp` is rewritten to `mcp-server/api/mcp.ts` by `mcp-server/vercel.json`.
- The handler uses `StreamableHTTPServerTransport` in stateless JSON response mode.
- The handler imports the bundled `mcp-server/src/skills.json`; it does not read live `SKILL.md` files in production.
- CORS allows MCP clients to send `Authorization`, `Content-Type`, `mcp-session-id`, and `mcp-protocol-version`.
- Anonymous requests must fail with a `401` token-required response.

## Required environment

Configure at least one hosted auth source:

- `MCP_TOKEN_SIGNING_SECRET` for signed bearer or query tokens.
- `MCP_ACCESS_TOKEN_HASHES` for pre-hashed emergency/manual tokens.
- `MCP_ACCESS_TOKENS` only for tightly controlled manual deployments.

Recommended:

- `MCP_PUBLIC_BASE_URL` set to the public deployment base URL.
- `MCP_OAUTH_SIGNING_SECRET` set separately from `MCP_TOKEN_SIGNING_SECRET` for OAuth compatibility.
- `SKILLS_FILTER` only when intentionally deploying a smaller domain subset.

Do not run a public hosted endpoint with no configured auth source.
Prefer `Authorization: Bearer YOUR_TOKEN` when the client supports headers. Use `?token=` only for clients that cannot set headers, because query-token URLs can leak through logs, browser history, screenshots, and shared links.

## Vercel setup

- Use `mcp-server` as the Vercel project root.
- Keep `mcp-server/vercel.json` committed; it rewrites `/mcp` to `/api/mcp` and exposes the OAuth `.well-known` endpoints.
- `npm run build` compiles the TypeScript server and copies `src/skills.json` into `dist/skills.json`.
- Vercel bundles `api/*` handlers separately; keep Playwright hosted-auth tests in the deployment gate because plain `npm run build` does not exercise every API route by itself.

## Smoke tests

For a local hosted-HTTP smoke test, run:

```bash
cd mcp-server
npm run build
npm run smoke:hosted
```

The local smoke test starts a temporary HTTP server around the hosted handlers, verifies anonymous `401`, OAuth metadata, authenticated `tools/list`, authenticated `prompts/list`, and Russian `find_skills` / `suggest_skills`.

For a real deployment, provide the hosted URL and token:

```bash
cd mcp-server
MCP_HTTP_URL=https://YOUR_DEPLOYMENT/mcp MCP_ACCESS_TOKEN=YOUR_TOKEN npm run smoke:hosted
```

If you do not have a token yet, you can still verify the hosted auth boundary and OAuth metadata:

```bash
cd mcp-server
MCP_HTTP_URL=https://YOUR_DEPLOYMENT/mcp npm run smoke:hosted
```

After deployment, verify:

```bash
curl -i https://YOUR_DEPLOYMENT/mcp
```

Expected without token:

- HTTP `401`.
- JSON body with `Hosted MCP access token required`.
- `WWW-Authenticate` header.
- protected resource metadata under `/.well-known/oauth-protected-resource/mcp`.

OAuth metadata:

```bash
curl -i https://YOUR_DEPLOYMENT/.well-known/oauth-protected-resource/mcp
curl -i https://YOUR_DEPLOYMENT/.well-known/oauth-authorization-server
```

Then verify with a valid token:

```bash
curl -s https://YOUR_DEPLOYMENT/mcp?token=YOUR_TOKEN \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  --data '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

Expected with token:

- HTTP `200`.
- `list_skills`, `find_skills`, `suggest_skills`, and `get_skill_details` are present.
- Unfiltered `tools/list` exposes 169 tools: 165 skills plus 4 meta-tools.
- Unfiltered `prompts/list` exposes 165 prompts.
- Skill tools and prompts reflect the current bundled snapshot.
- Russian queries such as `ФГОС диагностическая работа критерии оценивания` return relevant results.
- If `SKILLS_FILTER` is configured, excluded domains do not appear.

## Client setup

For clients that support bearer headers, prefer:

```text
Authorization: Bearer YOUR_TOKEN
```

For clients that cannot send headers, use:

```text
https://YOUR_DEPLOYMENT/mcp?token=YOUR_TOKEN
```

Local clients should prefer stdio when possible:

```bash
node /absolute/path/to/education-agent-skills/mcp-server/dist/index.js
```

## Operations and rollback

- Keep the previous successful deployment available until the new smoke tests pass.
- Roll back if anonymous requests do not return `401`.
- Roll back if `tools/list` omits meta-tools or reports an unexpected skill count.
- Roll back if Russian `suggest_skills` smoke queries stop returning relevant education domains.
- Rotate tokens if a URL with query-token access is shared publicly.
- Rebuild and redeploy after any `SKILL.md` change; production reads the snapshot, not live skill files.
- Add platform-level rate limiting or WAF protection for public deployments; the server currently relies on token auth and does not implement per-token quotas.
- Keep previous signing secrets available during staged rollback if you need existing signed tokens or OAuth codes to keep working.

## Privacy

- Do not request or store student names, grades, personal data, or confidential school materials for token issuance.
- Treat hosted MCP prompts as remote traffic; advise local use for sensitive classroom context.
- Keep logs focused on operational metadata, not teaching content.
