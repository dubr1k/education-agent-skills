# Educational Skills RU MCP Server

MCP server exposing the bilingual **Educational Skills RU** library as callable tools and prompts: 165 evidence-based education skills across 20 domains, plus 4 discovery tools.

This fork documents local MCP usage and self-hosted deployments.

See [Codex setup](../docs/CODEX.md) and [Hermes setup](../docs/HERMES.md).

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

From this directory:

```bash
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
npm run bundle-skills # Re-generate src/skills.json for MCP runtime/deployments
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
