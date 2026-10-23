import { test, expect } from '../../lib/fixture';
import { knownBug } from '../../lib/bugs';

// Uses a fresh, logged-out context so it can exercise sign-in and sign-out.
test.use({ storageState: { cookies: [], origins: [] } });

async function signIn(page: import('@playwright/test').Page) {
  await page.locator('#email').fill(process.env.QA_FREE_EMAIL!);
  await page.locator('#password').fill(process.env.QA_FREE_PASSWORD!);
  await page.locator('form[action="/login"] button[type=submit]').click();
  await page.waitForLoadState('networkidle');
}

test('sign out ends the session', async ({ page }) => {
  await page.goto('/login');
  await signIn(page);
  await page.goto('/logout');
  await expect(page).toHaveURL(/\/login/);
  await page.goto('/profile');
  await expect(page).toHaveURL(/\/login/);
});

test('signing in from a protected page returns you to it', async ({ page }) => {
  knownBug('login|return-url|lost');
  await page.goto('/downloads');
  await expect(page).toHaveURL(/\/login/);
  await signIn(page);
  await expect(page).toHaveURL(/\/downloads/);
});
