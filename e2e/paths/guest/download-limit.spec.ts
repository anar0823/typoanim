import { test, expect, request as pwRequest } from '@playwright/test';
import { knownBug } from '../../lib/bugs';
import { FREE_DOWNLOAD_IDS } from '../../lib/data';

// @quota: these tests really download files and use up the guest quota for this IP.
// They are skipped unless QA_QUOTA=1 (npm run test:quota).

test.describe('@quota guest download limit', () => {
  test.skip(!process.env.QA_QUOTA, 'set QA_QUOTA=1 to run quota tests');

  test('the 4th distinct free download in one browser session is blocked', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({ baseURL });
    const statuses: number[] = [];
    for (const id of FREE_DOWNLOAD_IDS.slice(0, 4)) {
      statuses.push((await ctx.get(`/download/${id}`, { maxRedirects: 0 })).status());
    }
    expect(statuses.slice(0, 3).every((s) => s === 200 || s === 302)).toBe(true);
    expect(statuses[3]).toBe(302);
    await ctx.dispose();
  });

  test('clearing cookies does not give a guest a fresh quota', async ({ baseURL }) => {
    knownBug('downloads|guest-limit|cookie-reset');
    // Session A uses up the quota.
    const a = await pwRequest.newContext({ baseURL });
    for (const id of FREE_DOWNLOAD_IDS.slice(0, 4)) await a.get(`/download/${id}`, { maxRedirects: 0 });
    await a.dispose();
    // Session B: same IP, no cookies. Should still be limited.
    const b = await pwRequest.newContext({ baseURL });
    const res = await b.get(`/download/${FREE_DOWNLOAD_IDS[0]}`, { maxRedirects: 0 });
    expect(res.status(), 'fresh cookie jar should still be over the limit').toBe(302);
    expect(res.headers().location).toMatch(/download-limit/);
    await b.dispose();
  });
});
