import { test, expect } from '@playwright/test';

test('Muer loads the Home view', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await expect(page.getByText('Home', { exact: true })).toBeVisible();
});