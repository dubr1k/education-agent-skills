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
| classroom talk / accountable talk | учебный разговор, ответственное обсуждение, речевые ходы |
| hinge question | диагностический вопрос, hinge question |
| self-regulated learning | саморегуляция, учебная самостоятельность |
| metacognition | метакогниция, мониторинг понимания, мышление о мышлении |
| wellbeing / SEL | благополучие, социально-эмоциональное обучение, психологическая безопасность |
| student agency | субъектность, ученическая самостоятельность, право выбора |
| trauma-informed practice | травма-информированный подход, безопасность, предсказуемость, ко-регуляция |
| restorative practice | восстановительные практики, восстановительный разговор, восстановительные вопросы |
| historical thinking | историческое мышление, работа с историческим источником |
| sourcing / corroboration | авторство и происхождение источника / сопоставление источников |
| systems thinking | системное мышление, петли обратной связи, рычаги влияния, ментальные модели |
| prepared environment | подготовленная среда, Монтессори-среда |
| professional learning | профессиональное развитие педагогов, наставничество, методическое объединение |
| AI literacy | ИИ-грамотность, промпт-грамотность, проверка фактов, галлюцинации |

## Приоритет адаптации skills

1. `student-learning` — прямое взаимодействие с учащимися.
2. `memory-learning-science` — универсальные учебные стратегии.
3. `curriculum-assessment` — планирование, оценивание, рубрики.
4. `explicit-instruction` — структура урока и проверка понимания.
5. `literacy-critical-thinking` и `eal-language-development` — чтение, письмо, РКИ/русский как неродной.

## Текущий статус адаптации

Полностью адаптированные runtime-домены:

- `ai-learning-science`
- `ai-literacy`
- `curriculum-alignment`
- `curriculum-assessment`
- `eal-language-development`
- `environmental-experiential-learning`
- `explicit-instruction`
- `global-cross-cultural-pedagogies`
- `historical-thinking`
- `inclusive-design`
- `literacy-critical-thinking`
- `memory-learning-science`
- `montessori-alternative-approaches`
- `original-frameworks`
- `professional-learning`
- `questioning-discussion`
- `self-regulated-learning`
- `student-learning`
- `systems-thinking`
- `wellbeing-motivation-agency`

Все 165 skills во всех 20 доменах содержат явный `Russian / bilingual context` слой в bundled MCP prompts. Русские запросы должны работать через `find_skills` / `suggest_skills`; английские `skill_id`, tool names, tags и chaining metadata остаются неизменными.

## Примеры русских запросов

`find_skills`:

```json
{
  "domain": "literacy-critical-thinking",
  "query": "учебный текст аргументация сочинение эссе медиаграмотность анализ источников критическое мышление"
}
```

```json
{
  "domain": "explicit-instruction",
  "query": "явное обучение структура урока объяснение моделирование управляемая практика самостоятельная практика проверка понимания коррекция ошибок"
}
```

```json
{
  "domain": "memory-learning-science",
  "query": "практика извлечения из памяти интервальное повторение чередование когнитивная нагрузка двойное кодирование обратная связь объяснительные вопросы"
}
```

```json
{
  "domain": "questioning-discussion",
  "query": "вопросы обсуждение диалог сократические вопросы hinge questions дискуссионные протоколы classroom talk"
}
```

```json
{
  "domain": "self-regulated-learning",
  "query": "саморегуляция метакогниция постановка целей учебные стратегии мониторинг понимания самостоятельная работа анализ ошибок"
}
```

```json
{
  "domain": "wellbeing-motivation-agency",
  "query": "благополучие мотивация субъектность принадлежность травма восстановительные практики самоэффективность эмоциональная грамотность"
}
```

```json
{
  "domain": "historical-thinking",
  "query": "история исторический источник документ контекстуализация сопоставление авторство происхождение источника ЕГЭ ОГЭ DBQ"
}
```

```json
{
  "domain": "systems-thinking",
  "query": "системное мышление причинно-следственные связи петли обратной связи рычаги влияния ментальные модели айсберг"
}
```

```json
{
  "domain": "ai-literacy",
  "query": "ИИ грамотность промпты галлюцинации проверка фактов надежность критическая оценка AI-output"
}
```

`suggest_skills`:

```json
{
  "problem_description": "Ученики 8 класса читают сложный учебный текст, плохо отделяют факт от мнения и должны подготовить аргументированное сочинение с оценкой источников"
}
```

Ожидаемый маршрут: навыки чтения и сложности текста, аргументации, оценки достоверности источников, медиаграмотности и критического мышления.

Для `explicit-instruction` ожидаемый маршрут: построение I Do / We Do / You Do последовательности, старт урока, think-aloud modelling, practice sequence и checking-for-understanding protocol.

Для `memory-learning-science` ожидаемый маршрут: retrieval practice, spaced practice schedule, interleaving plan, cognitive load analysis, dual coding design, feedback rewrite, elaborative interrogation prompts и worked example fading.

Для `questioning-discussion` ожидаемый маршрут: dialogic teaching moves, discussion protocol selection, hinge question design, perspective-taking activity design и Socratic questioning sequence.

Для `self-regulated-learning` ожидаемый маршрут: error analysis, goal-setting protocol, metacognitive prompts, self-regulation scaffolds и evidence-based study strategy selection.

Для `wellbeing-motivation-agency` ожидаемый маршрут: belonging/classroom culture, trauma-informed practice, restorative protocols, self-efficacy, RULER emotional literacy и PERMA/wellbeing-learning связи.

Для `historical-thinking` ожидаемый маршрут: sourcing, close reading, contextualisation, corroboration, document-based lesson design и assessment of historical thinking.

Для `systems-thinking` ожидаемый маршрут: systems-awareness iceberg, mental model mapping, leverage/response design, ladder of inference и agency circles.

Для `ai-literacy` ожидаемый маршрут: AI output audit, hallucination fact-checking, prompt literacy, learning boundaries, disciplinary AI literacy и Socratic AI dialogue.

## Проверка после изменений

```bash
PYTHONPATH=/tmp/educational-skills-pyyaml python3 scripts/generate-registry.py
cd mcp-server && npm run bundle-skills && npm run build && npm test
cd ..
npx playwright test
```
