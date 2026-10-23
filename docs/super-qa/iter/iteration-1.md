# Iteration 1 — 23 Oct 2026

## 1. Scope
Standalone run against production `https://www.typoanim.com` (no staging available; no app source in this repo).
Order requested by the owner: guest → free user → premium user.

## 2. What was done
- Status sweep of all 9,546 sitemap URLs (all 200) and 1,889 crawled internal links (all 200).
- Browser crawl at 1440px and 375px with console, page-error, network, broken-image, overflow and meta checks.
- Interactive probes: cookie banner, search, FAQ, pagination, template preview video, Read more, Add to collection, downloads and quota, pricing toggle and CTA, login/register/forgot-password validation, contact form, mobile menu, sign-out, access control on downloads, licenses and invoices.
- Wrote the Playwright suite (`e2e/`), 124 tests across guest/free/premium projects.

## 3. Bugs found
| Fingerprint | Issue | Priority | Spec |
|---|---|---|---|
| contact\|script-crash\|topic-routing | gh_issue: 1 | medium | guest/forms.spec.ts |
| downloads\|guest-limit\|cookie-reset | gh_issue: 2 | medium | guest/download-limit.spec.ts (@quota) |
| profile\|free-quota\|counter-mismatch | gh_issue: 3 | low | free/account.spec.ts |
| header\|premium-user\|upgrade-cta | gh_issue: 4 | low | premium/account.spec.ts |
| login\|return-url\|lost | gh_issue: 5 | low | free/auth-flow.spec.ts |
| seo\|forgot-password\|duplicate-meta | gh_issue: 6 | low | guest/pages.spec.ts |

No fixes were attempted: the site's source code isn't in this repo.

## 4. Queue
Before: seeded from sitemap (9,546 URLs + auth/account pages). After: see `queue.md`, which has 28 `[x]`, 6 `[b]`, 1 `[!]` (premium billing actions) and 7 `[ ]` items that need a staging/sandbox environment.

## 5. Side effects on the test accounts
- Free account: 3 free templates downloaded (today's quota used up; resets 24 h after the last download). Collection item added then removed.
- Premium account: 1 premium template downloaded (now in its My Downloads history). No billing or profile changes.
- Guest downloads from the test machine's IP: about 20 free-template zips.

## 6. Deviations from the standard Super QA loop
- **GitHub Project board not used.** This session can't call GitHub's GraphQL API, which Projects needs. Issues were filed with labels only; add them to a "Super Ultimate QA" board by hand if wanted.
- **Production, not staging.** All mutating actions were avoided or intercepted.
