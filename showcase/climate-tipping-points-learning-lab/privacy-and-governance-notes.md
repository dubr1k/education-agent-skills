# Privacy And Governance Notes

## Purpose

This showcase uses learning evidence. That creates real product value, but also governance responsibility. The system must be designed around data minimisation, teacher oversight, and clear boundaries between formative support and high-stakes judgement.

## Data Principles

1. **Collect only learning-relevant evidence.** Capture misconception tags, hint levels, confidence changes, transfer checks, and unassisted results. Do not collect unrelated behavioural or emotional data.
2. **Separate formative evidence from grades.** AI-generated evidence can inform teacher decisions, but should not automatically become summative assessment.
3. **Separate scaffolded and unassisted work.** The system must preserve whether evidence came from supported, partially supported, or independent performance.
4. **Make AI inference visible.** Teacher dashboards should label evidence as AI-inferred until reviewed or accepted by a teacher.
5. **Avoid sensitive profiling.** Confidence patterns and support levels are learning-state evidence, not fixed traits. The interface should not label students as weak, dependent, anxious, or low ability.

## Suggested Data Classes

| Data Class | Example | Retention Guidance |
|---|---|---|
| Session evidence | hint level, misconception tag, transfer result | Keep for course duration, then archive or aggregate |
| Student attempts | short excerpts of explanations | Keep only when pedagogically needed |
| Teacher annotations | "needs threshold graph reteach" | Keep as part of formative record |
| AI audit trail | verified/rejected claims | Keep as learning artifact |
| Sensitive reflections | climate anxiety or personal wellbeing statements | Avoid collection unless explicitly part of pastoral process |

## Governance Boundaries

The system should require human review before:

- using AI evidence for grades
- making placement or intervention decisions
- sharing evidence with parents
- exporting student-level analytics
- retaining student writing beyond the learning period

## Safety Language For Students

Students should be told:

- "This evidence helps you and your teacher understand what kind of support helps you learn."
- "Needing hints is not failure; it tells us what to practise next."
- "Your unassisted checkpoint is not a grade by itself."
- "The AI can be wrong about your thinking, so you can challenge its feedback."

## Product Trust Requirements

A production version should include:

- role-based access control
- school-level retention settings
- teacher validation of AI evidence
- export controls
- deletion workflows
- audit logs for who viewed student evidence
- clear consent and parent/school policy alignment where required

## Reviewer Takeaway

The learning evidence is commercially valuable because it is instructionally useful. It should stay valuable by remaining narrow, transparent, teacher-mediated, and clearly separated from surveillance or automated judgement.
