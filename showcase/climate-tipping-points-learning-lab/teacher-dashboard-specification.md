# Teacher Dashboard Specification

## Purpose

The teacher dashboard turns student-facing AI interactions into actionable learning evidence. It does not rank students by generic engagement. It shows what students can do independently, what they can do only with scaffolding, where misconceptions cluster, and what the teacher should do next.

## Primary Dashboard View

```text
Climate Tipping Points Learning Lab
Class: Year 12 Environmental Systems
Week: 3

---------------------------------------------------------------------
Learning Evidence Overview
---------------------------------------------------------------------
Students with strong unassisted feedback-loop reasoning:        11 / 24
Students strong only with scaffolding:                           8 / 24
Students still missing loop closure:                             5 / 24
Students overconfident by 25+ confidence points:                 6 / 24
Students needing AI claim verification reteach:                  9 / 24

Recommended teacher move:
Run a 12-minute whole-class micro-lesson on "closing the loop",
then assign a no-AI near-transfer checkpoint on Amazon dieback.
```

## Misconception Heatmap

| Knowledge Component | Secure Independent | Scaffolded Only | Common Misconception | Teacher Action |
|---|---:|---:|---|---|
| KC1 Variables | 21 | 3 | Lists topics, not variables | Quick pair sort |
| KC2 Directional links | 18 | 5 | Links are vague | Model causal verbs |
| KC3 Loop closure | 11 | 8 | One-way chains | Micro-lesson and diagram practice |
| KC4 Positive feedback | 15 | 6 | Positive means beneficial | Contrast examples |
| KC5 Threshold reasoning | 9 | 10 | Tipping point means any harm | Use threshold graph |
| KC6 Uncertainty language | 16 | 5 | Uses "definitely" or "proved" | AI audit modelling |

## Student Evidence Card

```text
Student: Anonymous 014
Current Focus: Feedback loop closure and threshold reasoning

Confidence Pattern:
- Before retrieval: 45
- After retrieval: 40
- Before unassisted: 65
- After unassisted: 75

Evidence:
- Ice-albedo explanation: scaffolded success, hint level 1
- Permafrost transfer: passed
- Amazon dieback unassisted: strong
- AI claim audit: secure, revised overclaim correctly

Teacher Note:
Ready for a harder threshold graph. Do not reteach basic feedback.
```

## Class Action Queue

| Priority | Group | Evidence | Action |
|---|---|---|---|
| High | 5 students | Cannot close feedback loops without Level 4 hints | Small-group reteach using variable cards |
| Medium | 9 students | Weak AI source reconstruction | Repeat hallucination hunt with one modelled citation |
| Medium | 6 students | Overconfident before unassisted checks | Confidence calibration reflection |
| Low | 4 students | Strong independent transfer | Extension: compare AMOC and social feedback systems |

## Design Rules

The dashboard must:

- separate scaffolded from unassisted evidence
- show misconception patterns rather than only scores
- recommend teacher actions with a reason
- preserve teacher override and annotation
- avoid surveillance-style productivity metrics
- avoid implying a single session is a stable trait

The dashboard must not:

- convert confidence into a grade
- treat hint use as failure
- hide uncertainty in the evidence
- use AI-generated evidence as the sole basis for summative judgement
- expose sensitive student data beyond the educator's legitimate need

## Technical Notes

The dashboard can be powered by event objects from Domain 20 skills:

- `retrieve-first-gate`
- `progressive-hint-ladder`
- `teach-back-evaluator`
- `transfer-bridge`
- `unassisted-evidence-checkpoint`
- `weekly-agency-review`

Each event should include:

- timestamp
- topic
- knowledge component
- student attempt summary
- support tag
- confidence before/after
- misconception tag
- next recommended action
- teacher validation status

Teacher validation matters. The system should distinguish **AI-inferred evidence** from **teacher-confirmed evidence**.
