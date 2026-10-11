import React, { createContext, useState, useContext, useEffect } from 'react';
import { HistoryContext } from './HistoryContext';
import historyStorage from './historyStorage';

// Create a Context for the playback state
export const PlaybackContext = createContext();

// Create a Provider component that holds the state
export const PlaybackProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekToTime, setSeekToTime] = useState(null);

  const [volume, setVolume] = useState(100);
  const [prevVolume, setPrevVolume] = useState(100);

  const historyContext = useContext(HistoryContext);

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
