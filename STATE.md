# State — Educational Skills RU

## Last updated: 2026-06-17

## What was done this session

Completed the staged bilingual RU/EN adaptation pass across the remaining skill domains without changing upstream-compatible IDs, folder names, tool names, tags, chains, or YAML metadata.

- Adapted 97 `SKILL.md` files across 10 domains: `ai-learning-science`, `ai-literacy`, `environmental-experiential-learning`, `global-cross-cultural-pedagogies`, `historical-thinking`, `montessori-alternative-approaches`, `original-frameworks`, `professional-learning`, `systems-thinking`, and `wellbeing-motivation-agency`.
- Added one `Russian / bilingual context` runtime paragraph inside each adapted prompt.
- Expanded Russian `find_skills` / `suggest_skills` terms for AI tutoring, AI literacy, ecological and experiential learning, cross-cultural pedagogy, historical thinking, Montessori, original frameworks, professional learning, systems thinking, wellbeing, motivation, agency, trauma-informed practice, and restorative practice.
- Added MCP QA coverage for Russian discovery and bundled prompt context for all newly adapted domains.
- Regenerated `registry.json` and rebuilt `mcp-server/src/skills.json`.
- Committed and pushed the completed adaptation wave as `092e008 Adapt remaining education skill domains for RU context` to `fork/main`.
- Added post-adaptation guard coverage: every `SKILL.md` must include `Russian / bilingual context`, and planning docs must describe the adaptation as complete.
- Added Russian end-to-end `suggest_skills` scenarios for AI literacy, wellbeing/conflict, historical thinking, ecological inquiry, and professional learning.
- Expanded root and MCP README documentation with detailed MCP runtime flow: snapshot bundle, stdio/HTTP transports, auth, domain filtering, and model responsibility.
- Added RU fork release notes to `CHANGELOG.md` and MCP-specific `0.4.0-ru` notes to `mcp-server/CHANGELOG.md`.
- Added `docs/HOSTED_MCP_DEPLOYMENT.md` with build/bundle, hosted HTTP, auth env, Vercel, smoke test, client setup, rollback, and privacy checklist.
- Added docs guard coverage for release notes and hosted MCP deployment checklist.
- Ran a local MCP stdio release smoke through `mcp-server/dist/index.js`; it exposed and fixed a domainless Russian `find_skills` gap for assessment queries such as `ФГОС диагностическая работа критерии оценивания`.

## What was verified

- `PYTHONPATH=/tmp/educational-skills-pyyaml python3 scripts/generate-registry.py` — 165 skills / 20 domains
- `cd mcp-server && npm run bundle-skills && npm run build` — OK
- Targeted MCP RU tests for the new domain wave — 20 passed
- `cd mcp-server && npm test` — 64 passed
- `npx playwright test` — 22 passed
- `npm test` — 22 passed
- Targeted post-adaptation MCP/docs tests — passed
- Targeted release/checklist docs tests — passed
- Local MCP stdio release smoke — passed: 169 tools, 165 prompts, Russian `find_skills`, Russian `suggest_skills`
- `git diff --check` for touched skill domains and shared files — clean

## Current library state

- 165 skills across 20 domains.
- Runtime/discovery layer is bilingual RU/EN.
- All 20 content domains now contain explicit `Russian / bilingual context` prompt guidance.
- English `skill_id`, tool names, folder names, tags, evidence citations, and chaining metadata remain stable for upstream compatibility.

## What's next

- Finish the current release smoke bugfix: commit and push the domainless `find_skills` regression coverage.
- Next concrete step after that: create the `ru-v1.0.0` GitHub release/tag, then optionally run hosted MCP smoke tests against a real deployment URL and access token.
