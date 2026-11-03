import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.removeItem('muer_playlist_folders'));
  await page.goto('http://localhost:5173');
  await page.locator('nav').getByText('Playlists', { exact: true }).click();
});

test('creates and deletes a playlist folder', async ({ page }) => {
  await page.getByRole('button', { name: 'New Folder' }).click();
  await page.getByLabel('Folder name').fill('Test Collection');
  await page.getByRole('button', { name: 'Create' }).click();

  await expect(page.getByText('Test Collection', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Delete Test Collection', exact: true }).click();
  await expect(page.getByText('Test Collection', { exact: true })).toHaveCount(0);
});

test('cancel closes the new-folder form without creating a folder', async ({ page }) => {
  await page.getByRole('button', { name: 'New Folder' }).click();
  await page.getByLabel('Folder name').fill('Discarded Collection');
  await page.getByRole('button', { name: 'Cancel' }).click();

  await expect(page.getByLabel('Folder name')).toHaveCount(0);
  await expect(page.getByText('Discarded Collection', { exact: true })).toHaveCount(0);
});
