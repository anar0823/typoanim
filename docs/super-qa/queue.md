# Super QA queue — typoanim.com

Seeded from `sitemap.xml` (9,546 URLs) plus `/login`, `/register`, `/forgot-password` and the account pages.
Template detail pages (9,474) are sampled: 2 per (licence × software × category) group in the crawl, and 12 fixed samples in the spec suite. All 9,546 sitemap URLs and all 1,889 internal links found in the crawl returned HTTP 200.

States: `[ ]` queued · `[x]` green spec · `[b]` bug filed · `[!]` skipped · `[?]` flaky

## Level 0 — guest (logged out)

- [x] `/` — e2e/paths/guest/pages.spec.ts (iter 1)
- [x] `/pricing` — pages.spec.ts, forms.spec.ts (iter 1)
- [x] `/black-friday`, `/black-friday/premiere-pro`, `/black-friday/after-effects` — pages.spec.ts (iter 1)
- [x] `/about`, `/faq`, `/license`, `/terms`, `/privacy`, `/refund`, `/dmca` — pages.spec.ts (iter 1)
- [b] `/contact` — page script crashes, topic routing broken → #1 (iter 1)
- [x] `/blog` + 4 posts — pages.spec.ts (iter 1)
- [x] `/login` — forms.spec.ts (iter 1)
- [x] `/register` — forms.spec.ts (iter 1; no account created, POST intercepted)
- [b] `/forgot-password` — two `<meta name="description">` tags → #6 (iter 1)
- [x] `/free-templates`, `/premium-templates` + software/category listings (34 pages) — pages.spec.ts (iter 1)
- [x] `/templates/search` (results, empty state, HTML injection) — navigation.spec.ts (iter 1)
- [x] Pagination (`?page=`) incl. malformed values — navigation.spec.ts (iter 1)
- [x] Template detail pages (12 samples) — pages.spec.ts, templates.spec.ts (iter 1)
- [b] Guest free downloads (3/day limit) — resets with fresh cookies → #2 (iter 1)
- [x] 404 handling — pages.spec.ts (iter 1)
- [x] Mobile 375px layout + menu (8 pages) — pages.spec.ts, navigation.spec.ts (iter 1)

## Level 1 — free user

- [x] `/profile`, `/downloads`, `/collection` — e2e/paths/free/account.spec.ts (iter 1)
- [x] Add to / remove from collection — account.spec.ts (iter 1)
- [x] Premium template gating (UI + direct URL) — account.spec.ts (iter 1)
- [x] Other users' license PDFs / invoices (access control) — account.spec.ts (iter 1)
- [b] Free-download counter on profile vs template page — disagreed → #3 (iter 1)
- [b] Sign in from a protected page lands on home → #5 (iter 1)
- [x] Sign out — auth-flow.spec.ts (iter 1)

## Level 1 — premium user (read-only: live subscription)

- [x] `/profile`, `/downloads`, `/collection` — e2e/paths/premium/account.spec.ts (iter 1)
- [x] Premium template download + license PDF — account.spec.ts (iter 1)
- [b] Header still shows "Upgrade" → #4 (iter 1)
- [!] Pause / cancel / switch to yearly / change card / billing details — skipped: real paid subscription on production; needs a sandbox (Paddle test mode) account

## Not yet explored (queued)

- [ ] Profile edits: name, newsletter toggle, change password (needs a disposable account)
- [ ] Registration end-to-end + email verification (needs a disposable inbox)
- [ ] Google sign-in (`/oauth2/authorization/google`)
- [ ] Checkout flow up to the Paddle overlay (needs Paddle sandbox)
- [ ] Contact form real submission (would email the team)
- [ ] Search filters (Free/Premium, Software, Resolution, sort)
- [ ] Remaining 9,462 template pages (status already 200; content not individually checked)
