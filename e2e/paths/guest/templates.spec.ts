import { test, expect, acceptCookies } from '../../lib/fixture';
import { FREE_TEMPLATE, PREMIUM_TEMPLATE } from '../../lib/data';

test('free template page: preview video plays and Read more toggles', async ({ page, forensics }) => {
  await page.goto(FREE_TEMPLATE.path);
  await acceptCookies(page);
  const video = page.locator('main video').first();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState), { timeout: 15_000 }).toBeGreaterThanOrEqual(2);
  expect(await video.evaluate((v: HTMLVideoElement) => v.error)).toBeNull();
  const more = page.locator('#tplReadMore');
  await expect(more).toHaveText(/Read more/);
  await more.click();
  await expect(more).toHaveText(/Show less/);
  forensics.expectClean();
});

test('free template page: Free Download button points to a download', async ({ page }) => {
  await page.goto(FREE_TEMPLATE.path);
  await expect(page.locator('a.tpl-btn-download')).toHaveAttribute('href', `/download/${FREE_TEMPLATE.downloadId}`);
  // Either '2 of 3 free downloads left' or 'You've used your 3 free downloads', depending on today's usage.
  await expect(page.getByText(/free downloads left|used your 3\s+free\s+downloads/).first()).toBeVisible();
});

test('guest "Add to collection" asks the visitor to sign in', async ({ page }) => {
  await page.goto(FREE_TEMPLATE.path);
  await acceptCookies(page);
  await page.getByText('+ Add to collection').first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Save templates to your collection');
});

test('premium template page: guest gets "Get with Premium", no download link', async ({ page }) => {
  await page.goto(PREMIUM_TEMPLATE.path);
  await expect(page.getByRole('link', { name: /Get with Premium/ })).toHaveAttribute('href', '/pricing');
  expect(await page.locator('a[href^="/download/"]').count()).toBe(0);
});

test('guest cannot download a premium template directly', async ({ request }) => {
  const res = await request.get(`/download/${PREMIUM_TEMPLATE.downloadId}`, { maxRedirects: 0 });
  expect(res.status()).toBe(302);
  expect(res.headers().location).toMatch(/\/login/);
});

test('guest cannot open license PDFs or invoices', async ({ request }) => {
  for (const path of ['/downloads/license/35', '/profile/billing']) {
    const res = await request.get(path, { maxRedirects: 0 });
    expect(res.status(), path).toBe(302);
    expect(res.headers().location, path).toMatch(/\/login/);
  }
});
