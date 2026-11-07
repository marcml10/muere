import { test, expect } from '../fixtures/landingPage';

test('DOCK-03-Shuffle toggles its active color on and off', async ({ landingPage: page }) => {
  const shuffleButton = page.getByRole('button', { name: 'Toggle shuffle' });

  await expect(shuffleButton).toHaveCSS('color', 'rgba(255, 255, 255, 0.7)');
  await shuffleButton.click();
  await expect(shuffleButton).toHaveCSS('color', 'rgb(250, 36, 60)');
  await shuffleButton.click();
  await expect(shuffleButton).toHaveCSS('color', 'rgba(255, 255, 255, 0.7)');
});
