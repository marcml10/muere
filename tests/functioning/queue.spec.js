import { test, expect } from '@playwright/test';

test('queue button opens the Up Next panel', async ({ page }) => {
  await page.route('http://localhost:3000/api/trending', (route) =>
    route.fulfill({ json: { tracks: [], lastUpdated: Date.now() } })
  );
  await page.goto('http://localhost:5173');

  await page.locator('.dock-actions > button').nth(1).click();

  await expect(page.getByRole('heading', { name: 'Up Next' })).toBeVisible();
  await expect(page.locator('.queue-panel').getByRole('button', { name: 'Clear' })).toBeVisible();
});
