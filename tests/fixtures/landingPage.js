import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  landingPage: async ({ page }, use) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Home', exact: true })).toBeVisible();
    await use(page);
  },
});

export { expect };
