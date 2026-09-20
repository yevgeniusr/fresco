# Verification record

## 2026-09-20 — v0.1 release candidate

| Check | Status | Evidence |
| --- | --- | --- |
| ESLint | Pass | `npm run lint`, zero warnings |
| TypeScript | Pass | `npm run typecheck` |
| Unit tests | Pass | 3 files, 6 tests |
| Production build | Pass | Next.js 16 production build, all required routes compiled |
| Production dependencies | Pass | `npm audit --omit=dev`, zero known vulnerabilities |
| PostgreSQL migrations | Pending live database | Local Docker daemon is unavailable in the build workspace |
| Seed | Pending live database | Will be verified against the dedicated production database |
| Desktop browser | Pending deployment | Landing, catalogue, authentication, and full experiment loop |
| Mobile browser | Pending deployment | 390 px responsive pass and core interaction loop |

The pending entries are release gates, not waived checks. Update this document with production evidence before declaring v0.1 deployed.
