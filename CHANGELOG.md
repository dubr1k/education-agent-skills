# Changelog

## RU fork v1.0.3 — 2026-06-17

- Rewrote fork setup instructions to be local-only.
- Replaced hosted/Vercel deployment docs with `docs/LOCAL_MCP.md`.
- Replaced `npm run smoke:hosted` with `npm run smoke:local-http`, which starts only a temporary `127.0.0.1` MCP HTTP smoke server.
- Removed remote hosted smoke instructions and Vercel config from the active fork workflow.

## RU fork v1.0.2 — 2026-06-17

- Added remote anonymous hosted smoke mode: `MCP_HTTP_URL=https://YOUR_DEPLOYMENT/mcp npm run smoke:hosted`.
- This mode verifies anonymous `401` and OAuth metadata when no access token is available, then instructs operators to set `MCP_ACCESS_TOKEN` for full authenticated smoke.

## RU fork v1.0.1 — 2026-06-17

- Added automated hosted-HTTP MCP smoke testing via `cd mcp-server && npm run smoke:hosted`.
- The smoke harness can run locally against the Vercel-style handlers or remotely with `MCP_HTTP_URL` and `MCP_ACCESS_TOKEN`.
- Smoke coverage includes anonymous `401`, OAuth metadata, authenticated `tools/list`, authenticated `prompts/list`, Russian `find_skills`, and Russian `suggest_skills`.

## RU fork — 2026-06-17

- Completed the bilingual RU/EN adaptation across all 165 skills and 20 domains.
- Added explicit `Russian / bilingual context` runtime guidance to every `SKILL.md` while preserving upstream-compatible English IDs, folder names, tool names, tags, evidence citations, schemas, and chaining metadata.
- Expanded Russian discovery coverage for `find_skills` and `suggest_skills`, including assessment, AI literacy, historical thinking, ecological inquiry, wellbeing/conflict, professional learning, systems thinking, and student-learning scenarios.
- Rebuilt `registry.json` and `mcp-server/src/skills.json` so local and hosted MCP clients serve the completed RU snapshot.
- Added regression guards for complete RU context coverage, Russian MCP discovery, MCP runtime documentation, and hosted access behavior.
- Documented how the MCP server works: pre-built snapshot runtime, local stdio transport, hosted HTTP transport, token-based access control, `SKILLS_FILTER`, and the fact that the calling model generates the final output.
- Added hosted MCP deployment checklist in [`docs/HOSTED_MCP_DEPLOYMENT.md`](docs/HOSTED_MCP_DEPLOYMENT.md).
- Release is based on the adaptation and polishing commits `092e008`, `11b1989`, and `5be6c24`, plus this release-note/checklist pass.
- Migration note: after any future `SKILL.md` edit, rebuild and commit both `registry.json` and `mcp-server/src/skills.json`; otherwise MCP deployments will serve a stale snapshot.

## v3.0 — May 2026

- Renamed from `claude-education-skills` to `education-agent-skills`
- Added OpenAI Codex plugin support (`.codex-plugin/plugin.json`)
- Added `AGENTS.md` for coding agent repo guidance
- README restructured for model-agnostic positioning — works with Claude, Codex, and any Agent Skills-compatible tool
- 131 skills across 17 domains

## v2.0 — April 2026

The library became compliant with the **Agent Skills 1.0 open standard**. What this meant in practice:

- **One-command install** — no manual setup, no copy-pasting prompts
- **Progressive disclosure** — skill metadata loads first; full skill content loads only when activated, keeping context lean
- **Auto-activation** — skills trigger when your conversation matches their description, without explicit invocation
- **Machine-readable registry** — `registry.json` indexes all skills with descriptions, tags, chaining metadata, and domain grouping for programmatic consumption
- **Backward compatible** — the MCP server, direct prompt use, and all existing workflows continued to work unchanged
