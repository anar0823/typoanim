import { test, expect, expectNonBlank, expectNoHorizontalOverflow } from '../../lib/fixture';
import { knownBug } from '../../lib/bugs';
import { STATIC_PAGES, LISTING_PAGES, TEMPLATE_SAMPLES } from '../../lib/data';

// public-page / list-page / detail-page recipes: loads, non-blank, no errors, fits on mobile.

for (const path of [...STATIC_PAGES, ...LISTING_PAGES, ...TEMPLATE_SAMPLES]) {
  test(`loads cleanly: ${path}`, async ({ page, forensics }) => {
    test.skip(path === '/contact', 'covered by contact.spec.ts (known bug #1)');
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await page.waitForLoadState('networkidle').catch(() => {});
    await expectNonBlank(page);
    expect((await page.title()).trim()).not.toBe('');
    const metas = page.locator('meta[name=description]');
    if (path === '/forgot-password') knownBug('seo|forgot-password|duplicate-meta');
    await expect(metas, 'exactly one meta description').toHaveCount(1);
    expect(await metas.first().getAttribute('content')).toBeTruthy();
    forensics.expectClean();
  });
}

test.describe('mobile 375px', () => {
  test.use({ viewport: { width: 375, height: 667 } });
  for (const path of ['/', '/pricing', '/free-templates', '/premium-templates/titles', TEMPLATE_SAMPLES[3], '/login', '/register', '/faq']) {
    test(`no horizontal scroll: ${path}`, async ({ page }) => {
      await page.goto(path);
      await expectNonBlank(page);
      await expectNoHorizontalOverflow(page);
    });
  }
});

test('unknown URL shows branded 404', async ({ page }) => {
  const res = await page.goto('/this-page-does-not-exist-qa');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

test('unknown template slug returns 404', async ({ page }) => {
  const res = await page.goto('/premium-templates/after-effects/titles/does-not-exist-qa');
  expect(res?.status()).toBe(404);
});

test('account pages redirect guests to login', async ({ page }) => {
  for (const path of ['/profile', '/downloads', '/collection']) {
    await page.goto(path);
    await expect(page, path).toHaveURL(/\/login/);
  }
});
