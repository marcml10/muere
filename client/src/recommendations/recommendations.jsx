import { useHistory } from '../playback/HistoryContext';
import { historyStorage } from '../playback/historyStorage';

/**
 * Extracts and formats recently played tracks from history data.
 * @param {Array} history - Raw history list from HistoryContext or historyStorage
 * @param {number} limit - Maximum number of tracks to return (default: 12)
 * @returns {Array} List of recently played tracks
 */
export const getRecentlyPlayed = (history, limit = 12) => {
  if (!Array.isArray(history)) return [];
  
  return history
    .filter(track => track && track.id && track.title)
    .slice(0, limit);
};

/**
 * Custom React hook to get live recently played tracks directly from HistoryContext pipeline.
 * @param {number} limit - Maximum number of tracks to return
 * @returns {Array} Recently played tracks array
 */
export const useRecentlyPlayed = (limit = 12) => {
  const { history } = useHistory();
  return getRecentlyPlayed(history, limit);
};

/**
 * Recommendation scoring logic based on listening history.
 * @param {Array} history - Listening history
 * @param {Array} candidates - Candidate tracks
 * @returns {Array} Candidates sorted by recommendation score
 */
export const getRecommendations = (history, candidates) => {
  if (!Array.isArray(candidates)) return [];
  const historyList = Array.isArray(history) ? history : [];
  const historyMap = new Map();

  historyList.forEach((item, index) => {
    if (item && item.id) {
      historyMap.set(item.id, {
        recencyRank: index,
        playedAt: item.playedAt
      });
    }
  });

  return candidates
    .map(track => {
      const record = historyMap.get(track.id);
      let score = 0;
      if (record) {
        score += Math.max(20 - record.recencyRank, 2);
      } else {
        score += 10;
      }
      return {
        ...track,
        recommendationScore: score
      };
    })
    .sort((a, b) => b.recommendationScore - a.recommendationScore);
};

export default {
  getRecentlyPlayed,
  useRecentlyPlayed,
  getRecommendations
};