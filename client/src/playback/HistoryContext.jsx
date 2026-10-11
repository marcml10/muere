import React, { createContext, useState, useContext, useCallback } from 'react';
import historyStorage from './historyStorage';

export const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState(() => historyStorage.get());

  const recordTrack = useCallback((track) => {
    if (!track || !track.id) return;
    const updated = historyStorage.addTrack(track);
    setHistory(updated);
  }, []);

  const addToHistory = recordTrack;

  const removeTrack = useCallback((trackId) => {
    if (!trackId) return;
    const updated = historyStorage.removeTrack(trackId);
    setHistory(updated);
  }, []);

  const clearHistory = useCallback(() => {
    historyStorage.clear();
    setHistory([]);
  }, []);

  return (
    <HistoryContext.Provider value={{
      history,
      recordTrack,
      addToHistory,
      removeTrack,
      clearHistory
    }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};

export default HistoryContext;
