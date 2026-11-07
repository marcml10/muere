import { test, expect } from '../fixtures/landingPage';

test('UI-02-Home to Search back Home', async ({ landingPage: page }) => {
  await page.getByRole('listitem').filter({ hasText: 'Search' }).click();
  await expect(page.getByRole('heading', { name: 'Browse Categories' })).toBeVisible();

  await page.getByRole('listitem').filter({ hasText: 'Home' }).click();
  await expect(page.getByRole('heading', { name: 'Home', exact: true })).toBeVisible();
});
