import { test, expect } from '../fixtures/landingPage';

test('DOCK-02-Repeat toggles its active color on and off', async ({ landingPage: page }) => {
  const repeatButton = page.getByRole('button', { name: 'Toggle repeat' });

  await expect(repeatButton).toHaveCSS('color', 'rgba(255, 255, 255, 0.7)');
  await repeatButton.click();
  await expect(repeatButton).toHaveCSS('color', 'rgb(250, 36, 60)');
  await repeatButton.click();
  await expect(repeatButton).toHaveCSS('color', 'rgba(255, 255, 255, 0.7)');
});
