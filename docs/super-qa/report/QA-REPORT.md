# QA report — typoanim.com

**Run:** Super QA iteration 1 · 23 Oct 2026 · target `https://www.typoanim.com` (production)
**Roles tested:** guest (logged out) → free user → premium user (read-only: live subscription)

## Result

| | |
|---|---|
| Sitemap URLs checked for HTTP status | 9,546 — all 200 |
| Internal links found while crawling | 1,889 — all 200 (plus the Google sign-in redirect, 302 as expected) |
| Pages crawled in a real browser (1440px + 375px) | 136 guest, 14 free, 14 premium |
| Automated tests in the suite | 124 (120 run by default, 4 opt-in quota tests) |
| Last full run | 120 passed (5 of them are known-bug tests that fail as expected), 4 skipped |
| Bugs filed | 6 (0 high · 2 medium · 4 low) |

## Bugs

| # | Priority | What | Who sees it |
|---|---|---|---|
| [#1](https://github.com/anar0823/typoanim/issues/1) | medium | `/contact` script crashes on load: all messages go to hello@ whatever topic is chosen, and the character counters are missing | everyone |
| [#2](https://github.com/anar0823/typoanim/issues/2) | medium | Guest "3 free downloads a day" limit resets when cookies are cleared | guests |
| [#3](https://github.com/anar0823/typoanim/issues/3) | low | Profile "X/3 free downloads left" disagrees with the template page and with what the server allows | free users |
| [#4](https://github.com/anar0823/typoanim/issues/4) | low | Premium subscribers still see "Upgrade" in the header | premium users |
| [#5](https://github.com/anar0823/typoanim/issues/5) | low | Signing in from a protected page lands on the homepage; signed-in users can still open /login and /register | all users |
| [#6](https://github.com/anar0823/typoanim/issues/6) | low | `/forgot-password` has two meta descriptions (one copied from Contact) | search engines |

## What works well

- **Access control is solid.** Guests are sent to login for account pages, premium downloads, license PDFs and invoices. Free users are sent to /pricing for premium downloads and get 404 for another user's license PDF. Another user's invoice redirects them back to their own profile.
- **Free-user download limit** is enforced per account (clearing cookies doesn't help), unlike the guest limit (#2).
- **Login and password reset** show generic messages, so they don't reveal whether an email has an account.
- Search reflects input safely (an HTML-injection probe didn't render), the empty-results state works, and pagination works.
- No console errors, failed requests, broken images or horizontal scrolling on any page tested other than `/contact`.
- Premium: unlimited downloads, license PDFs, "Download again", and the pricing page correctly hides "Get Premium".

## Minor observations (not filed)

- `?page=9999` on listings returns 200 with an empty grid. A 404 would be cleaner for SEO.
- `?page=abc` gives browsers the branded "Page not found" page but with status 400, and non-browser clients get raw Spring JSON.
- The 404 page header shows "Pricing" where every other page shows "Blog".
- The contact form's CSRF token is placed in the form `action` URL query string (`/contact?_csrf=…`), so it can end up in access logs.
- The download `Content-Disposition` sends an RFC 2047-encoded `filename=` alongside `filename*=`. Browsers use the latter, so this is harmless.

## Not tested (needs a safe environment)

- Billing actions on the premium account (pause, cancel, switch to yearly, change card): it's a real paid subscription.
- Checkout to Paddle, registration end-to-end, email verification, Google sign-in, contact form real submission, profile edits and password change.

These need a staging site or a Paddle sandbox and disposable accounts. See `docs/super-qa/queue.md` → "Not yet explored".

## Evidence

Screenshots in `docs/super-qa/report/evidence/` are cropped so they show no names, emails or payment details.
Run `npx playwright show-report` after a test run for full traces of any failure.
