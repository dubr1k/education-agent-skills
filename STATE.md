# State — Academic Skills RU

## Last updated: 2026-06-16

## What was done this session

Continued the bilingual RU/EN fork adaptation without breaking upstream skill compatibility.

- Adapted all 5 `explicit-instruction` skills with Russian / bilingual runtime context for lesson structure, explicit teaching, modelling, guided practice, independent practice, checking for understanding, and error correction.
- Kept upstream-compatible `skill_id`, folder names, tool names, tags, chaining identifiers, and YAML metadata.
- Expanded Russian `find_skills` / `suggest_skills` aliases for explicit instruction terms: `явное обучение`, `прямое обучение`, `объяснение`, `моделирование`, `управляемая практика`, `самостоятельная практика`, `проверка понимания`, `коррекция ошибок`.
- Added MCP QA coverage for Russian explicit-instruction discovery and bundled prompt context.
- Updated `docs/RU_LOCALIZATION.md` and `README.md` with Russian-language explicit instruction examples and current adaptation status.
- Regenerated `registry.json` and rebuilt `mcp-server/src/skills.json`.

## What was verified

- `conda run -n base python scripts/generate-registry.py` — 165 skills / 20 domains
- `cd mcp-server && npm run bundle-skills && npm run build && npm test` — 38 passed
- `npx playwright test` — 20 passed
- `npm test` — 20 passed

## Current library state

- 165 skills across 20 domains.
- Runtime/discovery layer is now bilingual RU/EN.
- Adapted content domains now include `student-learning`, `explicit-instruction`, `curriculum-assessment`, `curriculum-alignment`, `eal-language-development`, `inclusive-design`, and `literacy-critical-thinking`.
- Remaining `SKILL.md` bodies still need staged Russian-context adaptation.

## What's next

- Adapt `memory-learning-science` SKILL.md files for Russian retrieval practice, spaced practice, interleaving, cognitive load, dual coding, feedback, and elaborative interrogation contexts.
- Add QA tests for Russian `find_skills` and bundled prompt context for `memory-learning-science`.
- Continue updating Russian docs as each domain becomes adapted.
