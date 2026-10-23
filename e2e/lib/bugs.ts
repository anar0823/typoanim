import { test } from '@playwright/test';

/**
 * Known open bugs, keyed by fingerprint → GitHub issue number.
 * A spec that reproduces an open bug calls `knownBug(key)`: Playwright then expects it to FAIL.
 * When the bug is fixed the spec "unexpectedly passes" and goes red — remove the knownBug() line
 * and close the issue.
 */
export const BUGS = {
  'contact|script-crash|topic-routing': 1,
  'downloads|guest-limit|cookie-reset': 2,
  'profile|free-quota|counter-mismatch': 3,
  'header|premium-user|upgrade-cta': 4,
  'login|return-url|lost': 5,
  'seo|forgot-password|duplicate-meta': 6,
} as const;

export function knownBug(key: keyof typeof BUGS) {
  const n = BUGS[key];
  test.info().annotations.push({ type: 'issue', description: `https://github.com/anar0823/typoanim/issues/${n}` });
  test.fail(true, `Known bug #${n} (${key})`);
}
