import { test, expect, acceptCookies } from '../../lib/fixture';

test('cookie banner: shown on first visit, gone after Accept', async ({ page }) => {
  await page.goto('/');
  const accept = page.getByRole('button', { name: 'Accept', exact: true });
  await expect(accept).toBeVisible();
  await accept.click();
  await page.reload();
  await expect(accept).toBeHidden();
  const cookies = (await page.context().cookies()).map((c) => c.name);
  expect(cookies).toContain('ta_consent');
});

test('header search finds templates', async ({ page, forensics }) => {
  await page.goto('/');
  await acceptCookies(page);
  const box = page.locator('input[name=q]').first();
  await box.fill('logo');
  await box.press('Enter');
  await expect(page).toHaveURL(/\/templates\/search\?q=logo/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('logo');
  expect(await page.locator('[data-slug]').count()).toBeGreaterThan(0);
  forensics.expectClean();
});

test('search with no results shows an empty state', async ({ page }) => {
  await page.goto('/templates/search?q=zzqxnotfound');
  await expect(page.getByText('No templates found')).toBeVisible();
  expect(await page.locator('[data-slug]').count()).toBe(0);
});

test('search does not render injected HTML', async ({ page }) => {
  let dialog = false;
  page.on('dialog', (d) => { dialog = true; void d.dismiss(); });
  await page.goto('/templates/search?q=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E');
  await page.waitForLoadState('networkidle');
  expect(dialog).toBe(false);
  expect(await page.locator('img[src="x"]').count()).toBe(0);
});

test('listing pagination: page 2 shows different templates', async ({ page }) => {
  await page.goto('/premium-templates/titles');
  const first = await page.locator('[data-slug]').first().getAttribute('data-slug');
  await page.getByRole('link', { name: 'Next page' }).click();
  await expect(page).toHaveURL(/page=1/);
  const second = await page.locator('[data-slug]').first().getAttribute('data-slug');
  expect(second).not.toBe(first);
  expect(await page.locator('[data-slug]').count()).toBe(30);
});

test('malformed page number shows the branded error page', async ({ page }) => {
  const res = await page.goto('/premium-templates/titles?page=abc');
  expect(res?.status()).toBeLessThan(500);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

test('FAQ accordion expands', async ({ page }) => {
  await page.goto('/faq');
  await acceptCookies(page);
  const q = page.locator('main button[aria-expanded]').first();
  await expect(q).toHaveAttribute('aria-expanded', 'false');
  await q.click();
  await expect(q).toHaveAttribute('aria-expanded', 'true');
});

test.describe('mobile menu', () => {
  test.use({ viewport: { width: 375, height: 667 } });
  test('hamburger opens nav with Login', async ({ page }) => {
    await page.goto('/');
    await acceptCookies(page);
    await page.locator('.navbar-toggler').first().click();
    await expect(page.getByRole('link', { name: 'Login' }).first()).toBeVisible();
  });
});
