# State — Academic Skills RU

## Last updated: 2026-06-16

## What was done this session

Started the bilingual RU/EN fork adaptation without breaking upstream skill compatibility.

- Renamed package/plugin identity to `academic-skills-ru` where runtime manifests need to avoid collisions.
- Kept upstream-compatible `skill_id`, folder names, tool names, tags, and chaining identifiers.
- Added Russian domain labels to `scripts/generate-registry.py` and regenerated `registry.json`.
- Added Russian/bilingual MCP tool titles, descriptions, wrapper instructions, and output labels.
- Added Unicode-aware RU/EN search tokenization and Russian query aliases for `suggest_skills` / `find_skills`.
- Added `docs/RU_LOCALIZATION.md` with compatibility invariants, glossary, and adaptation priorities.
- Updated root and MCP package lockfiles after package renaming.
- Rebuilt `mcp-server/src/skills.json`.

## What was verified

- `cd mcp-server && npm run build`
- `cd mcp-server && npm test` — 21 passed
- `npx playwright test` — 20 passed
- Russian `suggest_skills` test added while preserving the existing plain-English query test.

## Current library state

- 165 skills across 20 domains.
- Runtime/discovery layer is now bilingual RU/EN.
- Actual `SKILL.md` bodies are still mostly upstream English and need staged Russian-context adaptation.
- `student-learning` remains the first priority domain for content adaptation.

## What's next

- Adapt `student-learning` SKILL.md files for Russian output and examples while preserving evidence citations.
- Add more Russian aliases/tests for curriculum, assessment, ФГОС/ФОП, ОГЭ/ЕГЭ, РКИ, ОВЗ.
- Localize `docs/CODEX.md`, `docs/HERMES.md`, and MCP server docs after runtime behaviour stabilizes.
