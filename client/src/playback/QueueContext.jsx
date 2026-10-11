import React, { createContext, useState, useContext } from 'react';
import { usePlayback } from './playBack';

export const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [playedHistory, setPlayedHistory] = useState([]);
  
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

  const { playTrack, currentTrack, currentTime, seekTo } = usePlayback();

  /**
   * Adds a song to the bottom of the existing queue.
   * If nothing is currently playing, begins playing immediately.
   * If a song is currently playing, appends to the bottom of the queue without interrupting.
   */
  const addSongToQueue = (track) => {
    const item = Array.isArray(track) ? track[0] : track;
    if (!item) return;

    if (!currentTrack) {
      playTrack(item);
      return;
    }

    setQueue(prevQueue => [...prevQueue, item]);
  };

  /**
   * Plays a list of tracks starting from startIndex, and loads the rest as upcoming queue.
   */
  const playQueue = (tracks, startIndex = 0) => {
    const list = Array.isArray(tracks) ? tracks : [tracks];
    const targetTrack = list[startIndex];
    if (targetTrack) {
      if (currentTrack) {
        setPlayedHistory(prev => [...prev, currentTrack]);
      }
      playTrack(targetTrack);
    }
    const upcoming = list.slice(startIndex + 1);
    setQueue(upcoming);
  };

  /**
   * Smart addToQueue:
   * - When adding a single track (e.g. from the '+' button) and a song is playing,
   *   it appends the song to the bottom of the existing queue.
   * - When playing a playlist/search list with multiple tracks, it plays starting at startIndex.
   */
  const addToQueue = (tracks, startIndex = undefined) => {
    const isSingleTrack = !Array.isArray(tracks) || tracks.length === 1;
    if (isSingleTrack && currentTrack && (startIndex === undefined || startIndex === 0)) {
      addSongToQueue(Array.isArray(tracks) ? tracks[0] : tracks);
      return;
    }
    playQueue(tracks, startIndex !== undefined ? startIndex : 0);
  };

  /**
   * Plays the next track:
   * - When shuffle is ON: randomly picks a song from the queue, and ONLY that song disappears from the queue.
   * - When shuffle is OFF: plays the next song sequentially from the top of the queue.
   */
  const nextTrack = () => {
    if (isRepeat && currentTrack) {
      seekTo(0);
      playTrack(currentTrack);
      return;
    }

    if (queue.length === 0) return;

    if (isShuffle) {
      // Pick a random track from the queue
      const randomIndex = Math.floor(Math.random() * queue.length);
      const nextSong = queue[randomIndex];
      if (!nextSong) return;

      // Only the picked song disappears from the queue
      setQueue(prevQueue => prevQueue.filter((_, i) => i !== randomIndex));

      if (currentTrack) {
        setPlayedHistory(prev => [...prev, currentTrack]);
      }

      playTrack(nextSong);
      return;
    }

    // Sequential playback
    const nextSong = queue[0];
    if (!nextSong) return;

    setQueue(prevQueue => prevQueue.slice(1));

    if (currentTrack) {
      setPlayedHistory(prev => [...prev, currentTrack]);
    }

    playTrack(nextSong);
  };

  /**
   * Plays the previous track or restarts the current track if > 3 seconds in.
   */
  const previousTrack = () => {
    if (currentTime > 3) {
      seekTo(0);
      return;
    }

    if (isRepeat && currentTrack) {
      seekTo(0);
      playTrack(currentTrack);
      return;
    }

    if (playedHistory.length > 0) {
      const prevSong = playedHistory[playedHistory.length - 1];
      setPlayedHistory(prev => prev.slice(0, -1));

      // Put current track back at the front of the queue
      if (currentTrack) {
        setQueue(prev => [currentTrack, ...prev]);
      }

      playTrack(prevSong);
      return;
    }

    seekTo(0);
  };

  /**
   * Plays a selected item from the queue and removes it from the upcoming list.
   */
  const playQueueItem = (index) => {
    const selectedTrack = queue[index];
    if (!selectedTrack) return;

    if (currentTrack) {
      setPlayedHistory(prev => [...prev, currentTrack]);
    }

    setQueue(prevQueue => prevQueue.filter((_, i) => i !== index));
    playTrack(selectedTrack);
  };

  /**
   * Removes a specific item from the queue.
   */
  const removeFromQueue = (indexToRemove) => {
    setQueue(prevQueue => prevQueue.filter((_, i) => i !== indexToRemove));
  };

  const [isQueueVisible, setIsQueueVisible] = useState(false);
  const toggleQueue = () => setIsQueueVisible(prev => !prev);

  return (
    <QueueContext.Provider value={{ 
      queue, 
      currentIndex: 0, 
      addToQueue, 
      addSongToQueue,
      playQueue,
      playQueueItem,
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

export default QueueContext;
