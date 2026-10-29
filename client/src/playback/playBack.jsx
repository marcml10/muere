import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { HistoryContext } from './HistoryContext';
import historyStorage from './historyStorage';

// Create a Context for the playback state
export const PlaybackContext = createContext();

const PLAYBACK_STORAGE_KEY = 'muer_playback_state';
const readSavedPlayback = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(PLAYBACK_STORAGE_KEY) || 'null');
    return saved && typeof saved === 'object' ? saved : {};
  } catch {
    return {};
  }
};

// Create a Provider component that holds the state
export const PlaybackProvider = ({ children }) => {
  const [savedPlayback] = useState(readSavedPlayback);
  const [currentTrack, setCurrentTrack] = useState(() => savedPlayback.currentTrack || null);
  const [isPlaying, setIsPlaying] = useState(() => Boolean(savedPlayback.currentTrack && savedPlayback.isPlaying));
  const [currentTime, setCurrentTime] = useState(() => Number(savedPlayback.currentTime) || 0);
  const [duration, setDuration] = useState(0);
  const [seekToTime, setSeekToTime] = useState(null);
  const sleepTimerRef = useRef(null);

  const [volume, setVolume] = useState(100);
  const [prevVolume, setPrevVolume] = useState(100);

  const historyContext = useContext(HistoryContext);

  useEffect(() => {
    try {
      localStorage.setItem(PLAYBACK_STORAGE_KEY, JSON.stringify({ currentTrack, isPlaying, currentTime }));
    } catch (error) {
      console.error('[Playback] Failed to save playback state:', error);
    }
  }, [currentTrack, isPlaying, currentTime]);

  // Synchronize playback track info to HistoryContext and historyStorage
  useEffect(() => {
    if (currentTrack && currentTrack.id) {
      if (historyContext?.recordTrack) {
        historyContext.recordTrack(currentTrack);
      } else {
        historyStorage.addTrack(currentTrack);
      }
    }
  }, [currentTrack?.id, historyContext]);

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume > 0 ? prevVolume : 100);
    }
  };

  // When a new track is selected, set it, record to history, and start playing
  const playTrack = (track) => {
    if (!track) return;

    if (historyContext?.recordTrack) {
      historyContext.recordTrack(track);
    } else {
      historyStorage.addTrack(track);
    }

    if (currentTrack && currentTrack.id === track.id) {
      seekTo(0);
      setIsPlaying(true);
      return;
    }
    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(0);
  };

  // Toggle play/pause for the currently playing track
  const togglePlayPause = () => {
    if (currentTrack) {
      setIsPlaying(prev => !prev);
    }
  };

  const startSleepTimer = (minutes) => {
    if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    sleepTimerRef.current = setTimeout(() => {
      setIsPlaying(false);
      sleepTimerRef.current = null;
    }, minutes * 60 * 1000);
  };

  useEffect(() => () => {
    if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
  }, []);

  // Trigger a seek operation (youtubePlayer will listen to this)
  const seekTo = (time) => {
    setSeekToTime(time);
    setCurrentTime(time);
  };

  return (
    <PlaybackContext.Provider value={{ 
      currentTrack, 
      isPlaying, 
      playTrack, 
      togglePlayPause,
      startSleepTimer,
      currentTime,
      setCurrentTime,
      duration,
      setDuration,
      seekTo,
      seekToTime,
      setSeekToTime,
      volume,
      setVolume,
      toggleMute,
      history: historyContext?.history || []
    }}>
      {children}
    </PlaybackContext.Provider>
  );
};

// Create a custom hook for easy access to the playback state
export const usePlayback = () => {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error("usePlayback must be used within a PlaybackProvider");
  }
  return context;
};
