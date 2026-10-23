# Critical paths (hand-curated — maintained by the site owner)

If any of these is red for more than 2 runs in a row, stop and investigate by hand.

- Sign in (free + premium) — `e2e/auth.setup.ts`
- Free template download works — `e2e/paths/guest/templates.spec.ts` (link), `@quota` tests (real download)
- Premium template download works for premium users — `e2e/paths/premium/account.spec.ts`
- Premium files are NOT downloadable by guests / free users — `templates.spec.ts`, `free/account.spec.ts`
- Pricing page "Get Premium" leads into sign-up/checkout — `e2e/paths/guest/forms.spec.ts`
