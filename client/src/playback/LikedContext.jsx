/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'muer_liked_songs';

const LikedContext = createContext();

export const LikedProvider = ({ children }) => {
  const [likedSongs, setLikedSongs] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('[LikedContext] Failed to load liked songs from localStorage:', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(likedSongs));
    } catch (e) {
      console.error('[LikedContext] Failed to save liked songs to localStorage:', e);
    }
  }, [likedSongs]);

  const toggleLike = (track) => {
    if (!track || !track.id) return;
    setLikedSongs((prev) => {
      const exists = prev.some((item) => item.id === track.id);
      if (exists) {
        return prev.filter((item) => item.id !== track.id);
      } else {
        const likedEntry = {
          ...track,
          likedAt: new Date().toISOString()
        };
        return [likedEntry, ...prev];
      }
    });
  };

  const isLiked = (trackId) => {
    if (!trackId) return false;
    return likedSongs.some((item) => item.id === trackId);
  };

  const removeLikedSong = (trackId) => {
    if (!trackId) return;
    setLikedSongs((prev) => prev.filter((item) => item.id !== trackId));
  };

  return (
    <LikedContext.Provider value={{ likedSongs, toggleLike, isLiked, removeLikedSong }}>
      {children}
    </LikedContext.Provider>
  );
};

export const useLiked = () => {
  const context = useContext(LikedContext);
  if (!context) {
    throw new Error('useLiked must be used within a LikedProvider');
  }
  return context;
};

export default LikedContext;
