# AGENTS.md

Repository-wide instructions for AI coding agents working on **Distrito Gourmet**.

This file is the primary source of truth for agent behavior in this repository. Tool-specific files such as `CLAUDE.md` may add small compatibility notes, but must not contradict this file.

## 1. Project purpose

Distrito Gourmet is a full-stack restaurant platform originally built as a DAW final project and now maintained as a portfolio-quality application.

The product covers:

- public restaurant website and digital menu;
- customer registration and authentication;
- reservations and capacity availability;
- takeaway orders and cart flows;
- customer profile and history;
- staff operations;
- administration of catalogue, reservations, orders and users;
- operational metrics.

The goal of current maintenance is **incremental product hardening**, not a rewrite.

## 2. Technology baseline

### Frontend

- React 19
- JavaScript / JSX
- Vite 7
- React Router
- Zustand
- Axios
- Tailwind CSS
- GSAP and Lenis

### Backend

- Laravel 12
- PHP 8.2+
- Laravel Sanctum
- Eloquent
- MySQL 8 in normal development/production flows
- SQLite may be used by automated tests where configured

### Infrastructure

- Docker / Docker Compose
- Nginx for the containerized frontend
- GitHub Actions CI

## 3. Non-negotiable constraints

Agents MUST preserve these constraints unless an issue explicitly changes one of them.

1. **Keep the frontend in JavaScript.** Do not migrate files to TypeScript, add a TypeScript migration, or introduce TypeScript-only architecture unless a dedicated approved issue requests it.
2. **Do not rewrite the application or change frameworks** as part of unrelated work.
3. **Do not replace Laravel, React, Zustand, Axios, Vite or Tailwind** without an explicit architectural issue.
4. **Do not perform drive-by refactors.** Change only what is needed for the issue plus directly required cleanup.
5. **Do not hardcode environment-specific URLs, hosts, ports, credentials or secrets.** Use environment variables and existing configuration patterns.
6. **Do not weaken authentication, authorization, CSRF protection, validation, rate limiting or demo-mode protections.**
7. **Do not commit real secrets or production credentials.** `.env.example` files contain examples only.
8. **Do not change public API contracts silently.** If a response shape, endpoint, validation rule or status code must change, update affected consumers, tests and API documentation in the same PR.
9. **Do not bypass failing lint, tests, security checks or build steps** by disabling rules, skipping tests or suppressing errors unless the issue explicitly requires and justifies it.
10. **Do not add dependencies when the platform or existing dependencies already solve the problem adequately.** New dependencies require a clear reason in the PR.

## 4. Authentication and security model

The real SPA session uses **Laravel Sanctum cookie-based authentication**, not bearer tokens stored in the browser.

Frontend expectations:

- Axios uses `withCredentials: true`.
- CSRF is initialized through `/sanctum/csrf-cookie` before authentication-sensitive mutations.
- The authenticated user is held in Zustand state.
- Do not store authentication tokens in `localStorage` or `sessionStorage`.

Backend expectations:

- Authentication and authorization are enforced server-side.
- Frontend route guards are UX controls only; they are not a security boundary.
- Respect the existing `auth:sanctum`, staff and admin authorization layers.
- Validate user input server-side even when the frontend also validates it.

Public demo mode is intentionally read-only. Before adding or modifying mutating frontend operations, inspect `frontend/src/config/demo.js` and the Axios protections in `frontend/src/services/api.js`.

## 5. Repository map

```text
distrito-gourmet/
├── frontend/                 React SPA
│   └── src/
│       ├── components/       reusable UI and layout components
│       ├── config/           runtime/demo configuration
│       ├── data/             static/demo data
│       ├── hooks/            reusable React hooks
│       ├── layouts/          route layouts
│       ├── motion/           reusable motion helpers
│       ├── pages/            route-level views
│       ├── services/         API/client integrations
│       ├── store/            Zustand stores
│       └── utils/            pure/shared utilities
├── backend/                  Laravel REST API
│   ├── app/Http/Controllers/API/
│   ├── app/Http/Middleware/
│   ├── app/Http/Requests/
│   ├── app/Http/Resources/
│   ├── app/Models/
│   ├── app/Services/         domain/business rules that do not belong in controllers
│   ├── database/
│   ├── routes/
│   └── tests/
├── database/                 auxiliary project data/resources
├── docs/                     product and technical documentation
├── scripts/                  local tooling
├── .github/workflows/        CI
├── docker-compose.yml
└── README.md
```

## 6. Architectural guidance

### Frontend

- Keep route-level views in `pages/` and reusable pieces in `components/`.
- Keep HTTP concerns in `services/`; pages/components should not duplicate Axios setup.
- Use Zustand only for genuinely shared client state. Prefer local component state for local UI state.
- Preserve lazy-loaded route views unless there is a measured reason not to.
- Reuse existing design tokens and Tailwind conventions before creating new one-off styles.
- Respect `prefers-reduced-motion`; new GSAP/Lenis behavior must remain accessible to users who reduce motion.
- Preserve responsive behavior and keyboard usability when changing UI.

### Backend

- Controllers should coordinate HTTP concerns, not accumulate domain logic.
- Use Form Requests for non-trivial validation when appropriate.
- Put reusable business rules in services/actions rather than copying them across controllers.
- Use Eloquent relationships and query scopes where they improve clarity without hiding critical behavior.
- Keep authorization server-side and explicit.
- Use database transactions for multi-step writes that must succeed or fail atomically.
- Avoid N+1 query regressions; eager-load intentionally when returning related data.

### Database

- Schema changes require migrations.
- Never edit historical migrations merely to change an already-established schema unless the issue explicitly concerns pre-release migration cleanup.
- Migrations should be reversible when practical.
- Seed/demo data must remain clearly non-production.

## 7. Issue-first workflow

Normal development follows:

```text
Issue -> branch -> implementation -> validation -> pull request -> review -> merge
```

Before coding, the agent must read the complete issue and identify:

- objective;
- acceptance criteria;
- files/areas likely affected;
- explicit non-goals;
- validation required.

If the issue is ambiguous, choose the smallest implementation consistent with the stated acceptance criteria. Do not expand product scope autonomously.

### Branch naming

Use one of:

- `feat/<short-description>`
- `fix/<short-description>`
- `refactor/<short-description>`
- `test/<short-description>`
- `docs/<short-description>`
- `chore/<short-description>`

Prefer linking the issue number when useful, for example `fix/42-reservation-capacity`.

### Commits

Prefer Conventional Commit-style messages:

- `feat(reservations): ...`
- `fix(auth): ...`
- `refactor(orders): ...`
- `test(api): ...`
- `docs: ...`
- `chore(ci): ...`

Commits should describe one coherent change. Avoid messages such as `changes`, `fix stuff` or `updates`.

## 8. Required commands

Run commands from the repository root unless stated otherwise.

### Install

```bash
npm run install:all
```

### Development

```bash
npm start
```

Frontend only:

```bash
cd frontend
npm run dev
```

Backend only:

```bash
cd backend
php artisan serve
```

### Frontend validation

```bash
npm --prefix frontend run lint
npm --prefix frontend run test
npm --prefix frontend run build
npm --prefix frontend run audit:security
```

### Backend validation

```bash
cd backend
php artisan test
php artisan route:list --path=api
vendor/bin/pint --test
composer audit --locked
```

Run the narrowest relevant tests while iterating, then run the full required checks before marking work complete.

## 9. Validation matrix

At minimum:

- **Frontend-only change:** frontend lint + relevant frontend tests + frontend build.
- **Backend-only change:** relevant/full Laravel tests + Pint; run route list when routing/contracts change.
- **Dependency change:** corresponding security audit + normal build/tests.
- **API contract change:** backend tests + affected frontend tests/build + API docs update.
- **Authentication/authorization/security change:** backend tests + affected frontend tests/build + security audit(s) where relevant.
- **Docker/deployment change:** validate configuration/build path appropriate to the changed service and update deployment docs when behavior changes.

If a required command cannot be run, state exactly which command was not run and why in the PR. Never imply validation that did not happen.

## 10. Testing expectations

Every bug fix should add or improve a regression test when the behavior is testable at reasonable cost.

Prioritize tests around business-critical flows:

- authentication and authorization;
- reservation availability and capacity;
- reservation creation/cancellation;
- order totals and order lifecycle;
- catalogue mutations;
- staff/admin access control;
- demo-mode write prevention;
- date/time handling.

Prefer focused, readable tests over one large test file covering unrelated domains.

Do not delete or weaken tests merely to make CI pass.

## 11. Documentation expectations

Update documentation when behavior visible to developers, operators or users changes.

Relevant files include:

- `README.md`
- `Documentacion.md`
- `docs/API_DOCS.md`
- `docs/DEPLOY.md`
- `docs/MANUAL_USUARIO.md`
- `docs/ROADMAP.md`
- `docs/SECURITY.md`

Do not duplicate the same detailed explanation across multiple files. Link to the canonical document where possible.

## 12. Pull request standard

A PR should be reviewable without reconstructing the issue from the diff.

Include:

- what changed;
- why it changed;
- issue reference (`Closes #...` when appropriate);
- important implementation decisions;
- validation performed;
- screenshots/video for meaningful UI changes;
- migrations/configuration/deployment notes;
- known limitations or follow-up work.

Keep PRs scoped. If unrelated problems are discovered, open or propose a separate issue instead of silently expanding the PR.

## 13. Definition of done

Work is done only when all applicable items are true:

- acceptance criteria are satisfied;
- implementation follows current architecture and project constraints;
- no secrets or environment-specific values were introduced;
- relevant tests were added/updated and pass;
- lint/format/build checks pass;
- API/docs were updated when contracts or behavior changed;
- demo mode remains safe for public use;
- authentication/authorization remains enforced server-side;
- no unrelated refactor is bundled into the change;
- PR description explains the change and validation clearly.

## 14. Agent communication

When working autonomously, agents should be explicit and concise:

1. State the issue interpretation and intended scope before large changes.
2. Surface discovered blockers or security concerns early.
3. Do not claim commands passed unless they were actually executed.
4. At completion, summarize changed files, validations and any remaining risk.

## 15. Instruction precedence

- The current GitHub issue defines the requested task.
- The nearest `AGENTS.md` to a modified file overrides broader instructions if nested agent files are added later.
- This root `AGENTS.md` applies to the entire repository today.
- Existing code and tests define current behavior when documentation is stale; fix stale documentation as part of the relevant scoped change.
- Tool-specific instruction files must defer to this file for repository-wide rules.
