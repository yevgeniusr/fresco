# Fresco v0.1 release report

Released: 2026-09-20

Production: <https://fresco.rachkovan.com>

Source: <https://github.com/yevgeniusr/fresco>

## What shipped

Fresco v0.1 is a deployable online experimental community, not a static prototype. A visitor can understand the thesis and method, inspect the constitutional principles, browse experiments and aggregate results, create a citizen account, propose goals, ideas, and experiments, opt into or withdraw from an experiment, discuss evidence, and submit or revise a community signal.

The release includes realistic, explicitly synthetic demonstrations across physical activity, voluntary learning, and social connection. It also includes the repository's institutional layer: structured OKF knowledge, the Fresco Experiment Specification, RFC-001, six ADRs, contributor guidance, database migrations, an idempotent seed, tests, and container deployment.

## Architecture

The product is a modular Next.js monolith backed by PostgreSQL through Drizzle ORM. Authentication uses password hashing and revocable server-side sessions. HTTP mutations validate untrusted input at the boundary. The architecture intentionally avoids services, queues, and distributed infrastructure until evidence requires them.

The two persistence systems have different authority:

- PostgreSQL is authoritative for operational facts: identities, consent, withdrawal, comments, community signals, workflow state, and pre-review measurements.
- Git and OKF are authoritative for reviewed institutional knowledge: principles, accepted risks, major conclusions, confidence, provenance, and supersession history.

Promotion is one-way and reviewable: runtime evidence, moderator review, OKF pull request, merged commit, then a database pointer to that commit. There is no bidirectional synchronization and no automatic elevation of a database result into accepted knowledge.

## Repository organization

- `.okf/` contains durable knowledge organized by first-class concept type.
- `src/app/` contains public pages, the citizen lab, and validated mutations.
- `src/db/` contains the application schema, migrations, and demo seed.
- `src/lib/` contains authentication, queries, validation, and the read-only OKF adapter.
- `rfcs/` contains substantial proposals; RFC-001 defines the experiment engine.
- `adr/` records material technical and ethical architecture decisions.
- `docs/` contains release and verification evidence.

## Important decisions

The release starts as a modular monolith, uses PostgreSQL for runtime state, preserves reviewed knowledge in Git and OKF, publishes only aggregate experiment results, requires explicit voluntary opt-in, and treats runtime records and institutional memory as distinct states.

## Current assumptions

- A community of roughly 20–100 people can operate the initial workflows with lightweight moderation.
- Structured forms can teach better experimental thinking without making participation feel bureaucratic.
- Public aggregate results can create transparency while protecting individual measurements.
- Fresco's environmental-design framing can unify the founder's existing work and attract people who share its values.

These are assumptions, not validated findings.

## Limitations and open questions

- Email verification, password recovery, and third-party authentication are not yet implemented.
- Moderator state transitions are documented but do not yet have a dedicated administration interface.
- The product does not yet collect individual measurements or run statistical analysis; it deliberately makes no automatic causal claims.
- OKF promotion is a documented review workflow with a database pointer, not an in-product publishing tool.
- Notifications, moderation queues, research citation workflows, and privacy exports remain future work.
- The founding-cohort size, acquisition strategy, and usefulness of community signals have not yet been validated with real participants.

## Recommended v0.2 priorities

1. Recruit a small founding cohort and run one genuine, low-risk experiment end to end.
2. Build moderator review and result-publication controls around that real workflow.
3. Add email verification, password recovery, privacy export, and abuse controls.
4. Make the OKF promotion review visible without weakening the Git pull-request boundary.
5. Measure comprehension, completion, withdrawal, and whether the intervention improved the intended human outcome—not generic engagement.

## Verification

Lint, type checking, unit tests, production build, migrations, idempotent seed, desktop and mobile browser inspection, and the authenticated production journey passed. See [VERIFICATION.md](VERIFICATION.md) for the evidence summary.
