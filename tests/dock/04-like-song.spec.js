import { test, expect } from '../fixtures/landingPage';

test('Dock like song appears in Liked', async ({ landingPage: page }) => {
  const firstTrendingTrack = page.locator('.trending-track-item').first();
  await expect(firstTrendingTrack).toBeVisible({ timeout: 20000 });
  await firstTrendingTrack.click();

  const footer = page.locator('footer.player-bar');
  const dockTitle = footer.locator('span.dock-title');
  await expect(dockTitle).not.toHaveText('Not Playing');
  const title = (await dockTitle.innerText()).replace(/\s*E\s*$/, '').trim();

  const likeButton = page.locator('footer.player-bar .dock-actions button[title="Like"], footer.player-bar .dock-actions button[title="Unlike"]');
  if ((await likeButton.getAttribute('title')) === 'Unlike') {
    await likeButton.click();
  }
  await likeButton.click();
  await expect(likeButton).toHaveCSS('color', 'rgb(255, 45, 85)');

  await page.getByRole('listitem').filter({ hasText: 'Liked' }).click();
  await expect(page.getByText(title)).toBeVisible();
});
