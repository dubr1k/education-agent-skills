# Hermes Agent setup for Educational Skills RU

Use this guide if you use [Hermes Agent](https://hermes-agent.nousresearch.com/) and want **Educational Skills RU** available locally.

Educational Skills RU is a bilingual RU/EN fork of the Education Agent Skills Library. The recommended Hermes path is **selected local installs**, not a full plugin. The repo remains the canonical, inspectable source of truth; Hermes installs selected `SKILL.md` folders from GitHub into your local runtime.

Repository: https://github.com/dubr1k/education-agent-skills

## Compatibility note / Важно о совместимости

Technical identifiers intentionally stay in English for upstream compatibility:

- `skill_id`
- folder names under `skills/<domain>/<skill-name>/`
- tool names such as `find_skills`, `suggest_skills`, `get_skill_details`, `list_skills`
- tags and chaining metadata

Русскоязычный слой добавлен через инструкции, поиск, aliases, документацию и runtime metadata. Поэтому запросы можно формулировать по-русски, а устанавливаемые идентификаторы skills остаются английскими.

## Which route should I use?

| Route | Best for | Trade-off |
|---|---|---|
| Hermes selected installs | Local, offline, no-dependency use inside Hermes | You choose which skills to install |
| Hermes tap | Registering this GitHub repo as a community skill source | Current Hermes tap search works best with flat skill repos, so use the full identifiers below |
| Local MCP | Local intelligent skill discovery via `find_skills` / `suggest_skills` | Requires a local MCP-capable client |
| Claude/Codex plugins | Users already working in those runtimes | Runtime-specific install path |
| Manual copy-paste | Trying one skill with no setup | No automatic discovery or orchestration |

## Optional: add the GitHub tap

```bash
hermes skills tap add dubr1k/education-agent-skills
```

This registers the repo as a Hermes community source. Because this library preserves domain folders (`skills/<domain>/<skill-name>/SKILL.md`), the most reliable install path is to use the full skill id or raw `SKILL.md` URL.

```bash
hermes skills install \
  dubr1k/education-agent-skills/skills/original-frameworks/learning-target-authoring-guide \
  --category education --yes
```

After installing, verify that Hermes can see the skill:

```bash
hermes skills list
```

## Suggested starter packs

Do not install all 165 skills by default. The library is intentionally broad; a smaller local set is easier to search and less likely to create noisy agent behaviour.

### Russian curriculum and assessment starter pack

Use this for ФГОС/ФОП planning, рабочие программы, КТП, рубрики, диагностические and контрольные работы.

```bash
hermes skills install dubr1k/education-agent-skills/skills/curriculum-assessment/competency-unpacker --category education --yes
hermes skills install dubr1k/education-agent-skills/skills/original-frameworks/learning-target-authoring-guide --category education --yes
hermes skills install dubr1k/education-agent-skills/skills/curriculum-assessment/kud-knowledge-type-mapper --category education --yes
hermes skills install dubr1k/education-agent-skills/skills/curriculum-assessment/criterion-referenced-rubric-generator --category education --yes
hermes skills install dubr1k/education-agent-skills/skills/curriculum-assessment/assessment-validity-checker --category education --yes
```

### Learning science starter pack

Use this for retrieval practice, spaced practice, feedback, metacognition, and study strategy support.

```bash
hermes skills install dubr1k/education-agent-skills/skills/memory-learning-science/retrieval-practice-generator --category education --yes
hermes skills install dubr1k/education-agent-skills/skills/memory-learning-science/spaced-practice-scheduler --category education --yes
hermes skills install dubr1k/education-agent-skills/skills/memory-learning-science/feedback-quality-analyser --category education --yes
hermes skills install dubr1k/education-agent-skills/skills/self-regulated-learning/metacognitive-prompt-library --category education --yes
```

### Student-facing AI learning starter pack

Use this for tutoring flows where the AI should not simply give the answer: retrieve first, diagnose the error, offer progressive hints, and ask for teach-back.

```bash
hermes skills install dubr1k/education-agent-skills/skills/student-learning/retrieve-first-gate --category education --yes
hermes skills install dubr1k/education-agent-skills/skills/student-learning/progressive-hint-ladder --category education --yes
hermes skills install dubr1k/education-agent-skills/skills/student-learning/stuck-and-error-diagnosis-coach --category education --yes
hermes skills install dubr1k/education-agent-skills/skills/student-learning/teach-back-evaluator --category education --yes
```

## Raw URL fallback

If identifier-based install fails in your Hermes version, install a single skill directly from its raw `SKILL.md` URL:

```bash
hermes skills install \
  https://raw.githubusercontent.com/dubr1k/education-agent-skills/main/skills/original-frameworks/learning-target-authoring-guide/SKILL.md \
  --category education --yes
```

You can use the same pattern for any folder under `skills/<domain>/<skill-name>/SKILL.md`.

## Russian usage examples / Примеры запросов

After installing selected skills locally, ask Hermes in Russian or English:

> Составь КТП на 8 недель по теме "электричество" для 8 класса: планируемые результаты, проверочные работы, критерии оценивания.

> Нужна диагностическая работа перед темой "дроби" и рубрика для проверки решений.

> Я ученик и не понимаю задачу. Помоги найти ошибку, но не давай готовый ответ сразу.

## Intelligent skill selection

A Hermes plugin is not currently planned. For intelligent discovery, run the MCP server locally.

If you want the system to recommend skills from a teaching need, use local MCP tools:

- `find_skills` — search by keyword, domain, evidence rating, or task.
- `suggest_skills` — describe a teaching/curriculum need and get recommended skills.
- `get_skill_details` — fetch the full skill metadata and guidance.
- `list_skills` — browse the library.

Examples for MCP-capable clients:

```text
find_skills query="ФГОС рабочая программа КТП критерии оценивания"
suggest_skills task="Нужно подготовить диагностическую работу и рубрику для 7 класса по теме дроби"
suggest_skills task="Ученик просит ответ сразу, но нужно сначала проверить понимание и дать постепенные подсказки"
```

Use selected Hermes installs when you want local/offline skills. Use local MCP when you want intelligent discovery through an MCP-capable client.

## Trust and licence

Hermes community sources are not the same as default trusted runtime repositories. This library's trust signals are public and inspectable:

- every skill is plain text in GitHub;
- evidence strength and sources are visible in each `SKILL.md`;
- exclusions are documented in [`EXCLUSIONS.md`](EXCLUSIONS.md);
- the architecture and schemas are documented in [`ARCHITECTURE.md`](ARCHITECTURE.md);
- the licence is [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
