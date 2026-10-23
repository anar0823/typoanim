import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';

// Local credentials live in .env.local (git-ignored). In CI, set the same names as secrets.
if (fs.existsSync('.env.local')) {
  for (const line of fs.readFileSync('.env.local', 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

export const BASE_URL = process.env.BASE_URL ?? 'https://www.typoanim.com';

export default defineConfig({
  testDir: './e2e',
  // Production site: keep load gentle.
  workers: 3,
  fullyParallel: true,
  retries: 1, // a test that only passes on retry is reported as "flaky", not green
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never' }], ['json', { outputFile: 'test-results/results.json' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    ...devices['Desktop Chrome'],
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    { name: 'guest', testDir: './e2e/paths/guest' },
    { name: 'free', testDir: './e2e/paths/free', dependencies: ['setup'], use: { storageState: '.auth/free.json' } },
    { name: 'premium', testDir: './e2e/paths/premium', dependencies: ['setup'], use: { storageState: '.auth/premium.json' } },
  ],
});
