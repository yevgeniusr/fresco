# ADR-002 — PostgreSQL as primary database

- **Status:** Accepted
- **Date:** 2026-09-20

## Context

Runtime data has relational links, participation uniqueness constraints, discussions, and state transitions.

## Decision

Use PostgreSQL with Drizzle ORM and committed SQL migrations.

## Alternatives

SQLite was attractive locally but creates a production divergence. Document databases weaken important relational constraints.

## Consequences

Local setup needs Docker or an existing PostgreSQL instance. The schema remains portable and self-hostable.
