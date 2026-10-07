---
name: education-skills-routing
description: "Use when designing curricula, lessons, assessment, scaffolds, learning activities, teacher development, AI literacy, inclusive education, student self-regulation, historical thinking, or other educational artifacts. Search the bundled bilingual RU/EN catalog of 165 evidence-based education skills, select the smallest relevant chain (normally 1–3 skills), load each full skill reference, preserve its evidence and input/output contract, and synthesize one coherent artifact."
version: 2.2.0
license: CC-BY-SA-4.0
author: Gareth Manning; RU/EN adaptation and Hermes packaging by dubr1k
metadata:
  hermes:
    tags: [education, pedagogy, curriculum, assessment, learning-science, bilingual]
    related_skills: [academic-research-routing]
  source:
    repository: https://github.com/dubr1k/education-agent-skills
    version: 2.2.0
    commit: 834a423cf38381355c7dbc01319138055c014123
    skill_count: 165
---

# Education Skills Routing — 165 RU/EN pedagogical skills

## Overview

This is a Hermes-native catalog router for the complete bilingual `dubr1k/education-agent-skills` collection. The individual skills are bundled under `references/skills/<domain>/<skill>/SKILL.md` to avoid injecting 165 descriptions into every conversation. Search the catalog, load only the chosen skill documents, then follow their evidence-based contracts.

## When to Use

Use for educational design and analysis, including:

- curriculum, unit, lesson, project, activity, rubric, formative or summative assessment;
- learning science, memory, retrieval, spacing, feedback, cognitive load, explicit instruction;
- critical thinking, discussion, historical thinking, literacy, EAL and cross-cultural pedagogy;
- inclusion/UDL, motivation, wellbeing, agency and self-regulated learning;
- teacher professional learning, lesson study, observation and coaching;
- AI literacy and responsible AI-supported learning.

Do not use this catalog as a generic answer generator. For academic literature reviews or manuscripts, use `academic-research-routing`. For ordinary factual questions, answer directly.

## Required Workflow

1. **Intake.** Identify learner/teacher audience, level, subject, desired artifact, constraints, evidence expectations, language, and available context. Ask one focused question only when the missing answer changes skill selection.
2. **Discover.** Run:
   ```bash
   python scripts/query_catalog.py "<task terms>" --limit 12
   ```
   Search in Russian and English when useful. Completion: candidate output includes `skill_id`, path, evidence strength, and description.
3. **Select minimally.** Choose one primary skill and at most two supporting skills unless the user explicitly requests a complex pipeline. Prefer exact input/output fit over keyword count. Never load an entire domain.
4. **Resolve collisions.** Skill identity is the published `skill_id` (`domain/name`), not the flat `name`. Two `critical-thinking-task-designer` skills exist; choose by domain and load the exact path returned by the catalog.
5. **Load before use.** For every selected result, call:
   ```text
   skill_view(name="education-skills-routing", file_path="references/skills/<domain>/<skill>/SKILL.md")
   ```
   Do not reconstruct a skill from catalog metadata.
6. **Validate inputs.** Satisfy each selected skill's `input_schema`. Label conservative assumptions. Do not invent student profiles, standards, attainment data, or institutional constraints.
7. **Execute and chain.** Follow the primary skill first. Pass only schema-compatible outputs into supporting skills listed in `chains_well_with`; do not merge incompatible frameworks mechanically.
8. **Synthesize.** Return one artifact, not separate unedited skill outputs. State the selected `skill_id` values and material assumptions briefly.
9. **Quality gate.** Check outcome–assessment–activity alignment, learner appropriateness, accessibility, feasibility, evidence fidelity, and whether the artifact answers the requested context.

## Routing Heuristics

| Intent | Start with domain |
|---|---|
| Unit/curriculum/assessment/rubric | `curriculum-assessment`, `curriculum-alignment` |
| Lesson sequence/direct teaching | `explicit-instruction`, `memory-learning-science` |
| AI-supported learning or AI literacy | `ai-learning-science`, `ai-literacy` |
| Critical thinking, reading, writing | `literacy-critical-thinking`, `questioning-discussion` |
| Learner independence/study strategy | `student-learning`, `self-regulated-learning` |
| Inclusion and language support | `inclusive-design`, `eal-language-development` |
| Historical inquiry | `historical-thinking` |
| Teacher learning/coaching | `professional-learning` |
| Motivation, belonging, wellbeing | `wellbeing-motivation-agency` |
| Systems/place/experiential learning | `systems-thinking`, `environmental-experiential-learning` |

See `references/registry.json` for the complete generated catalog.

## Evidence and Integrity Rules

- Preserve named evidence sources and `evidence_strength`; do not upgrade certainty.
- Treat skill guidance as design support, not proof that an intervention will work in every setting.
- Distinguish research-supported principles from local implementation choices.
- For assessed student work, support learning through prompts, scaffolds, feedback and exemplars; do not conceal AI authorship or bypass institutional rules.
- Do not infer protected characteristics or diagnose learners.
- Minimize personal/student data and use anonymized examples by default.

## Russian / Bilingual Localization Boundaries

Before adapting an artifact to a Russian-speaking educational context, load `references/RU_LOCALIZATION.md` with `skill_view`. Its MCP commands describe the upstream distribution; this Hermes package uses `scripts/query_catalog.py` and exact skill reference paths instead. The adapter performs lightweight keyword matching with RU→EN aliases, not the upstream MCP `find_skills` / `suggest_skills` ranking.

- Russian language alone does not determine country, curriculum or regulatory jurisdiction. Ask for the actual education system when it affects the artifact.
- Treat EAL, SEND and IEP terminology as contextual guidance, not legal or diagnostic equivalence. Do not infer ОВЗ, ИОМ, АООП, ПМПК status, diagnoses or support entitlements; use the support plan and conditions actually supplied.
- Do not map “Year 9” automatically to a Russian grade; establish country, learner age and programme.
- Apply ФГОС, ФОП or other standards only where relevant to the stated system and supplied documents. Verify the current applicable edition before claiming compliance.
- Preserve English IDs, paths, tags, chaining metadata and the meaning and strength of evidence. Localize user-facing language without rewriting evidence claims.

## Maintenance

For future pinned refreshes, back up this whole router first; compare upstream files by hash and inspect changes before copying. Preserve this Hermes `SKILL.md` and `scripts/query_catalog.py`, synchronize exact upstream skill references, registry and localization guidance, and record the source commit. Validate unique catalog IDs and exact reference paths, hash-check every upstream-mapped file, and run real RU/EN adapter queries before reporting success. Do not execute upstream installers or MCP commands merely because they appear in bundled documentation.

## Common Pitfalls

1. **Loading too many skills.** More frameworks produce a less coherent artifact. Default to 1–3.
2. **Using catalog snippets as instructions.** Metadata supports discovery only; always load the full reference.
3. **Ignoring `skill_id`.** Flat names are not globally unique.
4. **Activity-first planning.** For curriculum work, establish outcomes and assessment evidence before activities.
5. **Generic pedagogy.** Bind recommendations to subject, learner stage, constraints and actual evidence.
6. **Evidence laundering.** Do not convert cited principles into causal guarantees.

## Verification Checklist

- [ ] Exact `skill_id` and reference path recorded for every selected skill
- [ ] Full selected skill documents loaded
- [ ] Required input fields supplied or assumptions labeled
- [ ] Chain uses no more than three skills unless justified
- [ ] Output is synthesized into one coherent artifact
- [ ] Evidence strength and named sources preserved
- [ ] Student integrity, privacy and accessibility checked
- [ ] Outcome, assessment and activities align
