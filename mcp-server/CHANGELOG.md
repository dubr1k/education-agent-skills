# Changelog

## 0.4.3-ru — 2026-06-17

- Reframed MCP usage as local-only for this fork.
- Replaced `smoke:hosted` with `smoke:local-http`.
- Removed Vercel config from the active MCP server package.

## 0.4.2-ru — 2026-06-17

- Added remote anonymous mode to `npm run smoke:hosted` for deployments where the URL is known but the access token is not available locally.
- The script now verifies hosted auth rejection and OAuth metadata before requiring a token for full authenticated MCP checks.

## 0.4.1-ru — 2026-06-17

- Added `npm run smoke:hosted` for hosted-HTTP MCP smoke testing.
- Local mode starts a temporary HTTP server around the hosted/Vercel handlers.
- Remote mode checks a deployed endpoint via `MCP_HTTP_URL` and `MCP_ACCESS_TOKEN`.
- Smoke verifies anonymous auth rejection, OAuth metadata, tool/prompt counts, and Russian discovery.

## 0.4.0-ru — 2026-06-17

- Expanded the bundled MCP snapshot to 165 bilingual RU/EN skills across 20 domains.
- Added Russian-aware discovery coverage for `find_skills` and `suggest_skills`, including post-adaptation end-to-end scenarios.
- Documented the MCP runtime flow: `SKILL.md` files are bundled into `src/skills.json`, tools/prompts are registered from that snapshot, and the calling model generates the final output.
- Documented local stdio and hosted HTTP transports, hosted token auth, `SKILLS_FILTER`, and snapshot rebuild requirements.
- Added hosted deployment checklist in `../docs/HOSTED_MCP_DEPLOYMENT.md`.

## 0.3.0

- **Hybrid architecture**: skills registered as both MCP tools (111 total: 107 skills + 4 meta) and MCP prompts (107). Tools work in Claude.ai and future orchestrators. Prompts ready for Claude Desktop and clients that surface them.
- Skill tool results use instruction framing so the calling Claude model executes the skill rather than displaying the raw prompt.
- Optional `{{placeholder}}` parameters that aren't provided are replaced with `[not provided]` instead of appearing as raw template syntax.

## 0.2.0

- Moved 107 skills from tools to MCP prompts. Kept 4 meta-tools (list_skills, get_skill_details, find_skills, suggest_skills). Reverted in v0.3.0 because Claude.ai doesn't surface MCP prompts in its UI.

## 0.1.0

- Initial release. 111 MCP tools (107 skills + 4 meta-tools) over stdio transport.
- Vercel deployment with streamable HTTP transport, stateless JSON response mode.
- Skill loader parses YAML frontmatter from parent repo markdown files at startup.
- `SKILLS_FILTER` env var for limiting loaded domains.
- Playwright test suite: 9 tests covering startup, domain grouping, skill suggestions, prompt assembly, input validation, name collisions, and domain filtering.
