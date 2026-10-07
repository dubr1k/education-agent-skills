# State — Educational Skills RU

## Last updated: 2026-10-05

## DSH native integration — проверенная рабочая ветка

- Ветка `dsh/native-integration`, base `origin/main@b4e9e384be5798cc4d5132b3ee795211370a8a95`; feature commit `5a62a9d320ee980db47b734bf3f60b44f85759d1`. Изменения прошли независимое read-only ревью; это отдельная ветка, не merge в main.
- Добавлены `scripts/install-dsh.mjs`, `docs/DSH.md`, раздел README и 8 DSH regression tests. Default — только пять выбранных навыков; target: `--skills-dir`, затем `$DSH_HOME/skills`, иначе `~/.dsh/skills`.
- Renderer сохраняет source metadata в reference-only теле, добавляет честный runtime contract и manual fallback для отсутствующего specialist rubric skill. Custom schemas/effort/evidence/chains не выдаются за DSH automation. CC BY-SA attribution, полный LICENSE и pinned/hash provenance прилагаются к каждому установленному навыку.
- Dry-run не пишет; overwrite требует backup; backup/staging не обнаруживаются как дополнительные skills. Symlinks и неоднозначные имена отклоняются. `--all` на текущем upstream fail-closed из-за двух `critical-thinking-task-designer`, без переименования IDs.
- Исправлен исходный literary example: явный Macbeth → Romeo and Juliet transfer, проверка prior knowledge, Macbeth-only fallback и точная последовательность гибели Mercutio/Tybalt. Frontmatter не менялся.
- Проверено: root `npm test` — 35 passed; MCP bundle/build/tests — 70 passed; `validate-skills.py` — 165 skills, 0 errors, 4 прежних предупреждения длины; `validate-registry.py` — valid; `git diff --check` — clean.
- Registry и MCP snapshot пересобраны. Metadata/prompt неизменны, Example Output не входит в MCP bundle; содержательного generated diff нет, timestamp-only registry churn исключён.
- Root audit: 0 vulnerabilities. MCP `npm audit --audit-level=high` проходит, но сообщает 3 moderate vulnerabilities в существующих fast-uri, hono и ip-address; dependency updates не входят в задачу.
- Installer tests выполнены в игнорируемых каталогах `test-results/`. Затем пять навыков установлены из feature commit в реальный DSH с резервными копиями прежних bundles. Живой каталог обновился; native skill load рубрики вернул DSH runtime contract и правильный resource base. Проверены rendered hashes всех пяти и sourceModifiedFromCommit=false; backup-каталоги не добавили discovery-дубликатов.
- Root/MCP suites дополнительно повторены родительским агентом (35 + 70 passed), после финальной правки help — ещё 8 DSH regressions. Это проверка установки/контрактов, не доказательство педагогической эффективности LLM и не полный учебный E2E. Настройки приложения, глобальные пакеты и LeanCTX не изменялись.
- Далее: отдельная публикация feature/STATE commits в ветку fork; при новых изменениях выполнять те же проверки. Полное поведенческое/педагогическое тестирование остаётся отдельной задачей.

## Upstream sync 2026-09-04

- Merged `GarethManning/education-agent-skills@6bbbce418f82e11044009c9f3b7373a354de5bd0` into fork `main` (5 upstream commits after `32fce5c`).
- Adopted the Bastani evidence-attribution and Creative Commons attribution corrections.
- Ported the upstream bundled-skill validation and current `@modelcontextprotocol/sdk` dependency into the fork's local-only MCP architecture without reintroducing hosted OAuth/Vercel behavior.
- Preserved Russian discovery, bilingual context, local HTTP/stdio operation, and the local authentication boundary.
- Rebuilt `registry.json` and `mcp-server/src/skills.json`; callable MCP inventory is 153 model-invocable skill tools plus 4 meta-tools, while all 165 skill prompts remain available.
- Verified root registry validation/generation and Playwright tests; verified MCP bundle, TypeScript build, Playwright tests, security audit, and local HTTP smoke.
- Current fork remains 165 skills across 20 domains with Russian/bilingual runtime guidance in every skill.

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
- Replaced hosted/Vercel setup docs with `docs/LOCAL_MCP.md`; this fork is now documented as local-only.
- Added docs guard coverage for local-only MCP setup and smoke testing.
- Ran a local MCP stdio release smoke through `mcp-server/dist/index.js`; it exposed and fixed a domainless Russian `find_skills` gap for assessment queries such as `ФГОС диагностическая работа критерии оценивания`.
- Published GitHub release `ru-v1.0.0` for `Educational Skills RU v1.0.0`.
- Replaced `npm run smoke:hosted` with `npm run smoke:local-http`, a local-only HTTP smoke harness around the MCP handlers.
- Removed remote hosted smoke instructions and the Vercel config from the fork docs.

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
- Local hosted HTTP smoke — passed: anonymous `401`, OAuth metadata, 169 tools, 165 prompts, Russian `find_skills`, Russian `suggest_skills`
- GitHub release `ru-v1.0.0` — published at https://github.com/dubr1k/education-agent-skills/releases/tag/ru-v1.0.0
- GitHub release `ru-v1.0.1` — published at https://github.com/dubr1k/education-agent-skills/releases/tag/ru-v1.0.1
- `git diff --check` for touched skill domains and shared files — clean

## Current library state

- 165 skills across 20 domains.
- Runtime/discovery layer is bilingual RU/EN.
- All 20 content domains now contain explicit `Russian / bilingual context` prompt guidance.
- English `skill_id`, tool names, folder names, tags, evidence citations, and chaining metadata remain stable for upstream compatibility.

## What's next

- Continue normal upstream monitoring; preserve local-only MCP and Russian/bilingual contracts during future merges.
