# Verification record

## 2026-09-20 — v0.1 production release

| Check | Status | Evidence |
| --- | --- | --- |
| ESLint | Pass | `npm run lint`, zero warnings |
| TypeScript | Pass | `npm run typecheck` |
| Unit tests | Pass | 4 files, 8 tests |
| Production build | Pass | Next.js 16 production build, all required routes compiled |
| Production dependencies | Pass | `npm audit --omit=dev`, zero known vulnerabilities |
| PostgreSQL migrations | Pass | Applied to the dedicated production PostgreSQL database |
| Seed | Pass | Idempotent seed completed against production |
| Production health | Pass | Application and database healthy at `fresco.rachkovan.com` |
| Desktop browser | Pass | Public pages, registration, login, join, withdrawal, discussion, signal update, and account deletion exercised in Firefox |
| Mobile browser | Pass | Landing page inspected using an iPhone 15 viewport; navigation and layout remain usable |
| Browser console | Pass | No application errors during the production journey |

The production journey used disposable citizen accounts. Those accounts—and their cascading participation, comments, and signals—were deleted after verification so the public instance was not left with QA activity.
