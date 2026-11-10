import { test, expect } from '../fixtures/landingPage';

test('UI-04-Home to Settings back Home', async ({ landingPage: page }) => {
  await page.getByRole('listitem').filter({ hasText: 'Settings' }).click();
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();

  await page.getByRole('listitem').filter({ hasText: 'Home' }).click();
  await expect(page.getByRole('heading', { name: 'Home', exact: true })).toBeVisible();
});
