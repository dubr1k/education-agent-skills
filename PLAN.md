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
- Последняя проверка 2026-06-16:
  - `.venv/bin/python scripts/generate-registry.py` — OK, 165 skills / 20 domains.
  - `cd mcp-server && npm run bundle-skills && npm run build && npm test` — OK, MCP `26 passed`.
  - `curl -4 -sS -m 10 -i https://mcp-server-sigma-sooty.vercel.app/mcp` — OK, endpoint отвечает ожидаемым `401 Hosted MCP access token required`.
  - `npx playwright test` — OK, root `20 passed`.

## Ближайший фокус

1. Начать bilingual adaptation pass для `curriculum-assessment`.
   - Приоритет высокий: уже добавлены русские assessment aliases и QA queries.
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

Начать адаптацию домена `curriculum-assessment`: пройти 13 `SKILL.md`, добавить русскоязычный слой для ФГОС/ФОП, рабочих программ, КТП, диагностических/контрольных работ, критериев и рубрик, не меняя совместимые английские идентификаторы и metadata.
