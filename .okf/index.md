---
okf_version: "0.1"
project: Fresco
last_reviewed: 2026-09-20
review_after: 2026-12-20
---

# Fresco knowledge index

This directory is Fresco's durable, version-controlled institutional memory. It records what Fresco believes, why, how certain it is, what was tested, and what changed. It is not the application database.

## Ontology

| Type | Purpose | Directory |
| --- | --- | --- |
| Principle | Ethical or constitutional constraint | `principles/` |
| Goal | Measurable human outcome | `goals/` |
| Hypothesis | Falsifiable causal expectation | `hypotheses/` |
| Metric | Defined measurement and limits | `metrics/` |
| Experiment | A real-world test | `experiments/` |
| Result | Observed experiment outcome | `results/` |
| Decision | Scale, Modify, Repeat, Stop, or Inconclusive | `decisions/` |
| Research | External evidence and prior work | `research/` |
| Domain | A broad problem area | `domains/` |
| Capability | Something Fresco can demonstrably do | `capabilities/` |
| Risk | A known failure mode | `risks/` |

## Core relationship

`Goal → Hypothesis → Idea → Experiment → Result → Decision → updated Hypothesis`

## Knowledge contract

- Markdown is canonical; YAML frontmatter carries stable identifiers and relationships.
- Claims identify their provenance as external evidence, internal assumption, experiment finding, or preference.
- Confidence is explicit: `low`, `medium`, or `high`.
- Status is one of `draft`, `active`, `testing`, `validated`, `disputed`, `superseded`, or `archived`.
- Meaningful knowledge is promoted deliberately from runtime records. Comments, joins, and every proposal do not automatically become OKF.
- Stale records are reviewed or superseded rather than copied into competing documents.

## Source-of-truth boundary

| Question | Canonical source |
| --- | --- |
| Accounts, sessions, participation, withdrawal, comments, supports, signals | PostgreSQL |
| Current proposal and experiment workflow state | PostgreSQL |
| Raw or pre-review result records | PostgreSQL |
| Constitutional principles, method, accepted risks, and architecture decisions | Git + OKF |
| Reviewed institutional conclusions and their confidence/provenance | Git + OKF |

Knowledge flows one way through an explicit review: `runtime record → moderator review → OKF pull request → merged commit → promotion pointer`. PostgreSQL stores the pointer to the promoted OKF path and Git commit, not a second editable copy of the institutional claim. There is no automatic two-way synchronization.

When a subject exists in both systems, the database owns its operational state and OKF owns the reviewed interpretation. For example, PostgreSQL may say an experiment is `Completed`; OKF may say its conclusion remains `disputed` or has been `superseded`.

Start with [the Fresco Method](../METHOD.md), [RFC-001](../rfcs/001-fresco-experiment-engine.md), and the relevant domain, principles, metrics, decisions, and risks.
