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

## What was verified

- `PYTHONPATH=/tmp/educational-skills-pyyaml python3 scripts/generate-registry.py` — 165 skills / 20 domains
- `cd mcp-server && npm run bundle-skills && npm run build` — OK
- Targeted MCP RU tests for the new domain wave — 20 passed
- `cd mcp-server && npm test` — 64 passed
- `npx playwright test` — 22 passed
- `npm test` — 22 passed
- `git diff --check` for touched skill domains and shared files — clean

## Current library state

- 165 skills across 20 domains.
- Runtime/discovery layer is bilingual RU/EN.
- All 20 content domains now contain explicit `Russian / bilingual context` prompt guidance.
- English `skill_id`, tool names, folder names, tags, evidence citations, and chaining metadata remain stable for upstream compatibility.

## What's next

- Continue polishing: add regression guards, tighten Russian end-to-end `suggest_skills` scenarios, remove stale planning language, and prepare release notes / changelog for the RU fork.
