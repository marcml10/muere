const STORAGE_KEY = 'muer_playback_history';
const MAX_HISTORY_ITEMS = 50;

/**
 * Reads playback history from browser localStorage.
 * @returns {Array} Array of historical track objects
 */
export const getStoredHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('[historyStorage] Failed to read history from localStorage:', err);
    return [];
  }
};

/**
 * Persists history array into browser localStorage.
 * @param {Array} history - Array of track objects
 */
export const saveHistory = (history) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (err) {
    console.error('[historyStorage] Failed to write history to localStorage:', err);
  }
};

/**
 * Adds or moves a track to the top of the history list and saves to localStorage.
 * @param {Object} track - Track object from playback
 * @returns {Array} Updated history array
 */
export const addTrackToHistory = (track) => {
  if (!track || !track.id) return getStoredHistory();

  try {
    const current = getStoredHistory();
    // Deduplicate: remove existing instance so it can be moved to the front
    const filtered = current.filter(item => item.id !== track.id);

    const trackEntry = {
      ...track,
      playedAt: new Date().toISOString()
    };

    const updated = [trackEntry, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    saveHistory(updated);
    return updated;
  } catch (err) {
    console.error('[historyStorage] Failed to add track to history:', err);
    return getStoredHistory();
  }
};

/**
 * Removes a specific track from localStorage history.
 * @param {string|number} trackId - ID of track to remove
 * @returns {Array} Updated history array
 */
export const removeTrackFromHistory = (trackId) => {
  try {
    const current = getStoredHistory();
    const updated = current.filter(item => item.id !== trackId);
    saveHistory(updated);
    return updated;
  } catch (err) {
    console.error('[historyStorage] Failed to remove track from history:', err);
    return getStoredHistory();
  }
};

/**
 * Clears all history from localStorage.
 * @returns {Array} Empty array
 */
export const clearStoredHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (err) {
    console.error('[historyStorage] Failed to clear history from localStorage:', err);
    return [];
  }
};

export const historyStorage = {
  get: getStoredHistory,
  save: saveHistory,
  addTrack: addTrackToHistory,
  removeTrack: removeTrackFromHistory,
  clear: clearStoredHistory
};

export default historyStorage;
