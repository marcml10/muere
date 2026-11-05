import { test, expect } from '@playwright/test';

test('Muer loads the Home view', async ({ page }) => {
  await page.goto('/');

  // "Home" also appears in the sidebar nav, so assert on the heading.
  await expect(page.getByRole('heading', { name: 'Home', exact: true })).toBeVisible();
});