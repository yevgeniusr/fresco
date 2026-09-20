# ADR-001 — Modular monolith first

- **Status:** Accepted
- **Date:** 2026-09-20

## Context

Fresco must prove one coherent learning loop for 20–100 people while remaining inexpensive and easy to understand.

## Decision

Use one Next.js application with domain-focused modules, one PostgreSQL database, and one deployment artifact.

## Alternatives

Microservices, event-driven services, and separate public/platform applications were rejected for v0.1.

## Consequences

Transactions, local development, and deployment stay simple. Module boundaries must be preserved so a future extraction is possible if measured load or team ownership requires it.
