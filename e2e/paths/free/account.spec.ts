import { test, expect, acceptCookies, expectNonBlank } from '../../lib/fixture';
import { ACCOUNT_PAGES, FREE_TEMPLATE, PREMIUM_TEMPLATE, FREE_DOWNLOAD_IDS } from '../../lib/data';

// Free (non-premium) user. Read-only except the collection round-trip, which removes what it adds.

for (const path of ACCOUNT_PAGES) {
  test(`account page loads cleanly: ${path}`, async ({ page, forensics }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expectNonBlank(page);
    await expect(page.getByText('FREE PLAN')).toBeVisible();
    forensics.expectClean();
  });
}

test('header shows account menu and Upgrade for a free user', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Login' })).toHaveCount(0);
  await expect(page.locator('a[href="/profile"]').first()).toBeAttached();
  await expect(page.getByRole('link', { name: 'Upgrade' }).first()).toBeVisible();
});

test('premium template: free user gets "Get with Premium", not a download', async ({ page }) => {
  await page.goto(PREMIUM_TEMPLATE.path);
  await expect(page.getByRole('link', { name: /Get with Premium/ })).toHaveAttribute('href', '/pricing');
  expect(await page.locator('a[href^="/download/"]').count()).toBe(0);
});

test('free user cannot download a premium template by URL', async ({ page }) => {
  const res = await page.request.get(`/download/${PREMIUM_TEMPLATE.downloadId}`, { maxRedirects: 0 });
  expect(res.status()).toBe(302);
  expect(res.headers().location).toMatch(/\/pricing/);
});

test("free user cannot open another user's license PDF", async ({ page }) => {
  const res = await page.request.get('/downloads/license/35', { maxRedirects: 0 });
  expect([403, 404]).toContain(res.status());
});

test("free user cannot open another user's invoice", async ({ page }) => {
  const res = await page.request.get('/profile/invoice/txn_01m57jwjh5c3x95ae39amfz7fs', { maxRedirects: 0 });
  expect(res.headers()['content-type'] ?? '').not.toContain('pdf');
  expect(res.headers().location ?? '').not.toMatch(/paddle|amazonaws/);
});

test('add to collection, see it in My Collection, then remove it', async ({ page, forensics }) => {
  await page.goto(FREE_TEMPLATE.path);
  await acceptCookies(page);
  const added = page.waitForResponse((r) => r.url().includes(`/templates/collection/add/${FREE_TEMPLATE.downloadId}`) && r.request().method() === 'POST');
  await page.locator('a.js-add-collection').first().click();
  await added;
  await page.goto('/collection');
  await expect(page.getByText('Cinematic Free Animated Titles').first()).toBeVisible();
  await page.getByRole('button', { name: 'Remove from collection' }).first().click();
  await page.waitForLoadState('networkidle');
  await expect(page.getByText('Your collection is empty')).toBeVisible();
  forensics.expectClean();
});

// Issue #3: the two counters disagreed while quota was partly used (state-dependent, so not
// marked knownBug). This stays as a consistency check.
test('free-download counter is the same on profile and template page', async ({ page }) => {
  await page.goto(FREE_TEMPLATE.path);
  const text = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
  const line = text.match(/\d+ of 3 free downloads left|used your 3 free downloads/)?.[0] ?? '';
  const tpl = /used your 3/.test(line) ? '0' : line.match(/(\d+) of 3/)?.[1];
  await page.goto('/profile');
  const prof = (await page.locator('body').innerText()).match(/(\d+)\/3\s*\n?\s*Free downloads left/)?.[1];
  expect(prof, 'profile counter').toBeDefined();
  expect(prof, `profile says ${prof}/3, template page says "${line}"`).toBe(tpl);
});

test('@quota free download appears in My Downloads with a license PDF', async ({ page }) => {
  test.skip(!process.env.QA_QUOTA, 'set QA_QUOTA=1 to run quota tests');
  const res = await page.request.get(`/download/${FREE_DOWNLOAD_IDS[3]}`, { maxRedirects: 0 });
  test.skip(res.status() === 302, 'daily quota already used');
  expect(res.headers()['content-disposition']).toContain('attachment');
  await page.goto('/downloads');
  const lic = page.locator('a[href^="/downloads/license/"]').first();
  const pdf = await page.request.get((await lic.getAttribute('href'))!);
  expect(pdf.headers()['content-type']).toContain('application/pdf');
});
