import { test, expect } from '@playwright/test';

test('opens Search from the navbar', async ({ page }) => {
  await page.goto('http://localhost:5173');
  const navigation = page.locator('nav');

  await navigation.getByText('Search', { exact: true }).click();

  await expect(page.getByPlaceholder('Search')).toBeVisible();
  await expect(navigation.locator('li').filter({ hasText: 'Search' })).toHaveClass(/active/);
});
