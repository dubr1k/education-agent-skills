# PLAN — Academic Skills RU

## Цель

Сделать bilingual RU/EN fork библиотеки Education Agent Skills пригодным для русскоязычного образовательного контекста, не ломая upstream-совместимость: `skill_id`, имена папок, tool names, tags и chaining metadata остаются стабильными.

## Уже сделано

- Репозиторий склонирован и запушен в fork `dubr1k/education-agent-skills`.
- Runtime/metadata слой переименован в `academic-skills-ru`.
- MCP wrapper, meta-tools, registry domain labels и поиск адаптированы под RU/EN.
- Добавлен Unicode-aware поиск и русские query aliases.
- Добавлен документ `docs/RU_LOCALIZATION.md`.
- Тесты зелёные: MCP `21 passed`, root Playwright `20 passed`.

## Ближайший фокус

1. Адаптировать `student-learning` как первый домен.
   - Сохранить evidence citations.
   - Добавить русскоязычные инструкции ответа.
   - Заменить UK/US examples на нейтральные или российские.
   - Сохранить английские technical fields и tool compatibility.

2. Расширить русские search aliases.
   - ФГОС, ФОП, рабочая программа, КТП.
   - ОГЭ, ЕГЭ, ВПР, контрольная, диагностическая.
   - РКИ, русский как неродной, билингвальные учащиеся.
   - ОВЗ, ИОМ, адаптированная программа, инклюзия.

3. Локализовать пользовательскую документацию.
   - `docs/CODEX.md`
   - `docs/HERMES.md`
   - `mcp-server/README.md`
   - `llms.txt`

4. Добавить bilingual QA tests.
   - Русский `find_skills`.
   - Русский `suggest_skills` по оцениванию, чтению, РКИ, ОВЗ.
   - Проверка, что английские запросы продолжают работать.

5. После каждого пакета изменений выполнять:

```bash
.venv/bin/python scripts/generate-registry.py
cd mcp-server && npm run bundle-skills && npm run build && npm test
cd ..
npx playwright test
```

## Следующий конкретный шаг

Начать с 13 файлов `skills/student-learning/*/SKILL.md`: сделать bilingual adaptation pass без переименования skill identifiers, затем пересобрать registry/MCP bundle и добавить тесты на русскоязычный student-facing сценарий.
