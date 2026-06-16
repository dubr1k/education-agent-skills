# PLAN — Academic Skills RU

## Цель

Сделать bilingual RU/EN fork библиотеки Education Agent Skills пригодным для русскоязычного образовательного контекста, не ломая upstream-совместимость: `skill_id`, имена папок, tool names, tags и chaining metadata остаются стабильными.

## Уже сделано

- Репозиторий склонирован и запушен в fork `dubr1k/education-agent-skills`.
- Runtime/metadata слой переименован в `academic-skills-ru`.
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
- Последняя проверка 2026-06-16:
  - `.venv/bin/python scripts/generate-registry.py` — OK, 165 skills / 20 domains.
  - `cd mcp-server && npm run bundle-skills && npm run build && npm test` — OK, MCP `30 passed`.
  - `curl -4 -sS -m 10 -i https://mcp-server-sigma-sooty.vercel.app/mcp` — OK, endpoint отвечает ожидаемым `401 Hosted MCP access token required`.
  - `npx playwright test` — OK, root `20 passed`.

## Ближайший фокус

1. Начать bilingual adaptation pass для следующего домена.
   - Приоритет: `eal-language-development`, потому что уже добавлены русские aliases для РКИ, русского как неродного, билингвов, мигрантов, словаря и речи.
   - Следующий кандидат после него: `inclusive-design`.
   - Сохранять `skill_id`, folder names, tags, chaining metadata и YAML frontmatter fields.
   - Добавлять RU/EN слой в инструкции без ослабления evidence guidance.

2. После каждого пакета изменений выполнять:

```bash
.venv/bin/python scripts/generate-registry.py
cd mcp-server && npm run bundle-skills && npm run build && npm test
cd ..
npx playwright test
```

## Следующий конкретный шаг

Начать адаптацию домена `eal-language-development`: пройти 5 `SKILL.md`, добавить русскоязычный слой для РКИ, русского как неродного, билингвальных учащихся, мигрантов, академического словаря, языковых рамок и scaffolded task modification, не меняя совместимые английские идентификаторы и metadata.
