# typoanim — QA suite for typoanim.com

Automated Playwright tests for https://www.typoanim.com, built by a Super QA run.
It covers three kinds of visitor: **guest** (logged out), **free** user and **premium** user.

## Run it

```bash
npm install
npx playwright install chromium   # first time only
cp .env.example .env.local        # then fill in the two test accounts
npm run test:e2e                  # everything
npm run test:guest                # logged-out only (no accounts needed)
npm run test:free
npm run test:premium
npm run test:quota                # tests that really download files and use up the daily quota
npx playwright show-report        # HTML report with screenshots and traces of failures
```

`BASE_URL` overrides the target (default `https://www.typoanim.com`). Point it at a staging copy when you have one.

## Known bugs

Tests that reproduce an open bug call `knownBug(...)` (see `e2e/lib/bugs.ts`), so Playwright **expects them to fail** and the run stays green.
When a bug is fixed, its test "unexpectedly passes" and turns red. Delete the `knownBug` line and close the issue.

## Safety

- The site under test is **production**. Tests never create accounts, submit the contact form, or touch billing.
  Register and contact submissions are intercepted, and the premium suite aborts every POST to `/profile/*`
  because the premium test account has a live subscription.
- Credentials live only in `.env.local` / CI secrets. `.auth/`, `.env*` and raw crawl output are git-ignored. This repo is public.

## Layout

```
e2e/auth.setup.ts          signs in once per role, saves .auth/<role>.json
e2e/lib/                   forensics fixture, sample data, known-bug map
e2e/paths/guest|free|premium/   the specs
docs/super-qa/             queue, page types, critical paths, iteration log, QA report + evidence
```
