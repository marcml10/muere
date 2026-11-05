import { test, expect } from '@playwright/test';

const HISTORY_KEY = 'muer_playback_history';
const PLAYBACK_KEY = 'muer_playback_state';

const shelf = (page) => page.locator('section.recently-played-section');
const shelfCards = (page) =>
  shelf(page).locator('div.muer-media-card.muer-media-card-shelf');
const dockTitle = (page) => page.locator('span.dock-title');
const trendingItems = (page) =>
  page.locator('section.trending-section .trending-track-item');

// The shelf card's own title node; the card wrapper only carries "Play <title>".
const cardTitle = (card) => card.locator('div.muer-media-title');

// Raw titles contain runs of spaces that innerText collapses; compare normalized.
const normalize = (text) => text.replace(/\s+/g, ' ').trim();

async function clearPlaybackStorage(page) {
  await page.evaluate(
    ([historyKey, playbackKey]) => {
      localStorage.removeItem(historyKey);
      localStorage.removeItem(playbackKey);
    },
    [HISTORY_KEY, PLAYBACK_KEY],
  );
}

async function readStoredJson(page, key) {
  return page.evaluate(
    ([storageKey]) => {
      try {
        return JSON.parse(localStorage.getItem(storageKey) || 'null');
      } catch {
        return null;
      }
    },
    [key],
  );
}

/**
 * Plays the nth trending item and returns its raw track title.
 * The title is read back from playback history rather than the trending row,
 * because trending rows strip explicit markers ("[E]") that the shelf and dock keep.
 */
async function playTrendingItem(page, index) {
  const shelfCountBefore = await shelfCards(page).count();

  await trendingItems(page)
    .nth(index)
    .locator('.trending-track-info')
    .click();
  await expect(dockTitle(page)).not.toHaveText('Not Playing');
  await expect
    .poll(() => shelfCards(page).count(), { timeout: 10_000 })
    .toBeGreaterThan(shelfCountBefore);

  const history = await readStoredJson(page, HISTORY_KEY);
  return history[0].title;
}

/** Clicks a shelf card by its title text; the shelf re-sorts by recency after a click. */
async function clickShelfCardByTitle(page, title) {
  await shelfCards(page)
    .filter({ hasText: title })
    .first()
    .locator('div.muer-media-title')
    .click();
}

test.describe('Recently Played shelf <-> dock title', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearPlaybackStorage(page);
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Home', exact: true })).toBeVisible();
    await expect(trendingItems(page).first()).toBeVisible({ timeout: 15_000 });
  });

  test.afterEach(async ({ page }) => {
    await clearPlaybackStorage(page);
    expect(await readStoredJson(page, HISTORY_KEY)).toBeNull();
    expect(await readStoredJson(page, PLAYBACK_KEY)).toBeNull();
  });

  test('empty shelf shows the placeholder and the dock reads Not Playing', async ({
    page,
  }) => {
    await expect(shelfCards(page)).toHaveCount(0);
    await expect(
      shelf(page).getByText('No songs played yet. Play any track to see it here!'),
    ).toBeVisible();
    await expect(dockTitle(page)).toHaveText('Not Playing');
  });

  test('the track in the dock has a matching title on the shelf', async ({ page }) => {
    const played = await playTrendingItem(page, 0);

    await expect(shelfCards(page)).toHaveCount(1);
    await expect(cardTitle(shelfCards(page).first())).toHaveText(played);

    const dockText = normalize(await dockTitle(page).textContent());
    const shelfTitles = (await cardTitle(shelfCards(page)).allTextContents()).map(normalize);

    // Exactly one shelf card title may appear inside the dock title.
    expect(shelfTitles.filter((title) => dockText.includes(title))).toEqual([
      normalize(played),
    ]);
  });

  test('clicking each shelf card puts that card title in the dock', async ({ page }) => {
    await playTrendingItem(page, 0);
    await playTrendingItem(page, 1);
    await expect(shelfCards(page)).toHaveCount(2);

    const titles = await cardTitle(shelfCards(page)).allTextContents();

    for (const title of titles) {
      await clickShelfCardByTitle(page, title);
      await expect(dockTitle(page)).toContainText(title);

      const dockText = normalize(await dockTitle(page).textContent());
      expect(dockText).toContain(normalize(title));
    }
  });

  test('the shelf persists across reload and keeps the dock match', async ({ page }) => {
    const first = await playTrendingItem(page, 0);
    const second = await playTrendingItem(page, 1);

    const history = await readStoredJson(page, HISTORY_KEY);
    expect(history.map((entry) => entry.title)).toEqual([second, first]);

    const playback = await readStoredJson(page, PLAYBACK_KEY);
    expect(playback.currentTrack.title).toBe(second);
    expect(playback.isPlaying).toBe(true);

    await page.reload();
    await expect(trendingItems(page).first()).toBeVisible({ timeout: 15_000 });

    await expect(shelfCards(page)).toHaveCount(2);
    await expect(cardTitle(shelfCards(page).first())).toHaveText(second);
    await expect(dockTitle(page)).toContainText(second);
  });
});
