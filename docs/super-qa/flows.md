# super-qa multi-step user journeys

One line per flow. Format: `- slug — short description (route1 → route2 → ...)`

## Flows

- collection-round-trip — free user saves a template, sees it, removes it (template → /collection) — covered in `e2e/paths/free/account.spec.ts`
- protected-page-sign-in — guest opens My Downloads, signs in, should return there (/downloads → /login → /downloads) — `e2e/paths/free/auth-flow.spec.ts` (bug #5)
- free-download-to-license — free user downloads, then gets the license PDF (template → /download/:id → /downloads → /downloads/license/:id) — `@quota` test in `free/account.spec.ts`
