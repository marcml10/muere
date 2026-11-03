import { test, expect } from '@playwright/test';

test('opens Playlists from the navbar', async ({ page }) => {
  await page.goto('http://localhost:5173');
  const navigation = page.locator('nav');

  await navigation.getByText('Playlists', { exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Playlists' })).toBeVisible();
  await expect(navigation.locator('li').filter({ hasText: 'Playlists' })).toHaveClass(/active/);
});
