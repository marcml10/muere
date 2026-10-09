import React from 'react';
import { usePlayback } from '../playback/playBack';

const PlayerBar = () => {
  const { currentTrack } = usePlayback();

  return (
    <footer className="player-bar">
      <div className="now-playing">
        <div className="mini-art" style={{ backgroundColor: '#eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {currentTrack?.thumbnailUrl ? (
             <img src={currentTrack.thumbnailUrl} alt={currentTrack.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
             <span style={{ fontSize: '20px' }}>🎵</span>
          )}
        </div>
        <div className="track-info" style={{ overflow: 'hidden' }}>
          <p className="track-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentTrack ? currentTrack.title : 'Not Playing'}
          </p>
          <p className="track-artist" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentTrack ? currentTrack.artist : 'Select a track'}
          </p>
        </div>
      </div>
      <div className="player-controls">
        <button className="control-btn">⏪</button>
        <button className="control-btn play-btn">▶️</button>
        <button className="control-btn">⏩</button>
      </div>
      <div className="volume-control">
        🔊 <input type="range" min="0" max="100" />
      </div>
    </footer>
  );
};

export default PlayerBar;
