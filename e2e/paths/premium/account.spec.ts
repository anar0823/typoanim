import { test, expect, expectNonBlank } from '../../lib/fixture';
import { knownBug } from '../../lib/bugs';
import { ACCOUNT_PAGES, FREE_TEMPLATE, PREMIUM_TEMPLATE } from '../../lib/data';

// Premium user — this account has a LIVE paid subscription.
// READ-ONLY: never submit pause / cancel / switch-yearly / change-card / billing forms.
test.beforeEach(async ({ page }) => {
  await page.route(/\/profile\/.+/, (r) => (r.request().method() === 'POST' ? r.abort() : r.continue()));
});

for (const path of ACCOUNT_PAGES) {
  test(`account page loads cleanly: ${path}`, async ({ page, forensics }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expectNonBlank(page);
    await expect(page.getByText(/^\s*premium\s*$/i).first()).toBeVisible();
    forensics.expectClean();
  });
}

test('profile shows Premium plan with unlimited downloads', async ({ page }) => {
  await page.goto('/profile');
  await expect(page.getByText('Unlimited downloads').first()).toBeVisible();
  await expect(page.getByText(/You're on Premium/)).toBeVisible();
});

test('premium template shows a Download button', async ({ page }) => {
  await page.goto(PREMIUM_TEMPLATE.path);
  await expect(page.locator(`a[href="/download/${PREMIUM_TEMPLATE.downloadId}"]`)).toBeVisible();
  await expect(page.getByRole('link', { name: /Get with Premium/ })).toHaveCount(0);
});

test('premium template downloads as a zip', async ({ page }) => {
  // Re-downloading a template already in history does not add a new history entry.
  const res = await page.request.get(`/download/${PREMIUM_TEMPLATE.downloadId}`, { maxRedirects: 0 });
  expect(res.status()).toBe(200);
  expect(res.headers()['content-disposition']).toContain('.zip');
});

test('free template shows "Premium member · Unlimited downloads"', async ({ page }) => {
  await page.goto(FREE_TEMPLATE.path);
  await expect(page.getByText(/Premium member · Unlimited downloads/)).toBeVisible();
});

test('My Downloads lists downloads with working license PDFs', async ({ page }) => {
  await page.goto('/downloads');
  const lic = page.locator('a[href^="/downloads/license/"]');
  expect(await lic.count()).toBeGreaterThan(0);
  const pdf = await page.request.get((await lic.first().getAttribute('href'))!);
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()['content-type']).toContain('application/pdf');
});

test('pricing page does not offer Premium again', async ({ page }) => {
  await page.goto('/pricing');
  await expect(page.locator('#getPremiumBtn')).toHaveCount(0);
});

test('header does not show "Upgrade" to a premium user', async ({ page }) => {
  knownBug('header|premium-user|upgrade-cta');
  await page.goto('/');
  await expect(page.locator('header, nav').getByRole('link', { name: 'Upgrade' })).toHaveCount(0);
});
