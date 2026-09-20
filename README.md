# Fresco

> Design better environments. Run experiments. Improve how we live.

Fresco is an open experimental community for continuously designing better environments for human life. It begins as an online community where citizens define human outcomes, propose environmental changes, run voluntary experiments, inspect aggregate results, decide what to do next, and preserve meaningful learning in Git.

Fresco is influenced by Jacque Fresco's emphasis on environmental design, science applied to social problems, and systems built around human needs. It is an independent project: it is **not The Venus Project** and is not officially affiliated with Jacque Fresco, The Venus Project, or related organizations.

**Fresco is not a finished model for society. It is a process for discovering better ones.**

![Fresco landing page](docs/screenshots/landing-desktop.png)

## The Fresco Method

```text
Observe → Goal → Hypothesis → Environmental change
        → Metrics + guardrails → Experiment → Result
        → Scale / Modify / Repeat / Stop / Inconclusive
        → Update knowledge → Repeat
```

Read the complete [Fresco Method](METHOD.md) and [constitutional Principles](PRINCIPLES.md).

## What v0.1 does

- Public landing, about, method, principles, research, and experiment catalogue.
- Email/password citizen accounts with hashed passwords and revocable server-side sessions.
- Structured Goal, Idea, and Experiment creation flows.
- Explicit experiment opt-in and penalty-free withdrawal.
- Public aggregate results with negative effects, guardrails, limitations, and confidence.
- Experiment discussion, idea support, and non-binding community signals.
- Account deletion without public reputation scores or citizen rankings.
- Seeded health, learning, and social examples, clearly labeled as synthetic demo data.
- OKF knowledge, RFCs, ADRs, GitHub workflow, tests, migrations, and deployment packaging.

## Architecture

Fresco is a modular monolith:

```text
Browser
  ↓
Next.js App Router
  ├── public pages
  ├── authenticated lab
  ├── route handlers + boundary validation
  └── domain queries
        ↓
     Drizzle ORM
        ↓
    PostgreSQL

Git + .okf/ ── reviewed institutional memory
```

The main boundaries are:

- `src/app/` — routes and HTTP mutations.
- `src/components/` — accessible product and editorial UI.
- `src/db/` — relational schema and idempotent seed.
- `src/lib/` — authentication, validation, queries, and knowledge reads.
- `.okf/` — durable institutional knowledge.
- `rfcs/` — substantial product and governance proposals.
- `adr/` — material technical decisions.

### What is the source of truth?

PostgreSQL is the operational source of truth for accounts, participation, comments, signals, current workflow state, and pre-review measurements. Git + OKF is the institutional source of truth for principles, accepted risks, and reviewed conclusions.

Knowledge promotion is explicit and one-way:

```text
runtime record → moderator review → OKF pull request
               → merged Git commit → promotion pointer
```

There is no bidirectional sync. Completion does not automatically turn an experiment result into accepted knowledge. See [ADR-006](adr/006-operational-record-vs-institutional-memory.md).

## Local setup

Requirements: Node.js 22+, npm, and PostgreSQL 16+ (Docker Compose is provided).

```bash
cp .env.example .env.local
docker compose up -d db
npm install
set -a; . ./.env.local; set +a
npm run db:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:3000`. The seed is idempotent and does not create a shared demo login; create your own citizen account through `/join`.

If port `5434` is occupied, change the host port in `docker-compose.yml` and `DATABASE_URL` together.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXT_PUBLIC_APP_URL` | Production | Canonical public URL used in metadata |

No third-party authentication or analytics credential is required in v0.1.

## Database workflows

```bash
npm run db:generate  # create a migration after schema changes
npm run db:migrate   # apply committed migrations
npm run db:seed      # idempotent demo content
```

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run build
# or all gates:
npm run verify
```

See [the verification record](docs/VERIFICATION.md) for the latest local and production checks.

## Knowledge organization

Start with [`.okf/index.md`](.okf/index.md). Every durable record has a type, stable ID, status, confidence, provenance, and review date where useful. Runtime activity is not dumped into OKF. Only knowledge meaningful to Fresco's long-term understanding is promoted.

AI agents must read [AGENTS.md](AGENTS.md) before substantial work.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md). Use normal issues and pull requests. Create an RFC for a substantial product, governance, or domain-model change; create an ADR for an important technical decision. Every substantial PR answers: **What did Fresco learn?**

## Roadmap

v0.2 focuses on operating a real founding cohort: moderator workflows, reviewed result collection, email verification/password reset, accessibility and safety audits, research citations, and a visible knowledge-promotion flow. See [ROADMAP.md](ROADMAP.md).

## License

[MIT](LICENSE)
