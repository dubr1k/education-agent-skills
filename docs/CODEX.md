# Using Educational Skills RU in OpenAI Codex

This guide explains how to use **Educational Skills RU**, a bilingual RU/EN fork of the Education Agent Skills Library, with OpenAI Codex locally.

Repository: https://github.com/dubr1k/education-agent-skills

The skills run from your machine. Once installed locally, Codex reads the skill files directly and does not call a remote MCP service.

## Compatibility note / Важно о совместимости

Technical identifiers intentionally stay in English for upstream compatibility:

- `skill_id`
- folder names under `skills/<domain>/<skill-name>/`
- tool names such as `find_skills`, `suggest_skills`, `get_skill_details`, `list_skills`
- tags and chaining metadata

Русскоязычный слой добавлен через инструкции, поиск, aliases, документацию и runtime metadata. Поэтому в запросах можно писать по-русски, но системные имена skills и tools остаются английскими.

## Recommended: install as a local Codex plugin

Use this when you want the full library available in Codex.

```bash
git clone https://github.com/dubr1k/education-agent-skills.git
cd education-agent-skills
codex plugin marketplace add "$PWD"
```

The repo includes the Codex plugin manifest:

```text
.codex-plugin/plugin.json
```

That manifest points Codex at:

```text
./skills/
```

The repo also includes a local marketplace helper:

```text
.agents/plugins/marketplace.json
```

Restart Codex after installing or updating the local plugin. Codex can then discover and use the installed skills from local files.

## Quickstart examples / Примеры запросов

You can ask Codex in English:

> I am planning a Year 9 science unit on cells: 6 weeks, 3 lessons per week. Build the unit using evidence-based learning science.

Or in Russian:

> Спланируй учебный модуль по клетке для 8 класса: 6 недель, 3 урока в неделю. Используй доказательные подходы, retrieval practice и формирующее оценивание.

> Подбери skills для рабочей программы по ФГОС: нужно связать планируемые результаты, КТП, контрольные работы и критерии оценивания.

> Я ученик, застрял на задаче по физике. Не давай сразу ответ: сначала помоги понять ошибку и дай подсказки по шагам.

Codex can then use relevant skills such as backwards design, spaced practice, retrieval practice, formative assessment, rubric design, progressive hints, and stuck/error diagnosis.

## Simple option: install individual skills

Use this when you only want a few skills available globally in Codex.

```bash
git clone https://github.com/dubr1k/education-agent-skills.git
cd education-agent-skills
mkdir -p ~/.codex/skills
cp -r skills/<domain>/<skill-name> ~/.codex/skills/
```

Example:

```bash
cp -r skills/memory-learning-science/spaced-practice-scheduler ~/.codex/skills/
```

Restart Codex after copying skills.

## One-off use without installing

You can also use any skill manually without setup:

1. Open a `SKILL.md` file under `skills/`.
2. Copy the prompt or instructions.
3. Paste them into Codex with your classroom context.

Example skill:

```text
skills/memory-learning-science/spaced-practice-scheduler/SKILL.md
```

This works well for testing, but it is not persistent. Codex will not automatically discover the skill in future sessions unless it is installed locally.

## MCP discovery tools

Local Codex use does not require MCP. If you are using the MCP server from another client, the discovery tools accept Russian and English search language while keeping tool names English:

- `find_skills` — search by keyword, domain, evidence strength, tag, or free text.
- `suggest_skills` — describe a teaching, curriculum, assessment, inclusion, or student-learning need.
- `get_skill_details` — fetch full metadata and usage guidance for a specific skill.
- `list_skills` — browse the library.

Russian examples for MCP-capable clients:

```text
find_skills query="ФГОС рабочая программа КТП критерии оценивания"
suggest_skills task="Нужно подготовить диагностическую работу и рубрику для 7 класса по теме дроби"
suggest_skills task="Ученик просит ответ сразу, но нужно сначала проверить понимание и дать постепенные подсказки"
```

## Which option should I choose?

Use the local plugin if:

- You want the full library available.
- You want Codex to discover relevant education skills automatically.
- You want RU/EN prompts without remote services.
- You are comfortable cloning a GitHub repo.

Use individual skill installation if:

- You only need one or two skills.
- You want a minimal local setup.
- You want skills available across Codex projects without installing the whole library.

Use manual one-off use if:

- You are evaluating the library.
- You cannot install local files.
- You only need a single prompt once.

## Updating

If you cloned the full repo, update it with:

```bash
cd education-agent-skills
git pull
```

Then restart Codex so it picks up the latest skill changes.

If you copied individual skills into `~/.codex/skills/`, copy them again after updating the repo.

## Troubleshooting

If Codex does not appear to use the skills:

- Make sure each installed skill folder contains a `SKILL.md` file.
- Make sure the `SKILL.md` file has `name` and `desc` fields in the frontmatter.
- Restart Codex after installing or updating skills.
- For individual skills, make sure the skill folder was copied directly into `~/.codex/skills/`, not nested too deeply.

Expected examples:

```text
~/.codex/skills/spaced-practice-scheduler/SKILL.md
~/.codex/skills/memory-learning-science/spaced-practice-scheduler/SKILL.md
```
