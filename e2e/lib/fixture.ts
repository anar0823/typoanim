import { test as base, expect, type Page } from '@playwright/test';

/**
 * Forensics fixture. Every test gets `forensics`, which records console errors,
 * uncaught page errors and 5xx responses while the test runs. `expectClean()`
 * enforces the Super QA "green" rule: no console errors, no page errors, no 5xx.
 */
export type Forensics = {
  consoleErrors: string[];
  pageErrors: string[];
  serverErrors: string[];
  expectClean: (opts?: { allowConsole?: RegExp }) => void;
};

export const test = base.extend<{ forensics: Forensics }>({
  forensics: async ({ page }, use, testInfo) => {
    const f: Forensics = {
      consoleErrors: [],
      pageErrors: [],
      serverErrors: [],
      expectClean: (opts) => {
        const consoleErrors = f.consoleErrors.filter((e) => !opts?.allowConsole?.test(e));
        expect.soft(f.pageErrors, 'uncaught page errors').toEqual([]);
        expect.soft(consoleErrors, 'console errors').toEqual([]);
        expect.soft(f.serverErrors, '5xx responses').toEqual([]);
      },
    };
    page.on('console', (m) => { if (m.type() === 'error') f.consoleErrors.push(m.text()); });
    page.on('pageerror', (e) => f.pageErrors.push(e.message));
    page.on('response', (r) => { if (r.status() >= 500) f.serverErrors.push(`${r.status()} ${r.url()}`); });
    await use(f);
    const log = { consoleErrors: f.consoleErrors, pageErrors: f.pageErrors, serverErrors: f.serverErrors };
    if (Object.values(log).some((a) => a.length)) {
      await testInfo.attach('forensics.json', { body: JSON.stringify(log, null, 2), contentType: 'application/json' });
    }
  },
});

export { expect };

/** Dismiss the cookie banner so it never covers what a test clicks. */
export async function acceptCookies(page: Page) {
  const accept = page.getByRole('button', { name: 'Accept', exact: true });
  if (await accept.isVisible().catch(() => false)) await accept.click();
}

/** Non-blank guard: the page rendered real content, not an empty shell. */
export async function expectNonBlank(page: Page) {
  await expect(page.locator('h1').first()).toBeVisible();
  const text = await page.locator('body').innerText();
  expect(text.trim().length, 'page body text length').toBeGreaterThan(200);
}

/** No horizontal scrolling at the current viewport. */
export async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, 'horizontal overflow in px').toBeLessThanOrEqual(2);
}
