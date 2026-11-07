import { test, expect } from '../fixtures/landingPage';

test('UI-03-Home to Playlists back Home', async ({ landingPage: page }) => {
  await page.getByRole('listitem').filter({ hasText: 'Playlists' }).click();
  await expect(page.getByRole('heading', { name: 'Playlists' })).toBeVisible();

  await page.getByRole('listitem').filter({ hasText: 'Home' }).click();
  await expect(page.getByRole('heading', { name: 'Home', exact: true })).toBeVisible();
});
