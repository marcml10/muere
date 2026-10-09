import React, { createContext, useState, useContext } from 'react';

// Create a Context for the playback state
const PlaybackContext = createContext();

// Create a Provider component that holds the state
export const PlaybackProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);

  // You can add more playback logic here later (e.g., isPlaying, volume, play/pause functions)
  const playTrack = (track) => {
    setCurrentTrack(track);
  };

  return (
    <PlaybackContext.Provider value={{ currentTrack, playTrack }}>
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
