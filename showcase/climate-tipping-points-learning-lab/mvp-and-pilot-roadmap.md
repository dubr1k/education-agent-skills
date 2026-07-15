# MVP And Pilot Roadmap

## Product Thesis

The first product should not try to become a full LMS, a generic tutor, or a curriculum marketplace. The strongest wedge is a **learning-quality orchestration layer** that plugs into an advanced unit and proves three things:

1. teachers get better evidence about student understanding
2. students become less dependent on AI answers
3. curriculum teams can inspect the learning design and assessment logic

## MVP Scope

### Must Include

- one complete learning lab
- skill-chain routing for selected skills
- student tutoring session state machine
- evidence event logging
- teacher dashboard prototype
- AI hallucination hunt activity
- unassisted checkpoint workflow
- exportable teacher report

### Must Not Include

- full LMS replacement
- automated grading for high-stakes assessment
- unrestricted chatbot mode
- broad curriculum marketplace
- opaque student scoring

## Build Phases

| Phase | Duration | Build | Success Test |
|---|---:|---|---|
| 0. Demo package | 1 week | Static showcase, transcript, dashboard spec, QA criteria | Stakeholders understand the product thesis in under 20 minutes |
| 1. Clickable prototype | 2-3 weeks | Simulated teacher dashboard and student session flow | Reviewers can experience retrieve-first, hint ladder, and unassisted checkpoint |
| 2. Functional pilot MVP | 6-8 weeks | Live session engine, evidence log, teacher dashboard, export | One teacher can run the learning lab with one class |
| 3. School pilot | 8-12 weeks | Privacy controls, teacher validation, class setup, pilot analytics | 3-5 teachers produce evidence of improved learning visibility |
| 4. Productisation | 12+ weeks | Multi-unit support, admin settings, integrations, reporting | Repeatable deployment across schools or programmes |

## Pilot Success Metrics

### Learning Quality

- percentage of students improving from scaffolded-only to unassisted performance
- reduction in repeated misconception tags after targeted teacher actions
- quality of student AI claim verification
- transfer success from taught examples to unfamiliar systems

### Teacher Value

- teacher time saved in diagnosing misconceptions
- teacher rating of dashboard usefulness
- number of actionable reteach decisions generated
- curriculum team rating of assessment validity

### Product Trust

- student understanding of why AI withholds direct answers
- teacher confidence in evidence accuracy
- rate of teacher corrections to AI-inferred evidence
- no use of AI evidence for unreviewed high-stakes judgement

### Commercial Signal

- willingness of school leaders to pilot with another unit
- curriculum team interest in adapting the model
- technical feasibility of skill orchestration and evidence events
- founder/investor belief that the product has a defensible wedge

## Pilot Research Questions

1. Do students who use the constrained AI tutor perform better on unassisted transfer tasks than students using free-form AI help?
2. Does the dashboard help teachers identify misconceptions faster or more precisely?
3. Can curriculum teams trust the alignment between skill chain, assessment, and student evidence?
4. Do students understand AI reliability better after the hallucination hunt?
5. Does bounded agency reduce climate-action overwhelm while preserving seriousness?

## Technical Workstreams

| Workstream | Core Tasks |
|---|---|
| Skill router | Load registry, select configured chain, pass structured context |
| Session engine | Manage retrieve-first, hints, teach-back, transfer, unassisted states |
| Evidence model | Store support tags, confidence, misconceptions, transfer, teacher validation |
| Dashboard | Show misconception heatmap, evidence cards, action queue |
| Governance | Role access, retention controls, export controls, teacher review |
| QA | Criteria scoring, transcript review, hallucination checks, assessment alignment |

## Commercial Story

The MVP should be sold as:

> "An evidence-grounded AI learning lab that helps schools prove whether students are actually learning with AI, not merely completing work with AI."

The immediate buyer pain is not "teachers need more worksheets." It is:

- schools need credible AI learning models
- leaders need trust and governance
- teachers need better evidence
- students need to learn without becoming dependent
- curriculum teams need AI use to remain aligned with real outcomes

## Decision Gate

Proceed from pilot to productisation only if:

- teachers use the dashboard to make real instructional decisions
- students complete unassisted checkpoints without rejecting the flow
- curriculum reviewers judge the assessment valid
- school leaders see the model as differentiated from generic AI tutoring
- the evidence model remains narrow, transparent, and governable
