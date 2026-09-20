# RFC-001 — Fresco Experiment Engine

- **Status:** Accepted for v0.1
- **Authors:** Fresco founding team
- **Date:** 2026-09-20

## Problem

Communities debate interventions without consistently defining outcomes, uncertainty, safeguards, or how results change future action.

## Context

Fresco needs one teachable path from observation to institutional learning. The software serves this method; it is not the source of epistemic authority.

## Proposed solution

The engine represents:

1. A **Goal** with domain, baseline, target, and target metric.
2. A falsifiable **Hypothesis**.
3. An **Idea** describing an environmental intervention, expected effect, cost, and downside.
4. An **Experiment** with intervention, eligibility, timeline, metrics, guardrails, privacy, and explicit participation.
5. A **Result** with aggregate measurements, positive and negative effects, guardrail outcomes, feedback, limitations, and confidence.
6. A **Decision** of Scale, Modify, Repeat, Stop, or Inconclusive, with reasoning.
7. Non-binding **community signals** on completed experiments. A moderator finalizes transitions in v0.1.

## State machine

`Draft → Recruiting → Running → Analyzing → Completed`

`Draft`, `Recruiting`, or `Running` may become `Cancelled` with a recorded reason. Transitions are moderator-controlled in v0.1. Joining is available only while Recruiting; withdrawal is always available while a participation record exists.

## Metrics and guardrails

Every experiment has one primary metric. Secondary metrics add context. Guardrails name outcomes that must not deteriorate and should include autonomy, privacy, burden, or safety when relevant. Metrics are definitions, not proof of causality.

## Participation and privacy

The product shows what changes, what is collected, how long participation takes, what becomes public, and how to withdraw before opt-in. Results are public only in aggregate. No health records or public individual measurements are part of v0.1.

## Community signals

A citizen can signal Scale, Modify, Repeat, Stop, or Inconclusive and explain why. Signals inform moderation; they are not votes with binding power. Governance mechanisms themselves remain experimentable.

## Alternatives considered

- An unstructured proposal board does not teach experimental thinking.
- Binding majority voting overstates early governance maturity and can harm minority interests.
- Automated causal inference would create false confidence from small, heterogeneous trials.

## Risks

Metric gaming, hidden coercion, privacy leakage, engagement substitution, participation pressure, and unjustified causal conclusions. See `.okf/risks/core-risks.md`.

## Success metrics

A citizen can complete the full loop; every public completed experiment contains limitations and a decision; opt-in and withdrawal are auditable; no individual measurement is public.

## Affected principles and knowledge

PRI-001 through PRI-010, GOAL-001 through GOAL-003, the core metric catalogue, and ADR-003 through ADR-005.

## Implementation notes

Use one relational schema with immutable identifiers, server-side validation, authenticated mutations, uniqueness constraints for participation/support/signals, and aggregate public queries.

### Knowledge promotion

PostgreSQL owns live workflow and participation state. Completion does not automatically make a result institutional knowledge. A moderator reviews the evidence, limitations, and decision in a pull request; the merged OKF document becomes the canonical interpretation. PostgreSQL then records a promotion pointer containing the OKF path and Git commit. See ADR-006.

## Open questions

- What minimum cohort size prevents practical re-identification?
- How should moderator legitimacy evolve after the founding cohort?
- Which result-review protocol best calibrates confidence?
- When should a runtime finding be promoted into OKF?
