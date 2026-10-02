# CLAUDE.md

Claude Code must read and follow [`AGENTS.md`](./AGENTS.md) before making changes in this repository.

`AGENTS.md` is the repository-wide source of truth for:

- project scope and architectural constraints;
- JavaScript-only frontend policy;
- authentication and security expectations;
- issue/branch/PR workflow;
- required validation commands;
- testing and documentation standards;
- definition of done.

## Claude-specific notes

- Do not infer repository conventions from this file alone; use `AGENTS.md` plus the current issue and existing code/tests.
- The SPA uses Laravel Sanctum cookie-based authentication with CSRF protection. Authentication tokens must not be introduced into `localStorage` or `sessionStorage`.
- Keep changes narrowly scoped to the current issue and report any validation command that could not be executed.

## Common commands

```bash
npm run install:all
npm start

npm --prefix frontend run lint
npm --prefix frontend run test
npm --prefix frontend run build
npm --prefix frontend run audit:security

cd backend
php artisan test
php artisan route:list --path=api
vendor/bin/pint --test
composer audit --locked
```

For the complete rules, see [`AGENTS.md`](./AGENTS.md).
