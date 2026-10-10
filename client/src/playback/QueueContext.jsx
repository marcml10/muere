import React, { createContext, useState, useContext } from 'react';
import { usePlayback } from './playBack';

export const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const toggleRepeat = () => {
    setIsRepeat(prev => {
      if (!prev) setIsShuffle(false);
      return !prev;
    });
  };

  const toggleShuffle = () => {
    setIsShuffle(prev => {
      if (!prev) setIsRepeat(false);
      return !prev;
    });
  };

  const { playTrack } = usePlayback();

  // addToQueue can take a single track or an array of tracks
  const addToQueue = (tracks, startIndex = 0) => {
    const newQueue = Array.isArray(tracks) ? tracks : [tracks];
    setQueue(newQueue);
    setCurrentIndex(startIndex);
    if (newQueue[startIndex]) {
      playTrack(newQueue[startIndex]);
    }
  };

  const nextTrack = () => {
    if (queue.length === 0) return;

    if (isRepeat) {
      // Replay the current track
      playTrack(queue[currentIndex]);
      return;
    }

    if (isShuffle) {
      // Pick a random track from the entire queue
      let randomIndex = Math.floor(Math.random() * queue.length);
      // Avoid playing the exact same song if there's more than 1 in the queue
      if (randomIndex === currentIndex && queue.length > 1) {
        randomIndex = (randomIndex + 1) % queue.length;
      }
      
      const nextSong = queue[randomIndex];
      
      setQueue(prevQueue => {
        const newQueue = [...prevQueue];
        // Remove the randomly picked song from its old position
        newQueue.splice(randomIndex, 1);
        
        // Find where the current playing song is now
        const activeIndex = randomIndex < currentIndex ? currentIndex - 1 : currentIndex;
        
        // Insert the picked song exactly after the currently playing song
        newQueue.splice(activeIndex + 1, 0, nextSong);
        return newQueue;
      });
      
      // Update currentIndex to point to the newly inserted track
      const newCurrentIndex = (randomIndex < currentIndex ? currentIndex - 1 : currentIndex) + 1;
      setCurrentIndex(newCurrentIndex);
      playTrack(nextSong);
      return;
    }

    // Default: play the next song in the queue sequentially
    if (currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      playTrack(queue[nextIndex]);
    }
  };

  const previousTrack = () => {
    if (queue.length === 0) return;

    if (isRepeat) {
      playTrack(queue[currentIndex]);
      return;
    }

    if (isShuffle) {
      let randomIndex = Math.floor(Math.random() * queue.length);
      if (randomIndex === currentIndex && queue.length > 1) {
        randomIndex = (randomIndex + 1) % queue.length;
      }
      
      const prevSong = queue[randomIndex];
      
      setQueue(prevQueue => {
        const newQueue = [...prevQueue];
        newQueue.splice(randomIndex, 1);
        
        const activeIndex = randomIndex < currentIndex ? currentIndex - 1 : currentIndex;
        // Insert exactly before the currently playing song
        newQueue.splice(activeIndex, 0, prevSong);
        return newQueue;
      });
      
      // Update currentIndex to point to the newly inserted track (which took the activeIndex's old spot)
      const newCurrentIndex = randomIndex < currentIndex ? currentIndex - 1 : currentIndex;
      setCurrentIndex(newCurrentIndex);
      playTrack(prevSong);
      return;
    }

    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      playTrack(queue[prevIndex]);
    } else if (currentIndex === 0) {
      // Replay first track if previous is pressed on the first track
      playTrack(queue[0]);
    }
  };

  const removeFromQueue = (indexToRemove) => {
    setQueue(prevQueue => {
      const newQueue = [...prevQueue];
      newQueue.splice(indexToRemove, 1);
      return newQueue;
    });

    // If we removed a track that was BEFORE the current track,
    // we need to decrement currentIndex to keep playing the same song.
    if (indexToRemove < currentIndex) {
      setCurrentIndex(prev => prev - 1);
    }
    // Note: If we remove the currently playing track, should it stop?
    // The prompt says "currently playing song should not be in the queue" 
    // so it won't even be displayed to be removed.
  };

  const [isQueueVisible, setIsQueueVisible] = useState(false);
  const toggleQueue = () => setIsQueueVisible(prev => !prev);

  return (
    <QueueContext.Provider value={{ 
      queue, 
      currentIndex, 
      addToQueue, 
      nextTrack, 
      previousTrack,
      removeFromQueue,
      isQueueVisible,
      toggleQueue,
      setQueue,
      isRepeat,
      isShuffle,
      toggleRepeat,
      toggleShuffle
    }}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error("useQueue must be used within a QueueProvider");
  }
  return context;
};
