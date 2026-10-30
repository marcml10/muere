import { test, expect } from '@playwright/test';

test('navigates back to Home from another navbar option', async ({ page }) => {
  await page.goto('http://localhost:5173');
  const navigation = page.locator('nav');

  await navigation.getByText('Settings', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();

  await navigation.getByText('Home', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
  await expect(navigation.locator('li').filter({ hasText: 'Home' })).toHaveClass(/active/);
});
