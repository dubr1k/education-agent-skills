# PLAN — Educational Skills RU

## Цель

Сделать bilingual RU/EN fork библиотеки Education Agent Skills пригодным для русскоязычного образовательного контекста, не ломая upstream-совместимость: `skill_id`, имена папок, tool names, tags и chaining metadata остаются стабильными.

## Уже сделано

- Репозиторий склонирован и запушен в fork `dubr1k/education-agent-skills`.
- Runtime/metadata слой переименован в `educational-skills-ru`.
- MCP wrapper, meta-tools, registry domain labels и поиск адаптированы под RU/EN.
- Добавлен Unicode-aware поиск и русские query aliases.
- Добавлен документ `docs/RU_LOCALIZATION.md`.
- Адаптирован первый домен `student-learning`: 13 `SKILL.md` получили RU/EN localization слой внутри инструкций, без переименования `skill_id`, папок, tags или chaining metadata.
- Исправлен MCP skill loader: теперь runtime bundle извлекает не только `## Prompt`, но и `## System Prompt`; иначе новые `student-learning` runtime-инструкции не попадали в `mcp-server/src/skills.json`.
- Расширены русские search aliases: ФГОС/ФОП/рабочая программа/КТП, контрольная/диагностическая/ОГЭ/ЕГЭ/ВПР, РКИ/билингвы, ОВЗ/ИОМ/адаптированная программа/инклюзия, student-facing формулировки про уверенность, подсказки и самостоятельную проверку.
- Добавлены bilingual QA tests для русского `find_skills`, русских `suggest_skills` сценариев и сохранения английских student-learning запросов.
- Локализована пользовательская документация: `docs/CODEX.md`, `docs/HERMES.md`, `mcp-server/README.md`, `llms.txt` получили RU/EN quickstart, русские примеры `find_skills`/`suggest_skills` и явное описание совместимости английских `skill_id`, tool names и metadata.
- Адаптирован домен `curriculum-assessment`: 13 `SKILL.md` получили RU/EN runtime-контекст для ФГОС/ФОП, рабочих программ, КТП, планируемых результатов, диагностических/контрольных работ, критериев, рубрик, проектной деятельности, ОВЗ/ИОМ и локальных assessment formats без изменения YAML metadata.
- Усилен русский `find_skills` для `curriculum-assessment`: доменный индекс теперь покрывает ФГОС/ФОП/рабочую программу/КТП/планируемые результаты, добавлен alias для результатов/целей/задач.
- Добавлены QA tests для русского `find_skills` по curriculum-assessment и проверки, что RU runtime-контекст попадает в bundled MCP prompts.
- Адаптирован домен `curriculum-alignment`: 4 `SKILL.md` получили RU/EN runtime-контекст для ФГОС/ФОП, рабочих программ, КТП, учебных планов, планируемых результатов, УУД, coverage audit, crosswalk, developmental band translation и KUD chart authoring без изменения YAML metadata.
- Усилен русский `find_skills` для `curriculum-alignment`: доменный индекс теперь покрывает планируемые результаты.
- Добавлены QA tests для русского `find_skills` по curriculum-alignment и проверки, что RU alignment-контекст попадает в bundled MCP prompts.
- Адаптирован домен `eal-language-development`: 5 `SKILL.md` получили RU/EN runtime-контекст для РКИ, русского как неродного/иностранного, билингвальных учащихся, детей мигрантов, academic Russian, академического словаря, языковых рамок, scaffolded task modification и sheltered instruction без изменения YAML metadata.
- Добавлены QA tests для русского `find_skills` по eal-language-development и проверки, что RU EAL-контекст попадает в bundled MCP prompts.
- Адаптирован домен `inclusive-design`: 3 `SKILL.md` получили RU/EN runtime-контекст для ОВЗ, ИОМ, АООП/адаптированной программы, ПМПК, тьютора, специальных условий, accessibility barriers, UDL и инклюзивного classroom support без изменения YAML metadata.
- Добавлены QA tests для русского `find_skills` по inclusive-design и проверки, что RU inclusive-контекст попадает в bundled MCP prompts.
- Адаптирован домен `literacy-critical-thinking`: 7 `SKILL.md` получили RU/EN runtime-контекст для смыслового чтения, учебного текста, аргументации, сочинения/эссе/развернутого ответа, анализа источников, достоверности, медиаграмотности и критического мышления без изменения YAML metadata.
- Усилен русский `find_skills` для `literacy-critical-thinking`: доменный индекс и aliases теперь покрывают учебный текст, смысловое чтение, сочинение/эссе/развернутый ответ, аргументацию, анализ источников, достоверность/надежность, медиаграмотность и критическое мышление.
- Добавлены QA tests для русского `find_skills` по literacy-critical-thinking и проверки, что RU literacy-контекст попадает в bundled MCP prompts.
- Обновлена русскоязычная документация: `docs/RU_LOCALIZATION.md` получил статус адаптированных доменов и русские примеры `find_skills`/`suggest_skills`; `README.md` получил русский literacy-critical-thinking пример.
- Адаптирован домен `explicit-instruction`: 5 `SKILL.md` получили RU/EN runtime-контекст для явного обучения, структуры урока, объяснения/моделирования, guided/independent practice, проверки понимания, коррекции ошибок, lesson openings, practice design и think-aloud scripts без изменения YAML metadata.
- Усилен русский `find_skills` для `explicit-instruction`: доменный индекс и aliases теперь покрывают явное/прямое обучение, объяснение, моделирование, структуру урока, управляемую практику, самостоятельную практику, проверку понимания, формирующую обратную связь и коррекцию ошибок.
- Добавлены QA tests для русского `find_skills` по explicit-instruction и проверки, что RU explicit-instruction контекст попадает в bundled MCP prompts.
- Обновлена русскоязычная документация: `docs/RU_LOCALIZATION.md` получил explicit-instruction пример и conda-команду проверки; `README.md` получил русский explicit-instruction пример.
- Адаптирован домен `memory-learning-science`: 8 `SKILL.md` получили RU/EN runtime-контекст для практики извлечения из памяти, интервального повторения, чередования, когнитивной нагрузки, рабочей памяти, двойного кодирования, обратной связи, объяснительных вопросов и worked-example fading без изменения YAML metadata.
- Усилен русский `find_skills` для `memory-learning-science`: доменный индекс и aliases теперь покрывают retrieval practice, spaced practice, interleaving, cognitive load, working memory, dual coding, feedback, elaborative interrogation и worked examples.
- Добавлены QA tests для русского `find_skills` по memory-learning-science и проверки, что RU memory-learning-science контекст попадает в bundled MCP prompts.
- Обновлена русскоязычная документация: `docs/RU_LOCALIZATION.md` и `README.md` получили memory-learning-science примеры и обновленный статус адаптированных доменов.
- Основной `README.md` переведен в русский local-first guide для `Educational Skills RU`: установка ведет на fork `dubr1k/education-agent-skills`, удалены англоязычные upstream onboarding sections, сохранены совместимые английские technical IDs и добавлен русский обзор доменов/архитектуры/MCP.
- Добавлены README QA tests: root README должен содержать русские основные секции, все `README.md` должны ссылаться на fork и не должны возвращать upstream install URLs / hosted signup flow.
- Адаптирован домен `questioning-discussion`: 5 `SKILL.md` получили RU/EN runtime-контекст для вопросов, обсуждения, диалога, сократических вопросов, hinge questions, дискуссионных протоколов, perspective-taking и classroom talk без изменения YAML metadata.
- Усилен русский `find_skills` для `questioning-discussion`: доменный индекс и aliases теперь покрывают вопросы, обсуждение, диалог, сократические вопросы, дискуссионные протоколы, classroom talk, accountable talk, hinge questions и perspective-taking.
- Добавлены QA tests для русского `find_skills` по questioning-discussion и проверки, что RU questioning/discussion-контекст попадает в bundled MCP prompts.
- Обновлена русскоязычная документация: `docs/RU_LOCALIZATION.md` получил questioning-discussion статус, терминологию и русский пример `find_skills`; `README.md` уточнил фокус домена.
- Адаптирован домен `self-regulated-learning`: 5 `SKILL.md` получили RU/EN runtime-контекст для саморегуляции, метакогниции, постановки целей, учебных стратегий, мониторинга понимания, самостоятельной работы и анализа ошибок без изменения YAML metadata.
- Усилен русский `find_skills` для `self-regulated-learning`: доменный индекс и aliases теперь покрывают саморегуляцию, метакогницию, цели, учебные стратегии, мониторинг понимания, самостоятельную работу и анализ ошибок.
- Добавлены QA tests для русского `find_skills` по self-regulated-learning и проверки, что RU self-regulated-learning контекст попадает в bundled MCP prompts.
- Обновлена русскоязычная документация: `docs/RU_LOCALIZATION.md` получил self-regulated-learning статус, терминологию и русский пример `find_skills`; `README.md` уточнил фокус домена.
- Параллельной волной адаптированы оставшиеся домены: `wellbeing-motivation-agency` (12), `historical-thinking` (10), `systems-thinking` (8), `montessori-alternative-approaches` (4), `global-cross-cultural-pedagogies` (9), `professional-learning` (10), `environmental-experiential-learning` (6), `ai-learning-science` (14), `ai-literacy` (7) и `original-frameworks` (17).
- Всего в этой волне 97 `SKILL.md` получили `Russian / bilingual context` runtime-слой без изменения YAML metadata, `skill_id`, folder names, tags, tool names или chaining identifiers.
- Усилен русский `find_skills` для новой волны: добавлены термины и aliases для благополучия/мотивации/субъектности, исторического источника, системного мышления, Монтессори, профессионального развития педагогов, экологического inquiry, AI tutoring, AI literacy, original frameworks и cross-cultural pedagogies.
- Добавлены MCP QA tests для русского `find_skills` и bundled prompt context по всем 10 доменам новой волны.
- Последняя проверка 2026-06-16:
  - `PYTHONPATH=/tmp/educational-skills-pyyaml python3 scripts/generate-registry.py` — OK, `165 skills, 20 domains`.
  - `cd mcp-server && npm run bundle-skills && npm run build` — OK.
  - Targeted MCP RU tests по новой волне — OK, `20 passed`.
  - `cd mcp-server && npm test` — OK, MCP `64 passed`.
  - `npx playwright test` — OK, root `22 passed`.
  - `npm test` — OK, root `22 passed`.
  - `git diff --check` по touched domains/shared files — OK.
  - Коммит `092e008 Adapt remaining education skill domains for RU context` запушен в `fork/main`.
- Polishing pass 2026-06-17:
  - Добавлен guard-test, что все 165 `SKILL.md` содержат `Russian / bilingual context`.
  - Нормализованы старые `## RU/EN Localization` заголовки в ранних доменах.
  - Добавлены русские end-to-end `suggest_skills` сценарии для AI literacy, wellbeing/conflict, historical thinking, ecological inquiry и professional learning.
  - Расширены README/MCP docs: snapshot runtime, stdio/HTTP transports, auth, domain filtering и роль вызывающей модели.
  - Guard/status слой запушен как `11b1989 Polish RU adaptation status and guards`; MCP/docs слой запушен как `5be6c24 Document MCP runtime and strengthen RU suggestions`.
- Release/deployment pass 2026-06-17:
  - Добавлены release notes в корневой `CHANGELOG.md` для завершенного RU fork adaptation release.
  - Добавлен MCP-focused `0.4.0-ru` блок в `mcp-server/CHANGELOG.md`.
  - Добавлен `docs/HOSTED_MCP_DEPLOYMENT.md` с build/bundle, hosted HTTP, auth env, Vercel, smoke tests, client setup, rollback и privacy checklist.
  - Добавлен docs guard-test, который закрепляет release notes и hosted deployment checklist.
- Release smoke bugfix 2026-06-17:
  - Локальный MCP stdio smoke через `mcp-server/dist/index.js` выявил пробел в domainless русском `find_skills` для assessment-запроса `ФГОС диагностическая работа критерии оценивания`.
  - Добавлен regression test без `domain` filter.
  - Добавлен RU alias для формулировок `диагностическая/контрольная/проверочная работа`, чтобы публичные README examples работали без ручного выбора домена.
- Release publication 2026-06-17:
  - Создан и запушен annotated tag `ru-v1.0.0`.
  - Опубликован GitHub release `Educational Skills RU v1.0.0`: https://github.com/dubr1k/education-agent-skills/releases/tag/ru-v1.0.0
  - Проверено, что локальной Vercel привязки (`.vercel`) в checkout нет; hosted smoke требует реальный deployment URL и access token либо настройку Vercel project.
- Hosted smoke automation 2026-06-17:
  - Добавлен `npm run smoke:hosted` в `mcp-server`.
  - Скрипт поднимает локальный HTTP wrapper вокруг hosted/Vercel handlers или проверяет remote endpoint через `MCP_HTTP_URL` + `MCP_ACCESS_TOKEN`.
  - Smoke проверяет anonymous `401`, OAuth metadata, authenticated `tools/list`, `prompts/list`, русский `find_skills` и русский `suggest_skills`.
- Remote anonymous smoke 2026-06-17:
  - `npm run smoke:hosted` теперь может проверять remote deployment без токена: `MCP_HTTP_URL=https://.../mcp npm run smoke:hosted`.
  - В этом режиме проверяются anonymous `401` и OAuth metadata; authenticated checks включаются при наличии `MCP_ACCESS_TOKEN`.
- Local-only pivot 2026-06-17:
  - Пользовательский путь fork переписан на local-only: публичный hosted/Vercel запуск больше не документируется как вариант.
  - `docs/HOSTED_MCP_DEPLOYMENT.md` и `docs/HOSTED_MCP_ACCESS.md` заменены на `docs/LOCAL_MCP.md`.
  - `npm run smoke:hosted` заменен на `npm run smoke:local-http`, который поднимает только временный `127.0.0.1` HTTP smoke server.
  - Root tests больше не зависят от remote baseURL.

## Ближайший фокус

1. Полный adaptation pass по `SKILL.md` завершен: все 165 skills во всех 20 доменах содержат явный RU/EN runtime-контекст.
   - Сохранять `skill_id`, folder names, tags, chaining metadata и YAML frontmatter fields при любой дальнейшей полировке.
   - Не ослаблять evidence guidance и не русифицировать совместимые technical IDs.

2. После каждого пакета изменений выполнять:

```bash
PYTHONPATH=/tmp/educational-skills-pyyaml python3 scripts/generate-registry.py
cd mcp-server && npm run bundle-skills && npm run build && npm test
cd ..
npx playwright test
```

## Следующий конкретный шаг

Прогнать local-only docs/test suite, закоммитить и запушить переход fork на локальный MCP-only workflow.
