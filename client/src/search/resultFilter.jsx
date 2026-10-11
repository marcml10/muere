import React, { useEffect } from 'react';

/**
 * Checks if a track is a YouTube Short.
 * YouTube Shorts are videos 60 seconds or less, or tagged with #shorts.
 */
export const isShortTrack = (track) => {
  if (!track) return false;
  
  // 1. Check duration (60 seconds or less indicates a Short / teaser)
  const duration = Number(track.duration);
  if (duration > 0 && duration <= 60) {
    return true;
  }

  // 2. Check title or artist for #shorts / #short hashtags or keywords
  const title = track.title || '';
  if (/#shorts?\b/i.test(title)) {
    return true;
  }

  return false;
};

/**
 * Filters out YouTube Shorts and sorts remaining tracks by view count descending,
 * while preserving artist channel information.
 * @param {Array|Object} data - Raw track results or { tracks, channel } object from SearchBar
 * @returns {Object} { tracks: Array, channel: Object|null }
 */
export const filterAndSortByViews = (data) => {
  if (!data) return { tracks: [], channel: null };
  
  // 1. Determine raw tracks and channel from input payload
  let rawTracks = [];
  let channel = null;

  if (Array.isArray(data)) {
    rawTracks = data;
  } else if (typeof data === 'object') {
    rawTracks = Array.isArray(data.tracks) ? data.tracks : (Array.isArray(data.results) ? data.results : []);
    channel = data.channel || null;
  }

  // 2. Remove all YouTube Shorts
  const fullLengthTracks = rawTracks.filter(track => !isShortTrack(track));

  // 3. Sort by view count in descending order
  const sorted = fullLengthTracks.sort((a, b) => {
    const viewsA = typeof a.viewCount === 'number' ? a.viewCount : parseInt(a.viewCount, 10) || 0;
    const viewsB = typeof b.viewCount === 'number' ? b.viewCount : parseInt(b.viewCount, 10) || 0;
    return viewsB - viewsA;
  });

  return {
    tracks: sorted,
    channel: channel
  };
};

/**
 * Parses duration from seconds number or ISO 8601 string (e.g. "PT3M45S" or 225)
 */
export const parseDurationString = (val) => {
  if (!val) return 0;
  if (typeof val === 'number') return val;
  if (/^\d+$/.test(val)) return parseInt(val, 10);
  const match = String(val).match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
};

/**
 * Utility to format duration into mm:ss format (e.g. 215 -> "3:35", "PT4M12S" -> "4:12")
 */
export const formatDuration = (val) => {
  if (!val) return '--:--';
  const totalSeconds = parseDurationString(val);
  if (!totalSeconds || totalSeconds <= 0) return '--:--';

  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

/**
 * Utility to format view count into human-readable format (e.g. 1.2M, 500K)
 */
export const formatViewCount = (count) => {
  if (!count || isNaN(count)) return '';
  const num = Number(count);
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B views`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M views`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K views`;
  return `${num} views`;
};

/**
 * Utility to format subscriber count (e.g. 59800000 -> "59.8M subscribers")
 */
export const formatSubscriberCount = (count) => {
  if (!count || isNaN(count)) return '';
  const num = Number(count);
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B subscribers`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M subscribers`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K subscribers`;
  return `${num} subscribers`;
};

/**
 * ResultFilter Pipeline Component:
 * Intercepts results obtained by SearchBar, sorts them by view count descending,
 * and gives them back to SearchPage for playback and display.
 */
const ResultFilter = ({ rawResults, onFilteredResults }) => {
  useEffect(() => {
    if (rawResults) {
      console.log('[resultFilter.jsx] Received raw results from SearchBar:', rawResults);
      const sorted = filterAndSortByViews(rawResults);
      console.log('[resultFilter.jsx] Sorted results by view count descending:', sorted);
      if (onFilteredResults) {
        onFilteredResults(sorted);
      }
    }
  }, [rawResults, onFilteredResults]);

  return null;
};

export default ResultFilter;
