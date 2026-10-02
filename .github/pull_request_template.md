## Summary

<!-- What changed? Keep this concise and specific. -->

## Why

<!-- Why is this change needed? Link the problem to the implementation. -->

Closes #<!-- issue number -->

## Scope

### Included

- 

### Not included

- 

## Implementation notes

<!-- Important architectural decisions, trade-offs, API/database changes, or unusual behavior. -->

## Validation

Mark only checks that were actually run.

### Frontend

- [ ] `npm --prefix frontend run lint`
- [ ] `npm --prefix frontend run test`
- [ ] `npm --prefix frontend run build`
- [ ] `npm --prefix frontend run audit:security` (when dependencies/security-sensitive code changed)
- [ ] Not applicable

### Backend

- [ ] `cd backend && php artisan test`
- [ ] `cd backend && php artisan route:list --path=api` (when routes/contracts changed)
- [ ] `cd backend && vendor/bin/pint --test`
- [ ] `cd backend && composer audit --locked` (when dependencies/security-sensitive code changed)
- [ ] Not applicable

### Manual verification

<!-- Describe exactly what was checked manually. -->

- 

## UI evidence

<!-- Add before/after screenshots or video for meaningful UI changes. Write "Not applicable" otherwise. -->

## Database / configuration / deployment

<!-- Migrations, new env variables, Docker/deployment changes, rollback notes. Write "None" if there are none. -->

- None

## Security checklist

- [ ] No secrets, credentials, tokens, private URLs or environment-specific values were committed.
- [ ] Authentication/authorization remains enforced server-side where applicable.
- [ ] Demo mode remains read-only for mutating operations where applicable.
- [ ] User input remains validated server-side where applicable.

## Final checklist

- [ ] Acceptance criteria from the linked issue are satisfied.
- [ ] The change is scoped to the issue; unrelated refactors were not bundled in.
- [ ] Tests were added/updated for changed behavior when practical.
- [ ] Documentation was updated if developer/user/operator-visible behavior changed.
- [ ] I have not introduced a JavaScript-to-TypeScript migration unless explicitly requested by the issue.
- [ ] Any validation I could not run is clearly explained above.
