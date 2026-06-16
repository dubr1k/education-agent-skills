# State — Educational Skills RU

## Last updated: 2026-06-16

## What was done this session

Continued the bilingual RU/EN fork adaptation without breaking upstream skill compatibility.

- Adapted all 5 `self-regulated-learning` skills with Russian / bilingual runtime context for self-regulation, metacognition, goal-setting, study strategies, monitoring understanding, independent work, and error analysis.
- Kept upstream-compatible `skill_id`, folder names, tool names, tags, chaining identifiers, and YAML metadata.
- Expanded Russian `find_skills` / `suggest_skills` aliases for self-regulated learning terms: `саморегуляция`, `метакогниция`, `постановка целей`, `учебные стратегии`, `мониторинг понимания`, `самостоятельная работа`, `анализ ошибок`.
- Added MCP QA coverage for Russian self-regulated-learning discovery and bundled prompt context.
- Updated `docs/RU_LOCALIZATION.md` and `README.md` with Russian-language self-regulated-learning examples and current adaptation status.
- Regenerated `registry.json` and rebuilt `mcp-server/src/skills.json`.

## What was verified

- `conda run -n base python scripts/generate-registry.py` — 165 skills / 20 domains
- `cd mcp-server && npm run bundle-skills && npm run build && npm test` — 44 passed
- `npx playwright test` — 22 passed
- `npm test` — 22 passed

## Current library state

- 165 skills across 20 domains.
- Runtime/discovery layer is now bilingual RU/EN.
- Adapted content domains now include `student-learning`, `memory-learning-science`, `explicit-instruction`, `curriculum-assessment`, `curriculum-alignment`, `eal-language-development`, `inclusive-design`, `literacy-critical-thinking`, `questioning-discussion`, and `self-regulated-learning`.
- Remaining `SKILL.md` bodies still need staged Russian-context adaptation.

## What's next

- Adapt `wellbeing-motivation-agency` SKILL.md files for Russian wellbeing, motivation, student agency, belonging, trauma-informed, and restorative practice contexts.
- Add QA tests for Russian `find_skills` and bundled prompt context for `wellbeing-motivation-agency`.
- Continue updating Russian docs as each domain becomes adapted.
