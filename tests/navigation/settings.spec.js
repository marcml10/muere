import { test, expect } from '@playwright/test';

test('opens Settings from the navbar', async ({ page }) => {
  await page.goto('http://localhost:5173');
  const navigation = page.locator('nav');

  await navigation.getByText('Settings', { exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  await expect(navigation.locator('li').filter({ hasText: 'Settings' })).toHaveClass(/active/);
});
