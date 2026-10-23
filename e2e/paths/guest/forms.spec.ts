import { test, expect, acceptCookies } from '../../lib/fixture';
import { knownBug } from '../../lib/bugs';

// form-page recipe. Nothing here creates an account or sends a real message:
// register/contact POSTs are intercepted and aborted.

test('pricing: Monthly/Yearly toggle changes the price', async ({ page, forensics }) => {
  await page.goto('/pricing');
  await acceptCookies(page);
  const cta = page.locator('#getPremiumBtn');
  await expect(cta).toContainText('first year');
  await page.locator('button:has-text("Monthly")').click();
  await expect(cta).toContainText('/month');
  await page.locator('button:has-text("Yearly")').click();
  await expect(cta).toContainText('first year');
  forensics.expectClean();
});

test('pricing: guest "Get Premium" goes to registration, not payment', async ({ page }) => {
  await page.goto('/pricing');
  await acceptCookies(page);
  await page.locator('#getPremiumBtn').click();
  await expect(page).toHaveURL(/\/register\?plan=premium-yearly/);
});

test('login: wrong password shows a generic error', async ({ page }) => {
  await page.goto('/login');
  await acceptCookies(page);
  await page.locator('#email').fill('qa-nonexistent-user@example.com');
  await page.locator('#password').fill('wrong-password-123');
  await page.locator('form[action="/login"] button[type=submit]').click();
  await expect(page).toHaveURL(/\/login\?error/);
  await expect(page.getByText('Invalid email or password.')).toBeVisible();
});

test('login: empty form is blocked by validation', async ({ page }) => {
  await page.goto('/login');
  await page.locator('form[action="/login"] button[type=submit]').click();
  await expect(page).toHaveURL(/\/login$/);
  expect(await page.locator('#email').evaluate((e: HTMLInputElement) => e.validity.valueMissing)).toBe(true);
});

test('register: short password is rejected before submit', async ({ page }) => {
  let posted = false;
  await page.route('**/register**', (r) => (r.request().method() === 'POST' ? ((posted = true), r.abort()) : r.continue()));
  await page.goto('/register');
  await acceptCookies(page);
  await page.locator('#firstname').fill('QA');
  await page.locator('#lastname').fill('Test');
  await page.locator('#email').fill('qa-test@example.com');
  await page.locator('#password').fill('1');
  await page.locator('#terms').check();
  await page.locator('form:has(#password) button[type=submit]').click();
  expect(await page.locator('#password').evaluate((e: HTMLInputElement) => e.validity.tooShort)).toBe(true);
  expect(posted).toBe(false);
});

test('forgot password: does not reveal whether an account exists', async ({ page }) => {
  await page.goto('/forgot-password');
  await page.locator('form input[type=email]').fill('qa-nonexistent-user@example.com');
  await page.locator('form:has(input[type=email]) button[type=submit]').click();
  await expect(page.getByText('If an account with that email exists, a reset link has been sent.')).toBeVisible();
});

test('contact: page script runs without errors', async ({ page, forensics }) => {
  knownBug('contact|script-crash|topic-routing');
  await page.goto('/contact');
  await page.waitForLoadState('networkidle');
  forensics.expectClean();
  expect(forensics.pageErrors).toEqual([]);
});

test('contact: choosing "Refund" routes the message to refund@', async ({ page }) => {
  knownBug('contact|script-crash|topic-routing');
  await page.goto('/contact');
  await page.selectOption('#cTopic', 'Refund');
  await expect(page.locator('#toField')).toHaveValue('refund@typoanim.com');
});

test('contact: empty submit is blocked and nothing is sent', async ({ page }) => {
  let posted = false;
  await page.route('**/contact**', (r) => (r.request().method() === 'POST' ? ((posted = true), r.abort()) : r.continue()));
  await page.goto('/contact');
  await acceptCookies(page);
  await page.getByRole('button', { name: 'Submit' }).click();
  expect(await page.locator('#cEmail').evaluate((e: HTMLInputElement) => e.validity.valueMissing)).toBe(true);
  expect(posted).toBe(false);
});
