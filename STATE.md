# State — Educational Skills RU

## Last updated: 2026-06-16

## What was done this session

Continued the bilingual RU/EN fork adaptation without breaking upstream skill compatibility.

- Adapted all 5 `questioning-discussion` skills with Russian / bilingual runtime context for questions, discussion, dialogue, Socratic questioning, hinge questions, discussion protocols, perspective-taking, and classroom talk.
- Kept upstream-compatible `skill_id`, folder names, tool names, tags, chaining identifiers, and YAML metadata.
- Expanded Russian `find_skills` / `suggest_skills` aliases for questioning and discussion terms: `вопросы`, `обсуждение`, `диалог`, `сократические вопросы`, `дискуссионные протоколы`, `classroom talk`, `accountable talk`, `hinge questions`, `perspective-taking`.
- Added MCP QA coverage for Russian questioning-discussion discovery and bundled prompt context.
- Updated `docs/RU_LOCALIZATION.md` and `README.md` with Russian-language questioning-discussion examples and current adaptation status.
- Regenerated `registry.json` and rebuilt `mcp-server/src/skills.json`.

## What was verified

- `conda run -n base python scripts/generate-registry.py` — 165 skills / 20 domains
- `cd mcp-server && npm run bundle-skills && npm run build && npm test` — 42 passed
- `npx playwright test` — 22 passed
- `npm test` — 22 passed

## Current library state

- 165 skills across 20 domains.
- Runtime/discovery layer is now bilingual RU/EN.
- Adapted content domains now include `student-learning`, `memory-learning-science`, `explicit-instruction`, `curriculum-assessment`, `curriculum-alignment`, `eal-language-development`, `inclusive-design`, `literacy-critical-thinking`, and `questioning-discussion`.
- Remaining `SKILL.md` bodies still need staged Russian-context adaptation.

## What's next

- Adapt `self-regulated-learning` SKILL.md files for Russian self-regulation, metacognition, goal-setting, strategy choice, monitoring understanding, and independent study contexts.
- Add QA tests for Russian `find_skills` and bundled prompt context for `self-regulated-learning`.
- Continue updating Russian docs as each domain becomes adapted.
