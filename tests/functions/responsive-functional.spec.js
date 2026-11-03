import { test, expect } from '@playwright/test';

const navigationItems = [
  ['Search', 'Browse Categories'],
  ['Home', 'Home'],
  ['Liked', 'Liked Songs'],
  ['Playlists', 'Playlists'],
  ['Settings', 'Settings'],
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload();
});

test('navigates through every primary view', async ({ page }) => {
  for (const [item, heading] of navigationItems) {
    await page.getByText(item, { exact: true }).click();
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('heading', { name: heading, exact: true }).first()).toBeVisible();
  }
});

test('creates, opens, and deletes a playlist folder', async ({ page }) => {
  await page.getByText('Playlists', { exact: true }).click();
  await page.getByRole('button', { name: 'New Folder' }).click();

  const folderName = `Functional test ${Date.now()}`;
  await page.getByRole('textbox', { name: 'Folder name' }).fill(folderName);
  await page.getByRole('button', { name: 'Create', exact: true }).click();

  const folder = page.locator('[role="button"]').filter({ hasText: folderName }).first();
  await expect(folder).toBeVisible();
  await expect(folder).toContainText('0 songs');

  await folder.click();
  await expect(page.getByRole('region', { name: `${folderName} songs` })).toBeVisible();
  await expect(page.getByRole('heading', { name: folderName, exact: true })).toBeVisible();

  await page.getByRole('button', { name: `Delete ${folderName}`, exact: true }).first().click();
  await expect(folder).toHaveCount(0);
});

test('opens the queue panel from the player controls', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 700, 'The compact player actions are not exposed in the mobile layout');
  await page.getByRole('button', { name: 'Open queue' }).click();
  await expect(page.getByRole('heading', { name: 'Up Next' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Clear', exact: true })).toBeVisible();
});

test('keeps the main layout within the viewport on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Home', exact: true })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);

  await page.getByText('Playlists', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Playlists', exact: true })).toBeVisible();
  const playlistOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(playlistOverflow).toBe(false);
});

test('renders primary content without horizontal overflow on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Home', exact: true })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});
