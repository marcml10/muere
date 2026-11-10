import { test, expect } from '../fixtures/landingPage';

test('DOCK-01-Queue toggles the Up Next panel and active color', async ({ landingPage: page }) => {
  const queueButton = page.getByRole('button', { name: 'Open queue' });

  await expect(queueButton).toHaveCSS('color', 'rgba(255, 255, 255, 0.7)');
  await queueButton.click();
  await expect(queueButton).toHaveCSS('color', 'rgb(250, 36, 60)');
  await expect(page.getByRole('heading', { name: 'Up Next' })).toBeVisible();

  await queueButton.click();
  await expect(queueButton).toHaveCSS('color', 'rgba(255, 255, 255, 0.7)');
  await expect(page.getByRole('heading', { name: 'Up Next' })).toHaveCount(0);
});
