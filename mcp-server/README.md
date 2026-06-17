# Educational Skills RU MCP Server

MCP server exposing the bilingual **Educational Skills RU** library as callable tools and prompts: 165 evidence-based education skills across 20 domains, plus 4 discovery tools.

This fork documents local MCP usage only.

See [Codex setup](../docs/CODEX.md) and [Hermes setup](../docs/HERMES.md).
For local setup and verification, see the [Local MCP setup](../docs/LOCAL_MCP.md).

## Compatibility note / Важно о совместимости

Technical identifiers intentionally stay in English for upstream compatibility:

- `skill_id`
- folder names under `skills/<domain>/<skill-name>/`
- tool names such as `find_skills`, `suggest_skills`, `get_skill_details`, `list_skills`
- tags and chaining metadata

Русскоязычный слой добавлен через runtime metadata, localized domain labels, Unicode-aware search, aliases and adapted skill instructions. Users can search and describe needs in Russian, while the MCP API surface remains stable and English.

## Architecture

Skills are registered twice, as both MCP tools and MCP prompts:

- **Tools**: 169 total, including 165 skills and 4 meta-tools. The calling model receives the assembled skill prompt via instruction framing and generates the output.
- **Prompts**: 165 prompts for clients that surface MCP prompts in their UI.

## Как именно работает MCP-сервер

MCP-сервер в этом repo — не отдельная LLM и не сервис, который сам пишет педагогический результат. Это runtime-слой, который превращает библиотеку `SKILL.md` в MCP tools/prompts, собирает правильный evidence-based prompt и возвращает его вызывающей модели.

### Режим запуска

| Режим | Entry point | Для чего |
|---|---|---|
| Local stdio | `dist/index.js` после `npm run build` | Claude Desktop, Codex, Hermes и другие локальные MCP clients |

### Runtime pipeline

1. `scripts/bundle-skills.ts` читает все `skills/<domain>/<skill-name>/SKILL.md`.
2. Из каждого skill извлекаются YAML metadata, описание и prompt body.
3. Snapshot записывается в `mcp-server/src/skills.json`.
4. При запуске `loadSkills()` загружает этот snapshot; live `SKILL.md` файлы во время работы сервера не читаются.
5. `createServer()` регистрирует каждый skill дважды:
   - как MCP tool;
   - как MCP prompt.
6. Когда клиент вызывает skill tool, `assemblePrompt()` подставляет аргументы в `{{placeholder}}`, заменяет отсутствующие optional поля на `[not provided]` и добавляет блок `## Ввод пользователя / Teacher Input`.
7. Tool возвращает instruction-framed prompt вызывающей модели.
8. Модель клиента уже сама генерирует итоговый педагогический output.

### Почему snapshot важен

После изменения любого `SKILL.md` нужно пересобрать bundle. Иначе локальный файл изменится, но MCP-сервер продолжит отдавать старую версию из `mcp-server/src/skills.json`.

Минимальный цикл:

```bash
cd ..
PYTHONPATH=/tmp/educational-skills-pyyaml python3 scripts/generate-registry.py
cd mcp-server
npm run bundle-skills
npm run build
npm test
```

### Local stdio flow

Локальный клиент запускает сервер как дочерний процесс:

```bash
node /absolute/path/to/education-agent-skills/mcp-server/dist/index.js
```

`src/index.ts` делает три вещи:

1. находит library root;
2. загружает bundled skills;
3. подключает `StdioServerTransport`.

Это самый простой режим: нет HTTP, нет токенов, доступ есть только у локального MCP-клиента, который запустил процесс.

### Local HTTP smoke

HTTP handlers остаются в repo только для локального regression smoke. Они не являются инструкцией к публичному deployment.

```bash
npm run build
npm run smoke:local-http
```

Smoke поднимает временный `127.0.0.1` server, проверяет anonymous `401`, локальные OAuth metadata, 169 tools, 165 prompts и русские `find_skills` / `suggest_skills` маршруты.

### Domain filtering

Переменная `SKILLS_FILTER` ограничивает загружаемые домены:

```bash
SKILLS_FILTER=memory-learning-science,explicit-instruction node dist/index.js
```

Это полезно для маленьких локальных запусков, специализированных клиентов или тестов, где не нужны все 165 skills.

### Что видит MCP-клиент

- `list_skills` — обзор по доменам.
- `find_skills` — точный поиск по домену, тегу, evidence strength и RU/EN query.
- `suggest_skills` — подбор 3-5 skills по описанию педагогической задачи.
- `get_skill_details` — полные metadata и schemas конкретного skill.
- 165 skill tools — готовят instruction-framed prompt для результата.
- 165 prompts — тот же skill layer для клиентов, которые показывают MCP prompts отдельно.

## Meta-tools

| Tool | Purpose |
|---|---|
| `list_skills` | Browse all skills grouped by domain |
| `get_skill_details` | Full metadata for a specific skill: evidence sources, schemas, chaining info, and guidance |
| `find_skills` | Search by tag, domain, evidence strength, or free text in Russian or English |
| `suggest_skills` | Describe a teaching, curriculum, assessment, inclusion, or student-learning problem and get relevant skill recommendations |

Russian examples:

```text
find_skills query="ФГОС рабочая программа КТП критерии оценивания"
find_skills query="ОГЭ диагностическая работа рубрика"
suggest_skills task="Нужно подготовить диагностическую работу и критерии оценивания для 7 класса по теме дроби"
suggest_skills task="Ученик просит готовый ответ; нужно сначала проверить понимание и дать подсказки по шагам"
```

English examples:

```text
find_skills query="retrieval practice formative assessment rubric"
suggest_skills task="Plan a six-week Year 9 unit with spaced retrieval and valid assessment"
```

## Connect to Claude Desktop

Add to your `claude_desktop_config.json`:

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

## Run locally

Clone this fork and run the MCP server from the bundled snapshot:

```bash
git clone https://github.com/dubr1k/education-agent-skills.git
cd education-agent-skills/mcp-server
npm install
npm run bundle-skills
npm run build
node dist/index.js
```

For Claude Desktop local stdio config:

```json
{
  "mcpServers": {
    "education-skills": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/dist/index.js"]
    }
  }
}
```

## Development

```bash
npm run dev           # Run with tsx, no build step
npm run build         # Compile TypeScript
npm test              # Run Playwright test suite
npm run smoke:local-http # Run local HTTP MCP smoke test
npm run bundle-skills # Re-generate src/skills.json for local MCP runtime
```

Environment variables:

| Variable | Description |
|---|---|
| `SKILLS_FILTER` | Comma-separated domain names to limit which domains are loaded. Omit for all 20 domains. |

## Runtime flow

1. Teacher, student, or client calls a skill tool with required parameters.
2. Server loads the skill's evidence-based prompt template from the pre-built bundle.
3. `{{placeholder}}` tokens are replaced with provided values; unprovided optional params become `[not provided]`.
4. The assembled prompt is wrapped in instruction framing and returned as the tool result.
5. The calling model follows the instructions and generates the structured output.

## Rebuilding the bundle

The MCP server serves `src/skills.json`, not live `SKILL.md` files. After adding or editing any skill:

```bash
cd ..
python3 scripts/generate-registry.py
cd mcp-server
npm run bundle-skills
npm run build
npm test
```

Commit `registry.json`, `mcp-server/src/skills.json`, and the edited `SKILL.md` files together.

## Licence

[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — see [LICENSE](LICENSE).
