import { test, expect } from '../fixtures/landingPage';

test('UI-01-Home to liked back home', async ({ landingPage: page }) => {
  await page.getByRole('listitem').filter({ hasText: 'Liked' }).click();
  await expect(page.getByRole('heading', { name: 'Liked Songs', level: 1 })).toBeVisible();

  await page.getByRole('listitem').filter({ hasText: 'Home' }).click();
  await expect(page.getByRole('heading', { name: 'Home', exact: true })).toBeVisible();
});
