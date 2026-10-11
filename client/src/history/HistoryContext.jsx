import React, {
  createContext,
  useContext,
  useState,
} from "react";

import {
  loadHistory,
  saveHistory,
} from "./history";

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState(() => loadHistory());

  const recordPlay = (track) => {
    setHistory(prev => {
      const existing = prev[track.id];

      const updated = {
        ...prev,

        [track.id]: {
          track: {
            id: track.id,
            title: track.title,
            artist: track.artist,
            thumbnailUrl: track.thumbnailUrl,
          },

          plays: existing?.plays ?? 0 + 1,
          lastPlayed: Date.now(),
        },
      };

      saveHistory(updated);

      return updated;
    });
  };

  const recordSkip = (track) => {
    setHistory(prev => {
      const existing = prev[track.id];

      const updated = {
        ...prev,

        [track.id]: {
          ...existing,

          track,
          skips: (existing?.skips ?? 0) + 1,
          lastPlayed: Date.now(),
        },
      };

      saveHistory(updated);

      return updated;
    });
  };

  const recordCompletion = (track) => {
    setHistory(prev => {
      const existing = prev[track.id];

      const updated = {
        ...prev,

        [track.id]: {
          ...existing,

          track,
          completions: (existing?.completions ?? 0) + 1,
        },
      };

      saveHistory(updated);

      return updated;
    });
  };

  return (
    <HistoryContext.Provider
      value={{
        history,
        recordPlay,
        recordSkip,
        recordCompletion,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);

  if (!context) {
    throw new Error(
      "useHistory must be used within a HistoryProvider"
    );
  }

  return context;
};