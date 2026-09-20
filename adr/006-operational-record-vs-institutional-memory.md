# ADR-006 — Separate operational records from institutional memory

- **Status:** Accepted
- **Date:** 2026-09-20

## Context

Goals, experiments, results, and decisions can appear in both PostgreSQL and OKF. Treating both as interchangeable sources of truth would create silent drift, while automatically mirroring records would promote unreviewed activity into apparent knowledge.

## Decision

PostgreSQL is canonical for runtime identity, participation, discussion, signals, current workflow state, and pre-review measurements. Git + OKF is canonical for constitutional knowledge and reviewed institutional interpretations.

Promotion is one-way and explicit:

`PostgreSQL record → moderator review → OKF pull request → merged Git commit → PostgreSQL promotion pointer`

A promotion pointer contains the runtime entity type and ID, OKF path, Git commit, reviewer, and promotion time. The pointer is provenance, not a second editable copy of the claim. No automatic OKF-to-database or database-to-OKF synchronization exists after bootstrap seeding.

## Alternatives

- **Database as the only truth:** poor diffs, weak review history, and less agent-readable institutional context.
- **Markdown as the runtime database:** unsuitable for concurrent joins, sessions, discussions, and transactional constraints.
- **Automatic bidirectional synchronization:** ambiguous conflict resolution and accidental promotion of low-quality records.

## Consequences

A completed experiment is not automatically accepted knowledge. Operational and epistemic statuses may differ visibly. Moderator tooling must eventually make promotion and supersession easy, but v0.1 can perform it through reviewed pull requests and record the pointer.
