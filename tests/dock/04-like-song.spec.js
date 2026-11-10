import { test, expect } from '../fixtures/landingPage';

test('Dock like song appears in Liked', async ({ landingPage: page }) => {
  const footer = page.locator('footer.player-bar');
  const title = await footer.locator('span.dock-title').innerText();

  const likeButton = page.locator('button[title="Like"]');
  await likeButton.click();
  await expect(likeButton).toHaveCSS('color', 'rgb(255, 45, 85)');

  await page.getByRole('listitem').filter({ hasText: 'Liked' }).click();
  await expect(page.getByText(title)).toBeVisible();
});
