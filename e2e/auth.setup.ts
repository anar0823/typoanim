import { test as setup, expect } from '@playwright/test';

// Logs in once per role and saves the session to .auth/<role>.json (git-ignored).
const roles = [
  { name: 'free', email: 'QA_FREE_EMAIL', password: 'QA_FREE_PASSWORD' },
  { name: 'premium', email: 'QA_PREMIUM_EMAIL', password: 'QA_PREMIUM_PASSWORD' },
];

for (const role of roles) {
  setup(`log in as ${role.name} user`, async ({ page }) => {
    const email = process.env[role.email];
    const password = process.env[role.password];
    setup.skip(!email || !password, `${role.email}/${role.password} not set`);

    await page.goto('/login');
    await page.locator('#email').fill(email!);
    await page.locator('#password').fill(password!);
    await page.locator('form[action="/login"] button[type=submit]').click();
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('a[href="/profile"]').first()).toBeAttached();
    await page.context().storageState({ path: `.auth/${role.name}.json` });
  });
}
