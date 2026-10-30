import { test, expect } from '@playwright/test';

test('search submits a query and displays the returned song', async ({ page }) => {
  await page.route('http://localhost:3000/api/trending', (route) =>
    route.fulfill({ json: { tracks: [], lastUpdated: Date.now() } })
  );
  await page.route('http://localhost:3000/api/search?*', (route) =>
    route.fulfill({
      json: {
        tracks: [{
          id: 'demo-track',
          title: 'Demo Song',
          artist: 'Demo Artist',
          thumbnailUrl: 'https://example.com/demo.jpg',
          viewCount: 1000,
          duration: 180,
        }],
        channel: null,
      },
    })
  );

  await page.goto('http://localhost:5173');
  await page.locator('nav').getByText('Search', { exact: true }).click();
  await page.getByPlaceholder('Search').fill('Demo');
  await page.getByPlaceholder('Search').press('Enter');

  await expect(page.getByRole('heading', { name: 'Demo Song' })).toBeVisible();
});
