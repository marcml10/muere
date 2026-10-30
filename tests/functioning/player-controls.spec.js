import { test, expect } from '@playwright/test';

test('shuffle and repeat controls toggle and remain mutually exclusive', async ({ page }) => {
  await page.route('http://localhost:3000/api/trending', (route) =>
    route.fulfill({ json: { tracks: [], lastUpdated: Date.now() } })
  );
  await page.goto('http://localhost:5173');

  const shuffle = page.getByRole('button', { name: 'Toggle shuffle' });
  const repeat = page.getByRole('button', { name: 'Toggle repeat' });

  await shuffle.click();
  await expect(shuffle).toHaveCSS('color', 'rgb(250, 36, 60)');
  await repeat.click();
  await expect(repeat).toHaveCSS('color', 'rgb(250, 36, 60)');
  await expect(shuffle).not.toHaveCSS('color', 'rgb(250, 36, 60)');
});

test('volume control opens and mute toggles volume', async ({ page }) => {
  await page.route('http://localhost:3000/api/trending', (route) =>
    route.fulfill({ json: { tracks: [], lastUpdated: Date.now() } })
  );
  await page.goto('http://localhost:5173');

  const volumeControl = page.locator('.dock-actions > div');
  await volumeControl.locator(':scope > button').click();

  const slider = volumeControl.locator('input[type="range"]');
  await expect(slider).toBeVisible();
  await volumeControl.locator('.dock-btn').first().click();
  await expect(slider).toHaveValue('0');
  await volumeControl.locator('.dock-btn').first().click();
  await expect(slider).toHaveValue('100');
});
