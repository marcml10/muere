import { test, expect } from '@playwright/test';

test('opens Liked Songs from the navbar', async ({ page }) => {
  await page.goto('http://localhost:5173');
  const navigation = page.locator('nav');

  await navigation.getByText('Liked', { exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Liked Songs' }).first()).toBeVisible();
  await expect(navigation.locator('li').filter({ hasText: 'Liked' })).toHaveClass(/active/);
});
