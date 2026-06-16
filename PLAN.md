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
- Последняя проверка 2026-06-16:
  - `conda run -n base python scripts/generate-registry.py` — OK, 165 skills / 20 domains.
  - `cd mcp-server && npm run bundle-skills && npm run build && npm test` — OK, MCP `40 passed`.
  - `npx playwright test` — OK, root `20 passed`.
  - `npm test` — OK, root `20 passed`.

## Ближайший фокус

1. Начать bilingual adaptation pass для следующего домена.
   - Приоритет: `questioning-discussion`, потому что следующий русский слой должен покрыть вопросы, обсуждение, диалог, Socratic questioning, hinge questions и classroom talk.
   - Следующий кандидат после него: `self-regulated-learning`.
   - Сохранять `skill_id`, folder names, tags, chaining metadata и YAML frontmatter fields.
   - Добавлять RU/EN слой в инструкции без ослабления evidence guidance.

2. После каждого пакета изменений выполнять:

```bash
conda run -n base python scripts/generate-registry.py
cd mcp-server && npm run bundle-skills && npm run build && npm test
cd ..
npx playwright test
```

## Следующий конкретный шаг

Начать адаптацию домена `questioning-discussion`: пройти его `SKILL.md`, добавить русскоязычный слой для вопросов, обсуждения, диалога, сократических вопросов, hinge questions, дискуссионных протоколов и classroom talk, не меняя совместимые английские идентификаторы и metadata.
