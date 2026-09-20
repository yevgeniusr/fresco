# Contributing to Fresco

Fresco welcomes focused changes that improve its capacity to learn without weakening participant autonomy, privacy, or clarity.

## Before substantial work

1. Read [AGENTS.md](AGENTS.md) and [`.okf/index.md`](.okf/index.md).
2. Identify the relevant domain, principles, decisions, risks, metrics, RFCs, and ADRs.
3. Open an issue when the problem or intended behavior needs public discussion.

## Run locally

```bash
cp .env.example .env.local
docker compose up -d db
npm install
set -a; . ./.env.local; set +a
npm run db:migrate
npm run db:seed
npm run dev
```

Use a short branch name such as `feat/result-review` or `fix/withdrawal-state`. Keep unrelated changes out of the same pull request.

## Verification

Run `npm run verify` before requesting review. Add tests around boundaries, permissions, state transitions, and calculations. Exercise changed citizen journeys in a real browser when UI behavior changes.

## RFCs and ADRs

Create an RFC before implementing a substantial new capability, governance mechanism, workflow, or domain model. Include the problem, context, proposal, alternatives, risks, success metrics, affected principles/OKF concepts, implementation notes, and open questions.

Create an ADR when a technical choice materially constrains future work. Include context, decision, alternatives, consequences, date, and status. Do not create either for routine implementation details.

## OKF changes

PostgreSQL stores operational state. OKF stores reviewed institutional knowledge. Do not mirror every record.

Propose a Goal or Hypothesis in the product first when it is community work. Promote it to OKF only when it becomes important to long-term understanding. Cite the runtime entity, evidence, and provenance; state uncertainty; supersede stale records instead of creating contradictions.

Research submissions belong in `.okf/research/` and should include stable links, publication dates, source quality, relevant findings, limitations, and which hypotheses they affect. A citation is not an endorsement.

## Experiments

Follow the [Fresco Experiment Spec](METHOD.md). Every experiment needs informed opt-in, one primary metric, guardrails, a privacy boundary, a time burden, limitations, and an explicit next decision. Never add covert enrollment or publish individual measurements.

## Pull requests

Use the repository template. Explain the problem, change, verification, risks, relevant principles, and what Fresco learned. Update durable knowledge only when the learning is real; avoid documentation theater.

By contributing, you agree that your contribution is licensed under the repository's MIT License.
