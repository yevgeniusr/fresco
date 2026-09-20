# ADR-003 — Git + OKF for durable project knowledge

- **Status:** Accepted
- **Date:** 2026-09-20

## Context

Fresco must remember important learning beyond mutable product records.

## Decision

Keep runtime state in PostgreSQL and promote durable institutional knowledge deliberately into Markdown-first OKF records reviewed in Git.

## Alternatives

Database-only knowledge is hard to diff and review. Automatically mirroring every record creates noise and false authority.

## Consequences

Promotion is a human/moderator responsibility in v0.1. Pull requests create an auditable learning history.
