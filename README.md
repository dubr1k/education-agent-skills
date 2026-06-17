# Educational Skills RU

[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-1.0-blue)](https://agentskills.io)
[![Skills](https://img.shields.io/badge/skills-165-blue)](https://github.com/dubr1k/education-agent-skills)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
[![Last Commit](https://img.shields.io/github/last-commit/dubr1k/education-agent-skills)](https://github.com/dubr1k/education-agent-skills/commits/main)

**Educational Skills RU** — русскоязычный RU/EN fork библиотеки Education Agent Skills Library: 165 доказательно обоснованных педагогических skills в 20 доменах. Цель fork — сохранить совместимость с upstream на уровне `skill_id`, folder names, tags и chaining metadata, но добавить рабочий русский слой для Codex, Claude, Hermes, MCP и ручного использования.

Русский слой добавляется через документацию, runtime metadata, поиск, локализованные domain labels, query aliases и постепенную адаптацию самих `SKILL.md`. Технические идентификаторы остаются английскими намеренно: это сохраняет переносимость skills между агентами и совместимость с upstream-экосистемой.

## Быстрый старт

Устанавливайте именно этот fork:

```text
https://github.com/dubr1k/education-agent-skills
```

### Claude Code

Установка напрямую из fork:

```bash
claude plugin install https://github.com/dubr1k/education-agent-skills
```

Или из локального клона:

```bash
git clone https://github.com/dubr1k/education-agent-skills.git
cd education-agent-skills
claude plugin install "$PWD"
```

### OpenAI Codex

Рекомендуемый локальный вариант:

```bash
git clone https://github.com/dubr1k/education-agent-skills.git
cd education-agent-skills
codex plugin marketplace add "$PWD"
```

В repo есть Codex plugin manifest `.codex-plugin/plugin.json`, который указывает на `./skills/`, и локальный marketplace helper `.agents/plugins/marketplace.json`. После установки или обновления локального plugin перезапустите Codex.

Если нужны только отдельные skills:

```bash
mkdir -p ~/.codex/skills
cp -r skills/<domain>/<skill-name> ~/.codex/skills/
```

Пример:

```bash
cp -r skills/memory-learning-science/spaced-practice-scheduler ~/.codex/skills/
```

Подробный гайд: [docs/CODEX.md](docs/CODEX.md).

### Hermes Agent

Hermes лучше использовать с выборочной локальной установкой нужных skills, а не с полной установкой всех 165 skills:

```bash
hermes skills tap add dubr1k/education-agent-skills
hermes skills install \
  dubr1k/education-agent-skills/skills/original-frameworks/learning-target-authoring-guide \
  --category education --yes
```

Подробный гайд и стартовые наборы skills: [docs/HERMES.md](docs/HERMES.md).

### Любой Agent Skills-совместимый инструмент

Скопируйте нужные папки из `skills/` в директорию skills вашего агента. Каждый skill — это обычная папка с `SKILL.md`; зависимости и build step для ручного использования не нужны.

### Ручное использование без установки

1. Откройте любой `SKILL.md` внутри `skills/`.
2. Скопируйте prompt/instructions.
3. Вставьте в AI-инструмент и добавьте контекст класса, темы, возраста, ограничений и желаемого результата.

## Для кого

- Учителя, которым нужны доказательно обоснованные уроки, задания, scaffolds и проверки понимания без часов поиска литературы.
- Преподаватели вузов, которым нужна практичная педагогическая поддержка без отдельной подготовки в didactics.
- Методисты, curriculum designers, завучи и руководители образовательных программ.
- Разработчики EdTech и AI tools, которым нужен структурированный педагогический knowledge layer.
- Исследователи образования, которым важно видеть, как evidence превращается в AI-mediated practice.
- Ученики и студенты в student-facing сценариях, где AI должен помогать думать, а не просто отдавать готовый ответ.

## Зачем это нужно

AI быстро входит в образование. Он может улучшать обучение, снижать нагрузку учителя и давать ученикам качественную поддержку — но только если в основе лежит не набор привычек, а проверенная педагогическая evidence base.

Эта библиотека собирает prompts как reusable skills: каждый skill содержит named research, ограничения, typed inputs/outputs и ожидаемый формат результата. Fork добавляет русский контекст: ФГОС/ФОП-совместимые формулировки там, где это уместно, русскоязычные query aliases, естественные термины для учителя и ученика, а также примеры запросов на русском.

Важно: prompts сами по себе не заявляются как эмпирически валидированные AI-интервенции. Они кодируют исследовательски обоснованные педагогические подходы и должны использоваться профессионально, с проверкой результата человеком.

## Попробовать

### Через установленный runtime

После установки в Claude, Codex или Hermes напишите задачу обычным языком.

Русский пример:

> Ученики 8 класса читают сложный учебный текст по обществознанию, путают факт и мнение, и им нужно подготовить аргументированное сочинение с оценкой источников.

Runtime может подобрать literacy и critical-thinking skills: анализ сложности текста, поддержку понимания, scaffold аргумента, оценку достоверности источников и медиаграмотность. При русском input outputs должны использовать естественные термины: `учебный текст`, `сочинение`, `эссе`, `развернутый ответ`, `анализ источников`, `медиаграмотность`.

Пример для урока:

> Нужно объяснить ученикам 7 класса линейные уравнения: короткое объяснение, моделирование решения, управляемая практика, самостоятельная практика и проверка понимания.

Это может маршрутизироваться в explicit instruction skills: lesson opening, I Do / We Do / You Do, think-aloud modelling, practice sequencing и checking for understanding. Русские outputs должны использовать `явное обучение`, `объяснение`, `моделирование`, `управляемая практика`, `самостоятельная практика`, `проверка понимания`, `коррекция ошибок`.

Пример для учебных стратегий:

> Нужно спланировать повторение по теме клетки: практика извлечения из памяти, интервальное повторение, чередование вопросов и короткая обратная связь по ошибкам.

Это может подключить retrieval practice, spaced practice, interleaving, cognitive load, dual coding, feedback rewriting и elaborative interrogation.

### Вручную

Откройте `skills/memory-learning-science/spaced-practice-scheduler/SKILL.md` и передайте, например:

- Темы: строение клетки, транспорт через мембрану, деление клетки, ферменты, биологические молекулы.
- Срок: 8 недель.
- Уроков в неделю: 3.

AI вернет план повторения с расширяющимися интервалами, retrieval activities и практическими действиями при обнаружении пробелов.

## Чем отличается

**Evidence — главный фильтр.** Каждый skill ссылается на named research: авторов, годы, тип findings и практический вывод. Подходы без надежной evidence base, например learning styles/VAK, вынесены в [EXCLUSIONS.md](docs/EXCLUSIONS.md).

**Evidence strength размечается явно.**

| Рейтинг | Что означает |
|---|---|
| **Strong** | Несколько meta-analysis или systematic reviews с согласованными выводами |
| **Moderate** | Хорошая experimental evidence, но с контекстными ограничениями |
| **Emerging** | Перспективная база, но меньше replication или practitioner translation |
| **Original** | Авторская practitioner framework; не заявляется как research-backed |

**Сразу рассчитано на orchestration.** YAML frontmatter, typed input/output schemas, chaining metadata и composable outputs встроены в каждый skill.

**Русская адаптация не ломает совместимость.** IDs, folder names и API names остаются английскими, а русский слой живет в metadata, search, docs и постепенно адаптированных instructions.

## 20 доменов

| # | Домен | Skills | Фокус |
|---|---|---:|---|
| 1 | Memory & Learning Science | 8 | Retrieval practice, spacing, interleaving, cognitive load, dual coding, feedback |
| 2 | Self-Regulated Learning & Metacognition | 5 | Саморегуляция, метакогниция, постановка целей, учебные стратегии, мониторинг понимания |
| 3 | Explicit & Direct Instruction | 5 | Явное обучение, gradual release, проверка понимания, think-alouds |
| 4 | Questioning, Discussion & Dialogue | 5 | Сократические вопросы, обсуждения, дискуссионные протоколы, classroom talk, hinge questions |
| 5 | Literacy, Writing & Critical Thinking | 7 | Чтение, письмо, аргументация, source evaluation, media literacy |
| 6 | EAL/D & Language Development | 5 | Language demands, vocabulary tiering, sentence frames, sheltered instruction |
| 7 | Curriculum Design & Assessment | 13 | Backwards design, rubrics, assessment validity, formative assessment, PBL |
| 8 | Wellbeing, Motivation & Student Agency | 12 | Мотивация, self-efficacy, belonging, agency scaffolds |
| 9 | Professional Learning & Teacher Development | 10 | Lesson observation, reflective practice, PD design, работа с данными |
| 10 | Global & Cross-Cultural Pedagogies | 9 | Variation theory, culturally responsive teaching, place-based inquiry |
| 11 | Environmental & Experiential Learning | 6 | Outdoor learning, ecological inquiry, experiential cycles, service learning |
| 12 | AI Learning Science | 14 | Adaptive hints, AI feedback, tutoring dialogue, learning analytics |
| 13 | AI Literacy | 7 | Аудит AI-output, hallucination checks, prompt literacy, reliability |
| 14 | Montessori & Alternative Evidence-Based Approaches | 4 | Three-part lessons, prepared environment, mixed-age learning |
| 15 | Original Frameworks | 17 | SEEDS, H3Uni, developmental bands, project design, composite orchestrators |
| 16 | Curriculum Alignment | 4 | Coverage audit, KUD chart, developmental band translation, scope and sequence |
| 17 | Historical Thinking | 10 | Sourcing, close reading, contextualisation, corroboration, DBQ |
| 18 | Systems Thinking | 8 | Iceberg models, leverage, mental models, systems wellbeing |
| 19 | Inclusive Design | 3 | UDL auditing, options design, proactive barrier anticipation |
| 20 | Student-Facing Learning Skills | 13 | Hints, stuck/error diagnosis, teach-back, SRL wrapper, fading manager |

## Архитектура

Библиотека — Layer 1 в трехслойной системе. Подробное описание Context Engine (Layer 2), Orchestrator (Layer 3), схем и design rationale лежит в [ARCHITECTURE.md](docs/ARCHITECTURE.md).

### YAML schema

Каждый skill начинается с machine-readable YAML header: `skill_id`, `domain`, `evidence_strength`, `evidence_sources`, `input_schema`, `output_schema`, chaining metadata и tags. Полный формат можно посмотреть в любом `SKILL.md` или в [ARCHITECTURE.md](docs/ARCHITECTURE.md).

### MCP-сервер

Fork использует MCP только локально. Публичный remote endpoint не является поддерживаемым способом запуска этого fork.

```bash
git clone https://github.com/dubr1k/education-agent-skills.git
cd education-agent-skills/mcp-server
npm install
npm run bundle-skills
npm run build
npm start
```

Для локального stdio-подключения в MCP-capable client используйте примерно такую конфигурацию:

```json
{
  "mcpServers": {
    "education-skills": {
      "command": "node",
      "args": ["/absolute/path/to/education-agent-skills/mcp-server/dist/index.js"]
    }
  }
}
```

Сервер предоставляет:

- **169 tools**: 165 skills + `list_skills`, `find_skills`, `suggest_skills`, `get_skill_details`.
- **165 prompts** для клиентов, которые показывают MCP prompts.

Как это устроено:

- MCP-сервер читает не live `SKILL.md`, а pre-built snapshot `mcp-server/src/skills.json`.
- Каждый skill регистрируется дважды: как callable MCP tool и как MCP prompt.
- Skill tool не вызывает отдельную LLM: он собирает evidence-based prompt, подставляет входные параметры и возвращает instruction-framed текст вызывающей модели.
- Русские запросы работают через Unicode-aware search, domain terms и aliases; technical IDs остаются английскими.
- Поддерживаемый режим запуска — локальный stdio transport (`dist/index.js`).

Source code и подробное описание runtime flow: [mcp-server/](mcp-server/). Локальная MCP-инструкция: [docs/LOCAL_MCP.md](docs/LOCAL_MCP.md).

## Участие в разработке

Критерии включения описаны в [CONTRIBUTING.md](CONTRIBUTING.md). Планка высокая намеренно: каждый skill должен быть practically useful, честно ограничен и связан с named evidence.

После добавления или изменения любого `SKILL.md`:

```bash
# 1. Пересобрать registry
python3 scripts/generate-registry.py

# 2. Пересобрать MCP bundle
cd mcp-server && npm run bundle-skills && cd ..

# 3. Добавить skill и generated файлы
git add skills/<domain>/<skill-name>/SKILL.md registry.json mcp-server/src/skills.json
```

Почему bundle обязателен: MCP-сервер читает не live `SKILL.md`, а snapshot `mcp-server/src/skills.json`. Если изменить skill без пересборки bundle, сервер не увидит изменение.

## План русской адаптации

Текущий статус и следующий пакет доменов ведутся в [PLAN.md](PLAN.md). Документ [docs/RU_LOCALIZATION.md](docs/RU_LOCALIZATION.md) фиксирует принципы русскоязычной адаптации: какие термины локализуем, какие IDs оставляем английскими и как сохраняем upstream compatibility.

## Авторы и происхождение

Оригинальная библиотека создана [Gareth Manning](https://substack.com/@garethmanning), educator, curriculum designer и learning systems designer с 20 годами международного опыта.

Этот repository — русскоязычный fork `dubr1k/education-agent-skills`, адаптирующий runtime, документацию и skills для RU/EN использования.

## Лицензия

[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Открыто. Можно fork, адаптировать и распространять на тех же условиях.
