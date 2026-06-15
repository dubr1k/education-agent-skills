# Русскоязычная адаптация

Цель fork — сделать библиотеку рабочей в русскоязычном образовательном контексте, не ломая англоязычные skill IDs, tags, chaining metadata и существующие MCP/Codex сценарии.

## Инварианты совместимости

- Не переименовывать папки `skills/<domain>/<skill-name>`.
- Не менять `skill_id`, `name`, `domain` и значения `chains_well_with` без отдельной миграции.
- Сохранять evidence citations без пересказа, который меняет смысл исследования.
- Русифицировать user-facing слой: README, plugin metadata, MCP descriptions, domain labels, examples, prompts and output guidance.
- Поиск должен принимать и русские, и английские запросы.

## Терминологический слой

| Upstream term | Русскоязычная адаптация |
| --- | --- |
| student / learner | ученик, учащийся, студент — выбирать по контексту |
| teacher / educator | педагог, учитель, преподаватель — выбирать по уровню образования |
| Year group | класс / курс / возрастная группа |
| Year 9 | обычно 8-9 класс; уточнять по возрасту и программе |
| EAL | русский как неродной, русский как иностранный, билингвальные учащиеся |
| SEND / IEP | ОВЗ, индивидуальный образовательный маршрут, специальные образовательные потребности |
| curriculum standards | ФГОС, ФОП, рабочая программа, локальные требования |
| formative assessment | формирующее оценивание |
| rubric | критериальная рубрика, оценочная шкала |
| retrieval practice | практика извлечения из памяти |
| spaced practice | интервальное повторение |
| worked example | разобранный пример |
| scaffolding | учебная поддержка, опоры, постепенное снятие поддержки |

## Приоритет адаптации skills

1. `student-learning` — прямое взаимодействие с учащимися.
2. `memory-learning-science` — универсальные учебные стратегии.
3. `curriculum-assessment` — планирование, оценивание, рубрики.
4. `explicit-instruction` — структура урока и проверка понимания.
5. `literacy-critical-thinking` и `eal-language-development` — чтение, письмо, РКИ/русский как неродной.

## Проверка после изменений

```bash
python3 scripts/generate-registry.py
cd mcp-server && npm run bundle-skills && npm run build && npm test
cd ..
npx playwright test
```
