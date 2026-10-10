import React, { createContext, useState, useContext } from 'react';

// Create a Context for the playback state
const PlaybackContext = createContext();

// Create a Provider component that holds the state
export const PlaybackProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekToTime, setSeekToTime] = useState(null);

  const [volume, setVolume] = useState(100);
  const [prevVolume, setPrevVolume] = useState(100);

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume > 0 ? prevVolume : 100);
    }
  };

  // When a new track is selected, set it and automatically start playing
  const playTrack = (track) => {
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
      toggleMute
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
