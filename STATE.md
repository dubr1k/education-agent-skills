# State — Academic Skills RU

## Last updated: 2026-06-16

## What was done this session

Continued the bilingual RU/EN fork adaptation without breaking upstream skill compatibility.

- Adapted all 7 `literacy-critical-thinking` skills with Russian / bilingual runtime context for reading, writing, argumentation, source analysis, media literacy, essays, extended responses, and critical thinking.
- Kept upstream-compatible `skill_id`, folder names, tool names, tags, chaining identifiers, and YAML metadata.
- Expanded Russian `find_skills` / `suggest_skills` aliases for literacy and critical thinking terms: `учебный текст`, `смысловое чтение`, `сочинение`, `эссе`, `развернутый ответ`, `анализ источников`, `достоверность`, `медиаграмотность`, `критическое мышление`.
- Added MCP QA coverage for Russian literacy-critical-thinking discovery and bundled prompt context.
- Updated `docs/RU_LOCALIZATION.md` and `README.md` with Russian-language literacy examples and current adaptation status.
- Regenerated `registry.json` and rebuilt `mcp-server/src/skills.json`.

## What was verified

- `/tmp/academic-skills-ru-venv/bin/python scripts/generate-registry.py` — 165 skills / 20 domains
- `cd mcp-server && npm run bundle-skills && npm run build && npm test` — 36 passed
- `npx playwright test` — 20 passed
- `npm test` — 20 passed

## Current library state

- 165 skills across 20 domains.
- Runtime/discovery layer is now bilingual RU/EN.
- Runtime/discovery layer is bilingual RU/EN.
- Adapted content domains now include `student-learning`, `curriculum-assessment`, `curriculum-alignment`, `eal-language-development`, `inclusive-design`, and `literacy-critical-thinking`.
- Remaining `SKILL.md` bodies still need staged Russian-context adaptation.

## What's next

- Adapt `explicit-instruction` SKILL.md files for Russian lesson-structure, modelling, guided practice, independent practice, and checking-for-understanding contexts.
- Add QA tests for Russian `find_skills` and bundled prompt context for `explicit-instruction`.
- Continue updating Russian docs as each domain becomes adapted.
